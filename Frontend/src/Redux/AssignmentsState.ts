import { createStore } from "redux";
import AssignmentModel from "../Models/AssignmentModel";

// 1. Assignments global State
export class AssignmentsState {
  public assignments: AssignmentModel[] = [];
}

// 2. Assignments Action Type
export enum AssignmentsActionType {
  FetchAssignments,
  AddAssignment,
  UpdateAssignment,
  DeleteAssignment,
}

// 3. Assignments Action
export interface AssignmentsAction {
  type: AssignmentsActionType;
  payload: any;
}

// 4. Assignments Reducer
export function assignmentsReducer(
  currentState = new AssignmentsState(),
  action: AssignmentsAction
): AssignmentsState {
  // Duplicate current state into a new state:
  const newState = { ...currentState };

  // Perform action on the newState:
  switch (action.type) {
    case AssignmentsActionType.FetchAssignments: // Payload is all assignments for saving
      newState.assignments = action.payload;
      break;

    case AssignmentsActionType.AddAssignment: // Payload is a assignment object for adding
      newState.assignments.push(action.payload);
      break;

    case AssignmentsActionType.UpdateAssignment: // Payload is a assignment object for updating    
      const indexToUpdate = newState.assignments.findIndex(
        (a) => a._id === action.payload._id
      );
      
      if (indexToUpdate >= 0) {
        newState.assignments[indexToUpdate] = action.payload;
      }
      break;

    case AssignmentsActionType.DeleteAssignment: // Payload is the assignments id for deleting
      const indexToDelete = newState.assignments.findIndex(
        (a) => a._id === action.payload
      );
      if (indexToDelete >= 0) {
        newState.assignments.splice(indexToDelete, 1);
      }
      break;
  }
    
  // Return the newState:
  return newState;
}

// 5. Products Store - The manager object handling redux:
export const assignmentsStore = createStore(assignmentsReducer);
