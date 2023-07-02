import { ResourceNotFoundError, ValidationError } from "../2-models/client-errors";
import EmployeeModel, { IEmployeeModel } from "../2-models/employee-model";


// Get all employees from database: 
async function getAllEmployees(): Promise<(IEmployeeModel)[]> {
  return EmployeeModel.find().populate('department position').exec();    
  }
  
// Get employees by department
async function getEmployeesByDepartment(departmentId:string): Promise<IEmployeeModel[]> {

  const employees = EmployeeModel.find({departmentId: departmentId}).populate('department position').exec();
    
    // Validate employees exists in category:
    if (!employees) throw new ResourceNotFoundError(departmentId);

    return employees;
}


// Get one employee
async function getOneEmployee(_id: string): Promise<IEmployeeModel> {
        
    const employee = await EmployeeModel.findById(_id).populate('department position').exec();
        
        // Validate employee id exists:
        if (!employee) throw new ResourceNotFoundError(_id);

        return employee;
}

// Add employee
async function addEmployee(employee: IEmployeeModel): Promise<IEmployeeModel> {
    
    // Validate employee:
    const errors = employee.validateSync();
    if(errors) throw new ValidationError(errors.message);

    return employee.save();
}

// Update employee
async function updateEmployee(employee: IEmployeeModel, employeeId:string): Promise<IEmployeeModel> {
 
    // Validate employee:
    const errors = employee.validateSync();
    if(errors) throw new ValidationError(errors.message);

    // Validate employee id exists:
    const updatedEmployee = await EmployeeModel.findByIdAndUpdate(employeeId, employee, { returnOriginal: false }).exec();
    if(!updatedEmployee) throw new ResourceNotFoundError(employee._id);

    return updatedEmployee;
}

// Delete employee
async function deleteEmployee(_id: string): Promise<void> {
   
    const employee = await EmployeeModel.findById(_id).exec();
    
    // Validate employee id exists:
    if (!employee) throw new ResourceNotFoundError(_id);
    
    const deleteEmployee = await EmployeeModel.findByIdAndDelete(_id).exec();

    // Validate deleted product:
    if(!deleteEmployee) throw new ResourceNotFoundError(_id);
}



export default {
    getAllEmployees,
    getEmployeesByDepartment,
    getOneEmployee,
    addEmployee,
    updateEmployee,
    deleteEmployee
};
