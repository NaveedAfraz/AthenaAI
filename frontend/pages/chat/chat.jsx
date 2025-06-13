import React, { useContext } from 'react';
import { Loader2, MessageCircle, Bot, User, Image as ImageIcon, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IKImage } from 'imagekitio-react';
import { ChatContext } from '@/GlobalContext';
import Markdown from 'react-markdown';
import useChat from '@/hooks/useChat';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
// Animation variants for message transitions
const messageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -20 },
};

// Animation variants for the typing indicator
const typingVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10 },
};

function Chat() {
  const { showQuestion, question } = useContext(ChatContext);
  
  // Use the custom hook for chat logic
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
  } = useChat();

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Athena AI
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={refreshConversation}
              className="text-gray-400 hover:text-white transition-colors"
              title="Refresh conversation"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
                <path d="M16 16h5v5"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 w-full max-w-4xl mx-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {messages?.length === 0 && !isLoading && !isError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-400"
            >
              <Bot className="h-16 w-16 mb-4 text-blue-400/50" />
              <h2 className="text-2xl font-semibold text-white mb-2">How can I help you today?</h2>
              <p className="max-w-md">Ask me anything or upload an image to get started.</p>
            </motion.div>
          )}

          {messages?.map((message, index) => (
            <React.Fragment key={index}>
              {/* User message */}
              <motion.div
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex justify-end mb-6 group"
              >
                <div className="max-w-3xl w-full">
                  <div className="flex items-start justify-end space-x-3">
                    <div className="flex flex-col items-end space-y-2">
                      {message.image && (
                        <div className="rounded-xl overflow-hidden border border-gray-700/50 shadow-lg">
                          <IKImage
                            urlEndpoint={import.meta.env.VITE_IMAGE_URL_ENDPOINT}
                            path={message.image}
                            transformation={[{ height: 300, width: 400, crop: 'fit' }]}
                            className="max-h-64 object-cover"
                          />
                        </div>
                      )}
                      <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-tr-none max-w-2xl">
                        <Markdown className="prose prose-invert prose-sm">
                          {message.question}
                        </Markdown>
                      </div>
                    </div>
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      <User className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* AI response */}
              <motion.div
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex justify-start mb-6 group"
              >
                <div className="max-w-3xl w-full">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-gray-800/50 border border-gray-700/50 text-gray-200 px-4 py-3 rounded-2xl rounded-tl-none max-w-2xl backdrop-blur-sm">
                      <Markdown className="prose prose-invert prose-sm prose-headings:text-white prose-strong:text-white">
                        {message.answer}
                      </Markdown>
                    </div>
                  </div>
                </div>
              </motion.div>
            </React.Fragment>
          ))}

          {/* Current question being asked */}
          {showQuestion && (
            <motion.div
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              className="flex justify-end mb-6"
            >
              <div className="max-w-3xl w-full">
                <div className="flex items-start justify-end space-x-3">
                  <div className="flex flex-col items-end space-y-2">
                    {img?.aiData && (
                      <div className="rounded-xl overflow-hidden border border-gray-700/50 shadow-lg">
                        <IKImage
                          urlEndpoint={import.meta.env.VITE_IMAGE_URL_ENDPOINT}
                          path={img.dbData}
                          transformation={[{ height: 300, width: 400, crop: 'fit' }]}
                          className="max-h-64 object-cover"
                        />
                      </div>
                    )}
                    <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-tr-none max-w-2xl">
                      {question}
                    </div>
                  </div>
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <User className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Typing indicator */}
          {isLoading && !isError && (
            <motion.div
              variants={typingVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex justify-start mb-6"
            >
              <div className="max-w-3xl w-full">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-gray-800/50 border border-gray-700/50 text-gray-200 px-4 py-3 rounded-2xl rounded-tl-none max-w-2xl backdrop-blur-sm">
                    <div className="flex space-x-1 items-center">
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error message */}
          {isError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl p-4 mb-6 max-w-3xl mx-auto"
            >
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error?.message || 'An error occurred. Please try again.'}</span>
              </div>
            </motion.div>
          )}

          <div ref={endMessageRef} />
        </AnimatePresence>
      </div>

      {/* Input area */}
      <div className="sticky bottom-0 bg-gradient-to-t from-gray-900/80 to-transparent backdrop-blur-sm pt-6 pb-8 px-4 border-t border-gray-800/50">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <Input
              setImg={setImg}
              img={img}
              setAnswer={setAnswer}
              messages={messages}
              setMessages={(msgs) => setMessages(msgs)}
              answer={answer}
              className="w-full bg-gray-800/50 border border-gray-700/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 rounded-2xl px-4 py-3 pr-12 text-white placeholder-gray-500 shadow-lg backdrop-blur-sm transition-all duration-200"
            />
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full flex items-center justify-center text-white transition-colors",
                isLoading
                  ? "bg-blue-600/50 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              )}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                className="flex items-center space-x-1 hover:text-gray-300 transition-colors"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                <ImageIcon className="h-4 w-4" />
                <span>Attach image</span>
              </button>
            </div>
            <div className="text-gray-600">
              <span className="hidden sm:inline">Press</span> Enter to send, Shift+Enter for new line
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
