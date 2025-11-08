import crypto from "crypto";

export const  secretRoomId = ({userId,targetUserId})=>{
  const roomId = [userId,targetUserId].sort().join("_");
   return crypto.createHash("sha256").update(roomId).digest("hex")

}