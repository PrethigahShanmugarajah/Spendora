import { Banknote, BarChart2, Calendar } from "lucide-react";
import FinancialCard from "./FinancialCard";
import { CURRENCY } from "../utils/helpers";
import { BeatLoader } from "react-spinners";

const OverviewSummaryCards = ({
  totalValue = 0,
  averageValue = 0,
  transactionsCount = 0,
  timeFrameRange,
  filter,
  type = "default",
  TrendIcon,
  loading = false,
}) => {
  const colorMap = {
    default: {
      bg: "bg-purple-100",
      text: "text-purple-600",
    },
    income: {
      bg: "bg-emerald-100",
      text: "text-emerald-600",
    },
    expense: {
      bg: "bg-amber-100",
      text: "text-amber-600",
    },
  };

  const loaderColorMap = {
    default: "#9333EA",
    income: "#059669",
    expense: "#D97706",
  };

  const loaderColor = loaderColorMap[type] || loaderColorMap.default;

  const renderValue = (value, isCurrency = false) => {
    if (loading) {
      return (
        <div className="items-center mt-2">
          <BeatLoader size={6} color={loaderColor} />
        </div>
      );
    }

    return isCurrency
      ? `${CURRENCY} ${Number(value || 0).toLocaleString()}`
      : Number(value || 0).toLocaleString();
  };

  const { bg, text } = colorMap[type] || colorMap.default;

  const totalLabel =
    type === "income"
      ? "Total Income"
      : type === "expense"
        ? "Total Expense"
        : "Total Amount";

  const averageLabel =
    type === "income"
      ? "Average Income"
      : type === "expense"
        ? "Average Expense"
        : "Average Amount";

  return (
    <div className="grid grid-cols-1 -mx-4 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
      <FinancialCard
        icon={
          <div className={`p-2 ${bg} rounded-lg`}>
            <Banknote className={`w-4 h-4 md:w-5 md:h-5 ${text}`} />
          </div>
        }
        label={totalLabel}
        value={renderValue(totalValue, true)}
        additionalContent={
          <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {loading ? (
              <BeatLoader size={4} color={loaderColor} />
            ) : (
              <span>{timeFrameRange?.label}</span>
            )}
          </div>
        }
      />

      <FinancialCard
        icon={
          <div className={`p-2 ${bg} rounded-lg`}>
            <BarChart2 className={`w-4 h-4 md:w-5 md:h-5 ${text}`} />
          </div>
        }
        label={averageLabel}
        value={renderValue(averageValue, true)}
        additionalContent={
          <div className="mt-2 text-xs text-gray-500 flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {loading ? (
              <BeatLoader size={4} color={loaderColor} />
            ) : (
              `${transactionsCount} transactions`
            )}
          </div>
        }
      />

      <FinancialCard
        icon={
          <div className={`p-2 ${bg} rounded-lg`}>
            {TrendIcon && (
              <TrendIcon className={`w-4 h-4 md:w-5 md:h-5 ${text}`} />
            )}
          </div>
        }
        label="Transactions"
        value={renderValue(transactionsCount)}
        additionalContent={
          <div className="mt-2 text-xs text-gray-500 flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {loading ? (
              <BeatLoader size={4} color={loaderColor} />
            ) : (
              <span>
                {filter === "all" ? "All records" : "Filtered records"}
              </span>
            )}
          </div>
        }
      />
    </div>
  );
};

export default OverviewSummaryCards;
