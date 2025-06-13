import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatLoading = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);

    const steps = [
        { text: "Initializing AI Assistant...", completed: false },
        { text: "Loading Knowledge Base...", completed: false },
        { text: "Preparing Chat Interface...", completed: false },
        { text: "Ready to Chat!", completed: false }
    ];

    const [stepStates, setStepStates] = useState(steps);

    useEffect(() => {
        const stepInterval = setInterval(() => {
            setCurrentStep(prev => {
                if (prev < steps.length - 1) {
                    setStepStates(prevStates =>
                        prevStates.map((step, index) => ({
                            ...step,
                            completed: index <= prev
                        }))
                    );
                    return prev + 1;
                }
                return prev;
            });
        }, 1500);

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev < 100) {
                    return prev + 2;
                }
                return prev;
            });
        }, 50);

        return () => {
            clearInterval(stepInterval);
            clearInterval(progressInterval);
        };
    }, []);

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const avatarVariants = {
        hidden: { scale: 0, rotate: -180 },
        visible: {
            scale: 1,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 15
            }
        }
    };

    const pulseVariants = {
        animate: {
            scale: [1, 1.05, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="flex items-center justify-center h-[100%] bg-gray-50 p-6">
            <motion.div
                className="flex flex-col items-center justify-center mt-36 space-y-8 max-w-md w-full"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* AI Avatar */}
                <motion.div
                    className="relative"
                    variants={avatarVariants}
                >
                    <motion.div
                        className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
                        variants={pulseVariants}
                        animate="animate"
                    >
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V7C3 8.1 3.9 9 5 9H8V11C8 12.1 8.9 13 10 13H14C15.1 13 16 12.1 16 11V9H21ZM7 11V9H5V11H7ZM19 11V9H17V11H19ZM12 15C9.8 15 8 16.8 8 19V21H16V19C16 16.8 14.2 15 12 15Z" />
                        </svg>
                    </motion.div>
                </motion.div>

                {/* Title */}
                <motion.h1
                    className="text-2xl font-bold text-gray-800"
                    variants={itemVariants}
                >
                    AI Assistant
                </motion.h1>

                {/* Status */}
                <AnimatePresence mode="wait">
                    <motion.p
                        key={currentStep}
                        className="text-blue-600 font-medium"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {currentStep === steps.length - 1 ? "Ready to Chat!" : steps[currentStep]?.text}
                    </motion.p>
                </AnimatePresence>
                <motion.div
                    className="w-full bg-gray-200 rounded-full h-2 overflow-hidden"
                    variants={itemVariants}
                >
                    <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ChatLoading;