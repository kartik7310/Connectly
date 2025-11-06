import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Auth from "../services/authService"
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { removeUser } from '../store/store-slices/userSlice'
const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogout = async()=>{
   try {
     await Auth.logout()
       toast.success( "Logged out");
  dispatch(removeUser());
  navigate("/login",{replace:true})
   } catch (error) {
     toast.error(error.message);
   }
  }
  return (
    <div>
      <div className="navbar bg-base-300 shadow-sm">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">🧑‍💻Connectly</Link>
        </div>
        <div className="flex gap-2">

          <div className="dropdown dropdown-end mx-5">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>

            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">

              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>

              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/connections">Connections</Link></li>
              <li><Link to="/request-connection">Request</Link></li>
               <li><button onClick={handleLogout}>Logout</button></li>{/* button is better here */}
            </ul>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
