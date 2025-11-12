// AddBlog.js
import React, { useRef, useState } from "react";
import JoditEditor from "jodit-react";
import blogService from "../services/blogService";
import axios from "axios";

export default function AddBlog() {
  const editor = useRef(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [publishedAt, setPublishedAt] = useState(
    new Date().toISOString().slice(0, 16)
  );

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // -- Helpers --

  // get auth params from server (axios-style response)
  async function getImageKitAuth() {
    try {
      const res = await blogService.getImageKitAuth(); // should be axios call
      console.log("resimagekit", res.data);

      const payload = res?.data ?? res;
      const auth = payload?.data ?? payload;

      if (!auth || !auth.token || !auth.signature) {
        throw new Error("Invalid ImageKit auth response");
      }
      return auth; // { token, expire, signature }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to get ImageKit auth";
      throw new Error(msg);
    }
  }

  // upload file to ImageKit and return the CDN URL (string)
  async function uploadToImageKit(file) {
    setUploadingImage(true);
    try {
      const auth = await getImageKitAuth();

      const fd = new FormData();
      fd.append("file", file);
      fd.append("fileName", file.name || `upload-${Date.now()}`);

      // environment variable name — include the one you use (Vite: VITE_..., CRA: REACT_APP_..., Next: NEXT_PUBLIC_...)
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
    
      
          
      if (!uploadRes?.status || uploadRes?.status !== 200){
         throw new Error(data.message || "ImageKit upload failed");
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
      let blogImageUrl = "";

      if (file) {
        try {
          blogImageUrl = await uploadToImageKit(file);
          console.log("blog",blogImageUrl);
          
           // returns string URL
        } catch (err) {
          console.error("Image upload failed:", err);
          alert("Image upload failed: " + (err.message || ""));
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

      const res = await blogService.createBlog(payload);

      alert(res?.data?.message ?? "Blog created");
      // reset form
      setTitle("");
      setContent("");
      setTagsText("");
      setPublishedAt(new Date().toISOString().slice(0, 16));
      setFile(null);
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.message ?? err?.message ?? "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const joditConfig = {
    readonly: false,
    height: 400,
    placeholder: "Write your blog content here...",
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 16 }}>
      <h2>Write Blog</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Title
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
            placeholder="Mastering Full-Stack Development"
          />
        </label>

        <label>
          Content (rich text)
          <JoditEditor
            ref={editor}
            value={content}
            config={joditConfig}
            tabIndex={1}
            onBlur={(newContent) => setContent(newContent)}
          />
        </label>

        <label>
          Tags (comma separated)
          <input
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            placeholder="FullStack,NodeJS,React"
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label>
          Image (optional) — will upload to ImageKit
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {file && <div style={{ fontSize: 13 }}>Selected: {file.name}</div>}
          {uploadingImage && (
            <div style={{ fontSize: 13 }}>Uploading image…</div>
          )}
        </label>

        <label>
          Publish date & time
          <input
            type="datetime-local"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <button
          type="submit"
          disabled={loading || uploadingImage}
          style={{ padding: "10px 16px" }}
        >
          {loading ? "Submitting…" : "Submit Blog"}
        </button>
      </form>
    </div>
  );
}
