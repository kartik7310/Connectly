import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
// import your profile service that calls PATCH /profile
import Profile from "../services/profileService"
import UserCard from "./UserCard";
import { useDispatch } from "react-redux";
import { addUser } from "../store/store-slices/userSlice";

export default function UpdateProfile({ user }) {
 const dispatch = useDispatch()
 
  if (!user) return null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      gender: user.gender || "",
      photoUrl: user.photoUrl || "",
      about: user.about || "",
      age: user.age ?? "",
    },
  });

  // keep form in sync if user changes
  useEffect(() => {
    reset({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      gender: user.gender || "",
      photoUrl: user.photoUrl || "",
      about: user.about || "",
      age: user.age ?? "",
    });
  }, [user, reset]);

  const onSubmit = async (values) => {
    try {
      // coerce age if provided
      const payload = {
        ...values,
        age:
          values.age === "" || values.age === undefined
            ? undefined
            : Number(values.age),
      };

      const res = await Profile.updateProfile(payload);
      if (res?.data?.success) {
        console.log("update",res?.data);
        
        dispatch(addUser(res?.data))
        toast.success("Profile updated");
      } else {
        toast.error(res?.data?.message || "Update failed");
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

  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-base-200 m-2">
      <div className="bg-base-100 shadow-lg rounded-xl p-6 w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-6">Update Profile</h2>

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
                minLength: { value: 2, message: "Minimum 2 characters" },
                maxLength: { value: 100, message: "Maximum 100 characters" },
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
                minLength: { value: 2, message: "Minimum 2 characters" },
                maxLength: { value: 100, message: "Maximum 100 characters" },
              })}
            />
            {errors.lastName && (
              <p className="text-sm text-red-600 mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* Gender */}
          <div className="mb-4">
            <label className="text-sm font-medium block mb-1">Gender</label>
            <input
              type="text"
              className={`w-full border rounded-xl px-3 py-2 ${
                errors.gender ? "border-red-500" : "border-slate-300"
              }`}
              {...register("gender", {
                validate: (v) => {
                  if (!v) return true; // optional
                  if (v.length < 2) return "Minimum 2 characters";
                  if (v.length > 100) return "Maximum 100 characters";
                },
              })}
            />
            {errors.gender && (
              <p className="text-sm text-red-600 mt-1">
                {errors.gender.message}
              </p>
            )}
          </div>

          {/* Photo URL */}
          <div className="mb-4">
            <label className="text-sm font-medium block mb-1">Photo URL</label>
            <input
              type="url"
              className={`w-full border rounded-xl px-3 py-2 ${
                errors.photoUrl ? "border-red-500" : "border-slate-300"
              }`}
              {...register("photoUrl", {
                validate: (v) => {
                  if (!v) return true; // optional
                  try {
                    new URL(v);
                    return true;
                  } catch {
                    return "Invalid URL";
                  }
                },
              })}
            />
            {errors.photoUrl && (
              <p className="text-sm text-red-600 mt-1">
                {errors.photoUrl.message}
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
                validate: (v) => {
                  if (v === "" || v === undefined) return true; // optional
                  const n = Number(v);
                  if (!Number.isFinite(n)) return "Age must be a number";
                  if (n < 0) return "Age cannot be negative";
                  if (n > 120) return "Age is too high";
                },
              })}
            />
            {errors.age && (
              <p className="text-sm text-red-600 mt-1">{errors.age.message}</p>
            )}
          </div>

          {/* About */}
          <div className="mb-4">
            <label className="text-sm font-medium block mb-1">About</label>
            <input
              className={`w-full border rounded-xl px-3 py-2 ${
                errors.about ? "border-red-500" : "border-slate-300"
              }`}
              {...register("about", {
                maxLength: { value: 500, message: "Maximum 500 characters" },
              })}
            />
            {errors.about && (
              <p className="text-sm text-red-600 mt-1">
                {errors.about.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn btn-primary rounded-xl mt-2 disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
        <UserCard user={{firstName:user?.firstName,lastName:user?.lastName,image:user?.photoUrl}}/>
    </div>
  
    </>
  );
}
