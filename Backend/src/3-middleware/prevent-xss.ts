import { NextFunction, Request, Response } from "express";
import stripTags from "striptags";

// Prevent cross-site scripting
function preventXss(request: Request, response: Response, next: NextFunction) {
  for (const prop in request.body) {
    if (typeof request.body[prop] === "string") {
      // Remove any HTML tags from request
      request.body[prop] = stripTags(request.body[prop]);
    }
  }

  next();
}

export default preventXss;
