import { createContext, useContext, useState } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [showQuestion, setShowQuestion] = useState(false);
  const [question, setQuestion] = useState("");
  return (
    <ChatContext.Provider
      value={{ showQuestion, setShowQuestion, question, setQuestion }}
    >
      {children}
    </ChatContext.Provider>
  );
};
