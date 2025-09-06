import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot as BotIcon, User, Zap } from 'lucide-react';
import axios from 'axios';
import axiosInstance from '../services/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice.js';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const [isDisabled, setIsDisabled] = useState(false);




  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);

  const navigate = useNavigate();



  // Scroll to bottom when new message arrives
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    // Push user message immediately
    setMessages(prev => [...prev, { sender: 'user', text: input }]);

    try {
      // Call backend API
      const response = await axiosInstance.post("/messages", { message: input });

      const botReply = response.data?.botMessage || "No response from server";

      // Push bot response
      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { sender: 'bot', text: "⚠️ Oops! Something went wrong." }]);
    } finally {
      setInput("");
      setLoading(false);
    }
  };


  const handleLogout = async () => {
    setIsDisabled(true);

    await toast.promise(
      dispatch(logoutUser()).unwrap(),
      {
        loading: "Logging out...",
        success: () => "✅ Logout successful!",
        error: (err) => err?.message || "❌ Logout failed",
      }
    );

    setIsDisabled(false);
    navigate("/");
  };


  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent newline on Enter
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 via-violet-900 to-indigo-900 border-b border-violet-700/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-violet-500/20 rounded-xl border border-violet-400/30">
              <Zap className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Neural Chat
              </h1>
              <p className="text-xs text-violet-300/70">AI Assistant v2.0</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className=" bg-emerald-400  animate-pulse"></div>
            <span className="text-md text-emerald-400">Welcome, {user?.username}</span>
            <div>
              <button
                onClick={handleLogout}
                disabled={isDisabled}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white disabled:opacity-50"
              >
                Logout
              </button>

            </div>
          </div>


        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 
                      scrollbar-hide">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex p-4 bg-violet-500/10 rounded-2xl border border-violet-500/20 mb-4">
                <BotIcon className="w-12 h-12 text-violet-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-violet-300 mb-2">Ready to Chat</h2>
              <p className="text-slate-400">Start a conversation with your AI assistant</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${msg.sender === 'user'
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                  : 'bg-gradient-to-br from-violet-500 to-purple-500'
                }`}>
                {msg.sender === 'user' ? (
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                ) : (
                  <BotIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                )}
              </div>

              <div className={`flex-1 max-w-2xl ${msg.sender === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block p-3 sm:p-4 rounded-2xl backdrop-blur-sm border ${msg.sender === 'user'
                    ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-100'
                    : 'bg-slate-800/50 border-slate-700/50 text-slate-100'
                  }`}>
                  <p className="leading-relaxed text-sm sm:text-base">{msg.text}</p>
                </div>
                <div className={`mt-1 text-xs text-slate-500 ${msg.sender === 'user' ? 'text-right' : 'text-left'
                  }`}>
                  {msg.sender === 'user' ? 'You' : 'AI Assistant'}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <BotIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="inline-block p-3 sm:p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
                <div className="mt-1 text-xs text-slate-500">AI is thinking...</div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </main>

      {/* Footer */}
      <footer className="p-2 sm:p-6 bg-gradient-to-t from-slate-950 to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="flex items-center bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 shadow-2xl">
              <input
                type="text"
                className="flex-1 bg-transparent px-3 sm:px-4 py-2 sm:py-3 focus:outline-none placeholder-slate-400 text-white text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Neural Chat..."
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="ml-2 p-2 sm:p-3 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 disabled:from-slate-600 disabled:to-slate-700 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed group"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:rotate-12 transition-transform duration-200" />
              </button>
            </div>

            <div className="flex justify-between items-center mt-2 px-2">
              <p className="text-xs text-slate-500">
                Press Enter to send • Shift+Enter for new line
              </p>
              <div className="text-xs text-slate-500">
                {input.length}/1000
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChatBot;
