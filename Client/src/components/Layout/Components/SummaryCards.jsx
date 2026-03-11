// Client / src / components / Layout / Components / SummaryCards.jsx
import { ArrowDown, ArrowUp, DollarSign, PiggyBank } from "lucide-react";
import { CURRENCY } from "../../../utils/helpers";

const SummaryCards = ({ stats, getSavingsRating }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-6">
      {/* -------- Balance -------- */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-600">Total Balance</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {CURRENCY}{" "}
              {stats.allTimeSavings.toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="bg-purple-100 p-2 rounded-lg">
            <DollarSign className="w-5 h-5 text-purple-600" />
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          <span className="text-purple-600 font-medium">
            +${stats.last30DaysSavings.toLocaleString()}
          </span>
          this month
        </p>
      </div>

      {/* -------- Income -------- */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-600">Monthly Income</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {CURRENCY}{" "}
              {stats.last30DaysIncome.toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="bg-emerald-100 p-2 rounded-lg">
            <ArrowUp className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          <span className="text-emerald-600 font-medium">+12.5%</span>
          from last month
        </p>
      </div>

      {/* -------- Expense -------- */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-600">Monthly Expense</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {CURRENCY}{" "}
              {stats.last30DaysExpenses.toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="bg-amber-100 p-2 rounded-lg">
            <ArrowDown className="w-5 h-5 text-amber-600" />
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          <span
            className={`font-medium ${
              stats.expenseChange > 0 ? "text-amber-600" : "text-emerald-600"
            } `}
          >
            {stats.expenseChange > 0 ? "+" : ""}
            {stats.expenseChange} %
          </span>
          from last month
        </p>
      </div>

      {/* -------- Saving Rate -------- */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-600">Saving Rate</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {stats.savingsRate}%
            </p>
          </div>

          <div className="bg-indigo-100 p-2 rounded-lg">
            <PiggyBank className="w-5 h-5 text-indigo-600" />
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          {getSavingsRating(stats.savingsRate)}
        </p>
      </div>
    </div>
  );
};

export default SummaryCards;
