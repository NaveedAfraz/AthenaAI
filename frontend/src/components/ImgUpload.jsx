import { IKContext, IKImage, IKUpload } from "imagekitio-react";
import { Pin, Loader } from "lucide-react";
import React, { useRef, useState } from "react";

const authenticator = async () => {
  try {
    const response = await fetch("http://localhost:3006/api/img-upload");
    
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
  const ikUploadRef = useRef(null);
  
  const urlEndpoint = import.meta.env.VITE_IMAGE_URL_ENDPOINT;
  const publicKey = import.meta.env.VITE_IMAGE_PUBLIC_KEY;

  const handleError = (error) => {
    console.error("Upload error:", error);
    setIsUploading(false);
    setImg(prev => ({ 
      ...prev, 
      isLoading: false, 
      error: error.message 
    }));
  };

  const handleSuccess = (response) => {
    setIsUploading(false);
    setImg(prev => ({ 
      ...prev, 
      isLoading: false,
      error: null,
      dbData: response.filePath 
    }));
  };

  const handleUploadStart = (event) => {
    const file = event.target.files[0];
    
    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      handleError(new Error('Please upload an image file'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      handleError(new Error('File size must be less than 5MB'));
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    
    reader.onloadend = () => {
      setImg(prev => ({
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
      handleError(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  };

  const handleClick = (e) => {
    e.preventDefault();
    ikUploadRef.current?.click();
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
          onUploadProgress={(progress) => console.log('Upload progress:', progress)}
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
            <Loader className="h-5 w-5 text-blue-500 mr-3 animate-spin" />
          ) : (
            <Pin className="h-5 w-5 text-blue-500 mr-3" />
          )}
        </button>
      </div>
    </IKContext>
  );
}

export default ImgUpload;