import React, { useState } from "react";
import connectionService from "../services/connectionService";
import { useDispatch } from "react-redux";
import { removeFeed } from "../store/store-slices/feedSlice";
import { toast } from "react-toastify";
import { X, Check } from "lucide-react";

const UserCard = ({ user }) => {
  if (!user) return null;

  const { _id, firstName, lastName, about, photoUrl } = user;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleRequest = async (status, userId) => {
    if (loading) return;
    setLoading(true);
    try {
      await connectionService.sendConnectionRequest({ status, userId });
      dispatch(removeFeed(userId));
      toast.success(status === "interested" ? "Interest sent" : "Profile ignored");
    } catch (error) {
      console.error("Error sending request:", error?.message ?? error);
      toast.error("Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white w-full max-w-sm mx-auto shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 rounded-2xl overflow-hidden flex flex-col">
      <div className="relative h-64 bg-gray-100 p-2">
        <img 
          src={photoUrl || `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=f3f4f6&color=4b5563`} 
          alt={`${firstName} ${lastName}`} 
          className="w-full h-full object-cover rounded-xl" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-80 rounded-xl m-2"></div>
        <div className="absolute bottom-6 left-6 right-6">
          <h2 className="text-xl font-bold text-white tracking-tight drop-shadow-md">
            {firstName} {lastName}
          </h2>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-6">
          {about || "No bio available."}
        </p>

        <div className="flex items-center justify-center gap-4 mt-auto pt-4 border-t border-gray-100">
          <button
            className="flex items-center justify-center gap-2 flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-50"
            onClick={() => handleRequest("ignored", _id)}
            disabled={loading}
          >
            <X size={18} />
            <span>Pass</span>
          </button>

          <button
            className="flex items-center justify-center gap-2 flex-1 py-2.5 px-4 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-50"
            onClick={() => handleRequest("interested", _id)}
            disabled={loading}
          >
            <Check size={18} />
            <span>Connect</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
