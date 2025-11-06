import React from "react";
import connectionService from "../services/connectionService";
import { useDispatch } from "react-redux";
import { removeFeed } from "../store/store-slices/feedSlice";
import { toast } from "react-toastify";
const UserCard = ({ user }) => {
  if (!user) return null;

  const {_id,firstName, lastName, about, photoUrl } = user;

   const handleIgnore = async(status,userId)=>{
    try {

      const res = await connectionService.sendConnectionRequest({status,userId})
      useDispatch(removeFeed(userId))
      toast.success("request send")
    } catch (error) {
       console.log("Error accepting request:", error);
             toast.error('Failed to accept request');
    }
   }

   const handleInterested = async(status,userId)=>{
    try {
      const res = await connectionService.sendConnectionRequest({status,userId})
      useDispatch(removeFeed(userId))
      toast.success("request send")
    } catch (error) {
       console.log("Error accepting request:", error);
             toast.error('Failed to accept request');
    }
   }
  return (
    <div className="card bg-base-100 w-70 shadow-xl border border-base-200 hover:shadow-xl m-5 hover:scale-[1.01] transition duration-200 cursor-pointer rounded-2xl">
      <figure className="h-56 overflow-hidden rounded-t-2xl p-4">
        <img src={photoUrl} alt="user" className="object-cover w-full h-full" />
      </figure>

      <div className="card-body space-y-2">
        <h2 className="card-title text-lg font-semibold">
          {firstName} {lastName}
        </h2>

        <p className="text-sm text-base-content/70 line-clamp-2">{about}</p>

       <div className="card-actions justify-between pt-2">
  <button className="btn btn-sm btn-error btn-outline rounded-full" onClick={()=>handleIgnore("ignored",_id)}>Ignore</button>
  <button className="btn btn-sm btn-success rounded-full" onClick={()=>handleInterested("interested",_id)}>Interested</button>
</div>
      </div>
    </div>
  );
};

export default UserCard;
