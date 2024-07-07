import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../contollers/posts.js";

const router = express.Router();

router.route("/").get(getFeedPosts);
router.route("/:userId/posts").get(getUserPosts);
router.route("/:id/like").patch(likePost);

export default router;
