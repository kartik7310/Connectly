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

  if (!Array.isArray(feed) || feed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="text-6xl mb-4">📭</div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No feed</h2>
        <p className="text-gray-500">You don't have any feed at the moment</p>
      </div>
    );
  }
  return (
    <div>
      <UserCard user={Array.isArray(feed) ? feed[0] : undefined} />

    </div>
  )
}

export default Feed
