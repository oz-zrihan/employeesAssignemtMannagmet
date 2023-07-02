import DepartmentModel from "./DepartmentModel";
import EmployeeModel from "./EmployeeModel";
import EmployeeResponseModel from "./EmployeeResponseModel";

class AssignmentModel {
  public _id: string;
  public managerId: string;
  public departmentId: string;
  public employeeIds: string[];
  public title: string;
  public mission: string;
  public startDate: Date;
  public dueDate: Date;
  public status: string;
  public priority: string;
  public assignmentFolder?: string;
  public imagesUrl?: string[];
  public filesUrl?:  string[];
  public employeeResponseIds?: string[];

  // for populating:
  employeeResponses:EmployeeResponseModel[];
  manager:EmployeeModel;
  department:DepartmentModel;
  employees: EmployeeModel[];
}

export default AssignmentModel;
