import express, { Request, Response, NextFunction } from "express";
//Models
import CredentialsModel from "../2-models/credentials-model";
// Service
import authService from "../5-services/auth-service";
import EmployeeModel from "../2-models/employee-model";

const router = express.Router();

// REGISTER
// POST http://localhost:4000/api/auth/register
router.post(
  "/register",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const employee = new EmployeeModel(request.body);
      const token = await authService.register(employee);
      response.status(201).json(token);
    } catch (err: any) {
      next(err);
    }
  }
);

// LOGIN
// POST http://localhost:4000/api/auth/login
router.post(
  "/login",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const credentials = new CredentialsModel(request.body);      
      const serverResponse = await authService.login(credentials);
      response.json(serverResponse);
    } catch (err: any) {
      next(err);
    }
  }
);

export default router;
