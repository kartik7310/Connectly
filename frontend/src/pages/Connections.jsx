import React, { useEffect } from 'react'
import UserConnection from "../services/userService"
import { useDispatch, useSelector } from 'react-redux'
import { addConnection } from '../store/store-slices/connectionSlice'
import UserCard from '../components/UserCard'

const Connections = () => {
  const connections = useSelector((state) => state.connection?.connections || state.connection || []);
  const dispatch = useDispatch();

  const getConnections = async () => {
    try {
      const res = await UserConnection.getConnections();

      const list = res?.data?.users || res?.data || [];
      dispatch(addConnection(list));
    } catch (error) {
      console.log("Error fetching connections:", error);
    }
  };

  useEffect(() => {
    getConnections();
  }, []);

  if (!Array.isArray(connections) || connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl text-gray-400">👥</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">No Connections Yet</h2>
        <p className="text-gray-500 max-w-md">You haven't made any connections yet. Start browsing the feed to connect with professionals.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Your Connections</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">You are connected with {connections.length} {connections.length === 1 ? 'professional' : 'professionals'}.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {connections.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              type="connection"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Connections;