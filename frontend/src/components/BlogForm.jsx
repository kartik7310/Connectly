import React, { useRef, useState } from "react";
import JoditEditor from "jodit-react";
import blogService from "../services/blogService";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Image as ImageIcon, Upload, Calendar, Tag, FileText, ArrowLeft, Loader2, Save } from "lucide-react";

export default function BlogForm({ initialData = null, onSuccess }) {
  const editor = useRef(null);
  const navigate = useNavigate();

  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [tagsText, setTagsText] = useState(initialData?.tags?.join(", ") || "");
  const [publishedAt, setPublishedAt] = useState(
    initialData?.publishedAt
      ? new Date(initialData.publishedAt).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16)
  );

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const isEditMode = !!initialData;

  async function getImageKitAuth() {
    try {
      const res = await blogService.getImageKitAuth();
      const payload = res?.data ?? res;
      const auth = payload?.data ?? payload;

      if (!auth || !auth.token || !auth.signature) {
        throw new Error("Invalid ImageKit auth response");
      }
      return auth;
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to get ImageKit auth";
      throw new Error(msg);
    }
  }

  async function uploadToImageKit(file) {
    setUploadingImage(true);
    try {
      const auth = await getImageKitAuth();

      const fd = new FormData();
      fd.append("file", file);
      fd.append("fileName", file.name || `upload-${Date.now()}`);

      const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
      if (!publicKey)
        throw new Error("ImageKit public key not configured in env");

      fd.append("publicKey", publicKey);
      fd.append("folder", "/blogs");
      fd.append("token", auth.token);
      fd.append("expire", auth.expire);
      fd.append("signature", auth.signature);

      const uploadRes = await axios.post(
        "https://upload.imagekit.io/api/v1/files/upload",
        fd,
        {
          withCredentials: false,
          timeout: 60000,
        }
      );

      if (!uploadRes?.status || uploadRes?.status !== 200) {
        throw new Error("ImageKit upload failed");
      }

      const data = uploadRes?.data ?? uploadRes;
      return data.url;
    } finally {
      setUploadingImage(false);
    }
  }

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let blogImageUrl = initialData?.blogImage || "";

      if (file) {
        try {
          blogImageUrl = await uploadToImageKit(file);
        } catch (err) {
          console.error("Image upload failed:", err);
          toast.error("Image upload failed: " + (err.message || ""));
          setLoading(false);
          return;
        }
      }

      const tags = tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title: title.trim(),
        content,
        tags,
        publishedAt: new Date(publishedAt).toISOString(),
      };

      if (blogImageUrl) {
        payload.blogImage = blogImageUrl;
      }

      let res;
      if (isEditMode) {
        res = await blogService.updateBlog(initialData._id, payload);
        toast.success("Blog updated successfully");
      } else {
        res = await blogService.createBlog(payload);
        toast.success("Blog created successfully");
        navigate("/blogs");
      }

      if (onSuccess) {
        onSuccess(res);
      }

      if (!isEditMode) {
        setTitle("");
        setContent("");
        setTagsText("");
        setPublishedAt(new Date().toISOString().slice(0, 16));
        setFile(null);
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ?? err?.message ?? "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const joditConfig = {
    readonly: false,
    height: 450,
    placeholder: "Write your story here...",
    toolbarSticky: false,
    showCharsCounter: false,
    showWordsCounter: true,
    showXPathInStatusbar: false,
    style: {
      background: "#ffffff",
      color: "#111827",
      fontFamily: "Inter, sans-serif",
      fontSize: "16px",
    },
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Blogs
        </button>
        <span className="text-xs font-semibold px-3 py-1 bg-primary-50 text-primary-700 rounded-full border border-primary-200">
          {isEditMode ? "Editing Mode" : "Drafting New Post"}
        </span>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-gray-100 bg-gray-50/50">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            {isEditMode ? "Edit Your Blog Post" : "Create a New Blog Post"}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Share your expertise, insights, and stories with the professional community.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FileText size={16} className="text-primary-600" />
              Article Title <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-lg font-semibold text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow shadow-sm"
              placeholder="e.g. Mastering Full-Stack Development in 2026"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <ImageIcon size={16} className="text-primary-600" />
              Cover Image (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 hover:border-primary-400 rounded-xl p-6 transition-colors bg-gray-50/50 flex flex-col items-center justify-center text-center">
              {file ? (
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                  <Upload size={18} className="text-primary-600" />
                  <span className="text-sm font-medium text-gray-800 truncate max-w-xs">{file.name}</span>
                  <button type="button" onClick={() => setFile(null)} className="text-xs text-red-600 hover:underline ml-2">Remove</button>
                </div>
              ) : initialData?.blogImage ? (
                <div className="flex flex-col items-center gap-2">
                  <img src={initialData.blogImage} alt="Current Cover" className="h-32 w-auto object-cover rounded-lg border border-gray-200 shadow-sm mb-2" />
                  <span className="text-xs text-gray-500">Current cover image. Upload a new file below to replace it.</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 mb-1">
                    <Upload size={20} />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Click to choose an image or drag and drop</p>
                  <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 5MB</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                style={{ position: 'relative', marginTop: file || initialData?.blogImage ? '12px' : '0px', width: 'auto' }}
              />
            </div>
            {uploadingImage && (
              <p className="text-xs text-primary-600 font-medium flex items-center gap-1.5 mt-1">
                <Loader2 size={12} className="animate-spin" /> Uploading image to CDN...
              </p>
            )}
          </div>

          {/* Rich Text Editor */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FileText size={16} className="text-primary-600" />
              Content <span className="text-red-500">*</span>
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
              <JoditEditor
                ref={editor}
                value={content}
                config={joditConfig}
                tabIndex={1}
                onBlur={(newContent) => setContent(newContent)}
              />
            </div>
          </div>

          {/* Tags and Date Grid */}
          <div className="grid md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Tag size={16} className="text-primary-600" />
                Tags
              </label>
              <input
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                placeholder="FullStack, NodeJS, React (comma separated)"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow shadow-sm"
              />
              <p className="text-xs text-gray-400">Separate tags with commas to help others discover your post.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar size={16} className="text-primary-600" />
                Publish Date & Time
              </label>
              <input
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow shadow-sm"
              />
              <p className="text-xs text-gray-400">Set when this post should appear as published.</p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-gray-100 mt-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-medium rounded-lg transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="w-full sm:w-auto px-8 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading || uploadingImage ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {uploadingImage ? "Uploading..." : "Saving..."}
                </>
              ) : (
                <>
                  <Save size={18} />
                  {isEditMode ? "Update Article" : "Publish Article"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
