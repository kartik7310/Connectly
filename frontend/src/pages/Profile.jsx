import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addUser } from "../store/store-slices/userSlice";
import Profile from "../services/profileService";

const EditProfile = () => {
  const user = useSelector((store) => store.user?.user);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset, formState:{errors,isSubmitting} } = useForm({
    defaultValues:{
      firstName:user?.firstName || "",
      lastName:user?.lastName || "",
      gender:user?.gender || "",
      photoUrl:user?.photoUrl || "",
      about:user?.about || "",
      age:user?.age ?? ""
    }
  });

  useEffect(()=>{ user && reset(user) },[user]);

  const onSubmit = async(values)=>{

    try{
      const payload = {
    ...values,
    age: values.age === "" ? undefined : Number(values.age)
  };
      const res = await Profile.updateProfile(payload);
      if(res?.data?.success){
        dispatch(addUser(res?.data));
        toast.success("Updated!");
        setIsEditing(false);
      }else toast.error("Failed updating");
    }catch(err){
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-base-900 text-white p-6">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-6">

        {/* left */}
        <div className="card bg-base-100 shadow p-6">
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-neutral text-neutral-content flex items-center justify-center">
              {user?.photoUrl ? <img src={user.photoUrl} className="object-cover w-full h-full"/> : user?.firstName?.[0]}
            </div>
            <h2 className="mt-3 font-bold text-xl">{user?.firstName} {user?.lastName}</h2>
            <p className="opacity-70 text-sm">{user?.email}</p>

            {!isEditing && (
              <button onClick={()=>setIsEditing(true)} className="btn btn-primary btn-block mt-4">
                Edit Profile
              </button>
            )}
         
          </div>
        </div>
        {/* Right */}
        <div className="lg:col-span-2 card bg-base-100 shadow p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <input className="input input-bordered w-full" placeholder="First Name" {...register("firstName")}/>
              <input className="input input-bordered w-full" placeholder="Last Name" {...register("lastName")}/>
              <input className="input input-bordered w-full" placeholder="Gender" {...register("gender")}/>
              <input className="input input-bordered w-full" type="number" placeholder="Age" {...register("age")}/>
              <input className="input input-bordered w-full" placeholder="Photo URL" {...register("photoUrl")}/>
              <textarea className="textarea textarea-bordered w-full" placeholder="About" rows="4" {...register("about")}/>

              <div className="flex gap-3 pt-2">
                <button disabled={isSubmitting} className="btn btn-primary flex-1">{isSubmitting?"Saving...":"Save"}</button>
                <button type="button" onClick={()=>setIsEditing(false)} className="btn btn-outline">Cancel</button>
              </div>
            </form>
          ) : (
            <div>
              <h2 className="font-bold text-xl mb-3">Details</h2>
              <p>First Name: {user?.firstName || "-"}</p>
              <p>Last Name: {user?.lastName || "-"}</p>
              <p>Gender: {user?.gender || "-"}</p>
              <p>about: {user?.about || "-"}</p>
              <p>Age: {user?.age || "-"}</p>
            </div>
            
          )}
        </div>
        
      </div>
    </div>
  );
};

export default EditProfile;
