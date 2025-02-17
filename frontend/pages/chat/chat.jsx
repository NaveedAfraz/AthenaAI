import React, { useState } from "react";
import { Send } from "lucide-react";
import Input from "../../src/components/input";
import ImgUpload from "../../src/components/ImgUpload";
import { IKImage } from "imagekitio-react";
function Chat() {
  const [question, setQuestion] = useState("");
  const [showQuestion, setShowQuestion] = useState(false);
  const [answer, setAnswer] = useState("");
  const [messages, setmessages] = useState([]);
  const [img, setImg] = useState({
    isLoading: false,
    error: null,
    dbData: {},
    aiData: {},
  });
  console.log(messages);
  // console.log(img);
  console.log(answer);

  return (
    <div className="flex flex-col h-full w-full border-none bg-transparent">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 w-[70%] mx-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        {messages.map((message, index) => {
          return (
            <div key={index} className="flex flex-col space-y-2">
              {" "}
              <div className="flex items-center space-x-2 justify-end">
                {" "} 
                {img?.aiData && (
                  <IKImage
                    urlEndpoint={import.meta.env.VITE_IMAGE_URL_ENDPOINT}
                    path={img?.dbData}
                    transformation={[{ height: 150, width: 200 }]}
                  />
                )}
                <p className="text-white p-3 bg-[#04021b] rounded-4xl">
                  {message.question}
                </p>
              </div>
              <div className="text-white flex  justify-start p-3 bg-[#04021b] rounded-4xl">
                {message.answer}
              </div>
            </div>
          );
        })}
        {showQuestion ? (
          <div className="flex items-center space-x-2 justify-end h-20">
            <p className="text-white flex justify-end p-3 bg-[#04021b] rounded-4xl w-fit float-right">
              {question}
            </p>
          </div>
        ) : null}
        {answer && <p className="text-white"> {answer} </p>}
      </div>
      <div className="flex items-center w-[75%] mx-auto p-4">
        <Input
          setImg={setImg}
          img={img}
          setAnswer={setAnswer}
          messages={messages}
          question={question}
          setQuestion={setQuestion}
          setShowQuestion={setShowQuestion}
          setmessages={setmessages}
          answer={answer}
        />
      </div>
    </div>
  );
}

export default Chat;
