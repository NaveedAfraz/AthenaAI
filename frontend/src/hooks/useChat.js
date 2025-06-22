import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useLocation } from "react-router";

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [answer, setAnswer] = useState("");
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

  return {
    messages,
    setMessages,
    answer,
    setAnswer,
    img,
    setImg,
    endMessageRef,
    chatID,
    isError,
    isLoading,
    isFetching,
    error,
    hasSubmittedOnce,
    setHasSubmittedOnce,
    chatConversation,
    refreshConversation,
    resetChat,
  };
};

export default useChat;
