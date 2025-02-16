import React from "react";
import { Link } from "react-router";
import { Separator } from "@/components/ui/separator";
// Example icons from lucide-react:
import {
  LayoutDashboard,
  PlusCircle,
  Search,
  Mail,
  History,
} from "lucide-react";

function ChatList() {
  return (
    <div
      className="h-[90vh] flex flex-col items-center  text-white  w-14 text-center lg:w-[20%] xl:w-[17%]"
      style={{ backgroundColor: "#04021b" }}
    >
      {/* Top Section */}
      <div className="flex flex-col gap-2 p-5 pt-6">
        {/* Dashboard heading with icon */}
        {/* <div className="flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5" />
         
          <h3 className="hidden lg:inline text-xs font-bold text-white">
            Dashboard
          </h3>
        </div> */}

        {/* "Create a new Chat" link */}
        <Link className="mx-1 flex items-center gap-2" to="">
          <PlusCircle className="h-5 w-5" />
          <span className="hidden lg:inline">Create a new Chat</span>
        </Link>

        {/* "Explore Athena AI" link */}
        <Link className="mx-1 flex items-center gap-2" to="">
          <Search className="h-5 w-5" />
          <span className="hidden lg:inline">Explore Athena AI</span>
        </Link>

        {/* "Contact" link */}
        <Link className="mx-1 flex items-center gap-2" to="">
          <Mail className="h-5 w-5" />
          <span className="hidden lg:inline">Contact</span>
        </Link>
      </div>

      <Separator className="bg-zinc-700 mx-auto h-[0.5px]" />

      {/* Bottom Section */}
      <div className="flex flex-col gap-5 p-5">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5" />
          {/* Hidden on small screens, shown on md and above */}
          <p className="text-sm hidden lg:inline">Recent Chats</p>
        </div>
      </div>

      <Separator className="bg-zinc-700 mx-auto h-[0.5px]" />
    </div>
  );
}

export default ChatList;
