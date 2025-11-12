// src/pages/Blog.jsx
import React, { useEffect, useState, useRef } from "react";
import BlogCard from "../components/BlogCard";
import { useDispatch, useSelector } from "react-redux";
import BlogService from "../services/blogService";
import { setBlogs } from "../store/store-slices/blogSlice";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Blog = () => {
  const dispatch = useDispatch();
    const navigate = useNavigate();
  const blogs = useSelector((state) => state.blogs?.blogs ?? []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 8;

  // for debounce
  const debounceRef = useRef(null);

  // derive available tags from fetched blogs (unique)
  const availableTags = React.useMemo(() => {
    const set = new Set();
    blogs.forEach((b) => {
      if (Array.isArray(b.tags)) b.tags.forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, [blogs]);

  // fetch function - handles various shapes of BlogService response
  const fetchBlogs = async ({ searchTerm = "", tags = [], pageNum = 1 } = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pageNum,
        limit,
        // send tags as CSV (backend accepts CSV or array)
        ...(tags.length ? { tags: tags.join(",") } : {}),
        ...(searchTerm ? { search: searchTerm } : {}),
      };

      const res = await BlogService.fetchAllBlogs(params);
      // BlogService may return either:
      // - the array directly, or
      // - an object { data, pagination }
      const data = res?.data ?? res; // prefer res.data if present, else res
      const finalArray = Array.isArray(data) ? data : data?.data ?? [];

      dispatch(setBlogs(finalArray));
    } catch (err) {
      setError(err?.message || "Failed to fetch blogs");
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  // initial load
  useEffect(() => {
    fetchBlogs({ searchTerm: "", tags: [], pageNum: 1 });
    
  }, []);

  // effect: search / selectedTags / page changes, debounce and fetch
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
     
      fetchBlogs({ searchTerm: search, tags: selectedTags, pageNum: page });
    }, 350);

    return () => clearTimeout(debounceRef.current);
    
  }, [search, selectedTags, page]);

  const toggleTag = (tag) => {
    setPage(1);
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading blogs...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search + Tag filters */}
      
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <fieldset className="w-full sm:w-1/2">
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            type="text"
            className="input w-full"
            placeholder="Search blogs by title or content..."
          />
        </fieldset>
         <div>
         <button
      className="btn btn-primary btn-block"
      onClick={() => navigate("/blogs/write-blog")}
    >
      Write Blog
    </button>
      </div>
        <div className="flex items-center flex-wrap gap-2">
          {availableTags.length > 0 ? (
            availableTags.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`text-xs font-medium px-3 py-1 rounded-full transition ${
                    active ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                  }`}
                >
                  #{tag}
                </button>
              );
            })
          ) : (
            <span className="text-xs text-gray-400 italic">No tags</span>
          )}

          {selectedTags.length > 0 && (
            <button
              onClick={() => {
                setSelectedTags([]);
                setPage(1);
              }}
              className="text-xs ml-2 px-2 py-1 rounded border"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Empty state */}
      {(!Array.isArray(blogs) || blogs.length === 0) && (
        <div className="text-center py-10 text-gray-500">No blogs found 😕</div>
      )}

      {/* Blog grid */}
      {Array.isArray(blogs) && blogs.length > 0 && (
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 justify-items-center">
          {blogs.map((blog) => (
            <Link key={blog._id} to={`/blogs/${blog._id}`}>
              <BlogCard blog={blog} />
            </Link>
          ))}
        </div>
      )}

      {/* simple pagination controls (optional) */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 rounded border disabled:opacity-50"
          disabled={page === 1}
        >
          Prev
        </button>
        <div className="text-sm">Page {page}</div>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 rounded border"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Blog;
