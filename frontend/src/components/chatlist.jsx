import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Separator } from '@/components/ui/separator';
import { 
  PlusCircle, 
  Search, 
  History, 
  ChevronLeft, 
  ChevronRight,
  MessageSquare,
  Sparkles,
  Bot,
  X
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const ChatList = ({ isOpen, setIsOpen, showHeader = true }) => {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle scroll for shadow effect
  const handleScroll = (e) => {
    setIsScrolled(e.target.scrollTop > 0);
  };

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
      if (isMobile) setIsOpen(false);
    },
    onError: (error) => {
      console.error('Error creating chat:', error);
    },
  });

  // Animation variants
  const sidebarVariants = {
    open: { 
      width: '280px',
      x: 0,
      opacity: 1,
      transition: { 
        duration: 0.2, 
        ease: 'easeInOut' 
      }
    },
    closed: { 
      width: '0',
      x: '-280px',
      opacity: 0,
      transition: { 
        duration: 0.2, 
        ease: 'easeInOut'
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      className={`fixed md:relative h-full bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col z-40`}
      style={{
        height: '100vh',
        WebkitOverflowScrolling: 'touch',
        display: isOpen ? 'flex' : 'none',
        flexDirection: 'column'
      }}
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      variants={sidebarVariants}
    >
      {/* No header in the chatlist when used in dashboard */}
      {showHeader && (
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Chats</h2>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md hover:bg-gray-700/50"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5 text-gray-300" />
          </button>
        </div>
      )}

      {/* Content */}
      <div className={`flex-1 overflow-y-auto ${!isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={() => createChat()}
            disabled={isCreating}
            className={cn(
              'w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl',
              'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
              'text-white font-medium transition-all duration-200',
              'transform hover:scale-[1.02] active:scale-100',
              'shadow-lg shadow-blue-500/10',
              isCreating && 'opacity-70 cursor-not-allowed'
            )}
          >
            <PlusCircle className="h-5 w-5" />
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="whitespace-nowrap"
              >
                {isCreating ? 'Creating...' : 'New Chat'}
              </motion.span>
            )}
          </button>
        </div>

        {/* Navigation */}
        <div className="px-3 py-2">
          <Link 
            to="/home"
            className={cn(
              'flex items-center space-x-3 p-3 rounded-lg transition-colors',
              'text-gray-300 hover:bg-gray-700/50',
              'group'
            )}
          >
            <Search className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform" />
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-sm font-medium"
              >
                Explore Athena AI
              </motion.span>
            )}
          </Link>
        </div>

        {/* Recent Chats Section */}
        <div className="px-3 py-2">
          <div className="flex items-center px-3 py-2 mb-2">
            <History className="h-5 w-5 text-purple-400 mr-2" />
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm font-semibold text-gray-400"
              >
                Recent Chats
              </motion.span>
            )}
          </div>

          {/* Chat List */}
          <div 
            className="space-y-1 pr-1"
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'thin',
            }}
          >
            {chatlistLoading ? (
              <div className="px-3 py-4 flex justify-center">
                <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce mx-1"></div>
                <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce mx-1" style={{ animationDelay: '0.2s' }}></div>
                <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce mx-1" style={{ animationDelay: '0.4s' }}></div>
              </div>
            ) : chatlistData?.data?.length > 0 ? (
              <AnimatePresence>
                {chatlistData.data.map((chat) => {
                  const isActive = location.pathname.includes(chat.ConversationsID);
                  return (
                    <motion.div
                      key={chat.ConversationsID}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={contentVariants}
                      layout
                    >
                      <Link
                        to={`chats/${chat.ConversationsID}`}
                        className={cn(
                          'flex items-center space-x-3 p-3 rounded-lg transition-colors',
                          'text-gray-300 hover:bg-gray-700/50',
                          isActive && 'bg-gray-700/70 border-l-4 border-blue-500',
                          'group',
                          'overflow-hidden'
                        )}
                        onClick={() => isMobile && setIsOpen(false)}
                      >
                        <MessageSquare className={cn(
                          'h-5 w-5 flex-shrink-0',
                          isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-blue-400'
                        )} />
                        {isOpen && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="text-sm truncate flex-1 text-left"
                            title={chat.Title || 'New Chat'}
                          >
                            {chat.Title || 'New Chat'}
                          </motion.span>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            ) : (
              <motion.div 
                className="px-3 py-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-sm text-gray-500">No recent chats</p>
                <button
                  onClick={() => createChat()}
                  className="mt-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Start a new chat
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div 
        className="sticky bottom-0 p-3 border-t border-gray-800 bg-gray-900/80 backdrop-blur-sm"
        style={{
          zIndex: 10,
          boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
      >
        <Link
          to="/home"
          className={cn(
            'flex items-center space-x-3 p-2 rounded-lg',
            'text-gray-400 hover:bg-gray-800/50',
            'transition-colors group'
          )}
        >
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          {isOpen && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm font-medium"
            >
              Upgrade to Pro
            </motion.span>
          )}
        </Link>
      </div>
    </motion.div>
  );
}

export default ChatList;
