import { IKContext, IKImage, IKUpload } from "imagekitio-react";
import { Pin, Loader } from "lucide-react";
import React, { useRef, useState } from "react";

const authenticator = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3006"}/api/img-upload`
    );
    if (!response.ok) {
      throw new Error(`Upload authentication failed: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
};

function ImgUpload({ setImg }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // Add this line
  const ikUploadRef = useRef(null);

  const urlEndpoint = import.meta.env.VITE_IMAGE_URL_ENDPOINT;
  const publicKey = import.meta.env.VITE_IMAGE_PUBLIC_KEY;

  const handleError = (error) => {
    console.error("Upload error:", error);
    setIsUploading(false);
    setUploadProgress(0); // Reset progress on error
    setImg((prev) => ({
      ...prev,
      isLoading: false,
      error: error.message,
    }));
  };

  const handleSuccess = (response) => {
    setIsUploading(false);
    setUploadProgress(100); // Set to 100% on success
    setImg((prev) => ({
      ...prev,
      isLoading: false,
      error: null,
      dbData: response.filePath,
    }));
  };

  const handleUploadStart = (event) => {
    const file = event.target.files[0];

    if (!file.type.startsWith("image/")) {
      handleError(new Error("Please upload an image file"));
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      handleError(new Error("File size must be less than 100MB"));
      return;
    }

    setIsUploading(true);
    setUploadProgress(0); // Reset progress on new upload
    const reader = new FileReader();

    reader.onloadend = () => {
      setImg((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        aiData: {
          inlineData: {
            data: reader.result.split(",")[1],
            mimeType: file.type,
          },
        },
      }));
    };

    reader.onerror = () => {
      handleError(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  };

  const handleClick = (e) => {
    e.preventDefault();
    ikUploadRef.current?.click();
  };

  const handleProgress = (progress) => {
    if (Math.abs(progress - uploadProgress) > 5) {
      setUploadProgress(progress);
      if (process.env.NODE_ENV === "development") {
        console.log("Upload progress:", Math.round(progress), "%");
      }
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
          fileName={`upload-${Date.now()}.png`}
          onError={handleError}
          onSuccess={handleSuccess}
          useUniqueFileName={true}
          onUploadProgress={handleProgress}
          onUploadStart={handleUploadStart}
          className="hidden"
          ref={ikUploadRef}
        />
        <button
          onClick={handleClick}
          className="relative cursor-pointer focus:outline-none hover:opacity-80 transition-opacity disabled:opacity-50"
          type="button"
          disabled={isUploading}
          aria-label="Upload image"
        >
          {isUploading ? (
            <div className="flex items-center">
              <Loader className="h-5 w-5 text-blue-500 mr-3 animate-spin" />
              {uploadProgress > 0 && uploadProgress < 100 && (
                <span className="text-xs text-blue-500">
                  {Math.round(uploadProgress)}%
                </span>
              )}
            </div>
          ) : (
            <Pin className="h-5 w-5 text-blue-500 mr-3" />
          )}
        </button>
      </div>
    </IKContext>
  );
}

export default ImgUpload;