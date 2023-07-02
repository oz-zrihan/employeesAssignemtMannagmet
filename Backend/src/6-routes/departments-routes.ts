import express, { Request, Response, NextFunction } from "express";
// Model
// Service
// Middleware
import blockNonLoggedIn from "../3-middleware/block-non-logged-in";
import verifyId from "../3-middleware/verifyId";
import departmentsService from "../5-services/departments-service";
import DepartmentModel from "../2-models/department-model";

const router = express.Router();

// GET ALL
// GET http://localhost:4000/api/departments
router.get(
  "/",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const departments = await departmentsService.getAllDepartments();
      response.json(departments);
    } catch (err: any) {
      next(err);
    }
  }
);

// GET ONE
// GET http://localhost:4000/api/departments/:departmentId
router.get(
  "/:departmentId([0-9a-fA-F]{24})",
  [blockNonLoggedIn, verifyId],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const departmentId = request.params.departmentId;
      const department = await departmentsService.getOneDepartment(departmentId);
      response.json(department);
    } catch (err: any) {
      next(err);
    }
  }
);


// ADD ONE
// POST http://localhost:4000/api/departments
router.post(
  "/",
  [blockNonLoggedIn, verifyId],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const department = new DepartmentModel(request.body);
      const addedDepartment = await departmentsService.addDepartment(department);
      response.json(addedDepartment);
    } catch (err: any) {
      next(err);
    }
  }
);

// DELETE ONE
// DELETE http://localhost:4000/api/departments/:departmentId
router.delete(
  "/:departmentId([0-9a-fA-F]{24})/:friendId([0-9a-fA-F]{24})",
  [blockNonLoggedIn, verifyId],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const departmentId = request.params.departmentId;
      await departmentsService.deleteDepartment(departmentId);
      response.sendStatus(204);
    } catch (err: any) {
      next(err);
    }
  }
);

export default router;
