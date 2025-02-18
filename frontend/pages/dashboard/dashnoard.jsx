import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import ChatList from "@/components/chatlist";
import cardItems from "../../config/dashboardCard";
import { Card, CardContent } from "@/components/ui/card";
import Chat from "../../pages/chat/chat";
import { Send } from "lucide-react";
import Input from "@/components/input";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
function Dashboard() {
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(
    location.pathname.includes("/chats")
  );
  useEffect(() => {
    if (!userId && isLoaded) {
      navigate("/register");
    }
  }, [userId, isLoaded, navigate]);

  useEffect(() => {
    if (location.pathname.includes("/chats")) {
      console.log("chat");
      setIsChatOpen(true);
    }
  }, [location, setIsChatOpen]);
  const { mutate: StartChatMutation } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.post(
          "http://localhost:3006/api/add-chat",
          { userId },
          { withCredentials: true }
        );

        return res.data;
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    },
    onSuccess: (data) => {
      console.log("success", data);
      navigate(`chats/${data.conversationId}`);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const handleStartConversation = () => {
    StartChatMutation();
  };
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <div className="flex w-full h-[91.7vh] overflow-hidden">
        <SidebarProvider
          className={`transition-all duration-300 ${
            isOpen ? "w-64" : "w-18"
          } overflow-hidden`}
        >
          <ChatList isOpen={isOpen} setIsOpen={setIsOpen} />
        </SidebarProvider>

        {!isChatOpen ? (
          <>
            <div className="flex flex-col w-full justify-center items-center mx-auto">
              <div
                className="flex w-full flex-col flex-1 p-5 border-none bg-transparent items-center justify-center"
                style={{ backgroundColor: "#0A1529" }}
              >
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl px-4">
                    {cardItems.map((item) => (
                      <Card
                        key={item.id}
                        style={{ backgroundColor: "#04021b" }}
                        className="border-none hover:border-blue-500 transition-colors p-4 cursor-pointer shadow-sm hover:shadow-md"
                      >
                        <CardContent>
                          <div className="flex flex-col items-center text-center space-y-2">
                            {item.icon}
                            <h3
                              className={`text-lg font-semibold ${item.textColor}`}
                            >
                              {item.title}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {item.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center my-6">
                <button
                  className="px-6 py-3 w-2xl max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  onClick={handleStartConversation}
                >
                  <Link to="/chat">Let's Spark a Conversation</Link>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 h-[100vh]  ">
            <Outlet />
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;
