import { useCallback, useContext } from "react";
import { createPost, getFeed, likePost, unlikePost } from "../services/post.api";
import { PostContext } from "../post.context";

function updatePostInFeed(prev, postId, transform) {
  if (!prev) {
    return prev;
  }
  let changed = false;
  const next = prev.map((item) => {
    if (item._id !== postId) {
      return item;
    }
    changed = true;
    return transform(item);
  });
  return changed ? next : prev;
}

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

  const handleToggleLike = useCallback(
    async (postId, shouldLike) => {
      const delta = shouldLike ? 1 : -1;

      setFeed((prev) =>
        updatePostInFeed(prev, postId, (item) => ({
          ...item,
          isLiked: shouldLike,
          likesCount: Math.max(0, (item.likesCount ?? 0) + delta),
        })),
      );

      try {
        const data = shouldLike
          ? await likePost(postId)
          : await unlikePost(postId);

        setFeed((prev) =>
          updatePostInFeed(prev, postId, (item) => ({
            ...item,
            isLiked: data.liked,
            likesCount: data.likesCount,
          })),
        );

        return { success: true };
      } catch (err) {
        setFeed((prev) =>
          updatePostInFeed(prev, postId, (item) => ({
            ...item,
            isLiked: !shouldLike,
            likesCount: Math.max(0, (item.likesCount ?? 0) - delta),
          })),
        );

        return { success: false, message: getPostErrorMessage(err) };
      }
    },
    [setFeed],
  );

  return { loading, feed, post, handleGetFeed ,handleCreatePost, handleToggleLike};
};
