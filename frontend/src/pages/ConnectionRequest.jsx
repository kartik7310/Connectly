import React, { useEffect } from 'react'
import UserConnection from "../services/userService"
import { useDispatch, useSelector } from 'react-redux'
import { addRequest, removeRequest } from '../store/store-slices/requestSlice'
import connectionService from '../services/connectionService'
import { toast } from 'react-toastify'
import UserCard from '../components/UserCard'

const ConnectionRequest = () => {
  const dispatch = useDispatch()
  const request = useSelector((state) => state.request || [])

  const getRequestConnections = async () => {
    try {
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
    <div className="min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Connection Requests</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">You have {request.length} pending {request.length === 1 ? 'request' : 'requests'}.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {request?.map((connectionRq) => {
            if (!connectionRq?.fromUserId) {
              return null;
            }
            return (
              <UserCard
                key={connectionRq._id}
                user={connectionRq.fromUserId}
                type="request"
                requestId={connectionRq._id}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ConnectionRequest