import React, { useEffect, useState } from "react";
import BlogForm from "../components/BlogForm";
import { useParams, useNavigate } from "react-router-dom";
import blogService from "../services/blogService";
import { useSelector } from "react-redux";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";

export default function EditBlog() {
  const { blogId } = useParams();
  const navigate = useNavigate();
  
  const blogFromRedux = useSelector((state) => 
    state?.blogs?.blogs?.find(blog => blog._id === blogId)
  );

  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBlog() {
      try {
        if (blogFromRedux) {
          setBlogData(blogFromRedux);
          setLoading(false);
          return;
        }

        const res = await blogService.getBlogById(blogId);
        setBlogData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load blog details.");
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [blogId, blogFromRedux]);

  const handleSuccess = () => {
    navigate(`/blogs/${blogId}`);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex flex-col items-center justify-center p-8 text-gray-500">
        <Loader2 size={32} className="animate-spin text-primary-600 mb-4" />
        <p className="text-sm font-medium">Loading blog article...</p>
      </div>
    );
  }

  if (error || !blogData) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Article Not Found</h3>
        <p className="text-gray-500 text-sm max-w-md mb-6">{error || "We couldn't find the blog post you are trying to edit."}</p>
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

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 font-sans">
      <BlogForm initialData={blogData} onSuccess={handleSuccess} />
    </div>
  );
}