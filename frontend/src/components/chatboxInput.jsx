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
        // ... (mutationFn, onSuccess, onError remain the same) ...
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

    return (
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 p-4">
            {/* ... your existing JSX ... */}
            <div className="max-w-4xl mx-auto relative">
                {/* Image Preview */}
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