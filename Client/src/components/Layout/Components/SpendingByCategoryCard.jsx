// Client / src / components / Layout / Components / SpendingByCategoryCard.jsx
import { DollarSign, PieChart } from "lucide-react";
import { CURRENCY } from "../../../utils/helpers";

const SpendingByCategoryCard = ({ topCategories, stats, CATEGORY_ICONS }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg md:text-xl lg:text-xl xl:text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <PieChart className="w-6 h-6 text-violet-500" /> Spending by Category
      </h3>

      <div className="space-y-4">
        {topCategories.map(([category, amount]) => (
          <div
            key={category}
            className="flex items-center md:text-lg lg:text-sm xl:text-lg justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                {CATEGORY_ICONS[category] || (
                  <DollarSign className="w-4 h-4 text-gray-600" />
                )}
              </div>
              <span className="font-medium text-gray-700">{category}</span>
            </div>
            <span className="font-semibold text-gray-800">
              {CURRENCY} {amount}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-linear-to-br from-purple-50 to-violet-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">Total Income</p>
            <p className="text-sm font-bold text-gray-800">
              {CURRENCY} {stats.allTimeIncome.toLocaleString()}
            </p>
          </div>

          <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">Total Expense</p>
            <p className="text-sm font-bold text-gray-800">
              {CURRENCY} {stats.allTimeExpenses.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendingByCategoryCard;
