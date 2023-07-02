  import mongoose from 'mongoose';
  import EmployeeModel from './employee-model';


  export interface IEmployeeResponseModel extends mongoose.Document {
    content: string;
    images?: string[];
    files?: string[];
    dateTime: Date;
    employeeId: mongoose.Types.ObjectId;
    assignmentId:mongoose.Types.ObjectId;
  }


  export const employeeResponseSchema = new mongoose.Schema({
    content: {
      type: String,
      required: [true,"missing response"],
    },
    images: [
      {
        type: String,
      },
    ],
    files: [
      {
        type: String,
      },
    ],
    dateTime: {
      type: Date,
      default: Date.now,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee",
      required: true,
    },
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "assignment",
      required: true,
    },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
  });

  employeeResponseSchema.virtual("employee", {
    ref: EmployeeModel,
    localField: "employeeId",
    foreignField: "_id",
    justOne: true,
  });
  
  const EmployeeResponseModel = mongoose.model<IEmployeeResponseModel>("EmployeeResponse", employeeResponseSchema, 'employeesResponse');
  export default EmployeeResponseModel;
