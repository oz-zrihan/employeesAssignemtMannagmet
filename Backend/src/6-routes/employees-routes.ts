import express, { Request, Response, NextFunction } from "express";
// Model
// Service
// Middleware
import blockNonLoggedIn from "../3-middleware/block-non-logged-in";
import verifyId from "../3-middleware/verifyId";
import employeesService from "../5-services/employees-service";
import EmployeeModel from "../2-models/employee-model";
import verifyAdmin from "../3-middleware/verify-admin";

const router = express.Router();

// GET ALL
// GET http://localhost:4000/api/employees
router.get(
  "/",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const employees = await employeesService.getAllEmployees();
      response.json(employees);
    } catch (err: any) {
      next(err);
    }
  }
);

// GET ONE
// GET http://localhost:4000/api/employees/:employeeId
router.get(
  "/:employeeId([0-9a-fA-F]{24})",
  [blockNonLoggedIn],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const employeeId = request.params.employeeId;
      const employee = await employeesService.getOneEmployee(employeeId);
      response.json(employee);
    } catch (err: any) {
      next(err);
    }
  }
);

// GET BY DEPARTMENT
// GET http://localhost:4000/api/employees/by-department/:departmentId
router.get(
  "/by-department/:departmentId([0-9a-fA-F]{24})",
  [blockNonLoggedIn],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const departmentId = request.params.departmentId;      
      const employees = await employeesService.getEmployeesByDepartment(departmentId);
      response.json(employees);
    } catch (err: any) {
      next(err);
    }
  }
);

// ADD ONE
// POST http://localhost:4000/api/employees
router.post(
  "/",
  [blockNonLoggedIn ,verifyAdmin],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const employee = new EmployeeModel(request.body);
      const addedEmployee = await employeesService.addEmployee(employee);
      response.json(addedEmployee);
    } catch (err: any) {
      next(err);
    }
  }
);

// UPDATE ONE
// PUT http://localhost:4000/api/employees/:employeeId
router.put(
  "/:employeeId([0-9a-fA-F]{24})/:friendId([0-9a-fA-F]{24})",
  [blockNonLoggedIn, verifyAdmin],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const employeeId = request.params.employeeId;
      const employee = new EmployeeModel(request.body);
      const updatedEmployee = await employeesService.updateEmployee(employee, employeeId);
      response.json(updatedEmployee);
    } catch (err: any) {
      next(err);
    }
  }
);

// DELETE ONE
// DELETE http://localhost:4000/api/employees/:employeeId
router.delete(
  "/:employeeId([0-9a-fA-F]{24})/:friendId([0-9a-fA-F]{24})",
  [blockNonLoggedIn, verifyAdmin],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const employeeId = request.params.employeeId;
      await employeesService.deleteEmployee(employeeId);
      response.sendStatus(204);
    } catch (err: any) {
      next(err);
    }
  }
);

export default router;
