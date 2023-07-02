import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { Request } from "express";
import crypto from "crypto";
// Models
import { UnauthorizedError } from "../2-models/client-errors";
import { IEmployeeModel } from "../2-models/employee-model";

// Secret Key
const secretKey = "JohnBryceFinalProject";

// ================== Create new token: ==================
function createToken(employee: IEmployeeModel): string {
  // Delete user password:
  delete employee.password;

  // Create container containing the user:
  const container = { employee };

  // Create options:
  const options = { expiresIn: "12h" };

  // Create token:
  const token = jwt.sign(container, secretKey, options);

  // Return:
  return token;
}

// ================== Verify Token ==================
async function verifyToken(request: Request): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    // Extract header:
    const header = request.header("authorization"); // "Bearer the-token"

    // If no header:
    if (!header) {
      reject(new UnauthorizedError("Incorrect username or password"));
      return;
    }

    // Extract token:
    const token = header.substring(7);

    // If no token:
    if (!token) {
      reject(new UnauthorizedError("Incorrect username or password"));
      return;
    }

    // Verify:
    jwt.verify(token, secretKey, (err: JsonWebTokenError) => {
      if (err) {
        console.log(err);
        reject(new UnauthorizedError("Invalid token"));
        localStorage.removeItem("token");
        return;
      }

      // All is good:
      resolve(true);
    });
  });
}

// ================== Verify Admin ==================
async function verifyAdmin(request: Request): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      // Extract header:
      const header = request.header("authorization"); // "Bearer the-token"

      // If no header:
      if (!header) {
        reject(new UnauthorizedError("Incorrect username or password"));
        return;
      }

      // Extract token:
      const token = header.substring(7);

      // If no token:
      if (!token) {
        reject(new UnauthorizedError("Incorrect username or password"));
        return;
      }

      // Verify:
      jwt.verify(token, secretKey, (err, container: { employee: IEmployeeModel }) => {
        if (err) {
          reject(new UnauthorizedError("Invalid token"));
          return;
        }

        // Extract user from token:
        const employee: IEmployeeModel = container.employee;

        // If user is not admin:
        if (employee.role !== "admin") {
          reject(new UnauthorizedError("Access denied"));
          return;
        }

        // All is good:
        resolve(true);
      });
    } catch (err: any) {
      reject(err);
    }
  });
}

// ================== Verify employee Id same as token ==================
function verifyId(request: Request, employeeId: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      // Extract header:
      const header = request.header("authorization");

      // If no header:
      if (!header) {
        reject(new UnauthorizedError("Incorrect username or password"));
        return;
      }

      // Extract token:
      const token = header.substring(7);

      // If no token:
      if (!token) {
        reject(new UnauthorizedError("Incorrect username or password"));
        return;
      }

      // Verify:
      jwt.verify(token, secretKey, (err: JsonWebTokenError, container: any) => {
        if (err) {
          reject(new UnauthorizedError("Invalid token"));
          return;
        }

        // Extract employee from token:
        const employee: IEmployeeModel = container.employee;
        
        //verify that given id is the same as token id
        if (employee._id !== employeeId) {
          reject(new UnauthorizedError("Access denied"));
          return;
        }

        resolve(true);
      });
    } catch (err: any) {
      reject(err);
    }
  });
}

// ================== Hashing password ==================
function hashPassword(plainText: string): string {
  // Salt string
  const salt = "M@aN#Ag@Y0rC0mp2Ny";

  // Hash with salt
  const hashedText = crypto
    .createHmac("sha512", salt)
    .update(plainText)
    .digest("hex");

  return hashedText;
}

function isPasswordHashed(password: string): boolean {
  const salt = "M@aN#Ag@Y0rC0mp2Ny";

  return password.startsWith(salt);
}


export default {
  createToken,
  verifyToken,
  verifyAdmin,
  verifyId,
  hashPassword,
  isPasswordHashed
};
