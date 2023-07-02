import express, { Request, Response, NextFunction } from "express";
// Model
// Service
// Middleware
import blockNonLoggedIn from "../3-middleware/block-non-logged-in";
import verifyId from "../3-middleware/verifyId";
import assignmentsService from "../5-services/assignments-service";
import AssignmentModel from "../2-models/assignment-model";
import verifyAdmin from "../3-middleware/verify-admin";

const router = express.Router();

// GET ALL
// GET http://localhost:4000/api/assignments
router.get(
  "/",
  [blockNonLoggedIn],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const assignments = await assignmentsService.getAllAssignments();
      response.json(assignments);
    } catch (err: any) {
      next(err);
    }
  }
);

// GET ONE
// GET http://localhost:4000/api/assignments/:assignmentId
router.get(
  "/:assignmentId([0-9a-fA-F]{24})",
  [blockNonLoggedIn],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const assignmentId = request.params.assignmentId;
      const assignment = await assignmentsService.getOneAssignment(
        assignmentId
      );
      response.json(assignment);
    } catch (err: any) {
      next(err);
    }
  }
);

// GET BY EMPLOYEE
// GET http://localhost:4000/api/assignments/by-employee/:employeeId
router.get(
  "/by-employee/:employeeId([0-9a-fA-F]{24})",
  [blockNonLoggedIn, verifyId],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const employeeId = request.params.employeeId;
      const assignments = await assignmentsService.getAssignmentsByEmployee(
        employeeId
      );
      response.json(assignments);
    } catch (err: any) {
      next(err);
    }
  }
);
// GET BY DEPARTMENT
// GET http://localhost:4000/api/assignments/by-department/:departmentId
router.get(
  "/by-department/:departmentId([0-9a-fA-F]{24})",
  [blockNonLoggedIn],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const departmentId = request.params.departmentId;
      const assignments = await assignmentsService.getAssignmentsByDepartment(
        departmentId
      );
      response.json(assignments);
    } catch (err: any) {
      next(err);
    }
  }
);

// ADD ONE
// POST http://localhost:4000/api/assignments
router.post(
  "/",
  [blockNonLoggedIn, verifyAdmin],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const assignment = new AssignmentModel(request.body);
      console.log("routes");
      console.log(assignment);

      const addedAssignment = await assignmentsService.addAssignment(
        assignment
      );
      response.json(addedAssignment);
    } catch (err: any) {
      next(err);
    }
  }
);

// UPDATE ONE
// PUT http://localhost:4000/api/assignments/:assignmentId
router.put(
  "/:assignmentId([0-9a-fA-F]{24})",
  [blockNonLoggedIn],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const assignmentId = request.params.assignmentId;
      const assignment = new AssignmentModel(request.body);
      const updatedAssignment = await assignmentsService.updateAssignment(
        assignment,
        assignmentId
      );
      response.json(updatedAssignment);
    } catch (err: any) {
      next(err);
    }
  }
);

// DELETE ONE
// DELETE http://localhost:4000/api/assignments/:assignmentId
router.delete(
  "/:assignmentId([0-9a-fA-F]{24})",
  [blockNonLoggedIn, verifyAdmin],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const assignmentId = request.params.assignmentId;
      await assignmentsService.deleteAssignment(assignmentId);
      response.sendStatus(204);
    } catch (err: any) {
      next(err);
    }
  }
);

export default router;
