import User from "../models/User.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";

export const getUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  // console.log(req.user.userId);

  if (!id) {
    throw new BadRequestError("id can't be empty");
  }
  if (!user) {
    throw new NotFoundError(`No User with id: ${id}`);
  }
  res.status(StatusCodes.OK).json(user);
};

export const getUserFriends = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!id) {
    throw new NotFoundError("No id provided ");
  }
  if (!user) {
    throw new NotFoundError(`No User with id: ${id}`);
  }

  const friends = await Promise.all(
    user.friends.map((id) => User.findById(id))
  );

  if (friends.length < 1) {
    throw new NotFoundError(`No friends founded related to this id: ${id}`);
  }

  const formattedFriends = friends.map(
    ({ _id, firstname, lastname, occupation, location, picturePath }) => {
      return { _id, firstname, lastname, occupation, location, picturePath };
    }
  );

  res.status(StatusCodes.OK).json(formattedFriends);
};

/**Update  */

export const addRemoveFriend = async (req, res) => {
  const { id, friendId } = req.params;

  if (id === friendId) {
    throw new BadRequestError("You can't add/remove yourself");
  }

  const user = await User.findById(id);
  const friend = await User.findById(friendId);

  if (!user || !friend) {
    throw new NotFoundError("User or Friend not found");
  }

  const isFriend = user.friends.includes(friendId);

  const userUpdate = isFriend
    ? { $pull: { friends: friendId } }
    : { $addToSet: { friends: friendId } };

  const friendUpdate = isFriend
    ? { $pull: { friends: id } }
    : { $addToSet: { friends: id } };

  await User.findByIdAndUpdate(id, userUpdate, {
    new: true,
    runValidators: true,
  });

  await User.findByIdAndUpdate(friendId, friendUpdate, {
    new: true,
    runValidators: true,
  });

  const updatedUser = await User.findById(id).populate(
    "friends",
    "_id firstname lastname occupation location picturePath"
  );

  res.status(StatusCodes.OK).json(updatedUser);
};
