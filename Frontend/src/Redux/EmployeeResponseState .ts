import { createStore } from "redux";
import EmployeeResponseModel from "../Models/EmployeeResponseModel";

// 1. EmployeeResponse global State
export class EmployeeResponseState {
  public employeeResponse: EmployeeResponseModel[] = [];
}

// 2. EmployeeResponse Action Type
export enum EmployeeResponseActionType {
  FetchEmployeeResponse,
  AddEmployeeResponse,
  DeleteEmployeeResponse,
}

// 3. EmployeeResponse Action
export interface EmployeeResponseAction {
  type: EmployeeResponseActionType;
  payload: any;
}

// 4. EmployeeResponse Reducer
export function employeeResponseReducer(
  currentState = new EmployeeResponseState(),
  action: EmployeeResponseAction
): EmployeeResponseState {
  // Duplicate current state into a new state:
  const newState = { ...currentState };

  // Perform action on the newState:
  switch (action.type) {
    case EmployeeResponseActionType.FetchEmployeeResponse: // Payload is all employee response for saving
      newState.employeeResponse = action.payload;
      break;

    case EmployeeResponseActionType.AddEmployeeResponse: // Payload is a employee response object for adding
      newState.employeeResponse.push(action.payload);
      break;

    case EmployeeResponseActionType.DeleteEmployeeResponse: // Payload is the employee response id for deleting
      const indexToDelete = newState.employeeResponse.findIndex(
        (e) => e._id === action.payload
      );
      if (indexToDelete >= 0) {
        newState.employeeResponse.splice(indexToDelete, 1);
      }
      break;
  }

  // Return the newState:
  return newState;
}

// 5. Products Store - The manager object handling redux:
export const employeeResponseStore = createStore(employeeResponseReducer);
