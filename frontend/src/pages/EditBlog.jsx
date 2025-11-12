import React, { useEffect, useState } from "react";
import BlogForm from "../components/BlogForm";
import { useParams, useNavigate } from "react-router-dom";
import blogService from "../services/blogService";
import { useSelector } from "react-redux";

export default function EditBlog() {
  const { blogId } = useParams();
  const navigate = useNavigate();
  
  // Fixed: Corrected Redux selector
  const blogFromRedux = useSelector((state) => 
    state?.blogs?.blogs?.find(blog => blog._id === blogId)
  );
  
  console.log("blogFromRedux", blogFromRedux);
  console.log("blogId", blogId);

  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      try {
        // Try to use Redux data first if available
        if (blogFromRedux) {
          setBlogData(blogFromRedux);
          setLoading(false);
          return;
        }

        // Otherwise fetch from API
        const res = await blogService.getBlogById(blogId);
        setBlogData(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load blog");
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [blogId, blogFromRedux]);

  const handleSuccess = () => {
    navigate(`/blogs/${blogId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (!blogData) return <div>Blog not found</div>;

  return (
    <div>
      <BlogForm initialData={blogData} onSuccess={handleSuccess} />
    </div>
  );
}