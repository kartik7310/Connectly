// controllers/chatController.js
import ChatService from "../services/chat.js"
import AppError from "../utils/AppError.js";
import logger from "../config/logger.js";
import { getDataFromRedis, setDataInRedis } from "../helper/redisData.js";

const ChatController = {

  async getChats(req, res, next) {
    try {
      const userId = req.user?._id;
      if(!userId) return next(new AppError("Unauthorized",401))
      
      const { targetUserId } = req.params;
      if(!targetUserId) return next(new AppError("Target user id is required",400))

        //sort ids => user a -> user b and user b -> user a use same id
        const sortedIds = [String(userId),String(targetUserId)].sort();
        const cacheKey = `chats:${sortedIds[0]}:${sortedIds[1]}`;
         
      //cache hit
        const cachedChat = await getDataFromRedis(cacheKey);
        if (cachedChat) {
          logger.info("Cache hit");
          return res.status(200).json({
            success: true,
            data: cachedChat,
          });
        }
        //db call
      const chat = await ChatService.getOneToOneChat({
        requesterId: userId,
        targetUserId,
      });

       const responseData = chat?[chat]:[]

      //set to redis
      const ttlSeconds=60*60;
      await setDataInRedis(cacheKey,chat,ttlSeconds);

      return res.status(200).json({
        success: true,
        data: responseData,
      });
    } catch (err) {
    
      logger?.error?.(err?.message || err);
      return next(err instanceof AppError ? err : new AppError("Something went wrong", 500));
    }
  },
};

export default ChatController;
