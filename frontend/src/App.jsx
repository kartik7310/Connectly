
import { BrowserRouter, Route, Router, Routes } from "react-router-dom"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Body from "./pages/Layout"
import {store} from "./store/appStore"
import { Provider } from 'react-redux'
import Profile from "./pages/Profile"
import Feed from "./pages/feed"
import Connections from "./pages/Connections"
import ConnectionRequest from "./pages/ConnectionRequest"

function App() {
 return(
 <>
 <Provider store={store}>


 <BrowserRouter basename="/">
  <Routes>
    <Route path="/" element={<Body/>}>
    <Route path="/login" element={<Login/>}/>
    <Route path="/signup" element={<Signup/>}/>
    <Route path="/profile" element={<Profile/>}/>
    <Route path="/feed" element={<Feed/>}/>
    <Route path="/connections" element={<Connections/>}/>
    <Route path="/request-connection" element={<ConnectionRequest/>}/>
    </Route>
  </Routes>
 </BrowserRouter>
  </Provider>
 </>
 )
}

export default App
