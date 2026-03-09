// Server / controllers / userController.js
import validator from "validator";
import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRES = process.env.JWT_EXPIRES_IN;

const createToken = (userId) =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });

/* -------- User Register -------- */
export async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    // if (!name || !email || !password) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "All fields (name, email, and password) are required.",
    //   });
    // }

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required.",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required.",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    // if (password.length < 8) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Password must be at least 8 characters long.",
    //   });
    // }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one uppercase letter.",
      });
    }

    if (!/[a-z]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one lowercase letter.",
      });
    }

    if (!/[0-9]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one number.",
      });
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least one special character (e.g., !@#$%^&*).",
      });
    }

    if (await userModel.findOne({ email })) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await userModel.create({ name, email, password: hashed });
    const token = createToken(user._id);

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(
      "User Register Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while registering the user.",
      error: `User Register Error: ${error?.stack || error?.message || error}`,
    });
  }
}

/* -------- User Login -------- */
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // if (!email || !password) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Email and password are required.",
    //   });
    // }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required.",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No account found with this email.",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password. Please try again.",
      });
    }

    const token = createToken(user._id);

    return res.status(200).json({
      success: true,
      message: "User logged in successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("User Login Error:", error?.stack || error?.message || error);

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while logging in.",
      error: `User Login Error: ${error?.stack || error?.message || error}`,
    });
  }
}

/* -------- Get Current User -------- */
export async function getCurrentUser(req, res) {
  try {
    const user = await userModel.findById(req.user.id).select("name email");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Authenticated user not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Current user fetched successfully.",
      user,
    });
  } catch (error) {
    console.error(
      "Get Current User Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while fetching the current user.",
      error: `Get Current User Error: ${error?.stack || error?.message || error}`,
    });
  }
}

/* -------- Update Profile -------- */
export async function updateProfile(req, res) {
  try {
    const { name, email } = req.body;

    // if (!name || !email || !validator.isEmail(email)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Name and a valid email are required.",
    //   });
    // }

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required.",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    const exists = await userModel.findOne({
      email,
      _id: { $ne: req.user.id },
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Email is already in use by another account.",
      });
    }

    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true, select: "name email" },
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user,
    });
  } catch (error) {
    console.error(
      "Update Profile Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while updating the profile.",
      error: `Update Profile Error: ${error?.stack || error?.message || error}`,
    });
  }
}

/* -------- Change Password -------- */
export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    // if (!currentPassword || !newPassword || newPassword.length < 8) {
    //   return res.status(400).json({
    //     success: false,
    //     message:
    //       "Both current and new passwords are required. New password must be at least 8 characters long.",
    //   });
    // }

    if (!currentPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password is required.",
      });
    }

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password is required.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long.",
      });
    }

    const user = await userModel.findById(req.user.id).select("password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Authenticated user not found.",
      });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error(
      "Change Password Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while changing the password.",
      error: `Change Password Error: ${error?.stack || error?.message || error}`,
    });
  }
}
