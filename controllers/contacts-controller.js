import fs from "fs/promises";
import gravatar from 'gravatar';

import path from "path";
import Contact from "../models/Contact.js";
import { HttpError } from "../helpers/index.js";

const avatarsPath = path.resolve("public", "avatars");

const getAllContacts = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const result = await Contact.find(owner);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { _id: owner } = req.user;

    const result = await Contact.findOne({ _id: contactId, owner });

    if (!result) {
      throw HttpError(404, `Not found`);
    }
    res.json(result);
  } catch (error) {
    next();
  }
};
const add = async (req, res, next) => {
  try {
    const { error } = req.body;
    if (error) {
      throw HttpError(400, error.message);
    }

    const { email, ...otherContactData } = req.body;

    const avatarUrl = gravatar.url(email, { s: '200', r: 'pg', d: 'identicon' });

    const result = await Contact.create({ ...otherContactData, avatar: avatarUrl, owner: req.user._id });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// const add = async (req, res, next) => {
//   try {
//     const { error } = req.body;
//     if (error) {
//       throw HttpError(400, error.message);
//     }
//     const { _id: owner } = req.user;
//     // const { path: oldPath, filename } = req.file;
//     // const newPath = path.join(avatarsPath, filename);

//   //   await fs.rename(oldPath, newPath);
//   // const avatar = path.join("avatars", filename)
//     const result = await Contact.create({...req.body, avatar, owner});
//     res.status(201).json(result);
//   } catch (error) {
//     next(error);
//   }
// };

const updateContacts = async (req, res, next) => {
  try {
    const { error } = req.body;
    if (error) {
      throw HttpError(400, error.message);
    }
    const { contactId } = req.params;
    const { _id: owner } = req.user;
    const result = await Contact.findOneAndUpdate(
      { _id: contactId, owner },
      req.body
    );
    if (!result) {
      throw HttpError(404, `Not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const deleteContactId = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { _id: owner } = req.user;

    const result = await Contact.findOneAndDelete({ _id: contactId, owner });
    if (!result) {
      throw HttpError(404, `Not found`);
    }
    res.json({
      message: "contact deleted",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllContacts,
  getById,
  add,
  updateContacts,
  deleteContactId,
};
