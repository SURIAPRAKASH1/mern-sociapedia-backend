import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom-api.js";

class NotFoundError extends CustomAPIError {
  constructor(meassage) {
    super(meassage);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

export default NotFoundError;
