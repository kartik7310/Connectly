import React from "react";
import { stripHtml } from "../utils/htmlparser";

const BlogCard = ({ blog }) => {
  const { title, content, blogImage, tags } = blog || {};

  return (
    <div className="card w-full sm:w-72 md:w-80 bg-base-100 border border-base-200 shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
      {/* Blog image */}
      <figure className="w-full h-48 overflow-hidden">
        <img
          src={blogImage || "https://via.placeholder.com/400x200"}
          alt={title || "Blog image"}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </figure>
    
      {/* Blog details */}
      <div className="card-body text-center px-5 py-6">
        <h2 className="card-title text-lg font-semibold mb-2 line-clamp-2">
          {title || "Untitled Blog"}
        </h2>

      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
  {content
    ? `${stripHtml(content).slice(0, 80)}... Read More`
    : "No content available."}
</p>

        {/* Tags section */}
       <div className="card-actions justify-center flex-wrap gap-2 mt-3">
  {Array.isArray(tags) && tags.length > 0 ? (
    tags.map((tag, index) => (
      <span
        
        key={index}
        className="bg-base-300 text-gray-700 text-xs font-medium px-3 py-1 rounded-full hover:bg-base-200 transition cursor-pointer"
      >
        #{tag}
      </span>
    ))
  ) : (
    <span className="text-xs text-gray-400 italic">No tags</span>
  )}
</div>
      </div>
    </div>
  );
};

export default BlogCard;
