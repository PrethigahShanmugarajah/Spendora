// Client / src / pages / Income / Components / IncomeSummaryCards.jsx
import { Banknote, BarChart2, Calendar, TrendingUp } from "lucide-react";
import FinancialCard from "../../../components/FinancialCard";
import { CURRENCY } from "../../../utils/helpers";

const IncomeSummaryCards = ({
  totalIncome,
  averageIncome,
  transactionsCount,
  timeFrameRange,
  filter,
}) => {
  return (
    <div className="grid grid-cols-1 -mx-4 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
      <FinancialCard
        icon={
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Banknote className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
          </div>
        }
        label="Total Income"
        value={`${CURRENCY} ${Number(totalIncome || 0).toLocaleString()}`}
        additionalContent={
          <div className="mt-2 text-xs text-gray-500 flex items-center">
            <Calendar className="w-3 h-3 mr-1" /> {timeFrameRange.label}
          </div>
        }
      />

      <FinancialCard
        icon={
          <div className="p-2 bg-indigo-100 rounded-lg">
            <BarChart2 className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" />
          </div>
        }
        label="Average Income"
        value={`${CURRENCY} ${Number(averageIncome || 0).toLocaleString()}`}
        additionalContent={
          <div className="mt-2 text-xs text-gray-500 flex items-center">
            <Calendar className="w-3 h-3 mr-1" /> {transactionsCount}{" "}
            transactions
          </div>
        }
      />

      <FinancialCard
        icon={
          <div className="p-2 bg-teal-100 rounded-lg">
            <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-teal-600" />
          </div>
        }
        label="Transactions"
        value={transactionsCount}
        additionalContent={
          <div className="mt-2 text-xs text-gray-500 flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {filter === "all" ? "All records" : "Filtered records"}
          </div>
        }
      />
    </div>
  );
};

export default IncomeSummaryCards;
