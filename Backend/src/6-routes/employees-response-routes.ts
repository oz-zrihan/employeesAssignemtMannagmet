import express, { Request, Response, NextFunction } from "express";
// Model
// Service
// Middleware
import blockNonLoggedIn from "../3-middleware/block-non-logged-in";
import verifyId from "../3-middleware/verifyId";
import employeesService from "../5-services/employees-service";
import EmployeeModel from "../2-models/employee-model";
import positionsService from "../5-services/positions-service";
import PositionModel from "../2-models/position-model";
import employeesResponseService from "../5-services/employees-response-service";
import EmployeeResponseModel from "../2-models/employee-response-model";

const router = express.Router();

// GET ALL
// GET http://localhost:4000/api/employees_response
router.get(
  "/",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const responses = await employeesResponseService.getAllEmployeesResponse();
      response.json(responses);
    } catch (err: any) {
      next(err);
    }
  }
);

// GET ONE
// GET http://localhost:4000/api/employees_response/:responseId
router.get(
  "/:responseId([0-9a-fA-F]{24})",
  [blockNonLoggedIn, verifyId],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const responseId = request.params.responseId;
      const employeeResponse = await employeesResponseService.getOneEmployeeResponse(responseId);
      response.json(employeeResponse);
    } catch (err: any) {
      next(err);
    }
  }
);


// ADD ONE
// POST http://localhost:4000/api/employees_response/:employeeId
router.post(
  "/:employeeId([0-9a-fA-F]{24})",
  [blockNonLoggedIn, verifyId],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const postResponse = new EmployeeResponseModel(request.body);
      const addedResponse = await employeesResponseService.addEmployeeResponse(postResponse);
      response.json(addedResponse);
    } catch (err: any) {
      next(err);
    }
  }
);

// DELETE ONE
// DELETE http://localhost:4000/api/employees_response/:responseId
router.delete(
  "/:responseId([0-9a-fA-F]{24})/:friendId([0-9a-fA-F]{24})",
  [blockNonLoggedIn, verifyId],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const responseId = request.params.responseId;
      await employeesResponseService.deleteEmployeeResponse(responseId);
      response.sendStatus(204);
    } catch (err: any) {
      next(err);
    }
  }
);

export default router;
