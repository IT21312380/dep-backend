const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const createError = require("../utils/appError");
const bcrypt = require("bcrypt");

//REGISTER USER
exports.signup = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return next(new createError("User already exists!"));
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    //ASSIGN JWT WEB TOKEN TO USER
    const token = jwt.sign({ _id: newUser._id }, "secretkey123", {
      expiresIn: "8d",
    });

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    next(error);
  }
};

//LOGGING USER
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return next(new createError("User not found!", 404));

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new createError("Invalid email or password", 401));
    }

    const token = jwt.sign({ id: user._id }, "secretkey123", {
      expiresIn: "8d",
    });
    res.status(200).json({
      status: "success",
      token,
      message: "Logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};
