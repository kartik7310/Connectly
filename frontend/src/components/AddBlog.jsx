
import React from "react";
import BlogForm from "./BlogForm";
import { useNavigate } from "react-router-dom";

export default function AddBlog() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Optional: Navigate to blog list or view page
    navigate("/blogs");
  };

  return <BlogForm onSuccess={handleSuccess} />;
}
