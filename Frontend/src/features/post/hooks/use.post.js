import { useContext } from "react";
import { getFeed } from "../services/post.api";
import {  PostContext} from "../post.context";


export const usePost = ()=>{

    const context = useContext(PostContext)

    const {loading,setloading,post,setpost,feed,setFeed} = context;

  const handleGetFeed = async ()=>{

      setloading(true);

      const data = await getFeed()

      
      
      
      setFeed(data.posts)

      setloading(false)
  }

  return {loading , feed , post ,handleGetFeed}

}