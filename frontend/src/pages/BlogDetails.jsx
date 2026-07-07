import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlogService from "../services/blogService";
import { FileEdit, Trash2, Heart, MessageCircle, Send, Clock, Calendar as CalendarIcon, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import AuthorInfo from "../components/Author";
import { useSelector } from "react-redux";
import { stripHtml } from "../utils/htmlparser";
import { toast } from "react-toastify";

const BlogDetails = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.user);

  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    const fetchBlogAndComments = async () => {
      try {
        const [blogData, commentsData] = await Promise.all([
          BlogService.fetchSingleBlog(blogId),
          BlogService.fetchComments(blogId),
        ]);
        setBlog(blogData);
        setComments(commentsData);
      } catch (err) {
        setError(err.message || "Failed to fetch blog details");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogAndComments();
  }, [blogId]);

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like this blog");
      return;
    }
    try {
      setIsLiking(true);
      const updatedLikes = await BlogService.likeBlog(blogId);
      setBlog({ ...blog, likes: updatedLikes });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to comment");
      return;
    }
    if (!commentContent.trim()) return;

    try {
      const newComment = await BlogService.addComment(blogId, commentContent);
      setComments([newComment, ...comments]);
      setCommentContent("");
      toast.success("Comment added");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      await BlogService.deleteBlog(blogId);
      toast.success("Blog deleted successfully");
      navigate("/blogs");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex flex-col items-center justify-center p-8 text-gray-500">
        <Loader2 size={32} className="animate-spin text-primary-600 mb-4" />
        <p className="text-sm font-medium">Loading article...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Article Not Found</h3>
        <p className="text-gray-500 text-sm max-w-md mb-6">{error || "We couldn't find the article you are looking for."}</p>
        <button
          onClick={() => navigate("/blogs")}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft size={16} />
          Back to Blogs
        </button>
      </div>
    );
  }

  const isAuthor = user?._id === blog?.author?._id;
  const hasLiked = blog.likes?.includes(user?._id);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 py-10 px-4 sm:px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back navigation */}
        <button
          onClick={() => navigate("/blogs")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
        >
          <ArrowLeft size={16} />
          Back to all articles
        </button>

        {/* Main Article Card */}
        <article className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden p-6 sm:p-10 space-y-8">
          
          {/* Header metadata */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500">
              <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                <Clock size={14} /> Read ~ 5 min
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarIcon size={14} />
                Published on {new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {blog.title}
            </h1>

            {/* Author bar & Admin controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
              <AuthorInfo author={blog.author} />

              {isAuthor && (
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => navigate(`/blogs/edit-blog/${blog._id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <FileEdit size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBlog(blog._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Cover Image */}
          {blog.blogImage && (
            <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm">
              <img
                src={blog.blogImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-6 font-normal">
            {stripHtml(blog.content)}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-gray-100">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Tags:</span>
            {Array.isArray(blog.tags) && blog.tags.length > 0 ? (
              blog.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded-md transition-colors"
                >
                  #{tag}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400 italic">No tags</span>
            )}
          </div>

          {/* Engagement Bar */}
          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4">
            <div className="flex items-center gap-6">
              <button
                onClick={handleLike}
                disabled={isLiking}
                className={`flex items-center gap-2 transition-all duration-200 ${
                  hasLiked ? "text-red-500 font-bold" : "text-gray-600 hover:text-red-500 font-semibold"
                } active:scale-95`}
              >
                <Heart className={`w-5 h-5 ${hasLiked ? "fill-current" : ""}`} />
                <span>{blog.likes?.length || 0} Likes</span>
              </button>
              <div className="flex items-center gap-2 text-gray-600 font-semibold">
                <MessageCircle className="w-5 h-5" />
                <span>{comments.length} Comments</span>
              </div>
            </div>
          </div>

        </article>

        {/* Comments Section */}
        <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
              Discussion <span className="text-gray-400 font-normal ml-1.5 text-lg">({comments.length})</span>
            </h3>
          </div>

          {user ? (
            <div className="flex gap-4 items-start">
              <img
                src={user.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                alt={user.firstName}
                className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-200 shadow-sm"
              />
              <form onSubmit={handleAddComment} className="flex-1 relative">
                <textarea
                  rows="2"
                  value={commentContent}
                  onChange={(e) => {
                    setCommentContent(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                  placeholder="Share your thoughts or ask a question..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 pr-12 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all shadow-sm resize-none overflow-hidden min-h-[56px]"
                />
                <button
                  type="submit"
                  disabled={!commentContent.trim()}
                  className="absolute right-3 bottom-3 text-primary-600 p-1.5 rounded-lg hover:bg-primary-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-95"
                  title="Post comment"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-6 text-center">
              <p className="text-sm font-medium text-gray-700 mb-2">Join the conversation</p>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                Sign In to Comment
              </button>
            </div>
          )}

          {/* Comments list */}
          <div className="divide-y divide-gray-100 space-y-6 pt-2">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="pt-6 first:pt-0">
                  <div className="flex items-start gap-4">
                    <img
                      src={comment.author?.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                      alt={comment.author?.firstName}
                      className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-200 shadow-sm"
                    />
                    <div className="flex-1 min-w-0 bg-gray-50 border border-gray-100 rounded-2xl p-4">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-bold text-gray-900 text-sm truncate">
                          {comment.author?.firstName} {comment.author?.lastName}
                        </span>
                        <span className="text-xs font-medium text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed break-words">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-3xl mb-3 opacity-30">💬</div>
                <p className="text-gray-500 text-sm font-medium">No comments yet.</p>
                <p className="text-gray-400 text-xs mt-0.5">Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default BlogDetails;
