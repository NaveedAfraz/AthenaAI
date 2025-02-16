import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
} from "@clerk/clerk-react";
import { Link, useLocation, useNavigate } from "react-router";
import { Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuth } = useAuth();
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
          <span className="hidden lg:inline text-lg font-bold">Athena AI</span>
        </Link>
      </div>

      <div className="ml-auto pr-4">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          {!isAuth && location.pathname !== "/login" ? (
            <Button
              onClick={() => navigate("/login")}
              className="bg-blue-700 hover:bg-blue-950 cursor-pointer text-white"
            >
              Sign In
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/register")}
              className="bg-blue-700 hover:bg-blue-950 cursor-pointer text-white"
            >
              Sign Up
            </Button>
          )}
        </SignedOut>
      </div>
    </div>
  );
}

export default Navbar;
