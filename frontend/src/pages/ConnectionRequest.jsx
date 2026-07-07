import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import UserConnection from "../services/userService"
import { useDispatch, useSelector } from 'react-redux'
import { addRequest, removeRequest } from '../store/store-slices/requestSlice'
import connectionService from '../services/connectionService'
import { toast } from 'react-toastify'
import { Check, X } from 'lucide-react'

const ConnectionRequest = () => {
  const dispatch = useDispatch()
  const request = useSelector((state) => state.request || [])

  const getRequestConnections = async () => {
    try {
      if (request && request.length > 0) return

      const requestData = await UserConnection.fetchRequest();
      const requests = requestData?.data?.data || requestData?.data || [];
      dispatch(addRequest(requests))
    } catch (error) {
      console.log("Error fetching connections:", error);
    }
  }

  useEffect(() => {
    getRequestConnections()
  }, [])

  // Handler review connection
  const handleAccept = async (status, requestId) => {
    try {
      await connectionService.reviewRequest({ status, requestId });
      dispatch(removeRequest(requestId));
      toast.success('Connection accepted!');
    } catch (error) {
      console.log("Error accepting request:", error);
      toast.error('Failed to accept request');
    }
  };

  const handleReject = async (status, requestId) => {
    try {
      await connectionService.reviewRequest({ status, requestId });
      dispatch(removeRequest(requestId));
      toast.success('Request rejected');
    } catch (error) {
      console.log("Error rejecting request:", error);
      toast.error('Failed to reject request');
    }
  };

  if (!Array.isArray(request) || request.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl text-gray-400">📭</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">No Pending Requests</h2>
        <p className="text-gray-500 max-w-md">You don't have any connection requests at the moment. Keep exploring the feed!</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Connection Requests</h2>
          <p className="text-gray-500 mt-2">You have {request.length} pending {request.length === 1 ? 'request' : 'requests'}.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {request?.map((connectionRq) => {
            if (!connectionRq?.fromUserId) {
              return null;
            }

            const { _id, username, firstName, lastName, age, gender, photoUrl, about } = connectionRq.fromUserId;
            const requestId = connectionRq._id;

            return (
              <div
                key={requestId}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col"
              >
                <div className="p-6 flex items-start gap-4 flex-1">
                  <Link to={`/user/${username || _id}`} className="shrink-0 group">
                    <img
                      src={photoUrl || `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=f3f4f6&color=4b5563`}
                      alt={`${firstName} ${lastName}`}
                      className="w-16 h-16 rounded-full object-cover flex-shrink-0 border border-gray-100 group-hover:scale-105 group-hover:border-primary-500 transition-all duration-300"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=f3f4f6&color=4b5563`;
                      }}
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/user/${username || _id}`} className="hover:text-primary-600 transition-colors inline-block">
                      <h3 className="font-bold text-lg text-gray-900 truncate">
                        {firstName} {lastName}
                      </h3>
                    </Link>

                    {(age || gender) && (
                      <p className="text-sm font-medium text-gray-500 mb-2 capitalize flex items-center gap-1.5">
                        {age && <span>{age} yrs</span>}
                        {age && gender && <span className="w-1 h-1 bg-gray-300 rounded-full"></span>}
                        {gender && <span>{gender}</span>}
                      </p>
                    )}

                    {about && (
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {about}
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-100 p-4 bg-gray-50/50 flex gap-3">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-white border border-gray-200 hover:bg-red-50 text-red-600 hover:text-red-700 hover:border-red-200 font-medium rounded-xl transition-colors shadow-sm"
                    onClick={() => handleReject("rejected", requestId)}
                  >
                    <X size={16} />
                    Reject
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors shadow-sm"
                    onClick={() => handleAccept("accepted", requestId)}
                  >
                    <Check size={16} />
                    Accept
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ConnectionRequest