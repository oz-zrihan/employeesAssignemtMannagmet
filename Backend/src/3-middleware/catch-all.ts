import { NextFunction, Request, Response } from "express";
// Utils
import appConfig from "../4-utils/app-config";

// Catch All Errors
function catchAll(
  err: any,
  request: Request,
  response: Response,
  next: NextFunction
) {
  // Get status code
  const status = err.status || 500;

  //report general error for production crashes
  const message =
    appConfig.isProduction && status >= 500
      ? "some error occurred, please try again"
      : err.message;

  response.status(status).send(message);
}

export default catchAll;
