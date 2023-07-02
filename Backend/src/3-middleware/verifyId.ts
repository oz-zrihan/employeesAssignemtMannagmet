import { NextFunction, Request, Response } from "express";
// Model
import { UnauthorizedError } from "../2-models/client-errors";
// Utils
import cyber from "../4-utils/cyber";

// Verify user Id
async function verifyId(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {

    // Get user id
    const id = request.params.employeeId;

    // Check if id is valid
    const isValid = await cyber.verifyId(request, id);    

    // If id not valid, throw error
    if (isValid) { next()}
    else {throw new UnauthorizedError("Invalid user id")}

    
  } catch (err: any) {
    next(err);
  }
}

export default verifyId;
