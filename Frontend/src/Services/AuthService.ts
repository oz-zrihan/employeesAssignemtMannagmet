import axios from "axios";
import appConfig from "../Utils/AppConfig";
import jwtDecode from "jwt-decode";
//Models
import CredentialsModel from "../Models/CredentialsModel";
import EmployeeModel from "../Models/EmployeeModel";
// Redux
import { AuthActionType, authStore } from "../Redux/AuthState";

class AuthService {
  // ====================== Register ======================
  public async register(user: EmployeeModel): Promise<void> {
    // Send user to backend to register:
   await axios.post<string>(appConfig.registerUrl, user);

  }

  // ====================== Login ======================
  public async login(credentials: CredentialsModel): Promise<EmployeeModel> {
    // Send credentials to backend to login:
    const response = await axios.post<{
      token: string;
      employee: EmployeeModel;
    }>(appConfig.loginUrl, credentials);

    // Extract token:
    const token = response.data.token;

    // Extract employee:
    const employee = response.data.employee;

    // Save token to global state
    authStore.dispatch({
      type: AuthActionType.Login,
      payload: { token, employee },
    });

    return employee;
  }

  // ====================== Logout ======================
  public logout(): void {
    // Logout in global state
    authStore.dispatch({ type: AuthActionType.Logout });
  }

  // ====================== Verify LoggedIn ======================
  public verifyLoggedIn(): boolean {
    // Get token from global state
    const token = authStore.getState().token;
    if (!token) return false;

    // check if there is a user inside token
    const user = jwtDecode<{ employee: EmployeeModel }>(token).employee;
    if (!user) return false;

    return true;
  }
  // ====================== Verify LoggedIn ======================
  public isAdmin(): boolean {
    // Get token from global state
    const token = authStore.getState().token;
    if (!token) return false;

    // check if there is a user inside token
    const employee = jwtDecode<{ employee: EmployeeModel }>(token).employee;

    // If user is not admin:
    if (employee.role !== "admin") {
      return false;
    }
    return true;
  }
}

const authService = new AuthService();

export default authService;
