import { ArrowDown, ArrowUp, Coins, PiggyBank } from "lucide-react";
import { CURRENCY } from "../../../utils/helpers";
import { BeatLoader } from "react-spinners";

const SummaryCards = ({ stats, getSavingsRating, loading = false }) => {
  const renderValue = (value, color = "#9333EA", prefix = "") => {
    if (loading) {
      return <BeatLoader size={6} color={color} />;
    }

    return (
      <>
        {prefix}
        {value}
      </>
    );
  };

  const renderMeta = (content, color = "#9333EA") => {
    if (loading) {
      return <BeatLoader size={4} color={color} />;
    }

    return content;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-6">
      {/* -------- Balance -------- */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-600">Total Balance</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {renderValue(
                stats.allTimeSavings.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                }),
                "#9333EA",
                `${CURRENCY} `,
              )}
            </p>
          </div>

          <div className="bg-purple-100 p-2 rounded-lg">
            <Coins className="w-5 h-5 text-purple-600" />
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          {renderMeta(
            <>
              <span className="text-purple-600 font-medium">
                +{CURRENCY} {stats.last30DaysSavings.toLocaleString()}
              </span>{" "}
              this month
            </>,
            "#9333EA",
          )}
        </p>
      </div>

      {/* -------- Income -------- */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-600">Monthly Income</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {renderValue(
                stats.last30DaysIncome.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                }),
                "#059669",
                `${CURRENCY} `,
              )}
            </p>
          </div>

          <div className="bg-emerald-100 p-2 rounded-lg">
            <ArrowUp className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          {renderMeta(
            <>
              {stats.incomeChange === null ? (
                <span className="text-gray-500 font-medium">New</span>
              ) : (
                <span
                  className={`font-medium ${
                    stats.incomeChange > 0
                      ? "text-emerald-600"
                      : "text-amber-600"
                  }`}
                >
                  {stats.incomeChange > 0 ? "+" : ""}
                  {stats.incomeChange}%
                </span>
              )}{" "}
              {stats.incomeChange === null ? "this month" : "from last month"}
            </>,
            "#059669",
          )}
        </p>
      </div>

      {/* -------- Expense -------- */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-600">Monthly Expense</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {renderValue(
                stats.last30DaysExpenses.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                }),
                "#D97706",
                `${CURRENCY} `,
              )}
            </p>
          </div>

          <div className="bg-amber-100 p-2 rounded-lg">
            <ArrowDown className="w-5 h-5 text-amber-600" />
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          {renderMeta(
            <>
              {stats.expenseChange === null ? (
                <span className="text-gray-500 font-medium">New</span>
              ) : (
                <span
                  className={`font-medium ${
                    stats.expenseChange > 0
                      ? "text-amber-600"
                      : "text-emerald-600"
                  }`}
                >
                  {stats.expenseChange > 0 ? "+" : ""}
                  {stats.expenseChange}%
                </span>
              )}{" "}
              {stats.expenseChange === null ? "this month" : "from last month"}
            </>,
            "#D97706",
          )}
        </p>
      </div>

      {/* -------- Saving Rate -------- */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-600">Saving Rate</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {renderValue(`${stats.savingsRate}%`, "#4F46E5")}
            </p>
          </div>

          <div className="bg-indigo-100 p-2 rounded-lg">
            <PiggyBank className="w-5 h-5 text-indigo-600" />
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          {renderMeta(getSavingsRating(stats.savingsRate), "#4F46E5")}
        </p>
      </div>
    </div>
  );
};

export default SummaryCards;
