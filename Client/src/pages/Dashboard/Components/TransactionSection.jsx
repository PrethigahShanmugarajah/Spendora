// Client / src / pages / Dashboard / Components / TransactionSection.jsx
import { ChevronDown, ChevronUp } from "lucide-react";

const TransactionSection = ({
  title,
  icon,
  labelColor,
  badgeColor,
  bgColor,
  iconBg,
  textColor,
  emptyIcon,
  emptyText,
  transactions,
  displayedTransactions,
  showAll,
  setShowAll,
  currency,
  timeFrameLabel,
  categoryIcons,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 -mx-8 md:-mx-3 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
        <h3 className="text-xl font-bold text-gray-800 md:mt-3 mt-3 flex items-center gap-3">
          {icon}
          {title}
          <span className="text-sm text-gray-500 font-normal">
            ({timeFrameLabel})
          </span>
        </h3>

        <span className={`text-sm px-2 py-1 rounded-full ${badgeColor}`}>
          {transactions.length} records
        </span>
      </div>

      <div className="space-y-3">
        {displayedTransactions.map((transaction) => {
          const IconComponent =
            categoryIcons[transaction.category] || categoryIcons.Other;

          return (
            <div
              key={transaction.id}
              className={`flex items-center justify-between p-3 rounded-lg ${bgColor}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${iconBg}`}>
                  {IconComponent}
                </div>

                <div>
                  <p className="font-medium text-gray-800">
                    {transaction.description}
                  </p>

                  <p className="text-sm text-gray-500">
                    {transaction.category}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className={`font-bold ${textColor}`}>
                  {currency} {Math.abs(transaction.amount).toLocaleString()}
                </p>

                <p className="text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          );
        })}

        {transactions.length === 0 && (
          <div className="text-center py-8">
            {emptyIcon}
            <p className="text-gray-600 font-medium">{emptyText}</p>
          </div>
        )}

        {transactions.length > 3 && (
          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full flex items-center justify-center gap-2 py-3 text-purple-600 font-medium hover:bg-purple-50 rounded-xl transition-colors"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-5 h-5" /> Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-5 h-5" /> View All (
                  {transactions.length})
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionSection;
