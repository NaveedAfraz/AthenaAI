import React, { useState } from "react";
import { Send } from "lucide-react";
import Input from "@/components/input";

function Chat() {
  // Sample messages array (replace with your actual data)
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", isUser: false },
    { id: 2, text: "I need help with my account.", isUser: true },
  ]);

  return (
    <div className="flex flex-col h-full w-full border-none bg-transparent">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 w-[70%] mx-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.isUser
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-100"
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center w-[75%] mx-auto p-4">
        <Input />
      </div>
    </div>
  );
}

export default Chat;
