import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from 'gravatar';
import User from "../models/User.js";
import { HttpError } from "../helpers/index.js";


const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "Email in use");
    }

    const avatarURL = gravatar.url(email, { s: '200', r: 'pg', d: 'identicon' });

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL });
    res.status(201).json({
      email: newUser.email,
    });
  } catch (error) {
    next(error);
  }
};
// const signup = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (user) {
//       throw HttpError(409, "Email in use");
//     }
//     const hashPassword = await bcrypt.hash(password, 10);

//     const newUser = await User.create({ ...req.body, password: hashPassword });
//     res.status(201).json({
//       email: newUser.email,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "Not authorized");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, "Email or password is wrong");
    }
    const { JWT_SECRET } = process.env;

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });

    res.json({
      token,
    });
  } catch (error) {
    next(error);
  }
};

const getCurrent = async (req, res, next) => {
  try {
    const { email } = req.user;
    res.json({
      email,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });

    res.json({
      message: "No Content"
    })
  } catch (error) {
    next();
  }
};

export default {
  signup,
  signin,
  getCurrent,
  logout,
};
