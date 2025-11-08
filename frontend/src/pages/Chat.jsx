
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../webSocket/socket";
import { useSelector } from "react-redux";

const Chat = () => {
  const userData = useSelector((store) => store.user.user);

  const {_id:userId,firstName} = userData
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([
    { role: "system", chat: `this is chat page ${targetUserId}` },
    { role: "user", chat: `this is chat page ${targetUserId}` },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const endRef = useRef(null);

  const handleSend = () => {
    const text = inputMessage.trim();
    if (!text) return;
    const socket = createSocketConnection();
    socket.emit("send-message",{
      firstName,
      userId,
      targetUserId,
      text,
    })
  };
 
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);
 
  useEffect(()=>{
     if(!userId && !targetUserId) return
    //as page load socket connection stable
   const socket = createSocketConnection();
   socket.emit("joinChat",{userId,targetUserId,firstName});


    socket.on("receiveMessage",({firstName,text})=>{
    console.log(firstName,":" ,text);
    
  })
   //disconnect connection when component unmount
   return ()=>{
    socket.disconnect();
   }
  },[userId,targetUserId])
  return (
    <div className="w-full">
   
      <div className="mx-auto max-w-3xl px-3 sm:px-4 lg:px-0 flex flex-col h-[calc(100vh-160px)]">

        <div className="flex-1 overflow-y-auto overscroll-contain rounded-md sm:rounded-xl border border-gray-700  bg-gray-800/40 p-3 sm:p-5 text-gray-100 space-y-3 sm:space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] sm:max-w-[75%] w-fit rounded-2xl px-4 py-2 text-sm sm:text-base leading-relaxed
                ${m.role === "user" ? "ml-auto bg-blue-600/80" : "bg-gray-900/80"}`}
            >
              {m.chat}
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="sticky bottom-0 left-0 right-0 mt-3 sm:mt-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Message…"
              aria-label="Type your message"
              className="flex-1 rounded-xl bg-gray-900 border border-gray-700 px-3 sm:px-4 py-3 text-gray-100
                         outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              onClick={handleSend}
              disabled={!inputMessage.trim()}
              className="shrink-0 rounded-xl px-4 sm:px-6 py-3 font-semibold text-white
                         bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Send
            </button>
          </div>
          <div style={{ paddingBottom: "env(safe-area-inset-bottom)" }} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
