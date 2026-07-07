import React, { useState } from "react";
import { Link } from "react-router-dom";
import connectionService from "../services/connectionService";
import { useDispatch } from "react-redux";
import { removeFeed } from "../store/store-slices/feedSlice";
import { toast } from "react-toastify";
import { X, Check, MapPin, Briefcase, MessageCircle } from "lucide-react";

const UserCard = ({ user, type = "feed", requestId, onAccept, onReject }) => {
  if (!user) return null;

  const { _id, firstName, lastName, about, bio, photoUrl, coverImage, profession, location, username } = user;
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

  const displayBio = bio || about || "No bio available.";
  const displayProfession = profession || "Professional Member";
  const profileLink = `/user/${username || _id}`;

  return (
    <div className="bg-white w-full h-full shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden flex flex-col group select-none">
      {/* Cover Image */}
      <Link to={profileLink} className="relative h-28 sm:h-32 bg-gray-100 block overflow-hidden shrink-0" tabIndex={-1}>
        <img 
          src={coverImage || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1000&q=80"} 
          alt="Cover" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60"></div>
      </Link>

      {/* Content Area */}
      <div className="px-6 pb-6 flex-1 flex flex-col justify-between relative">
        {/* Profile Picture Overlapping Cover */}
        <div className="-mt-12 mb-3 flex items-end justify-between">
          <Link to={profileLink} className="relative block shrink-0">
            <img 
              src={photoUrl || `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=f3f4f6&color=4b5563`} 
              alt={`${firstName} ${lastName}`} 
              className="w-20 h-20 sm:w-22 sm:h-22 rounded-full object-cover border-4 border-white shadow-md bg-gray-100 group-hover:border-primary-50 transition-colors"
              draggable={false}
            />
          </Link>

          {location && (
            <div className="flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full mb-1 border border-gray-200/60 max-w-[130px] truncate">
              <MapPin size={12} className="text-gray-400 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          )}
        </div>

        {/* User Info */}
        <div>
          <Link to={profileLink} className="block group/link">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight group-hover/link:text-primary-600 transition-colors line-clamp-1">
              {firstName} {lastName}
            </h2>
          </Link>

          <div className="flex items-center gap-1.5 text-sm font-medium text-primary-600 mt-0.5">
            <Briefcase size={14} className="shrink-0 text-primary-500" />
            <span className="truncate">{displayProfession}</span>
          </div>
          
          {/* Bio - max 2 lines */}
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mt-3 min-h-[2.5rem]">
            {displayBio}
          </p>
        </div>

        {/* Action Buttons based on type */}
        {type === "feed" && (
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
            <button
              type="button"
              className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 active:scale-95 transition-all disabled:opacity-50 cursor-pointer focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none"
              onClick={() => handleRequest("ignored", _id)}
              disabled={loading}
              title="Pass"
              aria-label={`Pass on ${firstName} ${lastName}`}
            >
              <X size={16} />
              <span>Pass</span>
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-1.5 flex-1 py-2.5 px-4 rounded-xl bg-primary-600 text-white font-medium text-sm hover:bg-primary-700 active:scale-[0.98] transition-all shadow-sm hover:shadow disabled:opacity-50 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none"
              onClick={() => handleRequest("interested", _id)}
              disabled={loading}
              aria-label={`Connect with ${firstName} ${lastName}`}
            >
              <Check size={16} />
              <span>Connect</span>
            </button>
          </div>
        )}

        {type === "request" && (
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
            <button
              type="button"
              className="flex items-center justify-center gap-1.5 flex-1 py-2.5 px-4 rounded-xl border border-gray-200 bg-white text-red-600 font-medium text-sm hover:bg-red-50 hover:text-red-700 hover:border-red-200 active:scale-95 transition-all shadow-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none"
              onClick={() => onReject && onReject("rejected", requestId)}
              aria-label={`Reject connection request from ${firstName} ${lastName}`}
            >
              <X size={16} />
              <span>Reject</span>
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-1.5 flex-1 py-2.5 px-4 rounded-xl bg-primary-600 text-white font-medium text-sm hover:bg-primary-700 active:scale-[0.98] transition-all shadow-sm hover:shadow cursor-pointer focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none"
              onClick={() => onAccept && onAccept("accepted", requestId)}
              aria-label={`Accept connection request from ${firstName} ${lastName}`}
            >
              <Check size={16} />
              <span>Accept</span>
            </button>
          </div>
        )}

        {type === "connection" && (
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
            <Link
              to={`/chat/${_id}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-primary-600 text-white font-medium text-sm hover:bg-primary-700 active:scale-[0.98] transition-all shadow-sm hover:shadow cursor-pointer focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none"
              aria-label={`Message ${firstName} ${lastName}`}
            >
              <MessageCircle size={18} />
              <span>Message</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
