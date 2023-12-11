import User from "../models/UserModel.js";
import { StatusCodes } from "http-status-codes";
import { USER_STATUS } from "../utils/constants.js";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";
import { UnauthenticatedError } from "../errors/customErrors.js";
import { createJWT } from "../utils/tokenUtils.js";

// REGISTER USER
export const register = async (req, res) => {
  const isFirstAccount = (await User.countDocuments()) === 0;
  if (isFirstAccount) {
    req.body.userStatus = USER_STATUS.ADMIN;
  }

  // password encryption
  const hashedPassword = await hashPassword(req.body.password);
  req.body.password = hashedPassword;

  // create user
  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ msg: "User registered", user });
};

// LOGIN - SET COOKIE
export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  const isValidUser =
    user && (await comparePassword(req.body.password, user.password));

  if (!isValidUser) throw new UnauthenticatedError("Invalid login");

  const token = createJWT({ userId: user._id, userStatus: user.userStatus });

  const oneDay = 1000 * 60 * 60 * 24;

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: isProduction, // send the cookie over HTTPS only
    sameSite: isProduction ? "None" : "Lax", // use 'None' for cross-site requests in production
  });
  res.status(StatusCodes.OK).json({ msg: "User is logged in" });
};

// LOGOUT - REMOVE COOKIE
export const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "User logged out" });
};
