import { createStore } from "redux";
import EmployeeModel from "../Models/EmployeeModel";

// 1. Employees global State
export class EmployeesState {
  public employees: EmployeeModel[] = [];
}

// 2. Employees Action Type
export enum EmployeesActionType {
  FetchEmployees,
  AddEmployee,
  UpdateEmployee,
  DeleteEmployee,
}

// 3. Employees Action
export interface EmployeesAction {
  type: EmployeesActionType;
  payload: any;
}

// 4. Employees Reducer
export function employeesReducer(
  currentState = new EmployeesState(),
  action: EmployeesAction
): EmployeesState {
  // Duplicate current state into a new state:
  const newState = { ...currentState };

  // Perform action on the newState:
  switch (action.type) {
    case EmployeesActionType.FetchEmployees: // Payload is all employees for saving
      newState.employees = action.payload;
      break;

    case EmployeesActionType.AddEmployee: // Payload is a employee object for adding
      newState.employees.push(action.payload);
      break;

    case EmployeesActionType.UpdateEmployee: // Payload is a employee object for updating
      const indexToUpdate = newState.employees.findIndex(
        (e) => e._id === action.payload.employeeId
      );
      if (indexToUpdate >= 0) {
        newState.employees[indexToUpdate] = action.payload;
      }
      break;

    case EmployeesActionType.DeleteEmployee: // Payload is the employee id for deleting
      const indexToDelete = newState.employees.findIndex(
        (e) => e._id === action.payload
      );
      if (indexToDelete >= 0) {
        newState.employees.splice(indexToDelete, 1);
      }
      break;
  }

  // Return the newState:
  return newState;
}

// 5. Products Store - The manager object handling redux:
export const employeesStore = createStore(employeesReducer);
