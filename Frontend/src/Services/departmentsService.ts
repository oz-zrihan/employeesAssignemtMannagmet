import axios from "axios";
import appConfig from "../Utils/AppConfig";
// Model
import DepartmentModel from "../Models/DepartmentModel";
// Redux
import {
  DepartmentsActionType,
  departmentsStore,
} from "../Redux/DepartmentsState";

class DepartmentsService {
  //  ==================== GET all departments ====================
  public async getAllDepartments(): Promise<DepartmentModel[]> {
    // Get departments from global state:
    let departments = departmentsStore.getState().departments;

    // If we don't have departments
    if (departments.length === 0) {
      // Get from server
      const response = await axios.get<DepartmentModel[]>(
        appConfig.departmentsUrl
      );

      // Extract assignments
      departments = response.data;

      // Update global state
      departmentsStore.dispatch({
        type: DepartmentsActionType.FetchDepartments,
        payload: departments,
      });
    }

    // Return
    return departments;
  }

  // ==================== GET one department ====================
  public async getOneDepartment(_id: string): Promise<DepartmentModel> {
    // Get departments from global state:
    let departments = departmentsStore.getState().departments;

    // Extract specific assignment
    let department = departments.find((d) => d._id === _id);

    // If department don't exist
    if (!department) {
      // Get from server
      const response = await axios.get<DepartmentModel>(
        appConfig.departmentsUrl + _id
      );

      // Extract department
      department = response.data;
    }

    // Return
    return department;
  }

  // ==================== ADD one department ====================
  public async addDepartment(department: DepartmentModel): Promise<void> {
    // Send axios request to server
    const response = await axios.post<DepartmentModel>(
      appConfig.departmentsUrl,
      department
    );

    // Get added department
    const addedDepartment = response.data;

    // Add department to global state
    departmentsStore.dispatch({
      type: DepartmentsActionType.AddDepartment,
      payload: addedDepartment,
    });
  }

  // ==================== DELETE department ====================
  public async deleteDepartment(_id: string): Promise<void> {
    // Delete department from server
    await axios.delete(appConfig.departmentsUrl + _id);

    // Delete from global state
    departmentsStore.dispatch({
      type: DepartmentsActionType.DeleteDepartment,
      payload: _id,
    });
  }
}

const departmentsService = new DepartmentsService();

export default departmentsService;
