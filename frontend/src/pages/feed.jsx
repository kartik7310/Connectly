import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import feedService from '../services/feedService';
import { addFeed } from '../store/store-slices/feedSlice';
import UserCard from '../components/UserCard';

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch()

  const getFeed = async () => {
    try {
      if (feed && feed.length > 0) return
      const { data, success } = await feedService.getFeed();
      const userData = data.users

      if (success) {
        dispatch(addFeed(userData))
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getFeed()
  }, [])

  if (!Array.isArray(feed) || feed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl text-gray-400">📭</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">You're all caught up!</h2>
        <p className="text-gray-500 max-w-md">There are no new connection suggestions at the moment. Check back later as our network grows.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Discover Connections</h1>
        <p className="text-gray-500">People you might be interested in collaborating with.</p>
      </div>
      <div className="w-full max-w-sm">
        <UserCard user={Array.isArray(feed) ? feed[0] : undefined} />
      </div>
    </div>
  )
}

export default Feed
