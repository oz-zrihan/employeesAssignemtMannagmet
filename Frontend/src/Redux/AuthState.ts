import { createStore } from "redux";
import jwtDecode from "jwt-decode";
import EmployeeModel from "../Models/EmployeeModel";

// 1. Auth global State
export class AuthState {
  public token: string = null;
  public user: EmployeeModel = null;

  public constructor() {
    this.token = localStorage.getItem("token");
    if (this.token) {
      const decodedToken: any = jwtDecode(this.token);
      this.user = decodedToken.employee;
    }
  }
}

// 2. Auth Action Type
export enum AuthActionType {
  Register,
  Login,
  Logout,
}

// 3. Auth Action
export interface AuthAction {
  type: AuthActionType;
  payload?: any;
}

// 4. Auth Reducer
export function authReducer(
  currentState = new AuthState(),
  action: AuthAction
): AuthState {
  // Duplicate current state into a new state:
  const newState = { ...currentState };

  // Perform action on the newState:
  switch (action.type) {
    case AuthActionType.Register: // Payload is token
    newState.token = action.payload;
    newState.user = jwtDecode<{ user: EmployeeModel }>(action.payload).user;
    break;

    case AuthActionType.Login: // Payload is token
      newState.token = action.payload.token;
      newState.user = action.payload.employee
      localStorage.setItem("token", newState.token);
      break;

    case AuthActionType.Logout: // No payload
      newState.token = null;
      newState.user = null;
      localStorage.removeItem("token");
      break;
      
  }
  console.log(newState);
  
  // Return the newState:
  return newState;
}

// 5. Auth Store - The manager object handling redux:
export const authStore = createStore(authReducer);
