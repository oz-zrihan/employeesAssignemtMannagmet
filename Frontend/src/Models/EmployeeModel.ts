import DepartmentModel from "./DepartmentModel";
import PositionModel from "./PositionModel";

class EmployeeModel  {
  public _id?: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public password: string;
  public departmentId: string;
  public positionId: string;
  public recruitmentDate: Date;
  public role: string;

  // For populating
  public department: DepartmentModel;
  public position: PositionModel;
}


export default EmployeeModel;
