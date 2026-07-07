import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { addUser } from "../store/store-slices/userSlice";
import { validations } from "../utils/constants";
import { GoogleLogin } from "@react-oauth/google";
import Auth from "../services/authService";
import authSide from "../assets/auth_side.png";

export default function Login() {

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ mode: "onTouched" })
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onSubmit = async (values) => {
    try {
      const res = await Auth.loginAccount({ email: values.email, password: values.password });
      
      if (res?.data?.success) {
        dispatch(addUser(res.data.user));
        toast.success(res.data.message || "Logged in successfully");
        navigate("/feed", { replace: true })
      }
    } catch (err) {
      toast.error(err.message || "Login failed");
    }
  }


  const handleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse?.credential;
    
    if (!idToken) {
      toast.error("Google login failed: Missing credential token");
      return;
    }
    try {
      const response = await Auth.googleLoginAccount(idToken);
      dispatch(addUser(response.data.user));
      toast.success(response.data?.message || "Google login successful!");
      navigate("/feed", { replace: true });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Google login failed. Please try again.";
      toast.error(message);
    }
  };

  const handleError = () => {
    toast.error("Google login failed. Please try again.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white shadow-xl shadow-gray-200/50 rounded-2xl overflow-hidden border border-gray-100">

        {/* Left Side - Image */}
        <div className="hidden md:block relative h-full bg-gray-100">
          <img
            src={authSide}
            alt="Login Visual"
            className="w-full h-full object-cover absolute inset-0 opacity-90 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent flex flex-col justify-end p-10">
            <h2 className="text-3xl font-bold text-white mb-3">Welcome Back to Connexto</h2>
            <p className="text-gray-200 font-medium leading-relaxed">Join thousands of professionals building meaningful connections every day.</p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Log in to your account</h2>
            <p className="text-gray-500 text-sm">Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Email address</label>
              <input
                type="email"
                className={`w-full border rounded-lg px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow shadow-sm ${errors.email ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-primary-500"}`}
                {...register("email", validations.email)}
                placeholder="name@example.com"
              />
              {errors.email && <p className="text-sm text-red-500 mt-1.5 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-gray-700 block">Password</label>
                <Link to="/forgot-password" title="Forgot Password?" className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">Forgot password?</Link>
              </div>
              <input
                type="password"
                className={`w-full border rounded-lg px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow shadow-sm ${errors.password ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-primary-500"}`}
                {...register("password", validations.password)}
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-sm text-red-500 mt-1.5 font-medium">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 rounded-lg transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm mt-2"
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </button>
          </form>

          {/* OR Divider */}
          <div className="flex items-center my-8 gap-4">
            <span className="flex-grow h-px bg-gray-200"></span>
            <span className="text-gray-400 font-medium text-xs uppercase tracking-wider">Or continue with</span>
            <span className="flex-grow h-px bg-gray-200"></span>
          </div>

          {/* Google Login */}
          <div className="w-full flex justify-center">
            <GoogleLogin onSuccess={handleSuccess} onError={handleError} theme="outline" size="large" width="100%" />
          </div>

          <p className="text-sm text-center mt-8 text-gray-600">
            Don't have an account? <Link className="text-primary-600 hover:text-primary-700 font-semibold transition-colors" to="/signup">Sign up for free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
