import { NextFunction, Request, Response } from "express";
// Utils
import cyber from "../4-utils/cyber";

// Verify that user is logged-in
async function verifyLoggedIn(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    // Verify user token
    await cyber.verifyToken(request);
    next();
  } catch (err: any) {
    next(err);
  }
}

export default verifyLoggedIn;
