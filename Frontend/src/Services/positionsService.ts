import axios from "axios";
import appConfig from "../Utils/AppConfig";
// Models
import PositionModel from "../Models/PositionModel";
// Redux
import { PositionsActionType, positionsStore } from "../Redux/PositionsState";

class PositionsService {
  //  ==================== GET all positions ====================
  public async getAllPositions(): Promise<PositionModel[]> {
    // Get positions from global state:
    let positions = positionsStore.getState().positions;

    // If we don't have positions
    if (positions.length === 0) {
      // Get from server
      const response = await axios.get<PositionModel[]>(appConfig.positionsUrl);

      // Extract positions
      positions = response.data;

      // Update global state
      positionsStore.dispatch({
        type: PositionsActionType.FetchPositions,
        payload: positions,
      });
    }

    // Return
    return positions;
  }

  // ==================== GET one position ====================
  public async getOnePosition(_id: string): Promise<PositionModel> {
    // Get positions from global state:
    let positions = positionsStore.getState().positions;

    // Extract specific position
    let position = positions.find((p) => p._id === _id);

    // If position don't exist
    if (!position) {
      // Get from server
      const response = await axios.get<PositionModel>(
        appConfig.positionsUrl + _id
      );

      // Extract department
      position = response.data;
    }

    // Return
    return position;
  }

  // ==================== ADD one position ====================
  public async addPosition(position: PositionModel): Promise<void> {
    // Send axios request to server
    const response = await axios.post<PositionModel>(
      appConfig.positionsUrl,
      position
    );

    // Get added position
    const addedPosition = response.data;

    // Add position to global state
    positionsStore.dispatch({
      type: PositionsActionType.AddPosition,
      payload: addedPosition,
    });
  }

  // ==================== DELETE position ====================
  public async deletePositions(_id: string): Promise<void> {
    // Delete position from server
    await axios.delete(appConfig.positionsUrl + _id);

    // Delete from global state
    positionsStore.dispatch({
      type: PositionsActionType.DeletePosition,
      payload: _id,
    });
  }
}

const positionsService = new PositionsService();

export default positionsService;
