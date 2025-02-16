import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Link } from "react-router";
import { Cpu } from "lucide-react";

function Navbar() {
  return (
    <div 
      className="h-16 text-white flex items-center justify-between px-4"
      style={{ backgroundColor: "#04021b" }}
    >

      <div className="relative flex items-center">
        <div
          className="absolute -left-1 rounded-full w-14 h-14"
          style={{ backgroundColor: "#0b092e" }}
        ></div>
        <Link to="/home" className="z-10 flex items-center gap-2 ml-3">
          <Cpu className="h-6 w-6 lg:hidden" />
          <span className="hidden lg:inline text-lg font-bold">
            Athena AI
          </span>
        </Link>
      </div>

 
      <div className="ml-auto pr-4">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </div>
  );
}

export default Navbar;