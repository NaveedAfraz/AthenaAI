import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Bot, User, Image as ImageIcon, Send, Paperclip } from 'lucide-react'
import { useChat } from '@/hooks/useChat'
function ChatBoxInput() {
    const {
        messages,
        answer,
        img,
        endMessageRef,
        isError,
        isLoading,
        error,
        setAnswer,
        setImg,
        refreshConversation,
        setMessages
    } = useChat();

    const handleSendMessage = async () => {
        if (!answer.trim() && !img) return;

        try {
            let imagePath = null;

            if (img && img instanceof File) {
                const formData = new FormData();
                formData.append("image", img);

                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/upload`, {
                    method: "POST",
                    body: formData,
                });

                const data = await res.json();

                if (!res.ok) throw new Error(data.message || "Image upload failed");

                imagePath = data.path; // e.g., 'uploads/xyz.jpg'
            }

            // Now send the message with optional image path
            const messagePayload = {
                question: answer,
                image: imagePath,
            };

            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/chat/send`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(messagePayload),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Message send failed");

            // Optionally: update message state
            setMessages(prev => [...prev, data]);
            setAnswer("");
            setImg(null);
        } catch (err) {
            console.error("Send message error:", err);
            // Show toast or error UI
        }
    };

    console.log(img);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    
    return (
        <div className={`border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 relative ${img?.aiData && Object.keys(img.aiData).length > 0 ? 'mt-17' : ''}`} style={{ zIndex: 0 }}>
            <div className="max-w-4xl mx-auto overflow-visible">
                <div className="relative flex items-end space-x-3">
                    {/* Image preview */}
                    {/* Local file preview (before sending) */}
                    {img instanceof File && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute left-0 bottom-[115%] p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                        >
                            <div className="relative">
                                <img
                                    src={URL.createObjectURL(img)}
                                    alt="Preview"
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <button
                                    onClick={() => setImg(null)}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                >
                                    ×
                                </button>
                            </div>
                        </motion.div>
                    )}


                    {/* File input */}
                    <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                setImg(file);
                            }
                        }}
                    />

                    {/* Attach button */}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-12 w-12 rounded-full p-0 flex-shrink-0"
                        onClick={() => document.getElementById('image-upload')?.click()}
                    >
                        <Paperclip className="h-4 w-4" />
                    </Button>

                    {/* Text input */}
                    <div className="flex-1 relative">
                        <Input
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                            className="w-full h-12 pr-12 rounded-full border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700"
                            disabled={isLoading}
                        />
                        <Button
                            type="button"
                            onClick={handleSendMessage}
                            disabled={isLoading || (!answer.trim() && !img)}
                            className="absolute right-1 top-1 h-10 w-10 rounded-full p-0 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Helper text */}
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Press Enter to send, Shift+Enter for new line</span>
                    <span>Powered by Athena AI</span>
                </div>
            </div>
        </div>
    )
}

export default ChatBoxInput