import { Box, Typography, useTheme } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { setFriends } from "../../state";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const getFriends = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_API_URL}/user/${userId}/friends`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData);
    }

    const data = await response.json();

    // console.log(data);
    dispatch(setFriends({ friends: data }));
  };

  //   console.log("this in list", friends);

  useEffect(() => {
    getFriends();
  }, []);

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{
          mb: "1.5rem",
        }}
      >
        Friend List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {Array.isArray(friends) &&
          friends.map((friend) => (
            <Friend
              key={friend._id}
              friendId={friend._id}
              name={`${friend.firstname} ${friend.lastname}`}
              userPicturePath={friend.picturePath}
            />
          ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
