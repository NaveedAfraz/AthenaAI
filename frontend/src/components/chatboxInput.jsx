import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Loader2, Send, Paperclip, X } from 'lucide-react';
import { IKImage } from 'imagekitio-react';
import ImgUpload from "./ImgUpload";

// --- Imports for logic ---
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "@clerk/clerk-react";
import { ChatContext } from "@/GlobalContext";
import { useChat } from "@/hooks/useChat";

export default function ChatBoxInput({
    img,
    setImg,
    setAnswer,
    setMessages,
    messages,
}) {
    const {
        setShowQuestion,
        question,
        setQuestion,
    } = useContext(ChatContext);

    const { userId } = useAuth();
    const location = useLocation();
    const sliced = location.pathname.split("/");
    const chatID = sliced[3];
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { sendMessageToAI } = useChat();

    const { mutate: sendMessageMutation, isLoading } = useMutation({
        mutationFn: async ({ answer, question, conversationId, image }) => {
            try {
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3006"}/api/send-message`, { question, answer, conversationId, image }, { withCredentials: true });
                return response.data;
            } catch (error) {
                console.error(error);
                throw new Error(error.message);
            }
        },
        onSuccess: (data) => {
            console.log("Saved to DB:", data);
            queryClient.invalidateQueries({ queryKey: ["getMessages", chatID] });
        },
        onError: (error) => {
            console.error("Mutation Error:", error);
        },
    });

    // In ChatBoxInput.jsx

    const handleSendMessage = async () => {
        // Nothing to do if no text and no image
        if (!question.trim() && !(img?.aiData && Object.keys(img.aiData).length)) return;

        try {
            setShowQuestion(true);
            setAnswer(""); // Clear any previous answer

            // If there's an image, we'll need to handle it differently
            // For now, we'll just send the text message
            if (question.trim()) {
                // Format chat history for context
                const chatHistory = messages.map(msg => ({
                    sender: 'user',
                    message: msg.question,
                }));

                // Add the current message to the history
                chatHistory.push({
                    sender: 'user',
                    message: question,
                });
                console.log(img, "img.aiData");
                // Get AI response
                const aiResponse = await sendMessageToAI(question, chatHistory, img?.dbData);

                // Update the answer in the UI
                setAnswer(aiResponse);

                // Update messages with the full Q&A
                const newMessage = {
                    question,
                    answer: aiResponse,
                    timestamp: new Date().toISOString()
                };

                setMessages(prev => [...prev, newMessage]);

                // Save to backend
                sendMessageMutation({
                    question,
                    answer: aiResponse,
                    conversationId: chatID,
                    image: img?.dbData,
                });

                // Reset inputs
                setQuestion("");
                setImg({ isLoading: false, error: null, dbData: {}, aiData: {} });
                setShowQuestion(false);
            }
        } catch (err) {
            console.error("Error sending message:", err);
            // Handle error state if needed
        }
    };


    // ... (handleKeyDown and the return JSX remain the same) ...
    const handleKeyDown = e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }; 
    console.log(img, "img.aiData");

    return (
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 p-4">
            {/* ... your existing JSX ... */}
            <div className="max-w-4xl mx-auto relative object-contain ">
                {/* Image Preview */}
                {img?.dbData.length > 0 && (
                    <div className="relative inline-block mt-2 w-15 mb-2 h-20">
                        <img
                            src={`${import.meta.env.VITE_IMAGE_URL_ENDPOINT}/${img.dbData}`}
                            alt="Uploaded Preview"
                            className="max-h-40 rounded-md shadow-md w-full h-full"
                        />
                        <button
                            onClick={() => setImg({ isLoading: false, error: null, dbData: null, aiData: null })}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            aria-label="Remove image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}
                <div className="flex items-end space-x-2">
                    <ImgUpload setImg={setImg} />
                    <div className="flex-1 relative">
                        <Input
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                            disabled={isLoading}
                            className="pr-12"
                        />
                        <Button
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                            size="icon"
                            onClick={handleSendMessage}
                            disabled={isLoading || (!question.trim() && !(img?.dbData && Object.keys(img.dbData).length > 0))}
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}