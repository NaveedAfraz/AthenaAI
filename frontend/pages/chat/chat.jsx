import React, { useContext, useEffect } from 'react';
import { Loader2, Bot, User, Image as ImageIcon, Send, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IKImage } from 'imagekitio-react';
import { ChatContext } from '@/GlobalContext';
import Markdown from 'react-markdown';
import useChat from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ChatLoading from '@/components/common/layouts/Home/chatLoading';
import ChatBox from '../../components/chatbox';
import ChatBoxInput from '../../components/chatboxInput';

const typingVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 }
  },
};

function Chat() {
  console.log("Chat rendering");
  const {
    messages,
    answer,
    img,
    endMessageRef,
    isError,
    isLoading,
    error,
    setAnswer,
    setImg,
    refreshConversation,
    setMessages
  } = useChat();
  useEffect(() => {
    console.log("mounted");
    return () => {
      console.log("unmounted");
    }
  }, []);
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
      {/* Messages Container */}
      <div className={`flex-1 overflow-y-auto px-4 py-6 ${!img ? 'pb-24' : ''}`}>
        <ChatBox />
      </div>

      {/* Input Area */}
      <ChatBoxInput />
    </div >
  );
}

export default Chat;