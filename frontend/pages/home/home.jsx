import React, { useState, useEffect } from "react";
import { MessageCircle, Zap, Lock, Brain, ChevronRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useNavigate } from "react-router";
import Footer from "@/components/common/layouts/footer";

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
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div
          className={`text-center max-w-3xl mx-auto transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="text-5xl font-bold mb-6 bg-clip-text h-16 text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
            <TypeWriter text="Your AI Assistant" speed={100}></TypeWriter>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Experience the next generation of AI communication. Smart, secure,
            and tailored to your needs.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all duration-300 hover:scale-105 flex items-center mx-auto"
          >
            Get Started <ChevronRight className="ml-2" size={20} />
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <MessageCircle className="h-12 w-12 text-blue-400 mb-4" />,
              title: "Natural Conversations",
              description:
                "Engage in fluid, context-aware discussions that feel natural and intuitive.",
            },
            {
              icon: <Brain className="h-12 w-12 text-blue-400 mb-4" />,
              title: "Advanced AI",
              description:
                "Powered by state-of-the-art language models for intelligent responses.",
            },
            {
              icon: <Lock className="h-12 w-12 text-blue-400 mb-4" />,
              title: "Secure & Private",
              description:
                "Your Conversations are encrypted and your privacy is our priority.",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-750"
            >
              <CardHeader>
                {feature.icon}
                <CardTitle className="text-white">{feature.title}</CardTitle>
                <CardDescription className="text-gray-300">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Demo Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gray-800 rounded-2xl p-8 text-white transform transition-all duration-500 hover:scale-[1.02]">
          <div className="max-w-2xl mx-auto text-center">
            <Zap className="h-16 w-16 text-yellow-400 mx-auto mb-6 animate-bounce" />
            <h2 className="text-3xl font-bold mb-4">Try It Now</h2>
            <p className="text-gray-300 mb-8">
              Experience the power of AI-driven Conversations. Ask anything and
              get intelligent, helpful responses in real-time.
            </p>
            <div className="bg-gray-700 rounded-lg p-4 text-left">
              <p className="text-gray-400 mb-2">Example:</p>
              <p className="text-white">
                <TypeWriter
                  text='"Help me write a professional email to my team about our upcoming project launch."'
                  speed={50}
                />
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Homepage;
