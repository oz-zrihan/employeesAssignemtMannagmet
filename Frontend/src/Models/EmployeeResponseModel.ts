import EmployeeModel from "./EmployeeModel";

class EmployeeResponseModel {
  public _id: string;
  public content: string;
  public images?: string[];
  public files?: string[];
  public dateTime: Date;
  public employeeId: string;
  public assignmentId: string;

  // for populating
  public employee: EmployeeModel;
}

export default EmployeeResponseModel;
