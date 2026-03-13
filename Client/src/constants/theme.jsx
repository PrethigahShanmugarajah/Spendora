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
  Laptop,
  Building2,
  GraduationCap,
  Landmark,
  Coins,
  Key,
  Zap,
  HeartPulse,
} from "lucide-react";

export const GAUGE_COLORS = {
  Income: {
    gradientStart: "#10B981",
    gradientEnd: "#059669",
    text: "text-emerald-600",
    bg: "bg-emerald-100",
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

export const EXPENSE_CHART_COLORS = [
  "#92400E",
  "#B45309",
  "#D97706",
  "#F59E0B",
  "#FBBF24",
  "#FCD34D",
  "#FDE68A",
];

export const INCOME_CHART_COLORS = [
  "#065F46",
  "#047857",
  "#059669",
  "#10B981",
  "#34D399",
  "#6EE7B7",
  "#A7F3D0",
];

export const INCOME_COLORS = [
  "#00C49F",
  "#33D6B2",
  "#66E2C4",
  "#99EDD7",
  "#CCF7EA",
];

export const EXPENSE_COLORS = [
  "#F59E0B",
  "#F7B733",
  "#F9C95C",
  "#FBD98C",
  "#FDEAC0",
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
  Salary: <Briefcase className="w-5 h-5 text-emerald-600" />,
  Freelance: <Laptop className="w-5 h-5 text-emerald-600" />,
  Business: <Building2 className="w-5 h-5 text-emerald-600" />,
  Tuition: <GraduationCap className="w-5 h-5 text-emerald-600" />,
  Rental: <Key className="w-5 h-5 text-emerald-600" />,
  "Bank Interest": <Landmark className="w-5 h-5 text-emerald-600" />,
  Other: <Coins className="w-5 h-5 text-emerald-600" />,
};

export const EXPENSE_CATEGORY_ICONS = {
  Groceries: <ShoppingCart className="w-5 h-5 text-amber-600" />,
  Dining: <Utensils className="w-5 h-5 text-amber-600" />,
  Rent: <Home className="w-5 h-5 text-amber-600" />,
  Utilities: <Zap className="w-5 h-5 text-amber-600" />,
  Transport: <Car className="w-5 h-5 text-amber-600" />,
  Healthcare: <HeartPulse className="w-5 h-5 text-amber-600" />,
  Other: <Coins className="w-5 h-5 text-amber-600" />,
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
