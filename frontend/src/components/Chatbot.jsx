import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, MessageSquare, X, Minus, ShieldCheck } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { baseUrl, isUserPremium } from "../utils/constants";

export default function Chatbot() {
  const user = useSelector((state) => state.user?.user);
  const isPremium = isUserPremium(user);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "assistant",
      content: "Hi, I’m Connexto. Ask me about your connections and blogs.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isTyping || !isPremium) return;

    const userMsg = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post(
        `${baseUrl}/chat/assistant`,
        {
          message: userMsg.content,
          history: updatedMessages.slice(-4).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        },
        { withCredentials: true }
      );

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: res.data.data,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 md:right-10 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="-mb-3 w-[340px] sm:w-[380px] h-[450px] bg-white border border-gray-200 shadow-2xl rounded-3xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between bg-primary-600 text-white px-6 py-4">
            <div className="flex gap-3 items-center">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <span className="text-sm font-bold block">Connexto AI</span>
                <span className="text-[10px] opacity-90 flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  Online
                </span>
              </div>
            </div>
            <button
              className="hover:bg-white/10 p-2 rounded-xl transition-colors"
              onClick={() => setIsOpen(false)}
              aria-label="Minimize Chatbot"
            >
              <Minus size={20} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 custom-scrollbar"
          >
            {isPremium ? (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${m.role === "assistant" ? "bg-primary-100 text-primary-600" : "bg-gray-200 text-gray-600"}`}>
                    {m.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
                  </div>

                  <div
                    className={`px-4 py-3 text-[14px] leading-relaxed max-w-[80%] ${m.role === "user"
                        ? "bg-primary-600 text-white rounded-2xl rounded-tr-none shadow-sm"
                        : "bg-white text-gray-800 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm"
                      }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-dashed border-gray-300">
                <div className="bg-primary-50 p-4 rounded-full mb-4">
                  <ShieldCheck className="text-primary-500" size={32} />
                </div>
                <p className="text-base font-bold text-gray-900">
                  Premium Feature
                </p>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                  Upgrade to Premium to chat with your personal AI assistant.
                </p>
                <Link to="/premium" className="mt-6 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
                  Upgrade Now
                </Link>
              </div>
            )}

            {isTyping && (
              <div className="flex gap-3 items-center opacity-70">
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shadow-sm">
                  <Bot size={16} />
                </div>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-4 bg-white border-t border-gray-200"
          >
            <div className="relative flex gap-2">
              <input
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all disabled:opacity-50 text-gray-900 placeholder:text-gray-400"
                placeholder={isPremium ? "Ask me anything..." : "Premium only..."}
                value={input}
                disabled={!isPremium || isTyping}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors disabled:bg-gray-200 disabled:text-gray-400 shadow-sm"
                disabled={!input.trim() || isTyping || !isPremium}
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        className={`mt-4 shadow-xl h-14 w-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 border border-transparent ${isOpen ? 'bg-gray-900 text-white rotate-90' : 'bg-primary-600 text-white shadow-primary-600/30'}`}
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? "Close Chat" : "Open Chat AI"}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
}
