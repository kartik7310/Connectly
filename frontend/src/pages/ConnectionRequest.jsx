import React, { useEffect } from 'react'
import UserConnection from "../services/userService"
import { useDispatch, useSelector } from 'react-redux'
import { addRequest, removeRequest } from '../store/store-slices/requestSlice'
import connectionService from '../services/connectionService'
import { toast } from 'react-toastify'
const ConnectionRequest = () => {
  const dispatch = useDispatch()
  const request = useSelector((state) => state.request || [])
  
  const getRequestConnections = async () => {
    try {

      if (request && request.length > 0) return
      
      const requestData = await UserConnection.fetchRequest();
      console.log("req", requestData.data);
      
  
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
      console.log('Accept request:', status, requestId);
      await connectionService.reviewRequest({status,requestId});
       dispatch(removeRequest(requestId));

       toast.success('Connection accepted!');
    } catch (error) {
      console.log("Error accepting request:", error);
       toast.error('Failed to accept request');
    }
  };

  const handleReject = async (status, requestId) => {
    try {
      console.log('Reject request:', status, requestId);
 
      await connectionService.reviewRequest ({status,requestId});
   
      dispatch(removeRequest(requestId));
 
     toast.success('Request rejected');
    } catch (error) {
      console.log("Error rejecting request:", error);
       toast.error('Failed to reject request');
    }
  };

  if (!Array.isArray(request) || request.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="text-6xl mb-4">📭</div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Requests</h2>
        <p className="text-gray-500">You don't have any connection requests at the moment</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Connection Requests ({request.length})</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {request?.map((connectionRq) => {
          console.log("conreq", connectionRq);
          
          // Fix: Handle potential undefined fromUserId
          if (!connectionRq?.fromUserId) {
            console.warn('Missing fromUserId in request:', connectionRq);
            return null;
          }

          const { _id, firstName, lastName, age, gender, photoUrl, about } = connectionRq.fromUserId;
          // Use the request's _id, not the user's _id for accept/reject
          const requestId = connectionRq._id;
          
          return (
            <div 
              key={requestId} 
              className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow p-4 border border-base-300"
            >
              <div className="flex items-start gap-4">
                <img
                  src={photoUrl || 'https://via.placeholder.com/150'}
                  alt={`${firstName} ${lastName}`}
                  className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-lg truncate">
                    {firstName} {lastName}

                  </p>                                    
                  
                  {(age || gender) && (
                    <p className="text-sm text-gray-600 mb-1">
                      {age && <span>{age} years</span>}
                      {age && gender && <span> • </span>}
                      {gender && <span>{gender}</span>}
                    </p>
                  )}
                  
                  {about && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {about}
                    </p>
                  )}

                  <div className="flex gap-2 mt-3">
                    <button 
                      className="btn btn-sm btn-primary flex-1"
                      onClick={() => handleAccept("accepted", requestId)}
                    >
                      Accept
                    </button>
                    <button 
                      className="btn btn-sm btn-outline btn-error flex-1"
                      onClick={() => handleReject("rejected",requestId)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ConnectionRequest