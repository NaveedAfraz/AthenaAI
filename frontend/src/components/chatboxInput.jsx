import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Loader2, Send, Paperclip, X } from 'lucide-react';
import { IKImage } from 'imagekitio-react';
import ImgUpload from "./ImgUpload";

// --- Imports for logic ---
import axios from "axios";
import model from "@/lib/GEMINI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "@clerk/clerk-react";
import { ChatContext } from "@/GlobalContext";

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

    const { mutate: sendMessageMutation, isLoading } = useMutation({
        // ... (mutationFn, onSuccess, onError remain the same) ...
        mutationFn: async ({ answer, question, conversationId, image }) => {
            try {
                const response = await axios.post("http://localhost:3006/api/send-message", { question, answer, conversationId, image }, { withCredentials: true });
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
        // 1) nothing to do if no text _and_ no image
        if (!question.trim() && !(img?.aiData && Object.keys(img.aiData).length)) return;

        const chat = model.startChat({
            generationConfig: {},
        });

        try {
            setShowQuestion(true);

            // 5) choose prompt payload (image+text or just text)
            const prompt = (img?.aiData && Object.keys(img.aiData).length)
                ? [img.aiData, question]
                : [question];

            // 6) kick off streaming
            const stream = await chat.sendMessageStream(prompt);

            // 7) accumulate text locally—don't touch messages yet
            let accumulated = "";
            for await (const chunk of stream.stream) {
                const txt = chunk.text();
                accumulated += txt;
                setAnswer(prev => prev + txt);
            }

            // 8) once complete, now _append_ your new turn with full Q and A
            setMessages(prev => [
                ...prev,
                { question, answer: accumulated }
            ]);

            // 9) persist to your backend
            sendMessageMutation({
                question,
                answer: accumulated,
                conversationId: chatID,
                image: img?.dbData,
            });

            // 10) reset inputs
            setAnswer("");
            setQuestion("");
            setImg({ isLoading: false, error: null, dbData: {}, aiData: {} });
            setShowQuestion(false);

        } catch (err) {
            console.error("Error sending message:", err);
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