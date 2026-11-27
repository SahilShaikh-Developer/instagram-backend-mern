import { useCallback, useContext } from "react";
import { createPost, getFeed } from "../services/post.api";
import { PostContext } from "../post.context";

function getPostErrorMessage(err) {
  if (err?.response?.data?.message) {
    return err.response.data.message;
  }
  if (!err?.response && (err?.request || err?.code === "ERR_NETWORK")) {
    return "Cannot reach the server. Please try again.";
  }
  return "Something went wrong. Please try again.";
}

export const usePost = () => {
  const context = useContext(PostContext);

  const { loading, setloading, post, setpost, feed, setFeed } = context;

  const handleGetFeed = useCallback(async () => {
    setloading(true);
    try {
      const data = await getFeed();
      setFeed(data.posts.reverse());
      return { success: true };
    } catch (err) {
      return { success: false, message: getPostErrorMessage(err) };
    } finally {
      setloading(false);
    }
  }, [setloading, setFeed]);

  const handleCreatePost = async (imageFile, caption) => {
    setloading(true);

    const data = await createPost(imageFile, caption);

    setpost(data.post);

    setloading(false)
  };

  return { loading, feed, post, handleGetFeed ,handleCreatePost};
};
