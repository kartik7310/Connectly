import { Server } from "socket.io";
import { secretRoomId } from "../utils/roomSecret.js";



 const intitlizeSocket = (server) =>{

  const io = new Server(server,{
    cors:{
      origin:"http://localhost:5173",
      credentials:true
    }
  })

  io.on("connection",(socket)=>{

    //handle events
    socket.on("joinChat",({userId,targetUserId,firstName})=>{
    // const roomId = [userId,targetUserId].sort().join("_");
   const roomId =  secretRoomId({userId,targetUserId})
    console.log(`${firstName} join the room with id ${roomId}`);
    
     socket.join(roomId)
     
    })
    socket.on("send-message",({firstName,userId,targetUserId,text})=>{
       const roomId = secretRoomId({userId,targetUserId})
       console.log(firstName + " " + text);
       
        io.to(roomId).emit("receiveMessage",{firstName,text })

    })
    socket.on("disconnect",()=>{

    })
  })

}

export default intitlizeSocket