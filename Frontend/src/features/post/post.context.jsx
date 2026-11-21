import { createContext, useState } from "react";



export const PostContext = createContext()



export const PostContextProvider = ({children})=>{
   const [loading, setloading] = useState(false)
   const [post, setpost] = useState(null)
   const [feed, setFeed] = useState(null)

   return (

    <PostContext.Provider value={{loading,setloading,post,setpost,feed,setFeed}}>
       {children}
    </PostContext.Provider>
   )
}
