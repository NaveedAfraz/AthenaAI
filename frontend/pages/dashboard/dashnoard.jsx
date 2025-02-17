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
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <div className="flex w-full h-[91.7vh] overflow-hidden">
        <SidebarProvider
          className={`transition-all duration-300 ${isOpen ? "w-64" : "w-18"} overflow-hidden`}
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
              </div>{" "}
              <Input />
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
