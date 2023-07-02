import AssignmentModel, {
  IAssignmentModel,
} from "../2-models/assignment-model";
import {
  ResourceNotFoundError,
  ValidationError,
} from "../2-models/client-errors";
import EmployeeModel from "../2-models/employee-model";
import socketIoService from "./socket.io-service";
// import socketIoService from "./socket.io-service";

// Get all assignments from database:
async function getAllAssignments(): Promise<IAssignmentModel[]> {
  return AssignmentModel.find()
  .populate({
    path: "employeeResponses",
    populate: {
      path: "employee",
      model: EmployeeModel,
    },
  })
  .populate("manager employees department")
  .exec();
}

// Get assignments by employee
async function getAssignmentsByEmployee(
  employeeId: string
): Promise<IAssignmentModel[]> {
  const assignments = AssignmentModel.find({ employeeId: employeeId })
  .populate({
    path: "employeeResponses",
    populate: {
      path: "employee",
      model: EmployeeModel,
    },
  })
  .populate("manager employees department")
  .exec();

  // Validate assignments exists in category:
  if (!assignments) throw new ResourceNotFoundError(employeeId);

  return assignments;
}

// Get assignments by department
async function getAssignmentsByDepartment(
  departmentId: string
): Promise<IAssignmentModel[]> {
  

  const assignments = await AssignmentModel.find({ departmentId: departmentId })
    .populate({
      path: "employeeResponses",
      populate: {
        path: "employee",
        model: EmployeeModel,
      },
    })
    .populate("manager employees department")
    .exec();

      
  // Validate assignments exists in category:
  if (!assignments) throw new ResourceNotFoundError(departmentId);

  return assignments;
}

// Get one assignment
async function getOneAssignment(_id: string): Promise<IAssignmentModel[]> {
  const assignments = await AssignmentModel.find({ _id: _id })
  .populate({
    path: "employeeResponses",
    populate: {
      path: "employee",
      model: EmployeeModel,
    },
  })
  .populate("manager employees department")
  .exec();

  // Validate assignment id exists:
  if (!assignments) throw new ResourceNotFoundError(_id);

  return assignments;
}

// Add assignment
async function addAssignment(
  assignment: IAssignmentModel
): Promise<IAssignmentModel> {

  // Validate assignment:
  const errors = assignment.validateSync();
  if (errors) throw new ValidationError(errors.message);

  const addedAssignment = await assignment.save();

  addedAssignment.employeeIds.map(e => {
    const id = e.toString();
    const departmentId = addedAssignment.departmentId.toString();
  
  });
  
  return addedAssignment;
}

// Update assignment
async function updateAssignment(
  assignment: IAssignmentModel,
  assignmentId: string
): Promise<IAssignmentModel> {
  // Validate assignment:
  const errors = assignment.validateSync();
  if (errors) throw new ValidationError(errors.message);
  const updatedAssignment = await AssignmentModel.findByIdAndUpdate(
    assignmentId,
    assignment,
    { returnOriginal: false } 
  )
    .populate({
      path: "employeeResponses",
      populate: {
        path: "employee",
        model: EmployeeModel,
      },
    })
    .populate("manager employees department")
    .exec();

    console.log("assignment");
    console.log("====================================");
    console.log(assignment);
    console.log("====================================");
    console.log("updatedAssignment");
    console.log("====================================");
    console.log(updatedAssignment);
    
  if (!updatedAssignment) throw new ResourceNotFoundError(assignment._id);

  return updatedAssignment;
}
// Delete assignment
async function deleteAssignment(_id: string): Promise<void> {
  const assignment = await AssignmentModel.findById(_id).exec();

  // Validate employee id exists:
  if (!assignment) throw new ResourceNotFoundError(_id);

  const deleteAssignment = await AssignmentModel.findByIdAndDelete(_id).exec();

  // Validate deleted product:
  if (!deleteAssignment) throw new ResourceNotFoundError(_id);
}

export default {
  getAllAssignments,
  getAssignmentsByEmployee,
  getAssignmentsByDepartment,
  getOneAssignment,
  addAssignment,
  updateAssignment,
  deleteAssignment,
};
