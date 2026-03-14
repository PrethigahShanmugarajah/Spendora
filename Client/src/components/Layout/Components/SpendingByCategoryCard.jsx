import { DollarSign, PieChart } from "lucide-react";
import { CURRENCY } from "../../../utils/helpers";
import {
  EXPENSE_CATEGORY_ICONS,
  INCOME_CATEGORY_ICONS,
} from "../../../constants/theme";
import { BeatLoader, FadeLoader } from "react-spinners";

const SpendingByCategoryCard = ({ topCategories, stats, loading = false }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg md:text-xl lg:text-xl xl:text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <PieChart className="w-6 h-6 text-violet-500" /> Spending by Category
      </h3>

      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <FadeLoader
              height={10}
              width={4}
              radius={2}
              margin={1}
              color="#8B5CF6"
            />
          </div>
        ) : (
          topCategories.map(([category, amount]) => (
            <div
              key={category}
              className="flex items-center md:text-lg lg:text-sm xl:text-lg justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    INCOME_CATEGORY_ICONS[category]
                      ? "bg-emerald-100 text-emerald-600"
                      : EXPENSE_CATEGORY_ICONS[category]
                        ? "bg-amber-100 text-amber-600"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {INCOME_CATEGORY_ICONS[category] ||
                    EXPENSE_CATEGORY_ICONS[category] || (
                      <DollarSign className="w-4 h-4" />
                    )}
                </div>

                <span className="font-medium text-gray-700">{category}</span>
              </div>

              <span className="font-semibold text-gray-800">
                {CURRENCY} {amount}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-linear-to-br from-emerald-50 to-green-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">Total Income</p>
            <p className="text-sm font-bold text-gray-800 min-h-5 flex items-center">
              {loading ? (
                <BeatLoader size={5} color="#059669" />
              ) : (
                <>
                  {CURRENCY} {stats.allTimeIncome.toLocaleString()}
                </>
              )}
            </p>
          </div>

          <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">Total Expense</p>
            <p className="text-sm font-bold text-gray-800 min-h-5 flex items-center">
              {loading ? (
                <BeatLoader size={5} color="#D97706" />
              ) : (
                <>
                  {CURRENCY} {stats.allTimeExpenses.toLocaleString()}
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendingByCategoryCard;
