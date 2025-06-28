import React, { useState, useEffect, useCallback, useMemo, useRef, forwardRef, useContext } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Search, History, MessageSquare, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useChatList } from '@/hooks/useChatList';
import { ChatContext } from '@/GlobalContext';
import useChat from '@/hooks/useChat';
import { useQueryClient } from '@tanstack/react-query';

// Constants for animation variants to prevent recreation on each render
const ANIMATION_VARIANTS = {
  sidebar: {
    open: { width: '320px', x: 0, opacity: 1, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
    closed: { width: '320px', x: '-100%', opacity: 1, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }
  },
  listItem: {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({ opacity: 1, x: 0, transition: { duration: 0.2, delay: i * 0.05 } })
  },
  overlay: { open: { opacity: 1 }, closed: { opacity: 0 } }
};

// Memoized Chat List Item component to prevent unnecessary re-renders
const ChatListItem = React.forwardRef(({ chat, isActive, onSelect, index }, ref) => {
  const { ConversationsID, Title } = chat;
  return (
    <motion.div
      ref={ref}
      custom={index}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={ANIMATION_VARIANTS.listItem}
      layout
      className="relative"
    >
      <NavLink
        to={`chats/${ConversationsID}`}
        className={({ isActive: isNavActive }) =>
          cn(
            'flex items-center space-x-3 p-3 rounded-xl transition-all duration-200',
            'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
            'group border border-transparent',
            isActive && 'bg-blue-50 border-blue-200 text-blue-900 shadow-sm',
            'w-full block' // Ensure full width and block display
          )
        }
        onClick={(e) => {
          e.preventDefault();
          onSelect(ConversationsID);
        }}
      >
        <MessageSquare
          className={cn(
            'h-5 w-5 flex-shrink-0 transition-all duration-200',
            isActive ? 'text-blue-600 scale-110' : 'text-gray-500 group-hover:text-blue-600 group-hover:scale-105'
          )}
        />
        <span
          className="text-sm truncate flex-1 text-left font-medium pointer-events-none"
          title={Title || 'New Chat'}
        >
          {Title || 'New Chat'}
        </span>
        {isActive && (
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r"
            layoutId="activeIndicator"
            transition={{ duration: 0.2 }}
          />
        )}
      </NavLink>
    </motion.div>
  );
}, (prevProps, nextProps) => (
  prevProps.chat.ConversationsID === nextProps.chat.ConversationsID &&
  prevProps.isActive === nextProps.isActive &&
  prevProps.index === nextProps.index
));

// Memoized Empty State component
const EmptyState = React.forwardRef(({ onCreateChat }, ref) => (
  <div className="px-3 py-6 text-center">
    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
      <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-3" />
      <p className="text-sm text-gray-500 mb-3">No conversations yet</p>
      <button
        onClick={onCreateChat}
        className="text-sm text-blue-400 hover:text-blue-300"
      >
        Start your first chat
      </button>
    </div>
  </div>
));

// Memoized Loading State component
const LoadingState = React.forwardRef(({ }, ref) => (
  <div className="px-3 py-8 flex justify-center">
    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
  </div>
));

// Memoized Error State component
const ErrorState = React.forwardRef(({ onRetry }, ref) => (
  <div className="px-3 py-4 text-center">
    <p className="text-sm text-red-400 mb-2">Failed to load chats</p>
    <button
      onClick={onRetry}
      className="text-sm text-blue-400 hover:text-blue-300"
    >
      Try again
    </button>
  </div>
));

const ChatListComponent = React.forwardRef(({ isOpen, setIsOpen, isEmbedded = false }, ref) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const chatListRef = useRef(null);
  const { setMessages } = useChat();
  const queryClient = useQueryClient();
  // Custom hook for fetching chat list
  const {
    chatList = [],
    isLoading,
    isError,
    refetch,
    createChat,
    isCreating: isPending
  } = useChatList();

  // Memoize chatList to prevent unnecessary re-renders
  const memoizedChatList = useMemo(() => chatList, [chatList]).sort((a, b) => b.ConversationsID - a.ConversationsID);
  console.log(memoizedChatList, "chatList");
  // Handle responsive design
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const optimizedResize = () => window.requestAnimationFrame(handleResize);

    window.addEventListener('resize', optimizedResize, { passive: true });
    handleResize();
    return () => window.removeEventListener('resize', optimizedResize);
  }, []);

  // Handle chat creation
  const handleCreateChat = useCallback(async () => {
    const result = await createChat();
    console.log("result", result);
    if (result?.conversationId) {
      navigate(`chats/${result.conversationId}`, { replace: true });
      if (isMobile && !isEmbedded) setIsOpen(false);
    }
  }, [createChat, isMobile, isEmbedded, setIsOpen, navigate]);

  // Handle chat selection
  const handleSelect = useCallback((chatId) => {
    console.log("chatId", chatId);
    console.log("id", id);
    if (id !== chatId) {
      console.log("runing");

      // Step A: Immediately clear the messages from the UI state
      setMessages([]);

      // Step B: Tell React Query to invalidate the query for the new chat.
      // This marks it as stale and forces a refetch. The key is that the
      // useQuery hook will now enter a 'loading' state without initial data.
      queryClient.invalidateQueries({ queryKey: ['getMessages', chatId] });
    }
    navigate(`chats/${chatId}`, { replace: true });
    if (isMobile && !isEmbedded) setIsOpen(false);
  }, [id, isMobile, isEmbedded, setIsOpen, navigate, setMessages]);
  // Memoize new chat button
  const newChatButton = useMemo(() => (
    <button
      onClick={handleCreateChat}
      disabled={isPending}
      className={cn(
        'w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl',
        'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
        'text-white font-medium transform hover:scale-[1.02] active:scale-[0.98]',
        'shadow-lg shadow-blue-600/25',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'group transition-all duration-200'
      )}
    >
      {isPending ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <PlusCircle className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
      )}
      <span>{isPending ? 'Creating...' : 'New Chat'}</span>
    </button>
  ), [handleCreateChat, isPending]);

  // Memoize chat list content
  const chatListContent = useMemo(() => {
    if (isLoading) return <LoadingState />;
    if (isError) return <ErrorState onRetry={refetch} />;
    if (!memoizedChatList.length) return <EmptyState onCreateChat={handleCreateChat} />;

    return (
      <AnimatePresence mode="popLayout">
        {memoizedChatList.map((chat, index) => (
          <ChatListItem
            key={chat.ConversationsID}
            chat={chat}
            isActive={id === chat.ConversationsID}
            onSelect={handleSelect}
            index={index}
          />
        ))}
      </AnimatePresence>
    );
  }, [isLoading, isError, memoizedChatList, id, handleSelect, handleCreateChat, refetch]);

  // Memoize Content component
  const Content = useMemo(() => (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <div
        ref={chatListRef}
        className="flex-1 overflow-y-auto overflow-x-hidden mb-[20%] pr-2 scrollbar-thin scrollbar-thumb-gray-300 w-full"
      >
        {/* New Chat Button */}
        <motion.div
          className="p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {newChatButton}
        </motion.div>

        {/* Explore Link */}
        <motion.div
          className="px-3 py-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <NavLink
            to="/home"
            className={({ isActive }) => cn(
              'flex items-center space-x-3 p-3 rounded-xl',
              'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
              'border border-transparent hover:border-gray-200',
              isActive && 'bg-gray-100 border-gray-200'
            )}
          >
            <Search className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium">Explore Athena AI</span>
          </NavLink>
        </motion.div>

        <Separator className="mx-4 my-2 bg-gray-200" />

        {/* Recent Chats Section */}
        <motion.div
          className="px-3 py-2 w-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center px-3 py-2 mb-3">
            <History className="h-5 w-5 text-purple-400 mr-3" />
            <span className="text-sm font-semibold text-gray-500">Recent Chats</span>
          </div>
          <div className="space-y-1">
            {chatListContent}
          </div>
        </motion.div>
      </div>
    </div>
  ), [newChatButton, chatListContent]);

  // Memoize overlay
  const overlay = useMemo(() => {
    if (!isMobile || !isOpen) return null;
    return (
      <motion.div
        className="fixed inset-0 bg-black/50 z-30"
        initial="closed"
        animate="open"
        exit="closed"
        variants={ANIMATION_VARIANTS.overlay}
        onClick={() => setIsOpen(false)}
      />
    );
  }, [isMobile, isOpen, setIsOpen]);

  // Early return for embedded mode
  if (isEmbedded) return Content;
  // Return nothing if closed on mobile
  if (!isOpen && isMobile) return null;

  return (
    <>
      {overlay}
      <motion.div
        ref={ref}
        className={cn(
          'h-screen flex flex-col z-40 bg-white border-r border-gray-200 overflow-hidden',
          isMobile ? 'fixed inset-y-0 left-0 w-full' : 'relative w-80'
        )}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        variants={ANIMATION_VARIANTS.sidebar}
      >
        {Content}
      </motion.div>
    </>
  );
});

ChatListComponent.displayName = 'ChatList';

const ChatList = React.memo(ChatListComponent, (prevProps, nextProps) => (
  prevProps.isOpen === nextProps.isOpen &&
  prevProps.isEmbedded === nextProps.isEmbedded
));

export default ChatList;
