import { createStore } from "redux";
import DepartmentModel from "../Models/DepartmentModel";

// 1. Departments global State
export class DepartmentsState {
  public departments: DepartmentModel[] = [];
}

// 2. Departments Action Type
export enum DepartmentsActionType {
  FetchDepartments,
  AddDepartment,
  DeleteDepartment,
}

// 3. Departments Action
export interface DepartmentsAction {
  type: DepartmentsActionType;
  payload: any;
}

// 4. Departments Reducer
export function departmentsReducer(
  currentState = new DepartmentsState(),
  action: DepartmentsAction
): DepartmentsState {
  // Duplicate current state into a new state:
  const newState = { ...currentState };

  // Perform action on the newState:
  switch (action.type) {
    case DepartmentsActionType.FetchDepartments: // Payload is all departments for saving
      newState.departments = action.payload;
      break;

    case DepartmentsActionType.AddDepartment: // Payload is a department object for adding
      newState.departments.push(action.payload);
      break;

    case DepartmentsActionType.DeleteDepartment: // Payload is the department id for deleting
      const indexToDelete = newState.departments.findIndex(
        (d) => d._id === action.payload
      );
      if (indexToDelete >= 0) {
        newState.departments.splice(indexToDelete, 1);
      }
      break;
  }

  // Return the newState:
  return newState;
}

// 5. Products Store - The manager object handling redux:
export const departmentsStore = createStore(departmentsReducer);
