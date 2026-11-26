import { useContext, useEffect } from "react";
import { createPost, getFeed } from "../services/post.api";
import { PostContext } from "../post.context";

export const usePost = () => {
  const context = useContext(PostContext);

  const { loading, setloading, post, setpost, feed, setFeed } = context;

  const handleGetFeed = async () => {
    setloading(true);

    const data = await getFeed();
    setFeed(data.posts.reverse());
    setloading(false);
  };
  const handleCreatePost = async (imageFile, caption) => {
    setloading(true);

    const data = await createPost(imageFile, caption);

    setpost(data.post, ...feed);

    setloading(false)
  };


  useEffect(()=>{
        handleGetFeed()
  },[])

  return { loading, feed, post, handleGetFeed ,handleCreatePost};
};
