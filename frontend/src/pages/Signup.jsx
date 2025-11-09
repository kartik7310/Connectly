import React from "react";
import { useForm } from "react-hook-form";

import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import Auth from "../services/authService";
import { GoogleLogin } from "@react-oauth/google";
export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onTouched" });


  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      // values: { firstName, lastName, email, password, age }
      const res = await Auth.createAccount({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        age: Number(values.age),
      });

      // keep same pattern as your Login (res?.data?.success)
      if (res?.data?.success) {
        toast.success(res.data.message || "Account created");
        navigate("/login", { replace: true });
      } else {
        toast.error(res?.data?.message || "Could not create account");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Something went wrong"
      );
    }
  };

    const handleSuccess = async (credentialResponse) => {
      const idToken = credentialResponse?.credential;
   
      
      if (!idToken) {
        toast.error("Google login failed: Missing credential token");
        return;
      }
      try {
      
        const response = await Auth.googleLoginAccount(idToken);
        console.log("res", response);
        toast.success(response.data?.message || "Google signup successful!");
        navigate("/feed", { replace: true });
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Google signup failed. Please try again.";
        toast.error(message);
        console.error("signup failed:", error);
      }
    };
  
    const handleError = () => {
      toast.error("Google signup failed. Please try again.");
      console.error("Google signup failed");
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-900">
      <div className="bg-base-500 shadow-lg rounded-xl p-6 w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-6">Create account</h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* First Name */}
          <div className="mb-4">
            <label className="text-sm font-medium block mb-1">First Name</label>
            <input
              type="text"
              className={`w-full border rounded-xl px-3 py-2 ${
                errors.firstName ? "border-red-500" : "border-slate-300"
              }`}
              {...register("firstName", {
                required: "First name is required",
                minLength: { value: 2, message: "Minimum 2 characters" },
                maxLength: { value: 50, message: "Maximum 50 characters" },
              })}
            />
            {errors.firstName && (
              <p className="text-sm text-red-600 mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label className="text-sm font-medium block mb-1">Last Name</label>
            <input
              type="text"
              className={`w-full border rounded-xl px-3 py-2 ${
                errors.lastName ? "border-red-500" : "border-slate-300"
              }`}
              {...register("lastName", {
                required: "Last name is required",
                minLength: { value: 2, message: "Minimum 2 characters" },
                maxLength: { value: 50, message: "Maximum 50 characters" },
              })}
            />
            {errors.lastName && (
              <p className="text-sm text-red-600 mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="text-sm font-medium block mb-1">Email</label>
            <input
              type="email"
              className={`w-full border rounded-xl px-3 py-2 ${
                errors.email ? "border-red-500" : "border-slate-300"
              }`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value:
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Email is not valid",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="text-sm font-medium block mb-1">Password</label>
            <input
              type="password"
              className={`w-full border rounded-xl px-3 py-2 ${
                errors.password ? "border-red-500" : "border-slate-300"
              }`}
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                  message:
                    "Min 8 chars, 1 uppercase, 1 lowercase, 1 number",
                },
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Age */}
          <div className="mb-4">
            <label className="text-sm font-medium block mb-1">Age</label>
            <input
              type="number"
              className={`w-full border rounded-xl px-3 py-2 ${
                errors.age ? "border-red-500" : "border-slate-300"
              }`}
              {...register("age", {
                required: "Age is required",
                valueAsNumber: true,
                min: { value: 13, message: "Minimum age is 13" },
                max: { value: 120, message: "Maximum age is 120" },
              })}
            />
            {errors.age && (
              <p className="text-sm text-red-600 mt-1">
                {errors.age.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 text-white py-2 rounded-xl mt-2 disabled:opacity-60"
          >
            {isSubmitting ? "Creating..." : "Sign up"}
          </button>
        </form>
                     {/* OR Divider */}
                 <div className="flex items-center my-6 gap-4">
                   <span className="flex-grow h-px bg-indigo-700"></span>
                   <span className="text-indigo-400 font-semibold">OR</span>
                   <span className="flex-grow h-px bg-indigo-700"></span>
                 </div>
         
                 {/* Google Login */}
         <div className="w-full flex justify-center">
           <GoogleLogin
             onSuccess={handleSuccess}
             onError={handleError}
             size="medium"
             type="standard"
             shape="rectangular"
             theme="filled_blue"
           />
         </div>
        <p className="text-sm text-center mt-3">
          Already have an account?{" "}
          <Link className="text-blue-600" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
