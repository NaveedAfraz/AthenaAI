import { Separator } from "@radix-ui/react-separator";
import React from "react";

function Footer() {
  return (
    <>
      <Separator className="h-[2px] bg-gray-800" />
      <footer
        style={{ backgroundColor: "#04021b" }}
        className="py-5 text-center w-[100%] text-gray-400  border-gray-800"
      >
        <p>© 2024 AI Assistant. All rights reserved.</p>
      </footer>
    </>
  );
}

export default Footer;
