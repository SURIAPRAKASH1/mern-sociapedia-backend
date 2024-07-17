import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setFriends } from "../state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { useState, useEffect } from "react";

const Friend = ({ friendId, name, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.primary.main;
  const medium = palette.primary.medium;

  // console.log("frienduserid", friends);
  // console.log("friendId ", friends);
  // console.log("id from friend", friendId);

  const isFriend = friends.find((friend) => friend._id === friendId);

  const [feedbackMessage, setFeedbackMessage] = useState("");

  // let isFriend;

  // if (friends.friends) {
  //   // console.log("We have frineds");
  //   isFriend = friends.friends.includes(friendId);
  // } else {
  //   isFriend = friends.find((friend) => friend === friendId);
  //   // console.log("We don't have friends");
  // }

  // console.log("isFriend", isFriend);

  const patchFriend = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_API_URL}/user/${_id}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errordata = await response.json();
      setFeedbackMessage(errordata.msg);
      return;
    }

    const data = await response.json();
    // console.log(data);
    dispatch(setFriends({ friends: data }));

    if (isFriend) {
      setFeedbackMessage("Friend Removed Successfully ");
    } else {
      setFeedbackMessage("Friend Added Successfully");
    }
  };

  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => {
        setFeedbackMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: primaryLight,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="1.75rem">
            {subtitle}
          </Typography>
        </Box>

        {feedbackMessage && (
          <Typography
            color={main}
            variant="h6"
            fontWeight="100"
            sx={{
              mt: "0.5rem",
              ml: "0.1rem",
            }}
          >
            {feedbackMessage}
          </Typography>
        )}
      </FlexBetween>

      <IconButton
        onClick={() => patchFriend()}
        sx={{
          backgroundColor: primaryLight,
          p: "0.6rem",
        }}
      >
        {isFriend ? (
          <PersonRemoveOutlined
            sx={{
              color: primaryDark,
            }}
          />
        ) : (
          <PersonAddOutlined
            sx={{
              color: primaryDark,
            }}
          />
        )}
      </IconButton>
    </FlexBetween>
  );
};

export default Friend;
