import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addUser } from "../store/store-slices/userSlice";
import ProfileService from "../services/profileService";
import { User, Mail, Calendar, Info, Camera, Edit3, Save, X, ShieldCheck } from "lucide-react";

const EditProfile = () => {
  const user = useSelector((store) => store.user?.user);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      gender: user?.gender || "",
      photoUrl: user?.photoUrl || "",
      about: user?.about || "",
      age: user?.age ?? ""
    }
  });

  useEffect(() => { user && reset(user) }, [user, reset]);

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        age: values.age === "" ? undefined : Number(values.age)
      };
      const res = await ProfileService.updateProfile(payload);
      if (res?.data?.success) {
        dispatch(addUser(res?.data));
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 text-gray-900 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              My Profile
            </h1>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">Manage your personal information and preferences.</p>
          </div>
          {user?.plan === "PREMIUM" && (
            <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-200 rounded-full text-primary-700 font-semibold text-sm shadow-sm w-fit">
              <ShieldCheck size={18} />
              Premium Member
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar / Photo Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm relative overflow-hidden group text-center flex flex-col items-center">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <User size={120} />
              </div>

              <div className="relative z-10 w-full flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100 flex items-center justify-center relative group-hover:shadow-lg transition-shadow">
                  {user?.photoUrl ? (
                    <img src={user.photoUrl} alt="Profile" className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-4xl font-bold text-gray-400">{user?.firstName?.[0]}</span>
                  )}
                </div>

                <div className="mt-6 w-full">
                  <h2 className="text-2xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h2>
                  <p className="text-primary-600 font-medium flex items-center justify-center gap-2 mt-1 text-sm">
                    <Mail size={16} />
                    {user?.email}
                  </p>
                </div>

                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full mt-8 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-medium py-2.5 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <Edit3 size={18} />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Info size={18} className="text-primary-600" />
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl text-center">
                  <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Age</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{user?.age || "-"}</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl text-center">
                  <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Gender</p>
                  <p className="text-xl font-bold text-gray-900 mt-1 capitalize">{user?.gender || "-"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Info Card */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm h-full">
              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                    <Edit3 className="text-primary-600" />
                    Edit Personal Information
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">First Name</label>
                      <input className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow shadow-sm" placeholder="First Name" {...register("firstName")} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Last Name</label>
                      <input className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow shadow-sm" placeholder="Last Name" {...register("lastName")} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Gender</label>
                      <select className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow shadow-sm" {...register("gender")}>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Age</label>
                      <input className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow shadow-sm" type="number" placeholder="Age" {...register("age")} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Photo URL</label>
                    <div className="relative">
                      <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input className="w-full bg-white border border-gray-300 rounded-lg pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow shadow-sm" placeholder="https://example.com/photo.jpg" {...register("photoUrl")} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">About Myself</label>
                    <textarea className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow shadow-sm resize-none" placeholder="Tell us about yourself..." rows="4" {...register("about")} />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100 mt-8">
                    <button disabled={isSubmitting} className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70">
                      <Save size={18} />
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                    <button type="button" onClick={() => setIsEditing(false)} className="px-6 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-medium py-2.5 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2">
                      <X size={18} />
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
                    <Info className="text-primary-600" />
                    Personal Information
                  </h2>

                  <div className="grid md:grid-cols-2 gap-y-8 gap-x-12">
                    <div className="space-y-8">
                      <div>
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">First Name</p>
                        <p className="text-lg text-gray-900 font-medium">{user?.firstName || "-"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Gender</p>
                        <p className="text-lg text-gray-900 font-medium capitalize">{user?.gender || "-"}</p>
                      </div>
                    </div>
                    <div className="space-y-8">
                      <div>
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Last Name</p>
                        <p className="text-lg text-gray-900 font-medium">{user?.lastName || "-"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Age</p>
                        <p className="text-lg text-gray-900 font-medium">{user?.age || "-"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12">
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Edit3 size={16} />
                      About Me
                    </p>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        {user?.about || <span className="italic text-gray-400">No description provided.</span>}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
