import React, { useEffect } from 'react'
import UserConnection from "../services/userService"
import { useDispatch, useSelector } from 'react-redux'
import { addConnection } from '../store/store-slices/connectionSlice'
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

const Connections = () => {
  const connections = useSelector((state) => state.connection?.connections || state.connection || []);
  const dispatch = useDispatch();

  const getConnections = async () => {
    try {
      if (connections && connections.length > 0) return;

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
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Your Connections</h2>
          <p className="text-gray-500 mt-2">You are connected with {connections.length} {connections.length === 1 ? 'professional' : 'professionals'}.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connections.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col"
            >
              <div className="p-6 flex items-start gap-4 flex-1">
                <img
                  src={user.photoUrl || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=f3f4f6&color=4b5563`}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-16 h-16 rounded-full object-cover flex-shrink-0 border border-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 truncate">
                    {user.firstName} {user.lastName}
                  </h3>

                  {(user.age || user.gender) && (
                    <p className="text-sm font-medium text-gray-500 mb-2 capitalize flex items-center gap-1.5">
                      {user.age && <span>{user.age} yrs</span>}
                      {user.age && user.gender && <span className="w-1 h-1 bg-gray-300 rounded-full"></span>}
                      {user.gender && <span>{user.gender}</span>}
                    </p>
                  )}

                  {user.about && (
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {user.about}
                    </p>
                  )}
                </div>
              </div>
              <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                <Link to={`/chat/${user._id}`} className="flex items-center justify-center w-full gap-2 py-2.5 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-medium rounded-xl transition-colors shadow-sm">
                  <MessageCircle size={18} className="text-gray-500" />
                  Message
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Connections;