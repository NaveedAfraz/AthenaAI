import { Pin, Send } from "lucide-react";
import React from "react";

function Input() {
  return (
    <div className="sticky bottom-0 bg-[#0A1529] w-full p-4">
      <form className="w-full mx-auto">
        <div className="flex items-center w-full bg-[#04021b] p-3 rounded-lg border border-gray-700 mx-auto">
          
          {/* File Input Hidden but Associated with Label */}
          <label htmlFor="file-upload" className="cursor-pointer">
            <Pin className="h-5 w-5 text-blue-500 mr-3" />
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
          />

          {/* Text Input */}
          <input
            type="text"
            placeholder="Type your message here..."
            className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none border-none"
          />

          {/* Send Button */}
          <button
            type="submit"
            className="ml-2 p-2 rounded-full hover:bg-blue-600/20 transition-colors"
          >
            <Send className="h-5 w-5 text-blue-500" />
          </button>

        </div>
      </form>
    </div>
  );
}

export default Input;
