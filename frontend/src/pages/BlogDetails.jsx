// src/pages/BlogDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BlogService from "../services/blogService";
import { ClipboardEditIcon, Edit2Icon, FileEdit, Trash2 } from "lucide-react";
import AuthorInfo from "../components/Author";
import { useSelector } from "react-redux";
import { stripHtml } from "../utils/htmlparser";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const BlogDetails = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.user);
 
  
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await BlogService.fetchSingleBlog(blogId);
        setBlog(data);
      } catch (err) {
        setError(err.message || "Failed to fetch blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  if (loading)
    return <div className="text-center py-10 text-gray-500">Loading...</div>;

  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  if (!blog)
    return (
      <div className="text-center py-10 text-gray-500">Blog not found 😕</div>
    );

    const isAuthor = user?._id === blog?.author?._id;
  
 const  handleDeleteBlog = async(blogId)=>{
  await BlogService.deleteBlog(blogId);
  toast.success("Blog deleted successfully")  
  navigate("/blogs");
 }

 

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <img
        src={blog.blogImage || "https://via.placeholder.com/800x400"}
        alt={blog.title}
        className="w-full h-64 object-cover rounded-xl mb-6"
      />
      <h1 className="text-3xl font-semibold mb-3">{blog.title}</h1>
      <div className="flex justify-between ">
        <h2 className="text-gray-300 font-bold">Read ~ 5 min</h2>
        <h3 className="text-gray-600">
          published At :
          <span className="text-blue-400">
            {new Date(blog.createdAt).toDateString()}
          </span>
        </h3>
      </div>

      <p className="text-gray-600 leading-relaxed mb-6 mt-2">
        {stripHtml(blog.content)}
      </p>

      <div className="flex flex-wrap gap-2 mt-4">
        {Array.isArray(blog.tags) && blog.tags.length > 0 ? (
          blog.tags.map((tag, i) => (
            <span
              key={i}
              className="bg-base-300 text-gray-700 text-xs font-medium px-3 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))
        ) : (
          <span className="text-sm text-gray-400 italic">No tags</span>
        )}
      </div>

      <div className="flex justify-between">
        <AuthorInfo author={blog.author} />
       {isAuthor && <div className="flex gap-6">
          <button className="text-red-500 cursor-pointer">
            <Trash2  onClick={()=>handleDeleteBlog(blog._id)}/>
          </button>
          <button className="text-slate-500 cursor-pointer">
            <ClipboardEditIcon onClick={()=>navigate(`/blogs/edit-blog/${blog._id}`)}/>
          </button>
        </div>}
      </div>
    </div>
  );
};

export default BlogDetails;
