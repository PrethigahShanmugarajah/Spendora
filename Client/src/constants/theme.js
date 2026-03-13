// Client / src / constants / theme.jsx
import {
  Utensils,
  Home,
  Car,
  ShoppingCart,
  Gift,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart2,
  ArrowUp,
  FileText,
  Briefcase,
  CreditCard,
  ShoppingBag,
  Film,
  Wifi,
  Heart,
} from "lucide-react";

export const GAUGE_COLORS = {
  Income: {
    gradientStart: "#9333EA",
    gradientEnd: "#7E22CE",
    text: "text-purple-600",
    bg: "bg-purple-100",
  },
  Spent: {
    gradientStart: "#F59E0B",
    gradientEnd: "#D97706",
    text: "text-amber-600",
    bg: "bg-amber-100",
  },
  Savings: {
    gradientStart: "#7C3AED",
    gradientEnd: "#6D28D9",
    text: "text-violet-600",
    bg: "bg-violet-100",
  },
};

export const COLORS = [
  "#9333EA",
  "#7E22CE",
  "#7C3AED",
  "#6D28D9",
  "#F59E0B",
  "#D97706",
  "#A855F7",
];

export const INCOME_COLORS = [
  "#00C49F",
  "#33D6B2",
  "#66E2C4",
  "#99EDD7",
  "#CCF7EA",
];

export const CATEGORY_ICONS_Inc = {
  Salary: <TrendingUp className="w-4 h-4" />,
  Freelance: <BarChart2 className="w-4 h-4" />,
  Investment: <ArrowUp className="w-4 h-4" />,
  Bonus: <FileText className="w-4 h-4" />,
  Other: <DollarSign className="w-4 h-4" />,
};

export const CATEGORY_ICONS = {
  Food: <Utensils className="w-4 h-4" />,
  Housing: <Home className="w-4 h-4" />,
  Transport: <Car className="w-4 h-4" />,
  Shopping: <ShoppingCart className="w-4 h-4" />,
  Entertainment: <Gift className="w-4 h-4" />,
  Utilities: <Home className="w-4 h-4" />,
  Healthcare: <Gift className="w-4 h-4" />,
  Salary: <TrendingUp className="w-4 h-4" />,
  Freelance: <TrendingDown className="w-4 h-4" />,
  Other: <DollarSign className="w-4 h-4" />,
};

export const INCOME_CATEGORY_ICONS = {
  Salary: <Briefcase className="w-5 h-5 text-emerald-500" />,
  Freelance: <CreditCard className="w-5 h-5 text-emerald-500" />,
  Investment: <TrendingUp className="w-5 h-5 text-emerald-500" />,
  Gift: <Gift className="w-5 h-5 text-emerald-500" />,
  Other: <DollarSign className="w-5 h-5 text-emerald-500" />,
};

export const EXPENSE_CATEGORY_ICONS = {
  Food: <Utensils className="w-5 h-5 text-amber-500" />,
  Housing: <Home className="w-5 h-5 text-amber-500" />,
  Transport: <Car className="w-5 h-5 text-amber-500" />,
  Shopping: <ShoppingBag className="w-5 h-5 text-amber-500" />,
  Entertainment: <Film className="w-5 h-5 text-amber-500" />,
  Utilities: <Wifi className="w-5 h-5 text-amber-500" />,
  Healthcare: <Heart className="w-5 h-5 text-amber-500" />,
  Other: <ShoppingCart className="w-5 h-5 text-amber-500" />,
};

export const colorClasses = {
  income: {
    bg: "bg-purple-100",
    text: "text-purple-600",
    border: "border-purple-200",
    ring: "ring-purple-500",
    button: "bg-purple-500 hover:bg-purple-600 text-white",
    iconBg: "bg-purple-100 text-purple-600",
  },
  expense: {
    bg: "bg-amber-100",
    text: "text-amber-600",
    border: "border-amber-200",
    ring: "ring-amber-500",
    button: "bg-amber-500 hover:bg-amber-600 text-white",
    iconBg: "bg-amber-100 text-amber-600",
  },
};
