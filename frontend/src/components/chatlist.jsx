import React, { useState } from "react";
import { Link } from "react-router";
import { Separator } from "@/components/ui/separator";
// Example icons from lucide-react:
import {
  PlusCircle,
  Search,
  Mail,
  History,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { SidebarContent } from "./ui/sidebar";

function ChatList({ isOpen, setIsOpen }) {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
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
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const {
    data: chatlistData,
    isLoading: chatlistLoading,
    isError: chatlistError,
  } = useQuery({
    queryKey: ["chatlist"],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:3006/api/get-chatList/${userId}`,
        { withCredentials: true }
      );
      return res.data;
    },
  });

  const handleNewChat = () => {
    mutate();
  };

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <SidebarContent
      className={`h-[100vh] flex flex-col items-center text-white text-center transition-all duration-300 ${
        isOpen ? "w-[20%] xl:w-[17%]" : "w-14"
      }`}
      style={{ backgroundColor: "#04021b" }}
    >
      {/* Toggle button */}
      <div className="flex justify-end w-full p-2">
        <button onClick={toggleSidebar} className="text-white">
          {isOpen ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-2 p-5 pt-6">
        <Link className="mx-1 flex items-center gap-2" to="">
          <PlusCircle className="h-5 w-5" />
          {isOpen && (
            <button onClick={handleNewChat} className="">
              Create a new Chat
            </button>
          )}
        </Link>

        <Link className="mx-1 flex items-center gap-2" to="">
          <Search className="h-5 w-5" />
          {isOpen && <span>Explore Athena AI</span>}
        </Link>

        <Link className="mx-1 flex items-center gap-2" to="">
          <Mail className="h-5 w-5" />
          {isOpen && <span>Contact</span>}
        </Link>
      </div>

      <Separator className="bg-zinc-700 mx-auto h-[0.5px]" />

      {/* Recent Chats */}
      <div className="flex flex-col gap-5 p-5">
        <div className="flex flex-col items-center gap-2">
          <History className="h-5 w-5" />
          {isOpen && <p className="text-sm">Recent Chats</p>}
          {chatlistLoading
            ? "Loading..."
            : chatlistData &&
              chatlistData.data.map((chat) => (
                <Link
                  key={chat.ConversationsID}
                  to={`chats/${chat.ConversationsID}`}
                >
                  {isOpen ? chat.Title : <PlusCircle className="h-5 w-5" />}
                </Link>
              ))}
        </div>
      </div>

      <Separator className="bg-zinc-700 mx-auto h-[0.5px]" />
    </SidebarContent>
  );
}

export default ChatList;
