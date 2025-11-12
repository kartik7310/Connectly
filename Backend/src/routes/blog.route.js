import express from "express";

import {protect} from "../middleware/auth.middleware.js"
import BlogController from "../controllers/blog.js";

const router = express.Router();

router.post("/create",protect, BlogController.createBlog);
router.get("/fetch", BlogController.getAllBlogs);
router.get("/fetch/:blogId", BlogController.fetchSingleBlog);
router.patch("/update/:blogId",protect, BlogController.updateBlog);
router.delete("/delete/:blogId", protect,BlogController.deleteBlog);
router.get("/imagekit-auth", protect,BlogController.ImagekitVerification );



export default router;
