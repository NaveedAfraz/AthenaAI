import React, { useContext } from 'react';
import { Loader2, Bot, User, Image as ImageIcon, Send, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IKImage } from 'imagekitio-react';
import { ChatContext } from '@/GlobalContext';
import Markdown from 'react-markdown';
import useChat from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ChatLoading from '@/components/common/layouts/Home/chatLoading';

// Animation variants
const messageVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 }
  },
};

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
  const { showQuestion, question } = useContext(ChatContext);

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
  console.log(messages);

  const handleSendMessage = () => {
    if (answer.trim() || img) {
      // Handle send message logic here
      console.log('Sending message:', answer);
    }
  };
  console.log(img);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Empty state */}
          {messages?.length === 0 && !isLoading && !isError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-96 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg">
                <Bot className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                How can I help you today?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Ask me anything, upload an image for analysis, or request code generation.
              </p>
            </motion.div>
          )}

          {/* Messages */}
          <AnimatePresence initial={false}>
            {messages?.map((message) => (
              <>
                {/* User Message */}
                <motion.div
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex justify-end"
                >
                  <div className="max-w-3xl flex items-start space-x-3">
                    <div className="flex flex-col items-end space-y-2">
                      {message.image && (
                        <div className="rounded-2xl overflow-hidden border-2 border-blue-200 dark:border-blue-800 shadow-lg">
                          <IKImage
                            urlEndpoint={import.meta.env.VITE_IMAGE_URL_ENDPOINT}
                            path={message.image}
                            transformation={[{ height: 300, width: 400, crop: 'fit' }]}
                            className="max-h-64 object-cover"
                          />
                        </div>
                      )}
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-2xl rounded-tr-md shadow-lg max-w-2xl">
                        <Markdown className="prose prose-invert prose-sm [&>*]:mb-0">
                          {message.question}
                        </Markdown>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </motion.div>

                {/* AI Response */}
                <motion.div
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex justify-start"
                >
                  <div className="max-w-3xl flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 px-4 py-3 rounded-2xl rounded-tl-md shadow-lg max-w-2xl">
                      <Markdown className="prose prose-gray dark:prose-invert prose-sm [&>*]:mb-2 [&>*:last-child]:mb-0">
                        {message.answer}
                      </Markdown>
                    </div>
                  </div>
                </motion.div>
              </>
            ))}

            {/* Current question being asked */}
            {showQuestion && (
              <motion.div
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                className="flex justify-end"
              >
                <div className="max-w-3xl flex items-start space-x-3">
                  <div className="flex flex-col items-end space-y-2">
                    {img?.aiData && (
                      <div className="rounded-2xl overflow-hidden border-2 border-blue-200 dark:border-blue-800 shadow-lg">
                        <IKImage
                          urlEndpoint={import.meta.env.VITE_IMAGE_URL_ENDPOINT}
                          path={img.dbData}
                          transformation={[{ height: 300, width: 400, crop: 'fit' }]}
                          className="max-h-64 object-cover"
                        />
                      </div>
                    )}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-2xl rounded-tr-md shadow-lg max-w-2xl">
                      {question}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Typing indicator */}
            {/* {isLoading && !isError && (
              <motion.div
                variants={typingVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex justify-start"
              >
                <div className="max-w-3xl flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-2xl rounded-tl-md shadow-lg">
                    <div className="flex space-x-1 items-center">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )} */}
            <div className="h-[100%]">
             {isLoading && <ChatLoading isLoading={isLoading} isError={isError} />}
            </div>
            {/* Error message */}
            {isError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
              >
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-xl p-4 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Something went wrong</h4>
                      <p className="text-sm mt-1">{error?.message || 'An error occurred. Please try again.'}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={endMessageRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className={`border-t border-gray-200  dark:border-gray-700 bg-white dark:bg-gray-800 p-4 relative ${img ? 'mt-17' : ''}  `}>
        <div className="max-w-4xl mx-auto overflow-visible">
          <div className="relative flex items-end space-x-3">
            {/* Image preview */}
            {img && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute left-0 bottom-[115%] p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
              >
                <div className="relative ">
                  <img
                    src={img}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded"
                  />
                  <button
                    onClick={() => setImg(null)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            )}

            {/* File input */}
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImg(file);
                }
              }}
            />

            {/* Attach button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-12 w-12 rounded-full p-0 flex-shrink-0"
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            {/* Text input */}
            <div className="flex-1 relative">
              <Input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="w-full h-12 pr-12 rounded-full border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700"
                disabled={isLoading}
              />
              <Button
                type="button"
                onClick={handleSendMessage}
                disabled={isLoading || (!answer.trim() && !img)}
                className="absolute right-1 top-1 h-10 w-10 rounded-full p-0 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Helper text */}
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>Powered by Athena AI</span>
          </div>
        </div>
      </div>
    </div >
  );
}

export default Chat;