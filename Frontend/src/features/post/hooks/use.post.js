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

  const runPostAction = useCallback(
    async (requestFn, onSuccess) => {
      setloading(true);
      try {
        const data = await requestFn();
        onSuccess(data);
        return { success: true };
      } catch (err) {
        return { success: false, message: getPostErrorMessage(err) };
      } finally {
        setloading(false);
      }
    },
    [setloading],
  );

  const handleGetFeed = useCallback(
    () => runPostAction(() => getFeed(), (data) => setFeed(data.posts.reverse())),
    [runPostAction, setFeed],
  );

  const handleCreatePost = (imageFile, caption) =>
    runPostAction(
      () => createPost(imageFile, caption),
      (data) => setpost(data.post),
    );

  return { loading, feed, post, handleGetFeed ,handleCreatePost};
};
