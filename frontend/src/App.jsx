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
import { Edit } from "lucide-react"
import EditBlog from "./pages/EditBlog"
function App() {
 return(
 <Provider store={store}>
   <BrowserRouter>
     <Routes>
     
         <Route index element={<Homepage/>} />
           <Route path="login" element={<Login/>}/>
         <Route path="signup" element={<Signup/>}/>
           <Route path="/" element={<Body/>}>
         <Route path="profile" element={<Profile/>}/>
         <Route path="premium" element={<Premium/>}/>
         <Route path="feed" element={<Feed/>}/>
         <Route path="connections" element={<Connections/>}/>
         <Route path="chat/:targetUserId" element={<Chat/>}/>
         <Route path="request-connection" element={<ConnectionRequest/>}/>
         <Route path="blogs" element={<Blog/>}/>
         <Route path="blogs/write-blog" element={<WriteBlog/>}/>
         <Route path="blogs/edit-blog/:blogId" element={<EditBlog/>}/>
         <Route path="blogs/:blogId" element={<BlogDetails/>}/>
       </Route>
     </Routes>
   </BrowserRouter>
 </Provider>
 )
}

export default App
