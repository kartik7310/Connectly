// import React from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import Auth from "../services/authService"
// import { useDispatch, useSelector } from 'react-redux'
// import { toast } from 'react-toastify'
// import { removeUser } from '../store/store-slices/userSlice'
// import { Bell } from 'lucide-react'
// import { clearAllNotifications } from '../store/store-slices/notificationSlice'

// const Navbar = () => {
//   const user = useSelector((state) => state.user?.user)
//   console.log("navser", user);

//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const { notifications, unreadCount } = useSelector((state) => state.notification);

//   const handleLogout = async () => {
//     try {
//       await Auth.logout()
//       toast.success("Logged out");
//       dispatch(removeUser());
//       navigate("/login", { replace: true })
//     } catch (error) {
//       toast.error(error.message);
//     }
//   }
//   return (
//     <div>
//       <div className="navbar bg-base-300 shadow-sm">
//         <div className="flex-1">
//           <div className="btn btn-ghost text-xl">🧑‍💻Connexto</div>
//         </div>
//         <div className="flex gap-2">
//           <div className="flex gap-2">
//             <div className="dropdown dropdown-end mx-5">
//               {/* The Button/Trigger */}
//               <div
//                 tabIndex={0}
//                 role="button"
//                 className="indicator cursor-pointer hover:bg-base-200 p-2 rounded-full transition-colors"
//               >
//                 {unreadCount > 0 && (
//                   <span className="indicator-item badge badge-secondary badge-xs py-2 px-1.5">
//                     {unreadCount}
//                   </span>
//                 )}
//                 <Bell className="w-6 h-6" />
//               </div>

//               {/* The Dropdown Content */}
//               <div
//                 tabIndex={0}
//                 className="dropdown-content z-[1] card card-compact w-72 p-2 shadow bg-base-100 border border-base-100 mt-1"
//               >
//                 <div className="card-body">
//                   <div className="flex justify-between items-center">
//                     <h2 className="font-bold text-xl">Notifications</h2>
//                     {unreadCount > 0 && (
//                       <button
//                         className="text-xs text-primary hover:underline"
//                         onClick={() => dispatch(clearAllNotifications())}
//                       >
//                         Clear all
//                       </button>
//                     )}
//                   </div>
//                   <div className="divider my-0"></div>
//                   <div className="max-h-64 overflow-y-auto">
//                     {notifications.length === 0 ? (
//                       <p className="py-4 text-center text-gray-500">No new notifications</p>
//                     ) : (
//                       <ul className="py-2">
//                         {notifications.map((n, i) => (
//                           <li
//                             key={i}
//                             className="p-2 hover:bg-base-200 rounded-lg cursor-pointer flex gap-3 items-start border-b border-base-200 last:border-0"
//                             onClick={() => {
//                               navigate(`/chat/${n.senderId}`);
//                             }}
//                           >
//                             <img src={n.photoUrl || "/default.png"} alt="" className="w-8 h-8 rounded-full flex-shrink-0" />
//                             <div className="flex-1 min-w-0">
//                               <p className="text-sm font-semibold truncate">{n.firstName} {n.lastName}</p>
//                               <p className="text-xs text-gray-500 truncate">{n.text}</p>
//                             </div>
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                   </div>
//                   <Link to="/connections" className="text-primary hover:underline">View Connections</Link>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="dropdown dropdown-end mx-5">
//             <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
//               <div className="w-10 rounded-full">
//                 <img
//                   alt="Tailwind CSS Navbar component"
//                   src={user ? user?.photoUrl : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
//                 />
//               </div>
//             </div>

//             <ul
//               tabIndex="-1"
//               className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">

//               <li>
//                 <Link to="/profile" className="justify-between">
//                   Profile
//                   {user?.plan === "PREMIUM" ? (
//                     <span className="badge badge-primary">Premium</span>
//                   ) : (
//                     <span className="badge">New</span>
//                   )}
//                 </Link>
//               </li>
//               <li><Link to="/connections">Connections</Link></li>
//               <li><Link to="/feed">Feed</Link></li>
//               <li><Link to="/request-connection">Request</Link></li>
//               <li><Link to="/blogs">Blogs</Link></li>
//               <li><Link to="/premium">Premium</Link></li>
//               <li><button onClick={handleLogout}>Logout</button></li>{/* button is better here */}
//             </ul>

//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Navbar
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Auth from "../services/authService";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { removeUser } from "../store/store-slices/userSlice";
import { Bell, LogOut, Settings, User } from "lucide-react";
import { clearAllNotifications } from "../store/store-slices/notificationSlice";

const Navbar = () => {
  const user = useSelector((state) => state.user?.user);
  const { notifications, unreadCount } = useSelector(
    (state) => state.notification
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await Auth.logout();
      toast.success("Logged out successfully");
      dispatch(removeUser());
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="navbar bg-white border-b border-gray-200 px-4 sm:px-8 h-16 sticky top-0 z-50">
      {/* LEFT */}
      <div className="flex-1">
        <Link to="/feed" className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center">
            C
          </div>
          Connexto
        </Link>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* NOTIFICATION */}
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className="btn btn-ghost btn-circle relative text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Bell className="w-5 h-5" />

            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            )}
          </label>

          <div
            tabIndex={0}
            className="dropdown-content z-50 mt-3 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Notifications</h2>
              {unreadCount > 0 && (
                <button
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                  onClick={() => dispatch(clearAllNotifications())}
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-8 text-center flex flex-col items-center justify-center">
                  <Bell className="w-8 h-8 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">No new notifications</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {notifications.map((n, i) => (
                    <li
                      key={i}
                      onClick={() => navigate(`/chat/${n.senderId}`)}
                      className="px-4 py-3 flex gap-3 items-start hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <img
                        src={n.photoUrl || "/default.png"}
                        alt="user"
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0 bg-gray-100 border border-gray-200"
                      />
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {n.firstName} {n.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {n.text}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="p-3 text-center border-t border-gray-100 bg-gray-50">
              <Link
                to="/connections"
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                View all connections
              </Link>
            </div>
          </div>
        </div>

        {/* PROFILE */}
        <div className="dropdown dropdown-end ml-1">
          <label
            tabIndex={0}
            className="btn btn-ghost btn-circle avatar hover:ring-2 hover:ring-gray-200 transition-all"
          >
            <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200">
              <img
                src={
                  user?.photoUrl ||
                  "https://ui-avatars.com/api/?name=" + (user?.firstName || "U") + "&background=0D8ABC&color=fff"
                }
                alt="profile"
                className="object-cover"
              />
            </div>
          </label>

          <ul className="menu menu-sm dropdown-content bg-white rounded-xl z-50 mt-3 w-56 p-2 shadow-lg border border-gray-200 text-gray-700">
            <li className="px-3 py-2 mb-2 border-b border-gray-100">
              <div className="flex flex-col gap-1 items-start cursor-default hover:bg-transparent px-0">
                <span className="font-semibold text-gray-900">{user?.firstName || 'User'}</span>
                {user?.plan === "PREMIUM" ? (
                  <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">Premium Member</span>
                ) : (
                  <span className="text-xs text-gray-500">Free Plan</span>
                )}
              </div>
            </li>

            <li><Link to="/profile" className="hover:bg-gray-50 hover:text-gray-900 py-2"><User className="w-4 h-4 mr-2" />Profile</Link></li>
            <li><Link to="/feed" className="hover:bg-gray-50 hover:text-gray-900 py-2">Feed</Link></li>
            <li><Link to="/connections" className="hover:bg-gray-50 hover:text-gray-900 py-2">Connections</Link></li>
            <li><Link to="/request-connection" className="hover:bg-gray-50 hover:text-gray-900 py-2">Requests</Link></li>
            <li><Link to="/blogs" className="hover:bg-gray-50 hover:text-gray-900 py-2">Blogs</Link></li>
            <li><Link to="/premium" className="hover:bg-gray-50 hover:text-gray-900 py-2">Upgrade to Premium</Link></li>

            <div className="divider my-1 h-px bg-gray-100"></div>

            <li>
              <button onClick={handleLogout} className="text-red-600 hover:bg-red-50 hover:text-red-700 py-2 font-medium">
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
