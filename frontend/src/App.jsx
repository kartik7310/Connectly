import { BrowserRouter, Route, Routes } from "react-router-dom"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Body from "./pages/Layout"
import {store} from "./store/appStore"
import { Provider } from 'react-redux'
import Profile from "./pages/Profile"
import Feed from "./pages/feed"
import Connections from "./pages/Connections"
import ConnectionRequest from "./pages/ConnectionRequest"
import Premium from "./pages/premium"
import Chat from "./pages/Chat"
import Homepage from "./pages/landingPage"
import Blog from "./pages/blog"
import BlogDetails from "./pages/BlogDetails"
import WriteBlog from "./pages/WriteBlog"
import EditBlog from "./pages/EditBlog"
import PublicProfile from "./pages/PublicProfile"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import Success from "./pages/Success"
import Cancel from "./pages/Cancel"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
 return(
 <Provider store={store}>
   <BrowserRouter>
     <Routes>
       {/* Public routes - NO authentication needed */}
       <Route index element={<Homepage/>} />
       
       {/* Public routes - Redirect to /feed if already logged in */}
       <Route 
         path="login" 
         element={
           <ProtectedRoute isPublic={true}>
             <Login/>
           </ProtectedRoute>
         }
       />
       <Route 
         path="signup" 
         element={
           <ProtectedRoute isPublic={true}>
             <Signup/>
           </ProtectedRoute>
         }
       />
       <Route 
         path="forgot-password" 
         element={
           <ProtectedRoute isPublic={true}>
             <ForgotPassword/>
           </ProtectedRoute>
         }
       />
       <Route 
         path="reset-password" 
         element={
           <ProtectedRoute isPublic={true}>
             <ResetPassword/>
           </ProtectedRoute>
         }
       />

       {/* Protected routes - Require authentication */}
       <Route path="/" element={<ProtectedRoute><Body/></ProtectedRoute>}>
         <Route path="profile" element={<Profile/>}/>
         <Route path="profile/:identifier" element={<PublicProfile/>}/>
         <Route path="user/:identifier" element={<PublicProfile/>}/>
         <Route path="users/:identifier" element={<PublicProfile/>}/>
         <Route path="premium" element={<Premium/>}/>
         <Route path="feed" element={<Feed/>}/>
         <Route path="connections" element={<Connections/>}/>
         <Route path="chat/:targetUserId" element={<Chat/>}/>
         <Route path="request-connection" element={<ConnectionRequest/>}/>
         <Route path="blogs" element={<Blog/>}/>
         <Route path="blogs/write-blog" element={<WriteBlog/>}/>
         <Route path="blogs/edit-blog/:blogId" element={<EditBlog/>}/>
         <Route path="blogs/:blogId" element={<BlogDetails/>}/>
         <Route path="success" element={<Success/>}/>
         <Route path="cancel" element={<Cancel/>}/>
       </Route>
     </Routes>
   </BrowserRouter>
   
 </Provider>
 )
}

export default App