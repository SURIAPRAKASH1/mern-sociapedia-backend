import User from "../models/User.js";

export const getUser = (req, res) => {
  res.send(req.params.id);
};

export const getUserFriends = (req, res) => {
  res.send(req.params.id);
};

export const addRemoveFriend = (req, res) => {
  const { id, friendId } = req.params;
  res.json({ id, friendId });
};
