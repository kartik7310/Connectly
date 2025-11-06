import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import feedService from '../services/feedService';
import { addFeed } from '../store/store-slices/feedSlice';
import UserCard from '../components/UserCard';
const Feed = () => {
   const feed = useSelector((store)=>store.feed);
   console.log("useSE",feed);
   
  const dispatch = useDispatch()
const getFeed = async()=>{
  try {
     if(feed && feed.length>0) return
    const {data,success} = await feedService.getFeed();
  const userData = data.users
  
  if(success){
 dispatch(addFeed(userData))
  }
   
  } catch (error) {
    console.log(error);
    
  }
}

useEffect(()=>{
  getFeed()
},[])
  return (
    <div>
      <UserCard user={Array.isArray(feed) ? feed[0] : undefined} />

    </div>
  )
}

export default Feed
