import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
} from "../contollers/user.js";

const router = express.Router();

/** Get Data */
router.route("/:id").get(getUser);
router.route("/:id/friends").get(getUserFriends);

/** Update data*/
router.route("/:id/:friendId").patch(addRemoveFriend);

export default router;
