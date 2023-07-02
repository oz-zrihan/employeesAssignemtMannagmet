import mongoose, { Schema, Document } from "mongoose";
import EmployeeResponseModel, { employeeResponseSchema } from "./employee-response-model";
import EmployeeModel from "./employee-model";
import DepartmentModel from "./department-model";

export interface IAssignmentModel extends Document {
  managerId: mongoose.Types.ObjectId;
  departmentId: mongoose.Types.ObjectId;
  employeeIds: mongoose.Types.ObjectId[];
  title: string;
  mission: string;
  startDate: Date;
  dueDate: Date;
  status: string;
  priority: string;
  assignmentFolder?: string;
  imagesUrl?: string[];
  filesUrl?:string[];
  employeeResponseIds?: mongoose.Types.ObjectId[];
}

export const assignmentSchema: Schema<IAssignmentModel> = new mongoose.Schema(
  {
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    employeeIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
      },
    ],
    title: {
      type: String,
      required: true,
    },
    mission: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "waiting",
        "inProgress",
        "backToRepairs",
        "waitingForApproval",
        "managerApproved",
      ],
      required: true,
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      required: true,
    },
    assignmentFolder: { type: String},
    imagesUrl: [{ type: String}],
    filesUrl: [{ type: String}],
    employeeResponseIds:  [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "employeeResponses",
        required: true,
      },
    ],
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
  }
);

// Add virtual fields for employeeResponses, manager, and employees
assignmentSchema.virtual("employeeResponses", {
  ref: EmployeeResponseModel,
  localField: "employeeResponseIds",
  foreignField: "_id",
  justOne: false,
  populate: {
    path: "employee",
    model: EmployeeModel,
  },
});


assignmentSchema.virtual("manager", {
  ref: EmployeeModel,
  localField: "managerId",
  foreignField: "_id",
  justOne: true,
});
assignmentSchema.virtual("department", {
  ref: DepartmentModel,
  localField: "departmentId",
  foreignField: "_id",
  justOne: true,
});

assignmentSchema.virtual("employees", {
  ref: EmployeeModel,
  localField: "employeeIds",
  foreignField: "_id",
  justOne: false,
});

const AssignmentModel = mongoose.model<IAssignmentModel>(
  "Assignment",
  assignmentSchema,
  "assignments"
);

export default AssignmentModel;
