import { Server } from "socket.io";
import { secretRoomId } from "../utils/roomSecret.js";
import Chat from "../models/chat.js";
import { config } from "../config/env.js";
import logger from "../config/logger.js";
import { setDataInRedis } from "../helper/redisData.js";
const intitlizeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: config.corsOrigin.split(',').map(origin => origin.trim()),
        credentials: true
    },
  });

  io.on("connection", (socket) => {
    
    //handle events
    socket.on("joinChat", ({ userId, targetUserId, firstName }) => {
      
      const roomId = secretRoomId({ userId, targetUserId });
      logger.info(`${firstName} join the room with id ${roomId}`);

      socket.join(roomId);
    });

    socket.on(
      "send-message",
      async ({ firstName, userId, targetUserId, text }) => {
    
        try {
          const roomId = secretRoomId({ userId, targetUserId });
          let chat = await Chat.findOne({
            participants: {
              $all: [userId, targetUserId],
            },
          });
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              message: [],
            });
          }
        
           chat.message.push({ senderId: userId, text });
          await chat.save();

          //set to redis
          const sortedIds = [String(userId),String(targetUserId)].sort();
          const cacheKey = `chats:${sortedIds[0]}:${sortedIds[1]}`;
          logger.info(`Chat saved to redis with key ${cacheKey}`);
          const ttlSeconds=60*60;
          await setDataInRedis(cacheKey,chat,ttlSeconds);

          io.to(roomId).emit("receiveMessage", { firstName, text });
        } catch (error) {
          logger.error(error.message);
        }
      }
    );
    socket.on("disconnect", () => {
      logger.info("User disconnected");
    });
  });
};

export default intitlizeSocket;
