import DepartmentModel from "./DepartmentModel";

class PositionModel {
  public _id: string
  public name: string;

  // for populating
  department:DepartmentModel;
}

export default PositionModel;
