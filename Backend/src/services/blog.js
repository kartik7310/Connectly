import logger from "../config/logger.js";
import Blog from "../models/blog.js";
import Comment from "../models/comment.js";
import AppError from "../utils/AppError.js";

const BlogService = {
  async createBlog(userId, payload) {
    
      const { title, content, tags, blogImage, publishedAt } = payload;
      const blog = await Blog.create({
        author: userId,
        title,
        content,
        tags,
        blogImage,
        publishedAt,
      });

      return blog;
    
  },
  
  async getAllBlogs(skip, limit, search) {

      const query = search ? { $text: { $search: search } } : {};
      const blogs =
        await Blog.find(query)
          .sort({ createdAt: -1 })
          .populate("author", "firstName lastName photoUrl")
          .skip(skip)
          .limit(limit).lean()
      
      return blogs;
    
  },

  async deleteBlog(blogId, userId) {
    const blog = await Blog.findById(blogId).select("author").lean();
    if (!blog) {
      logger.warn(`deleteBlog: Blog not found (${blogId})`);
      throw new AppError("Blog not found", 404);
    }
    if (String(blog.author) !== String(userId)) {
      logger.warn(
        `deleteBlog: Forbidden. user=${userId} blog.author=${blog.author}`
      );
      throw new AppError("You are not allowed to delete this blog", 403);
    }

    await Blog.deleteOne({ _id: blogId });
    return true;
  },

  async updateBlog(blogId,userId,blogPayload) {
      
      const blog = await Blog.findById(blogId).select("author").lean();
      if (!blog) {
        logger.warn(`updateBlog: Blog not found (${blogId})`);
        throw new AppError("Blog not found", 404);
      }
      if (String(blog.author) !== String(userId)) {
        logger.warn(`updateBlog: Forbidden user=${userId} blog.author=${blog.author}`);
        throw new AppError("You are not allowed to update this blog", 403);
      }

      const updated = await Blog.findByIdAndUpdate(
        blogId,
        { $set: blogPayload },
        { new: true, runValidators: true }
      )
        .populate("author", "firstName lastName")
        .lean();

      if (!updated) {
        throw new AppError("Failed to update blog", 500);
      }

      return updated;
    },
    async fetchSingleBlog(blogId){
      try {
         const blog = await Blog.findById(blogId).populate("author", "firstName lastName photoUrl").lean();
      
        if (!blog) {
          throw new AppError("Blog not found", 404);
        }
        return blog;
      } catch (error) {
        throw new AppError(error.message, 500);
      }
    },
    async likeUnlikeBlog(blogId, userId) {
      const blog = await Blog.findById(blogId);
      if (!blog) {
        throw new AppError("Blog not found", 404);
      }

      const index = blog.likes.indexOf(userId);
      if (index === -1) {
        blog.likes.push(userId);
      } else {
        blog.likes.splice(index, 1);
      }

      await blog.save();
      return blog;
    },
    async addComment(blogId, userId, content) {
      const blog = await Blog.findById(blogId).lean();
      if (!blog) {
        throw new AppError("Blog not found", 404);
      }

      const comment = await Comment.create({
        blog: blogId,
        author: userId,
        content,
      });

      return await comment.populate("author", "firstName lastName photoUrl");
    },
    async getComments(blogId) {
      const comments = await Comment.find({ blog: blogId })
        .populate("author", "firstName lastName photoUrl")
        .sort({ createdAt: -1 })
        .lean();
      return comments;
    },
    };

export default BlogService;
