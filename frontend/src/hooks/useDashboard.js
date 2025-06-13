import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '@clerk/clerk-react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useDashboard = () => {
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State
  const [isChatOpen, setIsChatOpen] = useState(location.pathname.includes('/chats'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check authentication
  useEffect(() => {
    if (!userId && isLoaded) {
      navigate('/register');
    }
  }, [userId, isLoaded, navigate]);

  // Update chat open state based on route
  useEffect(() => {
    setIsChatOpen(location.pathname.includes('/chats'));
  }, [location.pathname]);

  // Start new chat mutation
  const { mutate: startChatMutation, isPending: isStartingChat } = useMutation({
    mutationFn: async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3006'}/api/add-chat`,
          { userId },
          { withCredentials: true }
        );
        return res.data;
      } catch (err) {
        console.error('Error starting chat:', err);
        setError(err.response?.data?.message || 'Failed to start chat');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: (data) => {
      navigate(`chats/${data.conversationId}`);
    },
  });

  const handleStartConversation = () => {
    startChatMutation();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return {
    // State
    isChatOpen,
    isSidebarOpen,
    isLoading: isLoading || isStartingChat,
    error,
    setIsSidebarOpen,
    // Actions
    handleStartConversation,
    toggleSidebar,
  };
};

export default useDashboard;
