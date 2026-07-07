import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addUser } from "../store/store-slices/userSlice";
import Auth from "../services/authService";
import { GoogleLogin } from "@react-oauth/google";
import authSide from "../assets/auth_side.png";

export default function Signup() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onTouched" });

  const email = watch("email");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Signup submit
  const onSubmit = async (values) => {
    try {
      const res = await Auth.createAccount({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        age: values.age,
        otp: values.otp,
      });

      if (res?.data?.success) {
        toast.success(res.data.message || "Account created successfully");
        navigate("/login", { replace: true });
      } else {
        toast.error(res?.data?.message || "Could not create account");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong"
      );
    }
  };

  const handleSendOtp = async (email) => {
    if (!email) {
      toast.error("Please enter email first");
      return;
    }

    try {
      const res = await Auth.sendOtp({ email });
      if (res?.data?.success) {
        toast.success(res.data.message || "OTP sent successfully");
      } else {
        toast.error(res?.data?.message || "Could not send OTP");
      }
    } catch (err) {
      toast.error("Failed to send OTP");
    }
  };

  // ✅ Google signup
  const handleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse?.credential;
    if (!idToken) {
      toast.error("Google login failed");
      return;
    }

    try {
      const res = await Auth.googleLoginAccount(idToken);
      dispatch(addUser(res.data.user));
      toast.success(res.data?.message || "Signup successful");
      navigate("/feed", { replace: true });
    } catch (err) {
      toast.error("Google signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white shadow-xl shadow-gray-200/50 rounded-2xl overflow-hidden border border-gray-100">

        {/* Left Image */}
        <div className="hidden md:block relative bg-gray-100">
          <img
            src={authSide}
            alt="Signup Visual"
            className="w-full h-full object-cover absolute inset-0 opacity-90 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent flex flex-col justify-end p-10">
            <h2 className="text-3xl font-bold text-white mb-3">Join Connexto Today</h2>
            <p className="text-gray-200 font-medium leading-relaxed">Start building intentional professional relationships in a clean, secure environment.</p>
          </div>
        </div>

        {/* Form */}
        <div className="p-8 sm:p-12 w-full flex flex-col justify-center">
          
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-primary-600 font-bold text-xl tracking-tight mb-8">
              <div className="w-6 h-6 rounded bg-primary-600 text-white flex items-center justify-center text-xs">
                C
              </div>
              Connexto
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Create an account</h2>
            <p className="text-gray-500 text-sm">Join us and start your journey.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">First name</label>
                <input
                  className={`w-full border rounded-lg px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow shadow-sm ${errors.firstName ? "border-red-300 focus:border-red-500" : "border-gray-300"}`}
                  placeholder="John"
                  {...register("firstName", { required: "First name required" })}
                />
                {errors.firstName && <p className="text-sm text-red-500 mt-1.5 font-medium">{errors.firstName.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Last name</label>
                <input
                  className={`w-full border rounded-lg px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow shadow-sm ${errors.lastName ? "border-red-300 focus:border-red-500" : "border-gray-300"}`}
                  placeholder="Doe"
                  {...register("lastName", { required: "Last name required" })}
                />
                {errors.lastName && <p className="text-sm text-red-500 mt-1.5 font-medium">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Email address</label>
                <input
                  type="email"
                  className={`w-full border rounded-lg px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow shadow-sm ${errors.email ? "border-red-300 focus:border-red-500" : "border-gray-300"}`}
                  placeholder="name@example.com"
                  {...register("email", { required: "Email required" })}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1.5 font-medium">{errors.email.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Age</label>
                <input
                  type="number"
                  className={`w-full border rounded-lg px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow shadow-sm ${errors.age ? "border-red-300 focus:border-red-500" : "border-gray-300"}`}
                  placeholder="18"
                  {...register("age", { required: "Age required" })}
                />
                {errors.age && <p className="text-sm text-red-500 mt-1.5 font-medium">{errors.age.message}</p>}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Password</label>
              <input
                type="password"
                className={`w-full border rounded-lg px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow shadow-sm ${errors.password ? "border-red-300 focus:border-red-500" : "border-gray-300"}`}
                placeholder="Create a strong password"
                {...register("password", { required: "Password required" })}
              />
              {errors.password && <p className="text-sm text-red-500 mt-1.5 font-medium">{errors.password.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Verification code (OTP)</label>
              <div className="flex gap-3">
                <input
                  className={`flex-1 border rounded-lg px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow shadow-sm ${errors.otp ? "border-red-300 focus:border-red-500" : "border-gray-300"}`}
                  placeholder="Enter 6-digit OTP"
                  {...register("otp", { required: "OTP required" })}
                />
                <button
                  type="button"
                  onClick={() => handleSendOtp(email)}
                  className="bg-primary-50 text-primary-700 hover:bg-primary-100 font-medium px-4 py-2.5 rounded-lg border border-primary-200 transition-colors whitespace-nowrap"
                >
                  Get OTP
                </button>
              </div>
              {errors.otp && <p className="text-sm text-red-500 mt-1.5 font-medium">{errors.otp.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 rounded-lg transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm mt-4"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* OR Divider */}
          <div className="flex items-center my-8 gap-4">
            <span className="flex-grow h-px bg-gray-200"></span>
            <span className="text-gray-400 font-medium text-xs uppercase tracking-wider">Or continue with</span>
            <span className="flex-grow h-px bg-gray-200"></span>
          </div>
          
          {/* Google */}
          <div className="flex justify-center w-full">
            <GoogleLogin onSuccess={handleSuccess} onError={() => toast.error("Google login failed")} theme="outline" size="large" width="100%" />
          </div>

          <p className="text-center text-gray-600 mt-8 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
