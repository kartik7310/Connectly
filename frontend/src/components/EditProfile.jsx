
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addUser } from "../store/store-slices/userSlice";
import Profile from "../services/profileService";

const EditProfile = () => {
  const user = useSelector((store) => store.user.user);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      gender: user?.gender || "",
      photoUrl: user?.photoUrl || "",
      about: user?.about || "",
      age: user?.age ?? "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        gender: user.gender || "",
        photoUrl: user.photoUrl || "",
        about: user.about || "",
        age: user.age ?? "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        age:
          values.age === "" || values.age === undefined
            ? undefined
            : Number(values.age),
      };

      const res = await Profile.updateProfile(payload);
      if (res?.data?.success) {
        dispatch(addUser(res?.data));
        toast.success("Profile updated successfully");
        setIsEditing(false);
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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(onSubmit)(e);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">View and manage your profile information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card - Left Side */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-xl rounded-2xl p-6 sticky top-8">
              <div className="flex flex-col items-center">
                {/* Profile Picture */}
                <div className="w-32 h-32 mb-4 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-lg">
                  {user.photoUrl ? (
                    <img
                      src={user.photoUrl}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-white">
                      {user.firstName?.[0]?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>

                {/* Name */}
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-1">
                  {user.firstName} {user.lastName}
                </h2>

                {/* Age & Gender */}
                <div className="flex gap-2 mb-4">
                  {user.age && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {user.age} years
                    </span>
                  )}
                  {user.gender && (
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                      {user.gender}
                    </span>
                  )}
                </div>

                {/* About */}
                {user.about && (
                  <div className="w-full mt-4 p-4 bg-gray-50 rounded-xl">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      About Me
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {user.about}
                    </p>
                  </div>
                )}

                {/* Edit Button */}
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-6 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Edit Form - Right Side */}
          <div className="lg:col-span-2">
            {isEditing ? (
              <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Edit Profile
                  </h2>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>

                <div onSubmit={handleFormSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                          errors.firstName
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        {...register("firstName", {
                          minLength: {
                            value: 2,
                            message: "Minimum 2 characters",
                          },
                          maxLength: {
                            value: 100,
                            message: "Maximum 100 characters",
                          },
                        })}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                          errors.lastName ? "border-red-500" : "border-gray-300"
                        }`}
                        {...register("lastName", {
                          minLength: {
                            value: 2,
                            message: "Minimum 2 characters",
                          },
                          maxLength: {
                            value: 100,
                            message: "Maximum 100 characters",
                          },
                        })}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">
                        Gender
                      </label>
                      <input
                        type="text"
                        className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                          errors.gender ? "border-red-500" : "border-gray-300"
                        }`}
                        {...register("gender", {
                          validate: (v) => {
                            if (!v) return true;
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

                    {/* Age */}
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                          errors.age ? "border-red-500" : "border-gray-300"
                        }`}
                        {...register("age", {
                          validate: (v) => {
                            if (v === "" || v === undefined) return true;
                            const n = Number(v);
                            if (!Number.isFinite(n))
                              return "Age must be a number";
                            if (n < 0) return "Age cannot be negative";
                            if (n > 120) return "Age is too high";
                          },
                        })}
                      />
                      {errors.age && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.age.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Photo URL - Full Width */}
                  <div className="mt-4">
                    <label className="text-sm font-semibold text-gray-700 block mb-2">
                      Photo URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.photoUrl ? "border-red-500" : "border-gray-300"
                      }`}
                      {...register("photoUrl", {
                        validate: (v) => {
                          if (!v) return true;
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

                  {/* About - Full Width */}
                  <div className="mt-4">
                    <label className="text-sm font-semibold text-gray-700 block mb-2">
                      About Me
                    </label>
                    <textarea
                      rows="4"
                      placeholder="Tell us about yourself..."
                      className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
                        errors.about ? "border-red-500" : "border-gray-300"
                      }`}
                      {...register("about", {
                        maxLength: {
                          value: 500,
                          message: "Maximum 500 characters",
                        },
                      })}
                    />
                    {errors.about && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.about.message}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={handleFormSubmit}
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        reset();
                      }}
                      className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Profile Details View
              <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Profile Details
                </h2>

                <div className="space-y-4">
                  <div className="flex border-b pb-4">
                    <div className="w-1/3">
                      <p className="text-sm font-semibold text-gray-500">
                        First Name
                      </p>
                    </div>
                    <div className="w-2/3">
                      <p className="text-gray-800 font-medium">
                        {user.firstName || "Not set"}
                      </p>
                    </div>
                  </div>

                  <div className="flex border-b pb-4">
                    <div className="w-1/3">
                      <p className="text-sm font-semibold text-gray-500">
                        Last Name
                      </p>
                    </div>
                    <div className="w-2/3">
                      <p className="text-gray-800 font-medium">
                        {user.lastName || "Not set"}
                      </p>
                    </div>
                  </div>

                  <div className="flex border-b pb-4">
                    <div className="w-1/3">
                      <p className="text-sm font-semibold text-gray-500">
                        Gender
                      </p>
                    </div>
                    <div className="w-2/3">
                      <p className="text-gray-800 font-medium">
                        {user.gender || "Not set"}
                      </p>
                    </div>
                  </div>

                  <div className="flex border-b pb-4">
                    <div className="w-1/3">
                      <p className="text-sm font-semibold text-gray-500">Age</p>
                    </div>
                    <div className="w-2/3">
                      <p className="text-gray-800 font-medium">
                        {user.age || "Not set"}
                      </p>
                    </div>
                  </div>

                  <div className="flex border-b pb-4">
                    <div className="w-1/3">
                      <p className="text-sm font-semibold text-gray-500">
                        Email
                      </p>
                    </div>
                    <div className="w-2/3">
                      <p className="text-gray-800 font-medium">
                        {user.email || "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;