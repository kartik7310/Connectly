import { ArrowLeftIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const ChatHeader = ({ user, isLoading, isOnline }) => {
  const navigate = useNavigate();
  const profileUser = user?.user || user;

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white/80 backdrop-blur-md rounded-t-2xl sm:rounded-t-none animate-pulse">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div className="flex-1">
          <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-20 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-white/95 backdrop-blur-md rounded-t-2xl sm:rounded-t-none sticky top-0 z-10">
      <button 
        onClick={() => navigate("/connections")}
        className="flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeftIcon size={20} />
      </button>
      
      <Link to={`/user/${profileUser?.username || profileUser?._id}`} className="shrink-0 group">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 group-hover:border-primary-500 transition-colors">
          <img
            src={profileUser?.photoUrl || `https://ui-avatars.com/api/?name=${profileUser?.firstName}+${profileUser?.lastName}&background=f3f4f6&color=4b5563`}
            alt={profileUser?.firstName || "User"}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>
      
      <div className="flex-1 min-w-0">
        <h2 className="font-bold text-gray-900 truncate flex items-center gap-2 text-base">
          {profileUser?.firstName} {profileUser?.lastName}
          <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500 shadow-sm" : "bg-gray-300"}`} />
        </h2>
        <p className={`text-xs font-medium ${isOnline ? "text-green-600" : "text-gray-500"}`}>
          {isOnline ? "Active now" : "Offline"}
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;
