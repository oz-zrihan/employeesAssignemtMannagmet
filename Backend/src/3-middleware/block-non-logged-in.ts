import { NextFunction, Request, Response } from "express";
// Model
import { UnauthorizedError } from "../2-models/client-errors";
//Utils
import cyber from "../4-utils/cyber";

// Blocked non logged-in users
async function blockNonLoggedIn(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    // Verify user token
    const isValid = await cyber.verifyToken(request);

    // If token not valid throw error
    if (!isValid) throw new UnauthorizedError("You are not logged in");
    next();
  } catch (err: any) {
    next(err);
  }
}

export default blockNonLoggedIn;
