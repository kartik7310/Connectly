import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createSocketConnection } from "../webSocket/socket";
import { useSelector } from "react-redux";
import chatService from "../services/chatService";
import userService from "../services/userService";
import ChatHeader from "../components/ChatHeader";
import MessageItem from "../components/MessageItem";
import { normalizeMessage } from "../utils/chatUtils";
import { ArrowLeftIcon, Send } from "lucide-react";
import { useDispatch } from "react-redux";
import { clearNotificationsForUser } from "../store/store-slices/notificationSlice";

const Chat = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((store) => store.user.user);
  const { _id: userId, firstName: meFirstName, lastName: meLastName, photoUrl: mePhoto } = userData || {};
  const { targetUserId } = useParams();

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [targetUser, setTargetUser] = useState(null);
  const [isHeaderLoading, setIsHeaderLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [isTargetTyping, setIsTargetTyping] = useState(false);

  const endRef = useRef(null);
  const socketRef = useRef(null);
  const chatContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // --- Helpers ---
  const normalize = useCallback(
    (raw) =>
      normalizeMessage(raw, {
        userId,
        targetUserId,
        meFirstName,
        meLastName,
        mePhoto,
        targetUser,
      }),
    [userId, targetUserId, meFirstName, meLastName, mePhoto, targetUser]
  );

  const handleSend = () => {
    const text = inputMessage.trim();
    if (!text || !socketRef.current) return;

    socketRef.current.emit("send-message", {
      firstName: meFirstName,
      lastName: meLastName,
      photoUrl: mePhoto,
      userId,
      targetUserId,
      text,
    });

    setInputMessage("");
  };

  // Auto-scroll on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isTargetTyping]);

  // Socket connection
  useEffect(() => {
    if (!userId || !targetUserId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.emit("joinChat", { userId, targetUserId, firstName: meFirstName });
    socket.emit("register-user", userId);

    socket.on("online-users-list", (onlineIds) => {
      setIsOnline(onlineIds.includes(String(targetUserId)));
    });

    socket.on("typing-status", ({ userId: senderId, isTyping }) => {
      if (String(senderId) === String(targetUserId)) {
        setIsTargetTyping(isTyping);
      }
    });

    socket.on("receiveMessage", (payload) => {
      const msg = normalize(payload);
      setMessages((prev) => {
        // Prevent duplicate messages if server echoes back
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });

      // If message is from target user, mark as seen
      if (String(payload.senderId || payload.userId) === String(targetUserId)) {
        socket.emit("mark-messages-seen", { userId, targetUserId });
      }
    });

    socket.on("messages-seen", ({ userId: seerId, targetUserId: originalSenderId }) => {
      // If the target user (the one I'm chatting with) has seen MY messages
      if (String(seerId) === String(targetUserId)) {
        setMessages((prev) =>
          prev.map((m) =>
            String(m.senderId) === String(userId) ? { ...m, seen: true } : m
          )
        );
      }
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("messages-seen");
      socket.off("online-users-list");
      socket.off("typing-status");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, targetUserId, meFirstName, normalize]);

  // Initial load: target user and chat history
  const fetchData = async () => {
    if (!targetUserId) return;

    try {
      // Fetch target user profile for header
      setIsHeaderLoading(true);
      const userRes = await userService.getUserById(targetUserId);
      const tUser = userRes.data;
      setTargetUser(tUser);
      setIsHeaderLoading(false);

      // Fetch chat history
      const chatRes = await chatService.chats(targetUserId);
      const chat = Array.isArray(chatRes) ? chatRes[0] ?? null : chatRes;

      if (!chat) {
        setMessages([]);
        return;
      }

      const msgs = (chat.message || [])
        .slice()
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .map((m) =>
          normalizeMessage(m, {
            userId,
            targetUserId,
            meFirstName,
            meLastName,
            mePhoto,
            targetUser: tUser,
          })
        );

      setMessages(msgs);

      // Clear notifications 
      dispatch(clearNotificationsForUser(targetUserId));

      // Mark messages as seen once loaded
      if (socketRef.current && msgs.some(m => String(m.senderId) === String(targetUserId) && !m.seen)) {
        socketRef.current.emit("mark-messages-seen", { userId, targetUserId });
      }
    } catch (error) {
      console.error("Error fetching chat data:", error);
      setIsHeaderLoading(false);
    }
  };

  useEffect(() => {
    if (targetUserId && userId) {
      fetchData();
    }
  }, [targetUserId, userId]);

  return (
    <div className="w-full h-[calc(100vh-64px)] flex justify-center bg-gray-50 py-0 sm:py-6 sm:px-6">
      <div className="w-full max-w-4xl flex flex-col h-full bg-white border border-gray-200 rounded-none sm:rounded-2xl shadow-sm overflow-hidden relative">
        <ChatHeader user={targetUser} isLoading={isHeaderLoading} isOnline={isOnline} />

        <div ref={chatContainerRef} className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 bg-gray-50/50 custom-scrollbar relative">
          {messages.length === 0 && !isHeaderLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40 select-none">
              <div className="w-16 h-16 mb-4 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-white">
                <span className="text-2xl">💬</span>
              </div>
              <p className="text-sm font-medium text-gray-600">No messages yet. Start a conversation!</p>
            </div>
          )}

          <div className="space-y-1 z-10 relative">
            {messages.map((m) => (
              <MessageItem key={m?.id} message={m} isMe={String(m?.senderId) === String(userId)} />
            ))}
          </div>

          {isTargetTyping && (
            <div className="chat chat-start mt-4 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="chat-image avatar">
                <div className="w-8 rounded-full ring-1 ring-gray-200 bg-white">
                  <img src={targetUser?.photoUrl || `https://ui-avatars.com/api/?name=${targetUser?.firstName}+${targetUser?.lastName}&background=f3f4f6&color=4b5563`} alt="sender" />
                </div>
              </div>
              <div className="chat-bubble bg-white text-gray-600 !rounded-2xl !rounded-tl-none border border-gray-200 shadow-sm py-2 px-4 italic text-sm flex items-center gap-2">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                </span>
                Typing...
              </div>
            </div>
          )}
          <div ref={endRef} className="h-2" />
        </div>

        <div className="p-3 sm:p-4 bg-white border-t border-gray-200">
          <div className="flex items-center gap-2 max-w-full">
            <input
              value={inputMessage}
              onChange={(e) => {
                setInputMessage(e.target.value);
                // Emit typing status
                if (socketRef.current && userId && targetUserId) {
                  socketRef.current.emit("typing-status", { userId, targetUserId, isTyping: true });

                  if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                  typingTimeoutRef.current = setTimeout(() => {
                    socketRef.current.emit("typing-status", { userId, targetUserId, isTyping: false });
                  }, 1000);
                }
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 rounded-full bg-gray-100 border border-transparent px-5 py-3 text-sm sm:text-base text-gray-900 outline-none focus:bg-white focus:border-primary-300 focus:ring-4 focus:ring-primary-100 transition-all placeholder:text-gray-500"
            />
            <button
              onClick={handleSend}
              disabled={!inputMessage.trim()}
              className="shrink-0 w-11 h-11 flex items-center justify-center rounded-full text-white bg-primary-600 hover:bg-primary-700 active:scale-95 disabled:opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-sm"
              aria-label="Send message"
            >
              <Send size={18} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
