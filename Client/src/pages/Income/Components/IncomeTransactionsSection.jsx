// Client / src / pages / Income / Components / IncomeTransactionsSection.jsx
import { Banknote, Eye, Plus } from "lucide-react";
import FilterSection from "./FilterSection";
import TransactionItem from "../../../components/TransactionItem";
import { CATEGORY_ICONS_Inc } from "../../../constants/theme";

const IncomeTransactionsSection = ({
  timeFrameRange,
  filter,
  setFilter,
  handleExport,
  exportLoading,
  filteredTransactions,
  showAll,
  setShowAll,
  editingId,
  editForm,
  setEditForm,
  handleEditTransaction,
  handleDeleteTransaction,
  setEditingId,
  setShowModal,
}) => {
  return (
    <div className="bg-white rounded-xl -mx-7 md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 mb-4 md:mb-6">
        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-5 flex items-center gap-2 md:gap-3">
          <Banknote className="w-5 h-5 md:w-6 md:h-6 text-emerald-500" />
          Income Transactions
          <span className="text-sm text-gray-500 font-normal">
            {" "}
            ({timeFrameRange.label})
          </span>
        </h3>

        <FilterSection
          filter={filter}
          setFilter={setFilter}
          handleExport={handleExport}
          exportLoading={exportLoading}
        />
      </div>

      <div className="space-y-3 -mx-3 lg:mx-0 md:mx-0">
        {filteredTransactions
          .slice(0, showAll ? filteredTransactions.length : 8)
          .map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              isEditing={editingId === transaction.id}
              editForm={editForm}
              setEditForm={setEditForm}
              onSave={handleEditTransaction}
              onCancel={() => setEditingId(null)}
              onDelete={handleDeleteTransaction}
              type="income"
              categoryIcons={CATEGORY_ICONS_Inc}
              setEditingId={setEditingId}
            />
          ))}

        {!showAll && filteredTransactions.length > 8 && (
          <button
            onClick={() => setShowAll(true)}
            className="mt-4 w-full text-center py-3 text-emerald-600 font-medium hover:bg-emerald-50 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Eye size={18} /> View All {filteredTransactions.length}{" "}
            Transactions
          </button>
        )}

        {filteredTransactions.length === 0 && (
          <div className="text-center py-6 md:py-8">
            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-full bg-emerald-50 flex items-center justify-center">
              <Banknote className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" />
            </div>
            <p className="text-gray-600 font-medium text-sm md:text-base">
              No income transactions found
            </p>
            <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">
              {filter === "all"
                ? "You haven't recorded any income yet"
                : `No ${filter} transactions found`}
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-3 md:mt-4 flex items-center gap-2 bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-3 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl transition-all shadow-md hover:shadow-lg mx-auto text-sm md:text-base"
            >
              <Plus size={16} className="md:size-5" /> Add Income
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomeTransactionsSection;
