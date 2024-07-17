import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setPosts } from "../../state";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId: UserId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  //   console.log(userId);
  //   console.log(isProfile);

  const getPosts = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_API_URL}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await response.json();

    dispatch(setPosts({ posts: data }));
  };

  const getUserPosts = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_API_URL}/posts/${UserId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await response.json();
    // console.log(data);
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    if (isProfile) getUserPosts();
    else getPosts();
  }, []);

  return (
    <>
      {Array.isArray(posts) &&
        posts.map(
          ({
            _id,
            userId,
            firstname,
            lastname,
            location,
            description,
            picturePath,
            userPicturePath,
            likes,
            comments,
          }) => (
            <PostWidget
              key={_id}
              postId={_id}
              postUserId={userId}
              name={`${firstname} ${lastname}`}
              location={location}
              description={description}
              picturePath={picturePath}
              userPicturePath={userPicturePath}
              likes={likes}
              comments={comments}
            />
          )
        )}
    </>
  );
};

export default PostsWidget;
