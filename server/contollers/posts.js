// import Post from "../models/Post.js"
import User from "../models/User.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import Post from "../models/Post.js";

export const createPost = async (req, res) => {
  const { userId, description, picturePath } = req.body;

  if (!userId || !description || !picturePath) {
    throw new BadRequestError(
      "Please provide userId , description , picturePath"
    );
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError(`No user found with id : ${userId}`);
  }

  const newPost = new Post({
    userId,
    firstname: user.firstname,
    lastname: user.lastname,
    description,
    userPicturePath: user.picturePath,
    picturePath,
    likes: {},
    comments: [],
  });

  await newPost.save();

  const post = await Post.find();

  res.status(StatusCodes.CREATED).json(post);
};

/* READ */

export const getFeedPosts = async (req, res) => {
  const post = await Post.find();

  if (!post) {
    throw new NotFoundError("No post founded");
  }

  res.status(StatusCodes.OK).json(post);
};

export const getUserPosts = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    throw new BadRequestError("Please provide userId");
  }

  const post = await Post.find({ userId });

  if (post.length < 1) {
    throw new NotFoundError(
      `No post founded or created for user with this id: ${userId}`
    );
  }

  res.status(StatusCodes.OK).json(post);
};

/* Update  */

export const likePost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!id || !userId) {
    throw new BadRequestError("Post ID and user ID are required");
  }

  const post = await Post.findById(id);
  if (!post) {
    throw new NotFoundError(`No post founded with id : ${id}`);
  }

  const isLiked = post.likes.get(userId);

  if (isLiked) {
    post.likes.delete(userId);
  } else {
    post.likes.set(userId, true);
  }

  const updatedPost = await Post.findByIdAndUpdate(
    id,
    { likes: post.likes },
    { new: true }
  );

  res.status(StatusCodes.OK).json(updatedPost);
};
