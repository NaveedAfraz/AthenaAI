import React from "react";
import { Separator } from "@radix-ui/react-separator"; // Assuming @radix-ui/react-separator is correctly installed

function Footer() {
  return (
    <>
      {/* Separator with a subtle gradient matching the theme */}
      <div className="h-[2px] bg-gradient-to-r from-blue-200 via-purple-300 to-pink-200 w-full" />
      <footer
        className="py-6 text-center w-full bg-white text-gray-600 border-t border-gray-100 shadow-inner"
      >
        <p className="text-sm md:text-base">
          &copy; 2024 Athena AI. All rights reserved.
        </p>
        {/*  */}
      </footer>
    </>
  );
}

export default Footer;
