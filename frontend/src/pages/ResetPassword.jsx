import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { validations } from "../utils/constants";
import Auth from "../services/authService";
import authSide from "../assets/auth_side.png";

export default function ResetPassword() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({ mode: "onTouched" });
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const password = watch("password");

  const onSubmit = async (values) => {
    try {
      const res = await Auth.resetPassword({
        email,
        otp: values.otp,
        password: values.password,
        confirmPassword: values.confirmPassword
      });
      if (res?.data?.success) {
        toast.success(res.data.message || "Password reset successfully");
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.message || "Failed to reset password");
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 font-sans px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center max-w-md w-full">
          <p className="text-gray-600 mb-6 font-medium">Invalid access. Please request an OTP first.</p>
          <Link to="/forgot-password" title="Go to Forgot Password" className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors shadow-sm">Go to Forgot Password</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white shadow-xl shadow-gray-200/50 rounded-2xl overflow-hidden border border-gray-100">
        
        {/* Left Side - Image */}
        <div className="hidden md:block relative h-full bg-gray-100">
          <img
            src={authSide}
            alt="Reset Password Visual"
            className="w-full h-full object-cover absolute inset-0 opacity-90 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent flex flex-col justify-end p-10">
            <h2 className="text-3xl font-bold text-white mb-3">Set New Password</h2>
            <p className="text-gray-200 font-medium leading-relaxed">Secure your account with a strong password.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 sm:p-12 w-full flex flex-col justify-center">
          
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-primary-600 font-bold text-xl tracking-tight mb-8">
              <div className="w-6 h-6 rounded bg-primary-600 text-white flex items-center justify-center text-xs">
                C
              </div>
              Connexto
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Reset Password</h2>
            <p className="text-gray-500 text-sm">Enter the OTP sent to <strong className="font-semibold text-gray-700">{email}</strong> and your new password.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">OTP</label>
              <input
                type="text"
                className={`w-full border rounded-lg px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow shadow-sm ${errors.otp ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-primary-500"}`}
                {...register("otp", { required: "OTP is required" })}
                placeholder="Enter 6-digit OTP"
              />
              {errors.otp && <p className="text-sm text-red-500 mt-1.5 font-medium">{errors.otp.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">New Password</label>
              <input
                type="password"
                className={`w-full border rounded-lg px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow shadow-sm ${errors.password ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-primary-500"}`}
                {...register("password", validations.password)}
                placeholder="New password"
              />
              {errors.password && <p className="text-sm text-red-500 mt-1.5 font-medium">{errors.password.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Confirm New Password</label>
              <input
                type="password"
                className={`w-full border rounded-lg px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow shadow-sm ${errors.confirmPassword ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-primary-500"}`}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (val) => val === password || "Passwords do not match"
                })}
                placeholder="Confirm new password"
              />
              {errors.confirmPassword && <p className="text-sm text-red-500 mt-1.5 font-medium">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 rounded-lg transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm mt-2"
            >
              {isSubmitting ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>

          <p className="text-sm text-center mt-8 text-gray-600">
            Back to <Link className="text-primary-600 hover:text-primary-700 font-semibold transition-colors" to="/login">log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
