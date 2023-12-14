import bcrypt from "bcryptjs";
import path from 'path'; 
import fs from 'fs/promises'; 
import Jimp from "jimp";
import jwt from "jsonwebtoken";
import gravatar from 'gravatar';
import User from "../models/User.js";
import { HttpError } from "../helpers/index.js";

const avatarsPath = path.resolve("public", "avatars");


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

const updateAvatar = async (req, res, next) => {
  try{
  const { _id } = req.user;

	const { path: oldPath, filename } = req.file;

	const newPath = path.join(avatarsPath, filename);

	(await Jimp.read(oldPath)).resize(250, 250).write(oldPath);

	await fs.rename(oldPath, newPath);
	const avatarUrl = path.join('avatars', filename);

	await User.findByIdAndUpdate(_id, { avatarUrl }, { new: true });
	if (error) {
		throw new HttpError(401, `Not authorized`);
	}
	res.status(200).json({ avatarUrl });
  }
  catch(error){
    next();

  }
};

export default {
  signup,
  signin,
  getCurrent,
  logout,
  updateAvatar
};
