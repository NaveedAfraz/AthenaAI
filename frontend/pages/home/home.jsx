import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Zap, Lock, Brain, Sparkles, Bot, ArrowRight } from "lucide-react"; // Removed unused icons
import { motion, useAnimation, useInView } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router";
import Footer from "@/components/common/layouts/footer";
import { cn } from "@/lib/utils";
import Navbar from "@/components/common/layouts/navbar";

const TypeWriter = ({ text, speed }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      if (currentIndex === text.length - 1) {
        setTimeout(() => {
          setCurrentIndex(0);
          setDisplayText("");
        }, 3000);
      }
    }
  }, [currentIndex, text, speed]);

  return <span>{displayText}</span>;
};

const Homepage = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const navigate = useNavigate();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800 overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Animated background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Radial gradient adjusted for light background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100/30 via-transparent to-transparent opacity-50" />
        {/* Grid pattern adjusted for light background */}
        <div className="absolute inset-0 bg-grid-gray-200/[0.2] bg-[size:20px_20px]" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={container}
            className="text-center max-w-4xl mx-auto space-y-6"
          >
            <motion.div variants={item} className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm mb-4 border border-blue-200">
              <Sparkles className="h-4 w-4" />
              <span>Powered by Advanced AI</span>
            </motion.div>

            <motion.h1
              variants={item}
              className="text-5xl md:text-7xl h-[12vh] font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-700 to-pink-700 pb-2"
            >
              <TypeWriter text="Your AI Assistant" speed={120} />
            </motion.h1>

            <motion.p
              variants={item}
              className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              Experience the next generation of AI communication. Smart, secure, and tailored to your needs.
            </motion.p>

            <motion.div variants={item} className="pt-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-purple-700 px-8 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-blue-600/30"
              >
                <span className="relative">Get Started</span>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-24 overflow-hidden">
        {/* Adjusted background gradient for light theme */}
        <div className="absolute -top-1/2 left-0 right-0 h-[200%] -z-10 bg-gradient-to-b from-transparent via-gray-100/50 to-transparent" />
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-700 mb-4">
              Powerful Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover what makes our AI assistant the perfect companion for your daily tasks
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <MessageCircle className="h-8 w-8" />,
                title: "Natural Conversations",
                description: "Engage in fluid, context-aware discussions that feel natural and intuitive.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: <Brain className="h-8 w-8" />,
                title: "Advanced AI",
                description: "Powered by state-of-the-art language models for intelligent responses.",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: <Lock className="h-8 w-8" />,
                title: "Secure & Private",
                description: "Your conversations are encrypted and your privacy is our priority.",
                color: "from-emerald-500 to-teal-500"
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={cn(
                  "group relative h-full bg-white/70 backdrop-blur-sm border border-gray-200 overflow-hidden", // Light background, border
                  "transition-all duration-500 hover:border-transparent hover:shadow-xl hover:shadow-blue-100/50" // Adjusted hover shadow
                )}>
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:via-blue-500/5 group-hover:to-blue-500/10 transition-all duration-700" />
                  <CardHeader className="relative z-10">
                    <div className={cn(
                      "inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 bg-gradient-to-br",
                      feature.color,
                      "text-white shadow-md" // Added shadow for icons
                    )}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900 mb-2"> {/* Dark text for title */}
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed"> {/* Darker text for description */}
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {/* Radial gradient adjusted for light background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent" />
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 md:p-12 overflow-hidden"> {/* Light background, border */}
                <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-blue-100/30 blur-3xl" /> {/* Lightened blur effect */}
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-gradient-to-br from-blue-600 to-purple-700 text-white shadow-lg mx-auto"> {/* Darker gradient, shadow */}
                    <Zap className="h-8 w-8" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"> {/* Dark text */}
                    Ready to experience the future of AI?
                  </h2>
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto"> {/* Darker text */}
                    Join thousands of users who are already boosting their productivity with our AI assistant.
                  </p>
                  <div className="space-y-4 sm:space-y-0 sm:space-x-4">
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-medium rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/20 inline-flex items-center"
                    >
                      Get Started for Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Demo Prompt Section */}
      <div className="container mx-auto px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-xl"> {/* Light background, border */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 border border-blue-200"> {/* Light blue background, dark text */}
                <Bot className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Try asking me...</h3> {/* Dark text */}
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-transparent rounded-lg -m-1" /> {/* Lighter gradient */}
              <div className="relative bg-white/50 backdrop-blur-sm border border-gray-200 rounded-lg p-4"> {/* Lighter background, border */}
                <p className="text-gray-800 font-mono text-sm h-[5vh] md:text-base"> {/* Dark text */}
                  <TypeWriter
                    text='"Help me write a professional email to my team about our upcoming project launch."'
                    speed={30}
                  />
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Homepage;
