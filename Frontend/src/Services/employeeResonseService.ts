import axios from "axios";
import appConfig from "../Utils/AppConfig";
// Model
import EmployeeResponseModel from "../Models/EmployeeResponseModel";
// Redux
import {
  EmployeeResponseActionType,
  employeeResponseStore,
} from "../Redux/EmployeeResponseState ";

class EmployeeResponseService {
  //  ==================== GET all responses ====================
  public async getAllResponses(): Promise<EmployeeResponseModel[]> {
    // Get responses from global state:
    let responses = employeeResponseStore.getState().employeeResponse;

    // If we don't have responses
    if (responses.length === 0) {
      // Get from server
      const response = await axios.get<EmployeeResponseModel[]>(
        appConfig.employeesResponseUrl
      );

      // Extract responses
      responses = response.data;

      // Update global state
      employeeResponseStore.dispatch({
        type: EmployeeResponseActionType.FetchEmployeeResponse,
        payload: responses,
      });
    }

    // Return
    return responses;
  }

  // ==================== GET one response ====================
  public async getOneResponse(_id: string): Promise<EmployeeResponseModel> {
    // Get responses from global state:
    let responses = employeeResponseStore.getState().employeeResponse;

    // Extract specific response
    let employeeResponse = responses.find((r) => r._id === _id);

    // If response don't exist
    if (!employeeResponse) {
      // Get from server
      const response = await axios.get<EmployeeResponseModel>(
        appConfig.employeesResponseUrl + _id
      );

      // Extract response
      employeeResponse = response.data;
    }

    // Return
    return employeeResponse;
  }

  // ==================== ADD one response ====================
  public async addResponse(
    employeeResponse: EmployeeResponseModel
  ): Promise<EmployeeResponseModel> {
    // Send axios request to server
    const response = await axios.post<EmployeeResponseModel>(
      appConfig.employeesResponseUrl + employeeResponse.employeeId,
      employeeResponse
    );

    // Get added response
    const addedResponse = response.data;

    // Add response to global state
    employeeResponseStore.dispatch({
      type: EmployeeResponseActionType.AddEmployeeResponse,
      payload: addedResponse,
    });

    return addedResponse;
  }

  // ==================== DELETE response ====================
  public async deleteResponse(_id: string): Promise<void> {
    // Delete response from server
    await axios.delete(appConfig.employeesResponseUrl + _id);

    // Delete from global state
    employeeResponseStore.dispatch({
      type: EmployeeResponseActionType.DeleteEmployeeResponse,
      payload: _id,
    });
  }
}

const employeeResponseService = new EmployeeResponseService();

export default employeeResponseService;
