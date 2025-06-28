import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Menu, Bell, Code, Image as ImageIcon, Bot, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChatList from '@/components/chatlist';
import useDashboard from '@/hooks/useDashboard';
import { useAuth, UserButton } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router';

const cardItems = [
  {
    id: 1,
    title: 'Start a New Chat',
    description: 'Begin a new conversation with our AI assistant',
    icon: <MessageSquare className="h-6 w-6" />,
    textColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
    hoverColor: 'hover:bg-blue-100',
  },
  {
    id: 2,
    title: 'Code Generation',
    description: 'Generate code snippets in multiple languages',
    icon: <Code className="h-6 w-6" />,
    textColor: 'text-purple-500',
    bgColor: 'bg-purple-50',
    hoverColor: 'hover:bg-purple-100',
  },
  {
    id: 3,
    title: 'Image Analysis',
    description: 'Upload and analyze images with AI',
    icon: <ImageIcon className="h-6 w-6" />,
    textColor: 'text-green-500',
    bgColor: 'bg-green-50',
    hoverColor: 'hover:bg-green-100',
  },
];


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

function Dashboard() {
  console.log("Dashboard rendering");
  const {
    isChatOpen,

    isSidebarOpen,
    isLoading,
    error,
    setIsSidebarOpen,
    handleStartConversation,
    toggleSidebar,
  } = useDashboard();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { userId, isLoaded } = useAuth();
  useEffect(() => {
    if (!userId && location.pathname.includes('/dashboard')) {
      navigate('/login');
    }
  }, [userId, navigate]);
  useEffect(() => {

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900">
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {isMobile && (
              <motion.div
                className="fixed inset-0 bg-black/50 z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            <motion.div
              className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30 shadow-lg"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="flex items-center justify-between p-[13.5px] border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800 z-100">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white z-100">Conversations</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarOpen(false)}
                  className="h-8 w-8 p-0 z-40"
                >
                  <X className="h-4 w-4 text-gray-700 dark:text-gray-200" />
                </Button>
              </div>
              <ChatList
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                showHeader={false}
                isEmbedded={true}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          !isMobile && isSidebarOpen ? "ml-80" : "ml-0"
        )}
      >
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="h-9 w-9 p-0"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Athena AI</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <Bell className="h-4 w-4" />
              </Button>
              <UserButton />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {!isChatOpen ? (
            <div className="max-w-6xl mx-auto p-6">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="text-center mb-12 pt-8"
              >
                <motion.div
                  variants={itemVariants}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-lg"
                >
                  <Bot className="h-8 w-8 text-white" />
                </motion.div>
                <motion.h1
                  variants={itemVariants}
                  className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
                >
                  Welcome to{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Athena AI
                  </span>
                </motion.h1>
                <motion.p
                  variants={itemVariants}
                  className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                >
                  Your intelligent assistant for conversations, code generation, and image analysis.
                  Start a conversation to experience the power of AI.
                </motion.p>
              </motion.div>

              <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
              >
                {cardItems.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    whileHover={{
                      y: -8,
                      transition: { duration: 0.2 }
                    }}
                    className="cursor-pointer"
                    onClick={handleStartConversation}
                  >
                    <Card className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 shadow-sm hover:shadow-lg">
                      <CardHeader className="pb-4">
                        <div className={cn(
                          "inline-flex p-3 rounded-lg mb-3",
                          item.bgColor,
                          "dark:bg-gray-700"
                        )}>
                          <div className={item.textColor}>
                            {item.icon}
                          </div>
                        </div>
                        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="text-center"
              >
                <Button
                  onClick={handleStartConversation}
                  disabled={isLoading}
                  size="lg"
                  className={cn(
                    'group relative overflow-hidden px-8 py-4 text-lg font-semibold rounded-xl',
                    'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
                    'shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                  )}
                >
                  {isLoading ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Starting Conversation...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-5 w-5 mr-2" />
                      Start Your First Conversation
                      <Sparkles className="h-5 w-5 ml-2 group-hover:rotate-12 transition-transform duration-200" />
                    </>
                  )}
                </Button>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                  >
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;