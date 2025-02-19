import React, { useContext, useEffect, useRef, useState } from "react";
import { Loader, LoaderCircle, MessageCircle, Send } from "lucide-react";
import Input from "../../src/components/input";
import ImgUpload from "../../src/components/ImgUpload";
import { IKImage } from "imagekitio-react";
import { useLocation } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ChatContext, ChatProvider } from "@/GlobalContext";
import Markdown from "react-markdown";
function Chat() {
  // const [question, setQuestion] = useState("");
  const { showQuestion, setShowQuestion, question, setQuestion } =
    useContext(ChatContext);
  const [answer, setAnswer] = useState("");

  const [img, setImg] = useState({
    isLoading: false,
    error: null,
    dbData: {},
    aiData: {},
  });

  const endMessageRef = useRef(null);

  const [messages, setmessages] = useState([]);
  console.log(img);
  console.log(answer);

  const location = useLocation();
  const sliced = location.pathname.split("/");
  // console.log(sliced[3], "sliced");
  const chatID = sliced[3];
  console.log(chatID);
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log("chatID changed");
    setmessages([]);
    queryClient.invalidateQueries(["getMessages", chatID]);
  }, [chatID, queryClient]);

  const {
    data: chatConversation,
    isError,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["getMessages", chatID],
    queryFn: async () => {
      try {
        console.log(chatID);

        const response = await axios.get(
          `http://localhost:3006/api/get-conversation/${chatID}`
        );
        console.log(response);
        return response.data;
      } catch (error) {
        console.log(error);
        throw new Error(error.response.data.message);
      }
    },
    enabled: !!chatID,
    onSuccess: (data) => {
      console.log(data);
      // queryClient.invalidateQueries(["getMessages"]);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  useEffect(() => {
    if (endMessageRef.current) {
      endMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, showQuestion, answer]);
  console.log(chatConversation?.data);
  console.log(error);

  useEffect(() => {
    setmessages(chatConversation?.data || []);
  }, [chatConversation]);
  console.log(chatConversation?.data);

  return (
    <div
      className="flex flex-col h-[90%]  w-full border-none bg-transparent"
      style={{ backgroundColor: "#0A1529" }}
    >
      <div className="flex-1 overflow-y-auto p-4 space-y-4 w-full lg:w-[70%] mx-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        {messages?.length !== 0 &&
          !isError &&
          messages?.map((message, index) => {
            return (
              <div key={index} className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2 flex-col ml-auto">
                  <div className="flex flex-col items-end space-y-2">
                    {img?.aiData && (
                      <IKImage
                        urlEndpoint={import.meta.env.VITE_IMAGE_URL_ENDPOINT}
                        path={message?.image || img?.dbData}
                        transformation={[{ height: 150, width: 200 }]}
                        className="rounded-lg shadow-md"
                      />
                    )}
                    {console.log(message)}
                    <p className="text-white p-3 mx-5 bg-[#04021b] rounded-lg hover:shadow-md transition-shadow max-w-[70%]">
                      <Markdown>{message.question}</Markdown>
                    </p>
                  </div>
                </div>

                <div className="text-white flex justify-start">
                  <p className="p-3  bg-[#04021b] rounded-lg hover:shadow-md transition-shadow max-w-[90%]">
                    <Markdown>{message.answer}</Markdown>
                  </p>
                </div>
              </div>
            );
          })}
        {showQuestion && (
          <div className="flex flex-col items-end space-y-2 ml-auto">
            {img?.aiData && (
              <IKImage
                urlEndpoint={import.meta.env.VITE_IMAGE_URL_ENDPOINT}
                path={img?.dbData}
                transformation={[{ height: 150, width: 200 }]}
                className="rounded-lg shadow-md"
              />
            )}
            <p className="text-white p-3 bg-[#04021b] rounded-lg hover:shadow-md transition-shadow max-w-[70%]">
              {question}
            </p>
          </div>
        )}
        {answer && (
          <div className="flex justify-start">
            <p className="text-white p-3 bg-[#04021b] rounded-lg hover:shadow-md transition-shadow max-w-[70%]">
              <Markdown>{answer}</Markdown>
            </p>
          </div>
        )}
        {/* <div className="h-2 bg-amber-300" ref={endMessageRef} /> */}
      </div>

      <div className="sticky bottom-0 bg-[#0A1529] w-full p-1">
        {isLoading && (
          <LoaderCircle
            className="text-white animate-spin mx-auto mb-10.5"
            size={32}
            strokeWidth={2}
          />
        )}
        {isError && (
          <div className="flex flex-col items-center justify-center p-8">
            <MessageCircle className="text-gray-400" size={64} />
            <p className="text-gray-500 mt-4 text-lg">{error.message}</p>
          </div>
        )}
        <Input
          setImg={setImg}
          img={img}
          setAnswer={setAnswer}
          messages={messages}
          setmessages={setmessages}
          answer={answer}
        />
      </div>
    </div>
  );
}

export default Chat;
