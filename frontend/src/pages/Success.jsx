import React, { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import profileService from "../services/profileService";
import { addUser } from "../store/store-slices/userSlice";

const Success = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFetchUser = async () => {
    try {
      const res = await profileService.getProfile();
      dispatch(addUser(res.data));
    } catch (error) {
      console.error("Failed to refresh user profile:", error);
    }
  };

  React.useEffect(() => {
    handleFetchUser();
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-base-100">
      <div className="max-w-md w-full p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-success/20 p-4">
            <CheckCircle className="w-16 h-16 text-success" />
          </div>
        </div>

        <h1 className="text-3xl font-bold">Payment Successful!</h1>

        <p className="text-gray-500">
          Thank you for your subscription. Your account has been upgraded to **Premium**. You now have unlimited access to all features!
        </p>

        <div className="pt-4">
          <button
            onClick={() => navigate("/feed")}
            className="btn btn-primary w-full"
          >
            Go to Feed
          </button>
        </div>

        <p className="text-xs text-gray-400">
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </div>
  );
};

export default Success;
