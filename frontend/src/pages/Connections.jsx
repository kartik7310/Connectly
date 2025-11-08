import React, { useEffect } from 'react'
import UserConnection from "../services/userService"
import { useDispatch, useSelector } from 'react-redux'
import { addConnection } from '../store/store-slices/connectionSlice'
import { Link } from 'react-router-dom';

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
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="text-6xl mb-4">👥</div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Connections</h2>
        <p className="text-gray-500">You haven't made any connections yet. Start connecting with people!</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Your Connections ({connections.length})</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {connections.map((user) => (
          <div 
            key={user._id} 
            className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow p-4 border border-base-300"
          >
            <div className="flex items-start gap-4">
              <img
                src={user.photoUrl || 'https://via.placeholder.com/150'}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150';
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-lg truncate">
                  {user.firstName} {user.lastName}
                </p>
                
                {(user.age || user.gender) && (
                  <p className="text-sm text-gray-600 mb-1">
                    {user.age && <span>{user.age} years</span>}
                    {user.age && user.gender && <span> • </span>}
                    {user.gender && <span>{user.gender}</span>}
                  </p>
                )}
                
                {user.about && (
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {user.about}
                  </p>
                )}

               
              </div>
              <div>
               <Link to={`/chat/${user._id}`}>
               <button className="btn btn-sm btn-error btn-outline rounded-full">Message</button>
               </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Connections;