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

const router = express.Router();

// GET ALL
// GET http://localhost:4000/api/positions
router.get(
  "/",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const positions = await positionsService.getAllPositions();
      response.json(positions);
    } catch (err: any) {
      next(err);
    }
  }
);

// GET ONE
// GET http://localhost:4000/api/positions/:positionId
router.get(
  "/:positionId([0-9a-fA-F]{24})",
  [blockNonLoggedIn, verifyId],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const positionId = request.params.positionId;
      const position = await positionsService.getOnePositions(positionId);
      response.json(position);
    } catch (err: any) {
      next(err);
    }
  }
);


// ADD ONE
// POST http://localhost:4000/api/positions
router.post(
  "/",
  [blockNonLoggedIn, verifyId],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const position = new PositionModel(request.body);
      const addedPosition = await positionsService.addPositions(position);
      response.json(addedPosition);
    } catch (err: any) {
      next(err);
    }
  }
);

// DELETE ONE
// DELETE http://localhost:4000/api/positions/:positionId
router.delete(
  "/:positionId([0-9a-fA-F]{24})/:friendId([0-9a-fA-F]{24})",
  [blockNonLoggedIn, verifyId],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const positionId = request.params.positionId;
      await positionsService.deletePosition(positionId);
      response.sendStatus(204);
    } catch (err: any) {
      next(err);
    }
  }
);

export default router;
