import React, { useEffect, useState, useRef } from "react";
import BlogCard from "../components/BlogCard";
import { useDispatch, useSelector } from "react-redux";
import BlogService from "../services/blogService";
import { setBlogs } from "../store/store-slices/blogSlice";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, Filter, X, ChevronLeft, ChevronRight, Loader2, BookOpen, Sparkles } from "lucide-react";

const Blog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const blogs = useSelector((state) => state.blogs?.blogs ?? []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 9;

  const debounceRef = useRef(null);

  const availableTags = React.useMemo(() => {
    const set = new Set();
    if (Array.isArray(blogs)) {
      blogs.forEach((b) => {
        if (Array.isArray(b.tags)) b.tags.forEach((t) => set.add(t));
      });
    }
    return Array.from(set);
  }, [blogs]);

  const fetchBlogs = async ({ searchTerm = "", tags = [], pageNum = 1 } = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pageNum,
        limit,
        ...(tags.length ? { tags: tags.join(",") } : {}),
        ...(searchTerm ? { search: searchTerm } : {}),
      };

      const res = await BlogService.fetchAllBlogs(params);
      const finalArray = Array.isArray(res) ? res : res?.data ?? [];
      dispatch(setBlogs(finalArray));
    } catch (err) {
      setError(err?.message || "Failed to fetch blogs");
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs({ searchTerm: "", tags: [], pageNum: 1 });
  }, []);

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

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 py-10 px-4 sm:px-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Hero Header */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold border border-primary-100">
              <Sparkles size={14} />
              Community Knowledge Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Insights, Stories & Ideas
            </h1>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Discover articles written by builders and thinkers across the Connexto network. Share your own journey and learn from others.
            </p>
          </div>
          
          <div className="z-10 shrink-0 w-full md:w-auto">
            <button
              onClick={() => navigate("/blogs/write-blog")}
              className="w-full md:w-auto px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 group"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              Write an Article
            </button>
          </div>

          {/* Decorative background shape */}
          <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 bg-gradient-to-br from-primary-100/50 to-indigo-100/30 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Search & Tag Filter Bar */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                type="text"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
                placeholder="Search articles by keywords or title..."
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Clear Filters */}
            {selectedTags.length > 0 && (
              <button
                onClick={() => {
                  setSelectedTags([]);
                  setPage(1);
                }}
                className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <X size={14} />
                Clear Filters ({selectedTags.length})
              </button>
            )}
          </div>

          {/* Tags */}
          <div className="pt-3 border-t border-gray-100 flex items-center flex-wrap gap-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-2 flex items-center gap-1">
              <Filter size={12} /> Topics:
            </span>
            {availableTags.length > 0 ? (
              availableTags.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                      active
                        ? "bg-primary-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })
            ) : (
              <span className="text-xs text-gray-400 italic">No tags discovered yet</span>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600 mb-3" />
            <p className="text-sm font-medium">Discovering stories...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center text-red-700">
            <p className="font-semibold text-base mb-1">Failed to load articles</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && (!Array.isArray(blogs) || blogs.length === 0) && (
          <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center max-w-lg mx-auto my-10 space-y-4">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mx-auto">
              <BookOpen size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No stories found</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              We couldn't find any blog posts matching your search or filter criteria. Try adjusting your filters or be the first to publish!
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedTags([]);
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Blog Grid */}
        {!loading && !error && Array.isArray(blogs) && blogs.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <Link key={blog._id} to={`/blogs/${blog._id}`} className="block h-full">
                <BlogCard blog={blog} />
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && Array.isArray(blogs) && blogs.length > 0 && (
          <div className="flex justify-between items-center bg-white border border-gray-200 px-6 py-4 rounded-2xl shadow-sm mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-xl border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <span className="text-sm font-semibold text-gray-700">
              Page <span className="text-primary-600 font-bold">{page}</span>
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={blogs.length < limit}
              className="flex items-center gap-1 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-xl border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Blog;
