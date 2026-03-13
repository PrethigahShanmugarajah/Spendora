// Client / src / pages / Dashboard / Components / DashboardSummaryCards.jsx
import {
  ArrowDown,
  BarChart2,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import FinancialCard from "../../../components/FinancialCard";
import { CURRENCY } from "../../../utils/helpers";

const DashboardSummaryCards = ({
  displayIncome,
  displayExpenses,
  displaySavings,
  expenseChange,
  prevTimeFrameRange,
  timeFrameRange,
  overviewMeta,
}) => {
  return (
    <div className="grid grid-cols-1 lg:-mx-3 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
      <FinancialCard
        icon={
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Wallet className="w-5 h-5 text-emerald-600" />
          </div>
        }
        label="Total Balance"
        value={`${CURRENCY} ${Math.round(displayIncome - displayExpenses).toLocaleString()}`}
        additionalContent={
          <div className="flex items-center gap-2 mt-2 text-sm">
            <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-lg text-xs">
              + {CURRENCY} {Math.round(displayIncome).toLocaleString()}
            </span>

            <span className="bg-amber-100 text-amber-800 px-1 py-1 rounded-lg text-xs">
              - {CURRENCY} {Math.round(displayExpenses).toLocaleString()}
            </span>
          </div>
        }
      />

      <FinancialCard
        icon={
          <div className="p-2 bg-amber-100 rounded-lg">
            <ArrowDown className="w-5 h-5 text-amber-600" />
          </div>
        }
        label={`${timeFrameRange.label} Expenses`}
        value={`${CURRENCY} ${Math.round(displayExpenses).toLocaleString()}`}
        additionalContent={
          <div
            className={`mt-2 text-xs text-amber-600 flex items-center gap-2 ${
              expenseChange >= 0 ? "text-amber-600" : "text-emerald-600"
            }`}
          >
            {expenseChange >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}

            <span>
              {Math.abs(expenseChange)}%{" "}
              {expenseChange >= 0 ? "increase" : "decrease"} from{" "}
              {prevTimeFrameRange.label}
            </span>
          </div>
        }
      />

      <FinancialCard
        icon={
          <div className="p-2 bg-violet-100 rounded-lg">
            <PiggyBank className="w-5 h-5 text-violet-600" />
          </div>
        }
        label={`${timeFrameRange.label} Savings`}
        value={`${CURRENCY} ${Math.round(displaySavings).toLocaleString()}`}
        additionalContent={
          <div className="mt-2 text-xs text-violet-600 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <BarChart2 className="w-4 h-4" />

              <span>
                {displayIncome > 0
                  ? Math.round((displaySavings / displayIncome) * 100)
                  : 0}
                % of income
              </span>
            </div>

            {typeof overviewMeta.savingsRate === "number" && (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  overviewMeta.savingsRate < 0
                    ? "bg-rose-100 text-rose-700"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {overviewMeta.savingsRate}%
              </span>
            )}
          </div>
        }
      />
    </div>
  );
};

export default DashboardSummaryCards;
