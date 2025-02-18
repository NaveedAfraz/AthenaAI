import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
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
  const navigate = useNavigate();
  const [chatID, setChatID] = useState("");
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
      setChatID(data.conversationId);
      navigate(`chats/${data.conversationId}`);
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
      console.log(res.data);
      return res.data;
    },
  });

  const handleNewChat = () => {
    mutate();
  };

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };
  console.log(chatlistData);

  return (
    <SidebarContent
      className={`h-[100vh] flex flex-col items-center text-white text-center transition-all duration-300 ${
        isOpen ? "w-[20%] xl:w-[17%]" : "w-14"
      }`}
      style={{ backgroundColor: "#04021b" }}
    >
      <div className="sticky top-0 px-5 justify-end w-full bg-[#04021b] py-3 flex border-b border-zinc-700">
        <button onClick={toggleSidebar} className="text-white cursor-pointer ">
          {isOpen ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-2 p-5 pt-6">
        <div className="mx-1 flex items-center gap-2" to={`chats/${chatID}`}>
          <PlusCircle className="h-5 w-5" />
          {isOpen && (
            <button onClick={handleNewChat} className="">
              Create a new Chat
            </button>
          )}
        </div>

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
      <div
        className={`flex flex-col gap-5 p-5 my-15 w-full scroll-auto ${
          isOpen ? "overflow-y-scroll" : "overflow-y-hidden"
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5" />
            {isOpen && <p className="text-sm font-semibold 500">Recent Chats</p>}
          </div>

          {chatlistLoading ? (
            "Loading..."
          ) : chatlistData !== undefined ? (
            chatlistData.data.map((chat) => (
              <Link
                key={chat.ConversationsID}
                to={`chats/${chat.ConversationsID}`}
                className="flex items-center justify-center gap-2 h-10 bg-indigo-950 rounded-2xl p-2 w-full"
              >
                {isOpen ? chat.Title : <PlusCircle className="h-5 w-5" />}
              </Link>
            ))
          ) : (
            <p>No Recent Chats</p>
          )}
        </div>
      </div>

      <Separator className="bg-zinc-700 mx-auto h-[0.5px]" />
    </SidebarContent>
  );
}

export default ChatList;
