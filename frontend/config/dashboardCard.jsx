import { History, Search, Sparkles } from "lucide-react";

const cardItems = [
  {
    id: 1,
    icon: <Search className="h-8 w-8 text-blue-500" />,
    title: "Quick Search",
    description: "Find answers instantly",
    textColor: "text-amber-50",
  },
  {
    id: 2,
    icon: <History className="h-8 w-8 text-blue-500" />,
    title: "Recent Searches",
    description: "View search history",
    textColor: "text-white",
  },
  {
    id: 3,
    icon: <Sparkles className="h-8 w-8 text-blue-500" />,
    title: "AI Suggestions",
    description: "Smart recommendations",
    textColor: "text-white",
  },
];

export default cardItems;