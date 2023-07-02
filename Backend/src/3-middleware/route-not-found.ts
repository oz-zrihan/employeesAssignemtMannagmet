import { NextFunction, Request, Response } from "express";
// Model
import { RouteNotFoundError } from "../2-models/client-errors";

// Rout not found error handler
function routeNotFound(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const err = new RouteNotFoundError(request.originalUrl);
  next(err);
}

export default routeNotFound;
