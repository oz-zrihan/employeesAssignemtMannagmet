import AssignmentModel from "../2-models/assignment-model";
import {
  ResourceNotFoundError,
  ValidationError,
} from "../2-models/client-errors";
import EmployeeResponseModel, {
  IEmployeeResponseModel,
} from "../2-models/employee-response-model";
import assignmentsService from "./assignments-service";

// Get all employees response from database:
async function getAllEmployeesResponse(): Promise<IEmployeeResponseModel[]> {
  return EmployeeResponseModel.find().populate("employees").exec();
}

// Get one employee response
async function getOneEmployeeResponse(
  _id: string
): Promise<IEmployeeResponseModel> {
  const employeeResponse = await EmployeeResponseModel.findById(_id)
    .populate("employees")
    .exec();

  // Validate employee response id exists:
  if (!employeeResponse) throw new ResourceNotFoundError(_id);

  return employeeResponse;
}

// Add employee response
async function addEmployeeResponse(employeeResponse: IEmployeeResponseModel): Promise<IEmployeeResponseModel> {
    
  console.log(employeeResponse);
  
    // Validate employee response:
    const errors = employeeResponse.validateSync();
    if (errors) throw new ValidationError(errors.message);
  
    // Save the employee response
    const addedResponse = await employeeResponse.save();
  
   
    return addedResponse;
  }
  

// Delete employee response
async function deleteEmployeeResponse(_id: string): Promise<void> {
  const employeeResponse = await EmployeeResponseModel.findById(_id).exec();

  // Validate employee response id exists:
  if (!employeeResponse) throw new ResourceNotFoundError(_id);

  const deleteEmployeeResponse = await EmployeeResponseModel.findByIdAndDelete(
    _id
  ).exec();

  // Validate deleted employee response:
  if (!deleteEmployeeResponse) throw new ResourceNotFoundError(_id);
}

export default {
  getAllEmployeesResponse,
  getOneEmployeeResponse,
  addEmployeeResponse,
  deleteEmployeeResponse,
};
