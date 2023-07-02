import { NextFunction, Request, Response } from "express";
// Utils
import cyber from "../4-utils/cyber";

// Verify if user is admin
async function verifyAdmin(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    // Verify admin
    await cyber.verifyAdmin(request);
    next();
  } catch (err: any) {
    next(err);
  }
}

export default verifyAdmin;
