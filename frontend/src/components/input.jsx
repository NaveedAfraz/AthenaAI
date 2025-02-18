import { Pin, Send, X } from "lucide-react";
import React, { useContext, useState } from "react";
import axios from "axios";
import ImgUpload from "./ImgUpload";
import model from "@/lib/GEMINI";
import { IKImage } from "imagekitio-react";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router";
import { ChatContext } from "@/GlobalContext";
import { useAuth } from "@clerk/clerk-react";

function Input({ img, setImg, setAnswer, setmessages, messages }) {
  const { setShowQuestion, question, setQuestion } = useContext(ChatContext);
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
  const { userId } = useAuth();
  const location = useLocation();
  const sliced = location.pathname.split("/");
  // console.log(sliced[3], "sliced");
  const chatID = sliced[3];
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    mutate: sendMessageMutation,
    isLoading: sendMessageLoading,
    isError: sendMessageError,
    isSuccess: sendMessageSuccess,
    data: sendMessageData,
  } = useMutation({
    mutationFn: async ({ answer, question, conversationId, image }) => {
      try {
        // console.log(answer, "answer");
        // console.log(question, "question");
        // console.log(conversationId, "conversationId");

        const response = await axios.post(
          "http://localhost:3006/api/send-message",
          { question, answer, conversationId, image },
          {
            withCredentials: true,
          }
        );
        return response.data;
      } catch (error) {
        console.log(error);
        throw new Error(error.message);
      }
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries(["getMessages", chatID]);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  console.log(img, "img is this here");
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
      if (messages.length === 0) {
        setmessages((prev) => [...prev, { question, answer: accumulatedText }]);
      } else {
        setmessages((prev) => [...prev, { question, answer: accumulatedText }]);
      }
      sendMessageMutation({
        answer: accumulatedText,
        question,
        conversationId: chatID,
        image: img?.dbData,
      });
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
    // if (e.target.value === "") return null;
    setQuestion(e.target.value);
  };
  console.log(img);

  return (
    <div className="sticky bottom-0 mx-auto bg-[#0A1529] w-[70%] p-4">
      <form className="w-full mx-auto" onSubmit={sendMessage}>
        {img?.dbData && Object.keys(img.dbData).length > 0 && (
          <div className="relative inline-block">
            <IKImage
              urlEndpoint={import.meta.env.VITE_IMAGE_URL_ENDPOINT}
              path={img.dbData} // Use the correct key (e.g., `url`, `path`, etc.) 
              transformation={[{ height: 100, width: 100 }]}
            />
            <button className="absolute top-0 right-0 bg-white/80 rounded-full p-1 flex items-center justify-center cursor-pointer hover:bg-white">
              <X
                className="w-4 h-4"
                onClick={() =>
                  setImg({
                    isLoading: false,
                    error: null,
                    dbData: {},
                    aiData: {},
                  })
                }
              />
            </button>
          </div>
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
