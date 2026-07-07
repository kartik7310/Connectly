import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import userService from "../services/userService";
import connectionService from "../services/connectionService";
import BlogCard from "../components/BlogCard";
import { toast } from "react-toastify";
import {
  MapPin,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  MessageSquare,
  UserPlus,
  Check,
  X,
  Calendar,
  Sparkles,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Users,
  BookOpen,
  Edit3,
  UserCheck,
  Clock3,
  ExternalLink,
} from "lucide-react";

const PublicProfile = () => {
  const { identifier } = useParams();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("articles");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await userService.getPublicProfile(identifier);
        const payload = res?.data ?? res;
        setProfileData(payload);
      } catch (err) {
        console.error("Failed to fetch public profile:", err);
        setError(err.message || "We couldn't find the profile you are looking for.");
      } finally {
        setLoading(false);
      }
    };

    if (identifier) {
      fetchProfile();
    }
  }, [identifier]);

  const handleConnect = async () => {
    if (!profileData?.user?._id || actionLoading) return;
    try {
      setActionLoading(true);
      await connectionService.sendConnectionRequest({
        status: "interested",
        userId: profileData.user._id,
      });
      setProfileData((prev) => ({
        ...prev,
        connectionStatus: "request_sent",
      }));
      toast.success("Connection request sent!");
    } catch (err) {
      toast.error(err.message || "Failed to send connection request");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!profileData?.requestId || actionLoading) return;
    try {
      setActionLoading(true);
      await connectionService.reviewRequest({
        status: "accepted",
        requestId: profileData.requestId,
      });
      setProfileData((prev) => ({
        ...prev,
        connectionStatus: "connected",
        isConnected: true,
        connectionCount: (prev.connectionCount || 0) + 1,
      }));
      toast.success("Connection request accepted!");
    } catch (err) {
      toast.error(err.message || "Failed to accept request");
    } finally {
      setActionLoading(false);
    }
  };

  const handleIgnore = async () => {
    if (!profileData?.requestId || actionLoading) return;
    try {
      setActionLoading(true);
      await connectionService.reviewRequest({
        status: "rejected",
        requestId: profileData.requestId,
      });
      setProfileData((prev) => ({
        ...prev,
        connectionStatus: "not_connected",
      }));
      toast.info("Connection request ignored");
    } catch (err) {
      toast.error(err.message || "Failed to ignore request");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gray-50 py-10 px-4 sm:px-6 font-sans animate-pulse">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="w-24 h-4 bg-gray-200 rounded-md" />
          
          {/* Cover & Avatar Skeleton */}
          <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="h-64 sm:h-80 bg-gray-200 w-full" />
            <div className="p-6 sm:p-10 pt-0 relative">
              <div className="-mt-16 sm:-mt-20 mb-6 flex items-end justify-between">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gray-300 border-4 border-white shadow-md" />
                <div className="w-32 h-10 bg-gray-200 rounded-xl mb-2" />
              </div>
              <div className="space-y-4 max-w-xl">
                <div className="h-8 bg-gray-200 rounded-lg w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-16 bg-gray-200 rounded-xl w-full mt-4" />
              </div>
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-white border border-gray-200 rounded-2xl" />
            <div className="h-24 bg-white border border-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !profileData || !profileData.user) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex flex-col items-center justify-center p-8 text-center font-sans">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 border border-red-100 shadow-sm">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">Profile Unavailable</h3>
        <p className="text-gray-500 text-sm max-w-md mb-6 leading-relaxed">
          {error || "The user profile you are searching for does not exist or has been removed."}
        </p>
        <button
          onClick={() => navigate("/feed")}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm active:scale-95"
        >
          <ArrowLeft size={16} />
          Return to Feed
        </button>
      </div>
    );
  }

  const {
    user,
    connectionStatus,
    isConnected,
    blogCount = 0,
    connectionCount = 0,
    blogs = [],
  } = profileData;

  const bioText = user.bio || user.about || "This user hasn't added a bio yet.";
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Connexto Member";
  const avatarUrl =
    user.photoUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=f3f4f6&color=4b5563`;
  const coverUrl =
    user.coverImage ||
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1600&q=80";

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 py-10 px-4 sm:px-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Back navigation */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* Hero Card */}
        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
          
          {/* Cover Banner */}
          <div className="relative h-64 sm:h-80 w-full bg-gray-100 overflow-hidden">
            <img
              src={coverUrl}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent" />
          </div>

          {/* Profile Details & Controls */}
          <div className="p-6 sm:p-10 pt-0 relative">
            <div className="-mt-16 sm:-mt-20 mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white shadow-lg bg-white"
                />
                {isConnected && (
                  <div
                    className="absolute bottom-2 right-2 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white shadow-sm"
                    title="Connected Member"
                  >
                    <UserCheck size={16} />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 self-start sm:self-end pb-1">
                {connectionStatus === "self" && (
                  <button
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm rounded-xl transition-all shadow-sm"
                  >
                    <Edit3 size={16} />
                    Edit Profile
                  </button>
                )}

                {connectionStatus === "connected" && (
                  <>
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold uppercase tracking-wider">
                      <Check size={14} />
                      Connected
                    </span>
                    <button
                      onClick={() => navigate(`/chat/${user._id}`)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm active:scale-95"
                    >
                      <MessageSquare size={16} />
                      Message
                    </button>
                  </>
                )}

                {connectionStatus === "request_sent" && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-xs font-bold uppercase tracking-wider">
                    <Clock3 size={14} />
                    Request Sent
                  </span>
                )}

                {connectionStatus === "request_received" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAccept}
                      disabled={actionLoading}
                      className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                      <Check size={16} />
                      Accept Request
                    </button>
                    <button
                      onClick={handleIgnore}
                      disabled={actionLoading}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl transition-all disabled:opacity-50"
                    >
                      <X size={16} />
                      Ignore
                    </button>
                  </div>
                )}

                {connectionStatus === "not_connected" && (
                  <button
                    onClick={handleConnect}
                    disabled={actionLoading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50"
                  >
                    <UserPlus size={16} />
                    Connect
                  </button>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-4 max-w-3xl">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    {fullName}
                  </h1>
                  {user.profession && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold border border-primary-100">
                      {user.profession}
                    </span>
                  )}
                </div>
                {user.username && (
                  <p className="text-gray-500 font-medium text-sm mt-0.5">
                    @{user.username}
                  </p>
                )}
              </div>

              {/* Metadata row */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-gray-600">
                {user.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-gray-400" />
                    {user.location}
                  </span>
                )}
                {user.website && (
                  <a
                    href={user.website.startsWith("http") ? user.website : `https://${user.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-medium hover:underline"
                  >
                    <Globe size={16} />
                    {user.website.replace(/^https?:\/\//, "")}
                    <ExternalLink size={12} />
                  </a>
                )}
                <span className="flex items-center gap-1.5 text-gray-400">
                  <Calendar size={16} />
                  Joined {new Date(user.createdAt || Date.now()).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
                </span>
              </div>

              {/* Social Links */}
              {user.socialLinks && Object.values(user.socialLinks).some(Boolean) && (
                <div className="flex items-center gap-3 pt-2">
                  {user.socialLinks.github && (
                    <a
                      href={user.socialLinks.github.startsWith("http") ? user.socialLinks.github : `https://github.com/${user.socialLinks.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                      title="GitHub"
                    >
                      <Github size={18} />
                    </a>
                  )}
                  {user.socialLinks.linkedin && (
                    <a
                      href={user.socialLinks.linkedin.startsWith("http") ? user.socialLinks.linkedin : `https://linkedin.com/in/${user.socialLinks.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                      title="LinkedIn"
                    >
                      <Linkedin size={18} />
                    </a>
                  )}
                  {user.socialLinks.twitter && (
                    <a
                      href={user.socialLinks.twitter.startsWith("http") ? user.socialLinks.twitter : `https://twitter.com/${user.socialLinks.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                      title="Twitter"
                    >
                      <Twitter size={18} />
                    </a>
                  )}
                  {user.socialLinks.instagram && (
                    <a
                      href={user.socialLinks.instagram.startsWith("http") ? user.socialLinks.instagram : `https://instagram.com/${user.socialLinks.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                      title="Instagram"
                    >
                      <Instagram size={18} />
                    </a>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
              <Users size={24} />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {connectionCount}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Connections
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {blogCount}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Articles Published
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 flex items-center gap-8">
          <button
            onClick={() => setActiveTab("articles")}
            className={`pb-4 text-sm font-bold tracking-wide transition-all relative ${
              activeTab === "articles"
                ? "text-primary-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Published Articles ({blogCount})
            {activeTab === "articles" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`pb-4 text-sm font-bold tracking-wide transition-all relative ${
              activeTab === "about"
                ? "text-primary-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            About & Skills
            {activeTab === "about" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="pt-2">
          
          {/* Articles Tab */}
          {activeTab === "articles" && (
            <div className="space-y-6">
              {Array.isArray(blogs) && blogs.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {blogs.map((blog) => (
                    <Link key={blog._id} to={`/blogs/${blog._id}`} className="block h-full">
                      <BlogCard blog={blog} />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center max-w-md mx-auto my-6 space-y-3">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto">
                    <BookOpen size={24} />
                  </div>
                  <h4 className="text-base font-bold text-gray-900">No articles published yet</h4>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                    When {user.firstName || "this user"} publishes stories or insights, they will appear right here.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* About Tab */}
          {activeTab === "about" && (
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 tracking-tight">
                  Biography
                </h3>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {bioText}
                </p>
              </div>

              {Array.isArray(user.skills) && user.skills.length > 0 && (
                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 tracking-tight">
                    Skills & Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-xl transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default PublicProfile;
