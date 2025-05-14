"use client";
import { useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages] = useState([
    {
      id: 1,
      text: "Hello Nice",
      isVisitor: false,
      timestamp: "02:10 PM",
    },
    {
      id: 2,
      text: "Welcome to LiveChat I was made with Pick a topic from the list or type down a question!",
      isVisitor: false,
      timestamp: "02:10 PM",
    },
    {
      id: 3,
      text: "Welcome",
      isVisitor: true,
      timestamp: "02:12 PM",
      isRead: true,
    },
    {
      id: 4,
      text: "Hello Nice",
      isVisitor: false,
      timestamp: "02:10 PM",
    },
  ]);

  const handleSend = () => {
    if (message.trim()) {
      // Handle sending message
      setMessage("");
    }
  };

  return (
    <main className="absolute sm:bottom-[1rem] sm:right-[3.125rem] flex-col items-start rounded-xl shadow-lg h-auto w-[330px]">
      <ChatHeader />
      <section className="flex-1 w-full overflow-y-auto max-h-[340px] bg-slate-200">
        <div className="flex flex-col gap-3 p-3">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg.text}
              isVisitor={msg.isVisitor}
              timestamp={msg.timestamp}
              isRead={msg.isRead}
            />
          ))}
        </div>
      </section>
      <ChatInput
        message={message}
        onMessageChange={setMessage}
        onSend={handleSend}
      />
    </main>
  );
};

export default Chat;