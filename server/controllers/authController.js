import User from "../models/UserModel.js";
import { StatusCodes } from "http-status-codes";
import { USER_STATUS } from "../utils/constants.js";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";
import { UnauthenticatedError } from "../errors/customErrors.js";
import { createJWT } from "../utils/tokenUtils.js";

// Controller for registering a new user
export const register = async (req, res) => {
  try {
    // Check if this is the first account to automatically assign admin status
    const isFirstAccount = (await User.countDocuments()) === 0;
    if (isFirstAccount) {
      req.body.userStatus = USER_STATUS.ADMIN;
    }

    // Encrypt the user's password before saving
    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;

    // Create and save the new user
    const user = await User.create(req.body);

    res.status(StatusCodes.CREATED).json({ msg: "User registered", user });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

// Controller for user login and setting authentication cookie
export const login = async (req, res) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email });

    // Validate user credentials
    const isValidUser =
      user && (await comparePassword(req.body.password, user.password));

    if (!isValidUser) throw new UnauthenticatedError("Invalid login");

    // Create a JWT for the user
    const token = createJWT({ userId: user._id, userStatus: user.userStatus });

    // Set cookie to expire in one day
    const oneDay = 1000 * 60 * 60 * 24;

    const isProduction = process.env.NODE_ENV === "production";

    // Set the authentication cookie
    res.cookie("token", token, {
      httpOnly: true, // prevent client-side script access to the cookie
      expires: new Date(Date.now() + oneDay),
      secure: isProduction, // send the cookie over HTTPS only
      sameSite: isProduction ? "None" : "Lax", // use 'None' for cross-site requests in production
    });
    res.status(StatusCodes.OK).json({ msg: "User is logged in" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

// Controller for logging out a user and removing the authentication cookie
export const logout = (req, res) => {
  try {
    // Set the cookie to a dummy value and make it expire immediately
    res.cookie("token", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({ msg: "User logged out" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};
