import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useLocation } from "react-router";

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [answer, setAnswer] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [hasSubmittedOnce, setHasSubmittedOnce] = useState(false);
  const [img, setImg] = useState({
    isLoading: false,
    error: null,
    dbData: {},
    aiData: {},
  });

  const endMessageRef = useRef(null);
  const location = useLocation();
  const queryClient = useQueryClient();
  const chatID = location.pathname.split("/")[3];

  // Fetch chat conversation
  const {
    data: chatConversation,
    isError,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["getMessages", chatID],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `http://localhost:3006/api/get-conversation/${chatID}`
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching conversation:", error);
        throw new Error(
          error.response?.data?.message || "Failed to load conversation"
        );
      }
    },
    enabled: !!chatID,
  });
  console.log("chatConversation", chatConversation);
  // Update messages when conversation data changes
  useEffect(() => {
    if (chatConversation?.data) {
      setMessages(chatConversation.data);
      console.log("chatConversation", chatConversation);
    } else {
      setMessages([]);
    }
  }, [chatConversation]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, answer]);

  const scrollToBottom = useCallback(() => {
    if (endMessageRef.current) {
      endMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Refresh conversation
  const refreshConversation = useCallback(() => {
    if (chatID) {
      setMessages([]);
      queryClient.invalidateQueries(["getMessages", chatID]);
    }
  }, [chatID, queryClient]);

  // Reset chat
  const resetChat = useCallback(() => {
    setMessages([]);
    setAnswer("");
    setImg({
      isLoading: false,
      error: null,
      dbData: {},
      aiData: {},
    });
  }, []);

  // Function to send message to AI and get response
  const sendMessageToAI = async (message, chatHistory = []) => {
    if (!message.trim()) return;
    
    setIsLoadingAI(true);
    setAiError(null);
    
    try {
      const response = await axios.post('http://localhost:3006/api/generate-ai-response', {
        message,
        chatHistory: chatHistory.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.message
        }))
      });
      
      if (response.data.success) {
        return response.data.response;
      } else {
        throw new Error(response.data.error || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('Error sending message to AI:', error);
      setAiError(error.response?.data?.error || error.message || 'Failed to get AI response');
      throw error;
    } finally {
      setIsLoadingAI(false);
    }
  };

  return {
    messages,
    setMessages,
    answer,
    setAnswer,
    img,
    setImg,
    endMessageRef,
    chatID,
    isError: isError || !!aiError,
    error: error || aiError,
    isLoading: isLoading || isLoadingAI,
    isFetching,
    error,
    hasSubmittedOnce,
    setHasSubmittedOnce,
    chatConversation,
    refreshConversation,
    resetChat,
    sendMessageToAI,
  };
};

export default useChat;
