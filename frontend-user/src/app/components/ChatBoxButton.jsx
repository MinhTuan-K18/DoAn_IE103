// "use client";
// import {
//   Send,
//   MessageCircleMore,
//   Minus,
//   Maximize,
//   Minimize,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import React, { useState, useEffect } from "react";

// const ChatBotButton = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isFullScreen, setIsFullScreen] = useState(false);
//   const [messages, setMessages] = useState([
//     { sender: "bot", text: "Hello Nice" },
//     {
//       sender: "bot",
//       text: "Welcome to LiveChat! I was made with Pick a topic from the list or type down a question!",
//     },
//     { sender: "user", text: "Welcome" },
//     { sender: "bot", text: "Hello Nice" },
//   ]);
//   const [input, setInput] = useState("");

//   const sendMessage = () => {
//     if (input.trim() === "") return;
//     const newMessage = {
//       sender: "user",
//       text: input,
//       time: new Date().toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }), // Lấy giờ:phút
//     };

//     setMessages((prev) => [...prev, newMessage]);
//     setInput("");
//   };

//   return (
//     <div className="fixed bottom-4 right-4 flex flex-col items-end">
//       {/* Nút mở chat */}
//       <Button
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-12 h-12 p-0 bg-blue-500 rounded-full flex items-center justify-center hover:opacity-80 hover:bg-blue-600 relative"
//       >
//         <MessageCircleMore className="w-8 h-8 text-white size-0.3" />
//         <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
//           <span className="text-white text-sm font-semibold">1</span>
//         </div>
//       </Button>

//       {/* Hộp chat */}
//       {isOpen && (
//         <div
//           className={`${
//             isFullScreen
//               ? "fixed inset-0 w-full h-full"
//               : "fixed bottom-20 right-4 w-80 h-96"
//           } bg-white rounded-xl flex flex-col border-2 border-blue-300`}
//         >
//           {/* Header */}
//           <div className="flex justify-between items-center p-3 border-b rounded-tl-xl rounded-tr-xl bg-[#E6EAF1]">
//             <span className="text-lg font-semibold text-gray-700">
//               Chat Box
//             </span>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="text-gray-600 hover:text-gray-800"
//               >
//                 <Minus className="w-5 h-5" />
//               </button>
//               <button
//                 onClick={() => setIsFullScreen(!isFullScreen)}
//                 className="text-gray-600 hover:text-gray-800"
//               >
//                 {isFullScreen ? (
//                   <Minimize className="w-5 h-5" />
//                 ) : (
//                   <Maximize className="w-5 h-5" />
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Nội dung chat */}
//           <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#E6EAF1]">
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`flex ${
//                   msg.sender === "user" ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 <div flex flex-col>
//                   <span className="text-xs text-gray-500 mt-1">
//                     {`${msg.sender === "user" ? "Visitor\t" : "LiveChat\t"}`}
//                     {msg.time ||
//                       new Date().toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                   </span>
//                   <div
//                     className={`px-4 py-2 rounded-lg ${
//                       msg.sender === "user"
//                         ? "bg-blue-500 text-white"
//                         : "bg-white text-gray-700"
//                     }`}
//                   >
//                     {msg.text}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Ô nhập tin nhắn */}
//           <div className="flex p-2 border-0 bg-white items-center rounded-br-xl rounded-bl-xl">
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Type a message..."
//               className="w-full border-0 rounded-xl px-3 py-2 outline-none"
//             />
//             <Button
//               onClick={sendMessage}
//               className="ml-2 bg-white text-black px-2 py-2 rounded-lg hover:bg-90 hover:bg-blue-200"
//             >
//               <Send className="w-6 h-6 size-0.5" />
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatBotButton;
"use client";
import React, { use, useState } from "react";
import Chat from "../ChatBox/Chat";

const ChatIcon = () => {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="chat-svg w-[2.25rem] h-[2.25rem]"
    >
      <mask
        id="mask0_342_2441"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="1"
        y="1"
        className=" w-[2.0625rem] h-[2.0625rem]"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.5 1.50049H33.7395V33.7412H1.5V1.50049Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0_342_2441)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.16266 29.513C10.0327 29.513 10.8532 29.843 11.7217 30.1925C17.0422 32.6525 23.3347 31.5335 27.4342 27.4355C32.8432 22.0235 32.8432 13.22 27.4342 7.81099C24.8152 5.19199 21.3322 3.75049 17.6242 3.75049C13.9147 3.75049 10.4302 5.19349 7.81266 7.81249C3.71166 11.9105 2.59566 18.203 5.03316 23.4725C5.38416 24.341 5.72316 25.187 5.72316 26.066C5.72316 26.9435 5.42166 27.827 5.15616 28.607C4.93716 29.249 4.60566 30.218 4.81866 30.431C5.02716 30.647 6.00216 30.3065 6.64566 30.086C7.41816 29.822 8.29416 29.519 9.16266 29.513V29.513ZM17.5867 33.7415C15.2947 33.7415 12.9877 33.257 10.8292 32.258C10.1932 32.003 9.59766 31.763 9.17016 31.763C8.67816 31.766 8.01666 31.994 7.37766 32.2145C6.06666 32.6645 4.43466 33.2255 3.22716 32.0225C2.02416 30.818 2.57916 29.1905 3.02616 27.881C3.24666 27.236 3.47316 26.57 3.47316 26.066C3.47316 25.652 3.27366 25.124 2.96766 24.3635C0.158156 18.296 1.45716 10.9835 6.22266 6.22099C9.26466 3.17749 13.3132 1.50049 17.6227 1.50049C21.9322 1.50049 25.9822 3.17599 29.0242 6.21949C35.3122 12.5075 35.3122 22.7375 29.0242 29.0255C25.9417 32.1095 21.7912 33.7415 17.5867 33.7415V33.7415Z"
          fill="white"
        />
      </g>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.5443 19.7446C22.7163 19.7446 22.0383 19.0741 22.0383 18.2446C22.0383 17.4151 22.7028 16.7446 23.5308 16.7446H23.5443C24.3723 16.7446 25.0443 17.4151 25.0443 18.2446C25.0443 19.0741 24.3723 19.7446 23.5443 19.7446"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.5311 19.7446C16.7031 19.7446 16.0251 19.0741 16.0251 18.2446C16.0251 17.4151 16.6881 16.7446 17.5176 16.7446H17.5311C18.3591 16.7446 19.0311 17.4151 19.0311 18.2446C19.0311 19.0741 18.3591 19.7446 17.5311 19.7446"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.5175 19.7446C10.6895 19.7446 10.0115 19.0741 10.0115 18.2446C10.0115 17.4151 10.676 16.7446 11.504 16.7446H11.5175C12.3455 16.7446 13.0175 17.4151 13.0175 18.2446C13.0175 19.0741 12.3455 19.7446 11.5175 19.7446"
        fill="white"
      />
    </svg>
  );
};

const NotificationBadge = ({ count }) => {
  return (
    <div
      className="absolute self-center w-[1.5rem] text-[1rem] font-bold text-center justify-center items-center text-white bg-[#F7302E] rounded-full"
      role="status"
      aria-label={`${count} unread messages`}
    >
      {count}
    </div>
  );
};

const ChatBotButton = () => {
  const [showChat, setShowChat] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(true);
  const toggleChat = () => {
    setShowChat(!showChat);
    setNotificationVisible(false);
  };
  return (
    <div className="fixed bottom-[1.5rem] right-[2rem] h-[4rem] w-[4rem]">
      <button
        onClick={toggleChat}
        className="flex absolute top-1.5 left-1.5 justify-center items-center p-[0.75rem] bg-sky-900 rounded-[999px] cursor-pointer"
        aria-label="Chat messages"
      >
        <ChatIcon />
      </button>
      {/* Hiển thị NotificationBadge nếu notificationVisible là true */}
      {notificationVisible && <NotificationBadge count={1} />}
      {showChat && <Chat />}
    </div>
  );
};

export default ChatBotButton;