import { Server } from "socket.io";
import { secretRoomId } from "../utils/roomSecret.js";
import Chat from "../models/chat.js";
import Notification from "../models/notification.js";
import { config } from "../config/env.js";
import logger from "../config/logger.js";
import { setDataInRedis } from "../helper/redisData.js";

// Track online users: Map<userId, Set<socketId>>
const onlineUsers = new Map();

const intitlizeSocket = async (server) => {
  const io = new Server(server, {
    cors: {
      origin: config.corsOrigin.split(',').map(origin => origin.trim()),
      credentials: true
    },
  });

  io.on("connection", (socket) => {
    let currentUserId = null;

    // Handle user registration for online status
    socket.on("register-user", (userId) => {
      if (!userId) return;
      currentUserId = String(userId);

      if (!onlineUsers.has(currentUserId)) {
        onlineUsers.set(currentUserId, new Set());
      }
      onlineUsers.get(currentUserId).add(socket.id);

      // Join a room named after the userId for targeted notifications
      socket.join(currentUserId);

      logger.info(`User registered online: ${currentUserId}`);
      // Notify all clients about the updated online list
      io.emit("online-users-list", Array.from(onlineUsers.keys()));
    });

    socket.on("get-online-users", () => {
      socket.emit("online-users-list", Array.from(onlineUsers.keys()));
    });

    // Existing chat events
    socket.on("joinChat", ({ userId, targetUserId, firstName }) => {
      const roomId = secretRoomId({ userId, targetUserId });
      logger.info(`${firstName} join the room with id ${roomId}`);
      socket.join(roomId);

      // Also ensure the user is registered as online if not already
      if (userId) {
        currentUserId = String(userId);
        if (!onlineUsers.has(currentUserId)) {
          onlineUsers.set(currentUserId, new Set());
        }
        onlineUsers.get(currentUserId).add(socket.id);
        io.emit("online-users-list", Array.from(onlineUsers.keys()));
      }
    });

    socket.on(
      "send-message",
      async ({ firstName, lastName, photoUrl, userId, targetUserId, text }) => {
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

          const sortedIds = [String(userId), String(targetUserId)].sort();
          const cacheKey = `chats:${sortedIds[0]}:${sortedIds[1]}`;
          logger.info(`Chat saved to redis with key ${cacheKey}`);
          const ttlSeconds = 60 * 60;
          await setDataInRedis(cacheKey, chat, ttlSeconds);

          const savedMessage = chat.message[chat.message.length - 1];

          io.to(roomId).emit("receiveMessage", {
            _id: savedMessage._id,
            text,
            userId,
            senderId: userId,
            firstName,
            lastName,
            photoUrl,
            createdAt: savedMessage.createdAt
          });

          //  emit a notification event to the target user 
          io.to(String(targetUserId)).emit("new-notification", {
            senderId: userId,
            targetUserId,
            firstName,
            lastName,
            photoUrl,
            text: text.substring(0, 50) + (text.length > 50 ? "..." : ""),
            createdAt: savedMessage.createdAt
          });
          logger.info(`Notification emitted to room: ${targetUserId}`);

          // save notification to DB 
          const newNotif = await Notification.create({
            recipientId: targetUserId,
            senderId: userId,
            chatId: chat._id,
            messageId: savedMessage._id,
            text: text,
            type: "MESSAGE"
          });
          logger.info(`Notification created in DB: ${newNotif._id} for recipient: ${targetUserId}`);
        } catch (error) {
          logger.error(`Error in send-message: ${error.message}`);
        }
      }
    );

    socket.on("typing-status", ({ userId, targetUserId, isTyping }) => {
      const roomId = secretRoomId({ userId, targetUserId });
      socket.to(roomId).emit("typing-status", { userId, isTyping });
    });

    socket.on("mark-messages-seen", async ({ userId, targetUserId }) => {
      try {
        const roomId = secretRoomId({ userId, targetUserId });
        const chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] },
        });

        if (chat) {
          let hasUpdates = false;
          chat.message.forEach((msg) => {
            if (String(msg.senderId) === String(targetUserId) && !msg.seen) {
              msg.seen = true;
              hasUpdates = true;
            }
          });

          if (hasUpdates) {
            await chat.save();
            const sortedIds = [String(userId), String(targetUserId)].sort();
            const cacheKey = `chats:${sortedIds[0]}:${sortedIds[1]}`;
            await setDataInRedis(cacheKey, chat, 60 * 60);

            // Notify the room that messages have been seen
            io.to(roomId).emit("messages-seen", { userId, targetUserId });

            // Clear persistent notifications for this chat/recipient
            await Notification.deleteMany({
              recipientId: userId,
              senderId: targetUserId,
              chatId: chat._id
            });
          }
        }
      } catch (error) {
        logger.error(`Error marking messages as seen: ${error.message}`);
      }
    });

    socket.on("disconnect", () => {
      if (currentUserId && onlineUsers.has(currentUserId)) {
        const socketIds = onlineUsers.get(currentUserId);
        socketIds.delete(socket.id);

        if (socketIds.size === 0) {
          onlineUsers.delete(currentUserId);
          logger.info(`User went offline completely: ${currentUserId}`);
        }

        // Broadcast updated list
        io.emit("online-users-list", Array.from(onlineUsers.keys()));
      }
      logger.info("User disconnected");
    });
  });
};

export default intitlizeSocket;
