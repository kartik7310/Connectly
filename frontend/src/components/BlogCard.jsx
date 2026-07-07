import React from "react";
import { stripHtml } from "../utils/htmlparser";
import { Heart, ArrowRight } from "lucide-react";

const BlogCard = ({ blog }) => {
  const { title, content, blogImage, tags, likes = [] } = blog || {};

  return (
    <div className="w-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden flex flex-col h-full group">
      {/* Blog image */}
      <div className="w-full h-48 overflow-hidden bg-gray-100 relative">
        <img
          src={blogImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80"}
          alt={title || "Blog image"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-gray-100">
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          <span className="text-xs text-gray-700 font-semibold">{likes.length}</span>
        </div>
      </div>

      {/* Blog details */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {title || "Untitled Blog"}
        </h3>

        <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed flex-1">
          {content
            ? stripHtml(content)
            : "No content available."}
        </p>

        {/* Tags section */}
        <div className="flex flex-wrap gap-1.5 mb-4 pt-4 border-t border-gray-100">
          {Array.isArray(tags) && tags.length > 0 ? (
            tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 text-[11px] font-medium px-2.5 py-1 rounded-md"
              >
                #{tag}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400 italic">No tags</span>
          )}
          {Array.isArray(tags) && tags.length > 3 && (
            <span className="bg-gray-100 text-gray-500 text-[11px] font-medium px-2 py-1 rounded-md">
              +{tags.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center text-primary-600 font-semibold text-xs gap-1 group-hover:translate-x-1 transition-transform">
          <span>Read Article</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
