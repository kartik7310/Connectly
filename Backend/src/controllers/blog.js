import imagekit from "../config/imagekit.js";
import logger from "../config/logger.js";
import { getDataFromRedis, invalidateByPrefix, InvalidateCache, setDataInRedis } from "../helper/redisData.js";
import BlogService from "../services/blog.js";
import AppError from "../utils/AppError.js";
import { blogSchema, updateBlogSchema } from "../validators/blog.js";
import mongoose from "mongoose";
const BlogController = {
  async createBlog(req, res, next) {
    try {
      const parsed = blogSchema.safeParse(req.body);
       if (!parsed.success) {
      logger.warn("Validation failed on createBlog request", parsed.error.flatten());
      
      const msg = parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join(", ");
      return next(new AppError(`Validation failed: ${msg}`, 400));
    }
      const userId = req?.user?._id;
      logger.debug("Create blog request", { userId });
      
      if (!userId) {
        logger.warn("Unauthorized access attempt on createBlog");
        return next(new AppError("Validation failed", 400));
      }
      const { title, content, tags = [] ,blogImage, publishedAt} = parsed.data;

      const blogPayload = { title, content, tags, blogImage, publishedAt };
      if (blogImage) blogPayload.blogImage = blogImage;
      if (publishedAt) blogPayload.publishedAt = publishedAt;

      const blog = await BlogService.createBlog(userId, blogPayload);

      //cache invalidation
       await invalidateByPrefix("blogs");
      return res.status(201).json({
        success: true,
        message: "Blog created successfully",
        data: blog,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAllBlogs(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const search = (req.query.search || "").trim();

       const cacheKey = page || limit || skip || search ?`blogs:${page}:${limit}:${skip}:${search}` : "blogs";

      const cachedBlogs = await getDataFromRedis(cacheKey);
      
       
      if (cachedBlogs) {
        logger.info("Cache hit");
        return res.status(200).json({
          success: true,
          message: "Blogs fetched successfully",
          data:cachedBlogs
        });
      }
      const blogs = await BlogService.getAllBlogs(skip, limit, search);
      logger.info("Blogs fetched successfully", { blogs });
      await setDataInRedis(cacheKey,blogs);
      logger.info("Cache miss");
      return res.status(200).json({
        success: true,
        message: "Blogs fetched successfully",
        data: blogs,
      });
    } catch (error) {
      next(error);
    }
  },

  async fetchSingleBlog(req, res, next) {
    try {
      const blogId = req.params?.blogId;
      if(mongoose.isValidObjectId(blogId) === false) return next(new AppError("Invalid blog id", 400));
      
      if (!blogId) return next(new AppError("Blog id is required", 400));

      const cacheKey = `blog:${blogId}`;

      //fecth from redis
      const cachedBlog = await getDataFromRedis(cacheKey);
      if (cachedBlog) {
        logger.info("Cache hit");
        return res.status(200).json({
          success: true,
          message: "Blog fetched successfully",
          data:cachedBlog
        });
      }
      const blog = await BlogService.fetchSingleBlog(blogId);

      //set to redis
      await setDataInRedis(cacheKey,blog);  
      logger.info("Cache miss");
      return res.status(200).json({
        success: true,
        message: "Blog fetched successfully",
        data: blog,
      }); 
    } catch (error) {
      next(error);
    }
  },

  async deleteBlog(req, res, next) {
    try {
      const blogId = req.params?.blogId;
       if(mongoose.isValidObjectId(blogId) === false) return next(new AppError("Invalid blog id", 400));

      const userId = req.user?._id;
      if (!blogId) {
        logger.warn("Blog id is required");
        return next(new AppError("Blog id is required", 400));
      }
      await BlogService.deleteBlog(blogId, userId);
      
      //cache invalidation
      await InvalidateCache(`blog:${blogId}`);
      await invalidateByPrefix("blog");
      return res.status(200).json({
        success: true,
        message: "blog deleted",
      });
    } catch (error) {
      next(error);
    }
  },
   async updateBlog(req, res, next) {
    try {

   const blogId = req.params?.blogId;
    if (!blogId) return next(new AppError("Blog id is required", 400));
   if(mongoose.isValidObjectId(blogId) === false) return next(new AppError("Invalid blog id", 400));

    const userId = req?.user?._id;
    if (!userId) {
      logger.warn("updateBlog: Unauthorized (no userId)");
      return next(new AppError("Unauthorized", 401));
    }

    const parsed = updateBlogSchema.safeParse(req.body);
    if (!parsed.success) {
      logger.warn("Validation failed on updateBlog", parsed.error.flatten());
      const msg = parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join(", ");
      return next(new AppError(`Validation failed: ${msg}`, 400));
    }

  
    const blogPayload = parsed.data;
    if (Object.keys(blogPayload).length === 0) {
      return next(new AppError("No fields to update", 400));
    }

    const updated = await BlogService.updateBlog(blogId, userId, blogPayload);

    //cache invalidation
    await InvalidateCache(`blog:${blogId}`);
    await invalidateByPrefix("blog");
    
    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updated,
    });
    } catch (error) {
      next(error);
    }
  },

  async ImagekitVerification(req,res,next){
    try {
     const authParams = imagekit.getAuthParameters?.() || imagekit.getAuthenticationParameters?.();
      if(!authParams){
        logger.warn("Imagekit verification failed")
        return next(new AppError("Something went wrong",500))

      }
      return res.status(200).json({
        success:true,
        data:authParams
      })
    } catch (error) {
      next(error)
    }
  }
};

export default BlogController;
