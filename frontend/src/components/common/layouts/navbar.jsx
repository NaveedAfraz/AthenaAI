import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react"; // Import Bell and User icons
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Bot } from "lucide-react";
import { UserButton } from '@clerk/clerk-react';
import { useDashboard } from '@/hooks/useDashboard';
import { useLocation } from "react-router";
function Navbar() {
  const {
    isChatOpen,
    isSidebarOpen,
    isLoading,
    error,
    setIsSidebarOpen,
    handleStartConversation,
    toggleSidebar,
  } = useDashboard();
  const location = useLocation()
  const [homePage, setHomePage] = useState(false)
  useEffect(() => {
    if (location.pathname !== "/home") {
      setHomePage(true)
    }
  }, [location])
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
         {homePage && location.pathname !== "/login" && location.pathname !== "/register" ? <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="h-9 w-9 p-0"
          >
            <Menu className="h-5 w-5" />
          </Button> : null}
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
  );
}

export default Navbar;