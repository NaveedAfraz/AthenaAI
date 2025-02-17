import { IKContext, IKImage, IKUpload } from "imagekitio-react";
import { Pin } from "lucide-react";
import React, { useRef } from "react";

const authenticator = async () => {
  try {
    const response = await fetch("http://localhost:3006/api/img-upload");

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

function ImgUpload({ setImg }) {
  const ikUploadRef = useRef(null);
  const urlEndpoint = import.meta.env.VITE_IMAGE_URL_ENDPOINT;
  const publicKey = import.meta.env.VITE_IMAGE_PUBLIC_KEY;

  const onError = (err) => {
    console.log("Error", err);
  };

  const onSuccess = (res) => {
    console.log("Success", res);
    setImg((prev) => ({ ...prev, isLoading: false, dbData: res.filePath }));
  };

  const onUploadProgress = (progress) => {
    console.log("Progress", progress);
  };

  const onUploadStart = (evt) => {
    console.log("Start", evt);
    const file = evt.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImg((prev) => ({
        ...prev,
        isLoading: true,
        
        aiData: {
          inlineData: {
            data: reader.result.split(",")[1],
            mimeType: file.type,
          },
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (ikUploadRef.current) {
      ikUploadRef.current.click();
    }
  };

  return (
    <IKContext
      urlEndpoint={urlEndpoint}
      publicKey={publicKey}
      authenticator={authenticator}
    >
      <div className="relative inline-block">
        <IKUpload
          fileName="test-upload.png"
          onError={onError}
          onSuccess={onSuccess}
          useUniqueFileName={true}
          onUploadProgress={onUploadProgress}
          onUploadStart={onUploadStart}
          style={{ display: "none" }}
          ref={ikUploadRef}
        />
        <button
          onClick={handleClick}
          className="cursor-pointer focus:outline-none"
          type="button"
        >
          <Pin className="h-5 w-5 text-blue-500 mr-3" />{" "}
        </button>
      </div>
    </IKContext>
  );
}

export default ImgUpload;
