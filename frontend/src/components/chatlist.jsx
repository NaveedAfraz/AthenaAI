import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Separator } from '@/components/ui/separator';
import { 
  PlusCircle, 
  Search, 
  History, 
  MessageSquare,
  Loader2
} from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const ChatList = ({ isOpen, setIsOpen, isEmbedded = false }) => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch chat list
  const {
    data: chatlistData,
    isLoading: chatlistLoading,
    isError: chatlistError,
    refetch: refetchChats
  } = useQuery({
    queryKey: ['chatlist', userId],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3006'}/api/get-chatList/${userId}`,
        { withCredentials: true }
      );
      return res.data;
    },
    enabled: !!userId,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create new chat mutation
  const { mutate: createChat, isPending: isCreating } = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3006'}/api/add-chat`,
        { userId },
        { withCredentials: true }
      );
      return res.data; 
    },
    onSuccess: (data) => {
      refetchChats();
      navigate(`chats/${data.conversationId}`);
      if (isMobile && !isEmbedded) { // Only auto-close if not embedded
        setIsOpen(false);
      }
    },
    onError: (error) => {
      console.error('Error creating chat:', error);
    },
  });

  // Animation variants for standalone mode
  const sidebarVariants = {
    open: { 
      width: isMobile ? '100%' : '320px', 
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    },
    closed: { 
      width: isMobile ? '100%' : '320px', 
      x: '-100%',
      opacity: isMobile ? 0 : 1,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    }
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.2, delay: index * 0.05 }
    })
  };

  const overlayVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 }
  };
  
  // Reusable component for the list content
  const ChatListContent = () => (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto overflow-x-hidden mb-[20%] pr-[2px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent z-220">
        <motion.div 
            className="p-4" 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <button
              onClick={() => createChat()}
              disabled={isCreating}
              className={cn(
                'w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl',
                'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
                'text-white font-medium transition-all duration-200',
                'transform hover:scale-[1.02] active:scale-[0.98]',
                'shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
                'group'
              )}
            >
              {isCreating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <PlusCircle className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
              )}
              <span className="whitespace-nowrap">
                {isCreating ? 'Creating...' : 'New Chat'}
              </span>
            </button>
        </motion.div>

        <motion.div 
            className="px-3 py-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
        >
            <Link 
              to="/home"
              className={cn(
                'flex items-center space-x-3 p-3 rounded-xl transition-all duration-200',
                'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                'group border border-transparent hover:border-gray-200'
              )}
            >
              <Search className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm font-medium">
                Explore Athena AI
              </span>
            </Link>
        </motion.div>

        <Separator className="mx-4 my-2 bg-gray-200" />

        <motion.div 
            className="px-3 py-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <div className="flex items-center px-3 py-2 mb-3">
              <History className="h-5 w-5 text-purple-400 mr-3" />
              <span className="text-sm font-semibold text-gray-500">
                Recent Chats
              </span>
            </div>

            <div className="space-y-1">
              {chatlistLoading ? (
                <motion.div 
                  className="px-3 py-8 flex justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </motion.div>
              ) : chatlistError ? (
                <motion.div 
                  className="px-3 py-4 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-sm text-red-400 mb-2">Failed to load chats</p>
                  <button
                    onClick={() => refetchChats()}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Try again
                  </button>
                </motion.div>
              ) : chatlistData?.data?.length > 0 ? (
                <AnimatePresence mode="popLayout">
                  {chatlistData.data.map((chat, index) => {
                    const isActive = location.pathname.includes(chat.ConversationsID);
                    return (
                      <motion.div
                        key={chat.ConversationsID}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={listItemVariants}
                        layout
                        className="relative"
                      >
                        <Link
                          to={`chats/${chat.ConversationsID}`}
                          className={cn(
                            'flex items-center space-x-3 p-3 rounded-xl transition-all duration-200',
                            'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                            'group border border-transparent',
                            isActive && 'bg-blue-50 border-blue-200 text-blue-900 shadow-sm'
                          )}
                          onClick={() => {
                            if (isMobile && !isEmbedded) setIsOpen(false);
                          }}
                        >
                          <MessageSquare className={cn(
                            'h-5 w-5 flex-shrink-0 transition-all duration-200',
                            isActive ? 'text-blue-600 scale-110' : 'text-gray-500 group-hover:text-blue-600 group-hover:scale-105'
                          )} />
                          <span
                            className="text-sm truncate flex-1 text-left font-medium"
                            title={chat.Title || 'New Chat'}
                          >
                            {chat.Title || 'New Chat'}
                          </span>
                          {isActive && (
                            <motion.div
                              className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r"
                              layoutId="activeIndicator"
                              transition={{ duration: 0.2 }}
                            />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              ) : (
                <motion.div 
                  className="px-3 py-6 text-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 mb-3">No conversations yet</p>
                    <button
                      onClick={() => createChat()}
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
                    >
                      Start your first chat
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
        </motion.div>
      </div>
    </div>
  );

  // If embedded, only render the content part.
  if (isEmbedded) {
    return <ChatListContent />;
  }

  // If standalone, render the full component with container and overlay.
  // The `isOpen` check for mobile is to prevent rendering an empty, invisible container.
  if (!isOpen && isMobile) return null;

  return (
    <>
      {isMobile && isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          initial="closed"
          animate="open"
          exit="closed"
          variants={overlayVariants}
          onClick={() => setIsOpen(false)}
        />
      )}
      <motion.div
        className={cn(
          "h-screen flex flex-col z-40 bg-white",
          "border-r border-gray-200",
          isMobile ? "fixed inset-y-0 left-0 w-full" : "relative w-80"
        )}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
      >
        <ChatListContent />
      </motion.div>
    </>
  );
};

export default ChatList;