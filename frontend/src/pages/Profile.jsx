import React from 'react'
import { useSelector } from "react-redux";
import UpdateProfile from '../components/EditProfile';
const editProfile = () => {
  const user = useSelector((store)=>store.user.user)
  return (
    <div>
      <UpdateProfile user={user}/>
    </div>
  )
}

export default editProfile
