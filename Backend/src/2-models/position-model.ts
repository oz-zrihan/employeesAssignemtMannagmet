import mongoose from 'mongoose';
import DepartmentModel from './department-model';

export interface IPositionModel extends mongoose.Document {
  name: string;
  departmentId: mongoose.Types.ObjectId;
}


export const positionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "missing position"],
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, "missing department"],
  },
},{
  versionKey: false,
  toJSON: {virtuals: true},
});
positionSchema.virtual('department', {
  ref: DepartmentModel,
  localField: 'departmentId',
  foreignField: '_id',
  justOne: true,
});
 const PositionModel = mongoose.model<IPositionModel>('Position', positionSchema, 'positions');
export default PositionModel;
