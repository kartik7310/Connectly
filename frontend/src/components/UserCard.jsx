import React, { useState } from "react";
import connectionService from "../services/connectionService";
import { useDispatch } from "react-redux";
import { removeFeed } from "../store/store-slices/feedSlice";
import { toast } from "react-toastify";

const UserCard = ({ user }) => {
  if (!user) return null;

  const { _id, firstName, lastName, about, photoUrl } = user;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);


  const handleRequest = async (status, userId) => {
    if (loading) return; 
    setLoading(true);
    try {
      
      const res = await connectionService.sendConnectionRequest({ status, userId });

      dispatch(removeFeed(userId));

      toast.success("Request sent");
    } catch (error) {
      console.error("Error sending request:", error?.message ?? error);
      toast.error("Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 w-70 shadow-xl border border-base-200 hover:shadow-xl m-5 hover:scale-[1.01] transition duration-200 cursor-pointer rounded-2xl">
      <figure className="h-56 overflow-hidden rounded-t-2xl p-4">
        <img src={photoUrl} alt="user" className="object-cover w-full h-full" />
      </figure>

      <div className="card-body space-y-2">
        <h2 className="card-title text-lg font-semibold">
          {firstName} {lastName}
        </h2>

        <p className="text-sm text-base-content/70 line-clamp-2">{about}</p>

        <div className="card-actions justify-between pt-2">
          <button
            className="btn btn-sm btn-error btn-outline rounded-full"
            onClick={() => handleRequest("ignored", _id)}
            disabled={loading}
          >
            {loading ? "Processing..." : "Ignore"}
          </button>

          <button
            className="btn btn-sm btn-success rounded-full"
            onClick={() => handleRequest("interested", _id)}
            disabled={loading}
          >
            {loading ? "Processing..." : "Interested"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
