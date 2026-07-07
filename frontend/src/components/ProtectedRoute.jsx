import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import profileService from "../services/profileService";
import { addUser, removeUser } from "../store/store-slices/userSlice";

export default function ProtectedRoute({ children, isPublic = false }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);

  // If user is already in Redux store, we are authenticated; no loading needed.
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    // If user is already present in Redux store, we don't need to re-verify or load.
    if (user) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    async function verifyAuth() {
      try {
        const res = await profileService.getProfile();
        if (isMounted) {
          if (res?.data) {
            dispatch(addUser(res.data));
          } else {
            dispatch(removeUser());
          }
        }
      } catch (err) {
        if (isMounted) {
          dispatch(removeUser());
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [user, dispatch]);

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isAuthenticated = Boolean(user);

  // If it's a PUBLIC route (login/signup/etc.)
  if (isPublic) {
    // If user IS logged in, redirect immediately to feed
    if (isAuthenticated) return <Navigate to="/feed" replace />;
    // If user is NOT logged in, show the public page
    return children;
  }

  // If it's a PROTECTED route (feed/connections/chat/etc.)
  // If user is NOT logged in, redirect to login
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  // If user IS logged in, show the protected page
  return children;
}