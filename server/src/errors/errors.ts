import { StatusCodes } from "http-status-codes";
import { ICustomError } from "src/types";

export class CustomError extends Error implements ICustomError {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    Object.setPrototypeOf(this, Error.prototype);
    this.status = status;
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(StatusCodes.NOT_FOUND, message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string) {
    super(StatusCodes.BAD_REQUEST, message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string) {
    super(StatusCodes.UNAUTHORIZED, message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
