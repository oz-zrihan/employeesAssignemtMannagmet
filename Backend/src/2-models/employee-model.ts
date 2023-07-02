import mongoose, { Model } from 'mongoose';
import PositionModel from './position-model';
import DepartmentModel from './department-model';

export interface IEmployeeModel extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  departmentId: mongoose.Types.ObjectId;
  positionId: mongoose.Types.ObjectId;
  recruitmentDate: Date;
  role: string;
}


export const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "missing first name"],
  },
  lastName: {
    type: String,
    required: [true, "missing last name"],
  },
  email: {
    type: String,
    required: [true, "missing email"],
  },
  password:{
    type: String,
    required: [true, "missing password"],
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "missing department"],
  },
  positionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "missing position"],
  },
  recruitmentDate: {
    type: Date,
    required: [true,"missing recruitment date"],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    required: true,
  },
},
{
  versionKey: false,
  toJSON: {virtuals: true},
});

employeeSchema.virtual('department', {
  ref: DepartmentModel,
  localField: 'departmentId',
  foreignField: '_id',
  justOne: true,
});

employeeSchema.virtual('position', {
  ref: PositionModel,
  localField: 'positionId',
  foreignField: '_id',
  justOne: true,
});

 const EmployeeModel = mongoose.model<IEmployeeModel>('Employee', employeeSchema,'employees');
export default EmployeeModel;
