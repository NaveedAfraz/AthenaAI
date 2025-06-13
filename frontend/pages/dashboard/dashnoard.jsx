import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Menu, Bell, Code, Image as ImageIcon, Bot, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChatList from '@/components/chatlist';
import useDashboard from '@/hooks/useDashboard';
import { UserButton } from '@clerk/clerk-react';

// Dashboard card items
const cardItems = [
  {
    id: 1,
    title: 'Start a New Chat',
    description: 'Begin a new conversation with our AI assistant',
    icon: <MessageSquare className="h-8 w-8 text-blue-500" />,
    textColor: 'text-blue-500',
  },
  {
    id: 2,
    title: 'Code Generation',
    description: 'Generate code snippets in multiple languages',
    icon: <Code className="h-8 w-8 text-purple-500" />,
    textColor: 'text-purple-500',
  },
  {
    id: 3,
    title: 'Image Analysis',
    description: 'Upload and analyze images with AI',
    icon: <ImageIcon className="h-8 w-8 text-green-500" />,
    textColor: 'text-green-500',
  },
];
// Animation variants
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
  const {
    isChatOpen,
    isSidebarOpen,
    isLoading,
    error,
    setIsSidebarOpen,
    handleStartConversation,
    toggleSidebar,
  } = useDashboard();

  // Determine if mobile view
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Close sidebar when resizing to mobile
      if (mobile && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen, setIsSidebarOpen]);

  // Determine the current variant based on sidebar state and screen size
  const getMainContentVariant = () => {
    if (isMobile) {
      return isSidebarOpen ? 'mobileOpen' : 'mobileClosed';
    }
    return isSidebarOpen ? 'open' : 'closed';
  };

  const currentVariant = getMainContentVariant();
  return (
    <div className="flex h-screen w-full bg-white dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <div className={`fixed bg-amber-400 inset-y-0 left-0 z-30 ${isMobile ? '' : 'static'}`}>
        <motion.div
          className="h-full"
          initial={false}
          animate={isSidebarOpen ? 'open' : 'closed'}
          variants={{
            open: { x: 0 },
            closed: { x: '-20px' }
          }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <ChatList 
            isOpen={isSidebarOpen} 
            setIsOpen={setIsSidebarOpen} 
            showHeader={false}
          />
        </motion.div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/50 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div 
        className={`flex-1 flex flex-col h-screen overflow-auto bg-white dark:bg-gray-900 transition-all duration-200 ${
          !isMobile && isSidebarOpen ? 'ml-[0px]' : 'ml-0'
        }`}
        style={{
          width: !isMobile && isSidebarOpen ? 'calc(100% - 280px)' : '100%'
        }}
      >
      
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-5">
          {!isChatOpen ? (
            <div className="max-w-7xl mx-auto">
              {/* Welcome Section */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                  Welcome to Athena AI
                </h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-base">
                  Your intelligent assistant for conversations, code generation, and more.
                </p>
              </motion.div>

              {/* Features Grid */}
              <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
              >
                {cardItems.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="h-full"
                  >
                    <Card className="h-full bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 hover:border-blue-500/30 transition-colors duration-200 hover:shadow-md hover:shadow-blue-500/5">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg bg-opacity-20 ${item.textColor.replace('text-', 'bg-')} ${item.textColor}`}>
                            {item.icon}
                          </div>
                          <CardTitle className={`text-xl ${item.textColor}`}>
                            {item.title}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 dark:text-gray-400">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Button */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center"
              >
                <Button
                  onClick={handleStartConversation}
                  disabled={isLoading}
                  className={cn(
                    'group relative overflow-hidden px-8 py-6 text-lg font-semibold rounded-xl',
                    'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
                    'transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20',
                    'flex items-center space-x-2',
                    isLoading && 'opacity-70 cursor-not-allowed'
                  )}
                >
                  {isLoading ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <span>Start a New Conversation</span>
                      <Sparkles className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </Button>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-sm text-red-400"
                  >
                    {error}
                  </motion.p>
                )}
              </motion.div>
            </div>
          ) : (
            <div className="h-full">
              <Outlet />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
