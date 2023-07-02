import mongoose from 'mongoose';


export interface IDepartmentModel extends mongoose.Document {
  name: string;
}

export const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "missing department"],
  },
});


export const DepartmentModel = mongoose.model<IDepartmentModel>('Department', departmentSchema, 'departments');
export default DepartmentModel;
