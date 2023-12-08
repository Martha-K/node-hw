import express from "express";
import contactsController from "../../controllers/contacts-controller.js";
import {
  authenticate,
  isEmptyBody,
  isValidId,
  upload,
} from "../../middlewares/index.js";
import { validateBody } from "../../decorators/index.js";
import {
  contactAddSchema,
  contactUpdateShema,
  contactFavoriteShema,
} from "../../models/Contact.js";

const router = express.Router();

router.use(authenticate);

router.get("/", contactsController.getAllContacts);

router.get("/:contactId", isValidId, contactsController.getById);

router.post(
  "/",
  upload.single("avatarUrl"),
  isEmptyBody,
  validateBody(contactAddSchema),
  contactsController.add
);

router.delete("/:contactId", isValidId, contactsController.deleteContactId);

router.put(
  "/:contactId",
  isValidId,
  isEmptyBody,
  validateBody(contactUpdateShema),
  contactsController.updateContacts
);
router.patch(
  "/:contactId/favorite",
  isValidId,
  isEmptyBody,
  validateBody(contactFavoriteShema),
  contactsController.updateContacts
);

export default router;
