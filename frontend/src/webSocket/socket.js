import { io } from "socket.io-client";
import { baseUrl } from "../utils/constants";
export const createSocketConnection = ()=>{
 return io("http://localhost:5000")
}