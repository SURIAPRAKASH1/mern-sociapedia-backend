import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors/index.js";

export const register = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const user = new User({
      firstname,
      lastname,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    const savedUser = await user.save();
    res.status(StatusCodes.CREATED).json(savedUser);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invaild Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invaild Credentials");
  }

  const token = user.createJWT();
  user.password = undefined;

  res.status(StatusCodes.OK).json({ token, user });
};
