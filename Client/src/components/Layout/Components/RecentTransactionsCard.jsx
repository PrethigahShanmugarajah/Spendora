import {
  Banknote,
  ChevronDown,
  ChevronUp,
  Clock,
  Info,
  RefreshCcw,
} from "lucide-react";
import SpendingByCategoryCard from "./SpendingByCategoryCard.jsx";
import { CURRENCY } from "../../../utils/helpers";
import {
  EXPENSE_CATEGORY_ICONS,
  INCOME_CATEGORY_ICONS,
} from "../../../constants/theme.jsx";
import { FadeLoader } from "react-spinners";

const RecentTransactionsCard = ({
  loading,
  fetchTransactions,
  displayedTransactions,
  showAllTransactions,
  setShowAllTransactions,
  topCategories,
  stats,
}) => {
  const renderListLoader = () => (
    <div className="flex items-center justify-center py-10">
      <FadeLoader height={10} width={4} radius={2} margin={1} color="#8B5CF6" />
    </div>
  );

  return (
    <div className="lg:col-span-1 lg:-mx-3 space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md md:text-xl lg:text-xl xl:text-xl font-bold text-gray-800 flex items-center gap-3">
            <Clock className="w-6 h-6 text-purple-500" />
            Recent Transactions
          </h3>

          <button
            onClick={fetchTransactions}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <RefreshCcw
              className={`w-5 h-5 text-gray-500 ${
                loading ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 bg-indigo-50 p-2 rounded-lg">
          <Info className="w-4 h-4 text-indigo-500" />
          <span>Transactions are stacked by date(newest first)</span>
        </div>

        <div className="space-y-4 max-h-125 -mx-5 overflow-y-auto pr-2">
          {loading ? (
            renderListLoader()
          ) : displayedTransactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-100 flex items-center justify-center">
                <Clock className="w-8 h-8 text-teal-500" />
              </div>
              <p className="text-gray-600 font-medium">
                No recent transactions
              </p>
            </div>
          ) : (
            <>
              {displayedTransactions.map((transaction) => {
                const { id, type, category, description, date, amount } =
                  transaction;
                return (
                  <div
                    key={id}
                    className="flex items-center lg:flex-col xl:flex-row md:flex-row justify-between p-1 mx-0 lg:p-4 md:p-4 hover:bg-gray-50 rounded-xl transition-all duration-300 border border-gray-100"
                  >
                    <div className="flex items-center gap-1 md:gap-4 lg:gap-4">
                      <div
                        className={`p-2 rounded-lg ${
                          type === "income"
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {type === "income"
                          ? INCOME_CATEGORY_ICONS[category] || (
                              <Banknote className="w-4 h-4" />
                            )
                          : EXPENSE_CATEGORY_ICONS[category] || (
                              <Banknote className="w-4 h-4" />
                            )}
                      </div>

                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 truncate max-w-30">
                          {description}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(date).toLocaleDateString()}
                          <span className="ml-2 capitalize">{category}</span>
                        </p>
                      </div>
                    </div>

                    <span
                      className={
                        type === "income"
                          ? "text-emerald-600"
                          : "text-amber-600"
                      }
                    >
                      {type === "income" ? "+" : "-"} {CURRENCY}{" "}
                      {Number(amount)}
                    </span>
                  </div>
                );
              })}

              <div className="pt-4 pb-4 border-t border-gray-100">
                <button
                  onClick={() => setShowAllTransactions(!showAllTransactions)}
                  className="w-full flex items-center justify-center gap-2 py-3 text-purple-600 font-medium hover:bg-purple-50 rounded-xl transition-colors"
                >
                  {showAllTransactions ? (
                    <>
                      <ChevronUp className="w-5 h-5" /> Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-5 h-5" /> Show More
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        <SpendingByCategoryCard
          topCategories={topCategories}
          stats={stats}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default RecentTransactionsCard;
