import { ResourceNotFoundError, ValidationError } from "../2-models/client-errors";
import DepartmentModel, { IDepartmentModel } from "../2-models/department-model";


// Get all departments from database: 
async function getAllDepartments(): Promise<(IDepartmentModel)[]> {
  return DepartmentModel.find().exec();    
  }

// Get one department
async function getOneDepartment(_id: string): Promise<IDepartmentModel> {
        
    const department = await DepartmentModel.findById(_id).exec();
        
        // Validate department id exists:
        if (!department) throw new ResourceNotFoundError(_id);

        return department;
}

// Add department
async function addDepartment(department: IDepartmentModel): Promise<IDepartmentModel> {
    
    // Validate department:
    const errors = department.validateSync();
    if(errors) throw new ValidationError(errors.message);

    return department.save();
}

// Delete department
async function deleteDepartment(_id: string): Promise<void> {
   
    const department = await DepartmentModel.findById(_id).exec();
    
    // Validate department id exists:
    if (!department) throw new ResourceNotFoundError(_id);
    
    const deleteDepartment = await DepartmentModel.findByIdAndDelete(_id).exec();

    // Validate deleted department:
    if(!deleteDepartment) throw new ResourceNotFoundError(_id);
}



export default {
   getAllDepartments,
   getOneDepartment,
   addDepartment,
   deleteDepartment
};
