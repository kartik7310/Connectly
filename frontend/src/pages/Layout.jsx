// Layout.jsx
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify'
import Profile from "../services/profileService";
import { useDispatch,useSelector } from "react-redux";
import { addUser } from "../store/store-slices/userSlice";
import { useEffect } from "react";


export default function Layout() {
  const navigate = useNavigate()
   const dispatch = useDispatch()
   const user = useSelector((store=>store.user.user))
   console.log("user",user);
   
   const fetchUser = async()=>{
    try {
      const res = await Profile.getProfile()
      dispatch(addUser(res.data))
    } catch (error) {
      navigate("/login")
        toast.error(err.message);
    }
   }

   useEffect(()=>{
    if(!user){
        fetchUser()
    }
  
   },[])
  return (
    <div className="min-h-dvh flex flex-col">  
    
      <Navbar />

      <main className="flex-1">                
        <Outlet />
      </main>

      <Footer />
      <ToastContainer
                position="top-left"
                autoClose={5000}
                pauseOnHover
                theme="light"
            />
    </div>
  );
}
