import axios from "axios";
import jwtDecode from "jwt-decode";
// Model
import EmployeeModel from "../Models/EmployeeModel";
// Service
import authService from "./AuthService";
// Redux
import { AuthActionType, authStore } from "./../Redux/AuthState";

// ====================== Intercept request ======================
interface DecodedToken {
  employee: EmployeeModel;
  exp: number;
  iat: number;
}

// If token is invalid - refresh it
async function refreshToken(decodedToken: DecodedToken) {
  authStore.dispatch({ type: AuthActionType.Logout });
  const credentials = {
    email: decodedToken.employee.email,
    password: decodedToken.employee.password,
  };
  authService.login(credentials);
  return;
}
class InterceptorService {
  // Create interceptor:
  public create(): void {
    // Register to any request:
    axios.interceptors.request.use(async (requestObject) => {
      // If we have token:
      if (authStore.getState().token) {
        // Validate token date, if expired logout and get new
        const decodedToken: DecodedToken = jwtDecode(
          authStore.getState().token
        );
        const now = Date.now();

        if (now > decodedToken.exp * 1000) {
          await refreshToken(decodedToken);
        }

        // Add authorization header with token:
        requestObject.headers["Authorization"] =
          "Bearer " + authStore.getState().token;
      }

      return requestObject;
    });
  }
}

const interceptorService = new InterceptorService();

export default interceptorService;
