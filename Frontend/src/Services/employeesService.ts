import axios from "axios";
import appConfig from "../Utils/AppConfig";
// Model
import EmployeeModel from "../Models/EmployeeModel";
//Redux
import { EmployeesActionType, employeesStore } from "../Redux/EmployeesState";

class EmployeesService {
  //  ==================== GET all vacations ====================
  public async getAllEmployees(): Promise<EmployeeModel[]> {

    // Get employees from global state:
    let employees = employeesStore.getState().employees;

    // If we don't have employees
    if (employees.length === 0) {
      // Get from server
      const response = await axios.get<EmployeeModel[]>(appConfig.employeesUrl);

      // Extract employees
      employees = response.data;

      // Update global state
      employeesStore.dispatch({
        type: EmployeesActionType.FetchEmployees,
        payload: employees,
      });
    }

    // Return
    return employees;
  }

  // ==================== GET employees by department ====================
  public async getEmployeesByDepartment(
    departmentId: string
  ): Promise<EmployeeModel[]> {

    // Get employees from global state:
    let employees = employeesStore.getState().employees;

    // Extract specific employee
    let employee = employees.filter((e) => e.departmentId === departmentId);

    // If employee don't exist
    if (employee.length === 0) {
      // Get from server
      const response = await axios.get<EmployeeModel[]>(
        appConfig.employeesUrl + "by-department/" + departmentId
      );

      // Extract vacation
      employee = response.data;
    }

    // Return
    return employee;
  }
  // ==================== GET one employee ====================
  public async getOneEmployee(_id: string): Promise<EmployeeModel> {

    // Get employees from global state:
    let employees = employeesStore.getState().employees;

    // Extract specific employee
    let employee = employees.find((e) => e._id === _id);

    // If employee don't exist
    if (!employee) {
      // Get from server
      const response = await axios.get<EmployeeModel>(
        appConfig.employeesUrl + _id
      );

      // Extract vacation
      employee = response.data;
    }

    // Return
    return employee;
  }

  // ==================== ADD one employee ====================
  public async addEmployee(employee: EmployeeModel): Promise<void> {

    // Send axios request to server
    const response = await axios.post<EmployeeModel>(
      appConfig.employeesUrl,
      employee
    );

    // Get added employee
    const addedEmployee = response.data;

    // Add employee to global state
    employeesStore.dispatch({
      type: EmployeesActionType.AddEmployee,
      payload: addedEmployee,
    });
  }

  // ==================== EDIT vacation ====================
  public async editVacation(employee: EmployeeModel): Promise<void> {

    // Send employee to server
    const response = await axios.put<EmployeeModel>(
      appConfig.employeesUrl + employee._id,
      employee
    );

    // Get updated employee
    const updatedEmployee = response.data;

    // Update global state
    employeesStore.dispatch({
      type: EmployeesActionType.UpdateEmployee,
      payload: updatedEmployee,
    });
  }
  // ==================== DELETE employee ====================
  public async deleteEmployee(_id: string): Promise<void> {
    
    // Delete employee from server
    await axios.delete(appConfig.employeesUrl + _id);

    // Delete from global state
    employeesStore.dispatch({
      type: EmployeesActionType.DeleteEmployee,
      payload: _id,
    });
  }
}

const employeesService = new EmployeesService();

export default employeesService;
