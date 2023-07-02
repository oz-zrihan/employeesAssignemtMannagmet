import { createStore } from "redux";
import PositionModel from "../Models/PositionModel";

// 1. Positions global State
export class PositionsState {
  public positions: PositionModel[] = [];
}

// 2. Positions Action Type
export enum PositionsActionType {
  FetchPositions,
  AddPosition,
  DeletePosition,
}

// 3. Positions Action
export interface PositionsAction {
  type: PositionsActionType;
  payload: any;
}

// 4. Positions Reducer
export function positionsReducer(
  currentState = new PositionsState(),
  action: PositionsAction
): PositionsState {
  // Duplicate current state into a new state:
  const newState = { ...currentState };

  // Perform action on the newState:
  switch (action.type) {
    case PositionsActionType.FetchPositions: // Payload is all positions for saving
      newState.positions = action.payload;
      break;

    case PositionsActionType.AddPosition: // Payload is a position object for adding
      newState.positions.push(action.payload);
      break;

    case PositionsActionType.DeletePosition: // Payload is the position id for deleting
      const indexToDelete = newState.positions.findIndex(
        (p) => p._id === action.payload
      );
      if (indexToDelete >= 0) {
        newState.positions.splice(indexToDelete, 1);
      }
      break;
  }

  // Return the newState:
  return newState;
}

// 5. Positions Store - The manager object handling redux:
export const positionsStore = createStore(positionsReducer);
