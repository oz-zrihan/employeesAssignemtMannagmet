// Models
import { ResourceNotFoundError, UnauthorizedError, ValidationError } from "../2-models/client-errors";
// Utils
import cyber from "../4-utils/cyber";
import dal from "../4-utils/dal";
import EmployeeModel, { IEmployeeModel } from "../2-models/employee-model";
import CredentialsModel, { ICredentialsModel } from '../2-models/credentials-model';


// ====================== Register new user: ======================
async function register(employee: IEmployeeModel): Promise<string> {
 
 // Validate user:
const errors = employee.validateSync();
if(errors) throw new ValidationError(errors.message);

// Validate email:
const isTaken = await isEmailTaken(employee.email);

if(isTaken) throw new ValidationError("Email is already taken")

// Hash password
employee.password = cyber.hashPassword( employee.password );

// Set role as a regular user:
employee.role = "user";

// save to database:
const savedEmployee = await employee.save(); 

// Create token:
const token = cyber.createToken(savedEmployee);

// Return token:
return token;
}

// ====================== Check if user name is already taken ======================
async function isEmailTaken(email: string): Promise<boolean> {
  
  try {
    const employee = await EmployeeModel.findOne({ email }).exec();

    if (employee) {
      // Email is already taken
      return true;
    } else {
      // Email is not taken
      return false;
    }
  } catch (err: any) {
    throw new ResourceNotFoundError(email);
  }
}


// ====================== Login: ======================
async function login(credentials: ICredentialsModel): Promise<{token:string, employee:IEmployeeModel}> {
  const { email, password } = credentials;

    // Check if the stored password is hashed or not
    const isPasswordHashed = cyber.isPasswordHashed(password);

    if (isPasswordHashed) {
      // Password is hashed in the database, hash the entered password for comparison
      const hashedPassword = cyber.hashPassword(password);
  
      // Compare the hashed passwords
      if (password !== hashedPassword) {
        throw new ValidationError('Username or password mismatch');
      }
    } else {
      // Password is not hashed in the database, compare the entered password as-is
      if (password !== password) {
        throw new ValidationError('Username or password mismatch');
      }
    }
  
  const employee = await EmployeeModel.findOne({ email })
  .populate('department')
  .populate('position')
  .exec();
  
  // Validate user email exists:
  if (!employee) throw new ResourceNotFoundError(email);

  // Create token:
  const token = cyber.createToken(employee);

  // Return token:
  return {token, employee};
}



export default {
  register,
  login,
};
