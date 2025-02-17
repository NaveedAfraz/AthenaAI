import { Pin, Send } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import ImgUpload from "./ImgUpload";
import model from "@/lib/GEMINI";
import { IKImage } from "imagekitio-react";

function Input({
  img,
  setImg,
  question,
  setQuestion,
  setAnswer,
  setShowQuestion,
  setmessages,
  messages,
  answer,
}) {
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "hello i am youe" }],
      },
      {
        role: "model",
        parts: [{ text: "blansbdhfbnsnjdhfbnjk jdbnj hscdb" }],
      },
    ],
    generationConfig: {
      // maxOutputTokens: 100,
    },
  });

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      setShowQuestion(true);
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData, question] : [question]
      );
      // console.log(text);
      let accumulatedText = "";
      // let last = messages.length - 1;
      // console.log(messages[last]?.answer);

      // console.log(last, "last message");

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        // console.log(chunkText);
        accumulatedText += chunkText;
        setAnswer(accumulatedText);
      }
      //  setImg({ isLoading: false, error: null, dbData: {}, aiData: {} });
      setmessages((prev) => [...prev, { question, answer: accumulatedText }]);
      setAnswer("");
      setImg({
        isLoading: false,
        error: null,
        dbData: {},
        aiData: {},
      });
      setQuestion("");
      setShowQuestion(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handlechnage = (e) => {
    setQuestion(e.target.value);
  };
  console.log(img);

  return (
    <div className="sticky bottom-0 mx-auto bg-[#0A1529] w-[70%] p-4">
      <form className="w-full mx-auto" onSubmit={sendMessage}>
        {img?.dbData && (
          <IKImage
            urlEndpoint={import.meta.env.VITE_IMAGE_URL_ENDPOINT}
            path={img?.dbData}
            transformation={[{ height: 100, width: 100 }]}
          />
        )}
        <div className="flex items-center w-full bg-[#04021b] p-3 rounded-lg border border-gray-700 mx-auto">
          <label htmlFor="file-upload" className="cursor-pointer">
            <ImgUpload setImg={setImg} />
          </label>
          <input
            type="text"
            placeholder="Type your message here..."
            className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none border-none"
            value={question}
            onChange={(e) => handlechnage(e)}
          />

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
