import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { addUser } from "../store/store-slices/userSlice";
import { validations } from "../utils/constants";

import Auth from "../services/authService";

export default function Login() {

  const { register, handleSubmit, formState:{errors,isSubmitting} } = useForm({ mode:"onTouched" })
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onSubmit = async(values) => {
    try {
      const res = await Auth.loginAccount({ email: values.email, password: values.password });
      console.log("res",res);
      
     if(res?.data?.success){
       dispatch(addUser(res.data.user));
      toast.success(res.message || "Logged in");
      navigate("/feed", { replace:true })
     }
    } catch(err){
        toast.error(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-900">
      <div className="bg-base-500 shadow-lg rounded-xl p-6 w-full max-w-sm">

        <h2 className="text-2xl font-semibold mb-6">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>

          <div className="mb-4">
            <label className="text-sm font-medium block mb-1">Email</label>
            <input 
              type="email"
              className={`w-full border rounded-xl px-3 py-2 ${errors.email ? "border-red-500" : "border-slate-300"}`}
              {...register("email", validations.email)}
            />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium block mb-1">Password</label>
            <input 
              type="password"
              className={`w-full border rounded-xl px-3 py-2 ${errors.password ? "border-red-500" : "border-slate-300"}`}
              {...register("password", validations.password)}
            />
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 text-white py-2 rounded-xl mt-2 disabled:opacity-60"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center mt-3">
          New user? <Link className="text-blue-600" to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  )
}
