// Layout.jsx
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify'
import Profile from "../services/profileService";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../store/store-slices/userSlice";
import { addNotification, setInitialNotifications } from "../store/store-slices/notificationSlice";
import { useEffect, useRef } from "react";
import Chatbot from "../components/Chatbot";
import { createSocketConnection } from "../webSocket/socket";
import chatService from "../services/chatService";


export default function Layout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((store => store.user.user))

  const fetchUser = async () => {
    try {
      const res = await Profile.getProfile()
      dispatch(addUser(res.data))
    } catch (error) {
      navigate("/login", { replace: true });
    }
  }

  const fetchNotifications = async () => {
    try {
      const res = await chatService.getUnreadNotifications();
      dispatch(setInitialNotifications(res));
    } catch (error) {
      console.error("Error fetching initial notifications:", error);
    }
  };

  const location = useLocation();
  const isChatPage = location.pathname.startsWith("/chat/");
  const targetUserIdInUrl = isChatPage ? location.pathname.split("/").pop() : null;

  const socketRef = useRef(null);
  const audioRef = useRef(new Audio("/fah.mp3"));

  useEffect(() => {
    if (!user) {
      fetchUser();
      return;
    }

    // Initial notifications load
    fetchNotifications();

    const socket = createSocketConnection();
    socketRef.current = socket;

    const registerUser = () => {
      if (user?._id) {
        socket.emit("register-user", user._id);
        socket.emit("get-online-users");
      }
    };

    registerUser();
    socket.on("connect", registerUser);

    const handleNotification = (notification) => {
      console.log("New notification received:", notification);

      // notification only will show when user is not in chat with that user
      if (isChatPage && String(notification.senderId) === String(targetUserIdInUrl)) {
        console.log("Suppressed notification (user in chat)");
        return;
      }

      // If notification is for ME
      if (String(notification.targetUserId) === String(user._id)) {
        console.log("Processing notification for current user");
        dispatch(addNotification(notification));

        // notification sound
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));

        // toast
        toast.info(`New message from ${notification.firstName}`);
      } else {
        console.log("Notification ignored (not for this user)");
      }
    };

    socket.on("new-notification", handleNotification);

    return () => {
      socket.off("connect", registerUser);
      socket.off("new-notification", handleNotification);
    };
  }, [user, isChatPage, targetUserIdInUrl]);

  // global disconnect on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-dvh flex flex-col">

      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      {!isChatPage && <Footer />}
      <Chatbot />

      <ToastContainer
        position="top-left"
        autoClose={5000}
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
