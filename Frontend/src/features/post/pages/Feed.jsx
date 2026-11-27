import React, { useEffect, useState } from "react";
import "../style/feed.scss"
import Post from "../components/Post";
import { usePost } from "../hooks/use.post";
import Nav from "../../shared/components/Nav";



const Feed = () => {
       
   const { feed , handleGetFeed , loading} = usePost()
   const [error, setError] = useState("")

   const handleRetry = async () => {
    setError("")
    const result = await handleGetFeed()
    if (!result.success) {
      setError(result.message)
    }
   }

   useEffect(()=>{
    let ignore = false

    async function loadFeed() {
      const result = await handleGetFeed()
      if (!ignore && !result.success) {
        setError(result.message)
      }
    }

    loadFeed()

    return () => {
      ignore = true
    }
   },[handleGetFeed])

   if(error){
    return (
      <main className="feed-page">
        <Nav/>
        <p>{error}</p>
        <button type="button" onClick={handleRetry} className="button primary-button">
          Try again
        </button>
      </main>
    )
   }

   if(loading || !feed){
    return (<main><h1>Feed is loading....</h1></main>)
   }

  
   





    
    
    
  return (
    <main className="feed-page">
          <Nav/>
      <div className="feed">
        <div className="posts">
        {feed.map(post=>{
          return <Post key={post._id} user={post.user} post={post}/>
        })}
        </div>
      </div>
    </main>
  );
};

export default Feed;
