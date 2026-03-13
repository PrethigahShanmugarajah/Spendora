// Client / src / components / TransactionsSection.jsx
import { Banknote, Eye, Plus } from "lucide-react";
import TransactionItem from "./TransactionItem";
import FilterSection from "./FilterSection";

const STYLE_MAP = {
  default: {
    iconText: "text-purple-500",
    emptyBg: "bg-purple-50",
    emptyIcon: "text-purple-400",
    viewAllText: "text-purple-600",
    viewAllHover: "hover:bg-purple-50",
    buttonGradient: "from-purple-600 to-fuchsia-600",
    buttonHover: "hover:from-purple-700 hover:to-fuchsia-700",
    filterVariant: "purple",
    loaderColor: "#A855F7",
  },
  income: {
    iconText: "text-emerald-500",
    emptyBg: "bg-emerald-50",
    emptyIcon: "text-emerald-400",
    viewAllText: "text-emerald-600",
    viewAllHover: "hover:bg-emerald-50",
    buttonGradient: "from-emerald-600 to-green-600",
    buttonHover: "hover:from-emerald-700 hover:to-green-700",
    filterVariant: "emerald",
    loaderColor: "#10B981",
  },
  expense: {
    iconText: "text-amber-500",
    emptyBg: "bg-amber-50",
    emptyIcon: "text-amber-400",
    viewAllText: "text-amber-600",
    viewAllHover: "hover:bg-amber-50",
    buttonGradient: "from-amber-600 to-orange-600",
    buttonHover: "hover:from-amber-700 hover:to-orange-700",
    filterVariant: "amber",
    loaderColor: "#F59E0B",
  },
};

const TransactionsSection = ({
  title = "Transactions",
  type = "default",
  timeFrameRange,
  filter,
  setFilter,
  handleExport,
  exportLoading,
  filterOptions = [],
  filteredTransactions = [],
  showAll,
  setShowAll,
  editingId,
  editForm,
  setEditForm,
  handleEditTransaction,
  handleDeleteTransaction,
  loading,
  setEditingId,
  setShowModal,
  categoryIcons = {},
  emptyTitle = "No transactions found",
  emptyDescription = "No matching transactions found",
  addButtonText = "Add Transaction",
}) => {
  const styles = STYLE_MAP[type] || STYLE_MAP.default;

  return (
    <div className="bg-white rounded-xl -mx-7 md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 mb-4 md:mb-6">
        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-5 flex items-center gap-2 md:gap-3">
          <Banknote className={`w-5 h-5 md:w-6 md:h-6 ${styles.iconText}`} />
          {title}
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
          variant={styles.filterVariant}
          loaderColor={styles.loaderColor}
          options={filterOptions}
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
              loading={loading}
              type={type === "default" ? "expense" : type}
              categoryIcons={categoryIcons}
              setEditingId={setEditingId}
            />
          ))}

        {!showAll && filteredTransactions.length > 8 && (
          <button
            onClick={() => setShowAll(true)}
            className={`mt-4 w-full text-center py-3 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 ${styles.viewAllText} ${styles.viewAllHover}`}
          >
            <Eye size={18} /> View All {filteredTransactions.length}{" "}
            Transactions
          </button>
        )}

        {filteredTransactions.length === 0 && (
          <div className="text-center py-6 md:py-8">
            <div
              className={`w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-full flex items-center justify-center ${styles.emptyBg}`}
            >
              <Banknote
                className={`w-6 h-6 md:w-8 md:h-8 ${styles.emptyIcon}`}
              />
            </div>

            <p className="text-gray-600 font-medium text-sm md:text-base">
              {emptyTitle}
            </p>

            <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">
              {emptyDescription}
            </p>

            <button
              onClick={() => setShowModal(true)}
              className={`mt-3 md:mt-4 flex items-center gap-2 bg-linear-to-r ${styles.buttonGradient} ${styles.buttonHover} text-white px-3 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl transition-all shadow-md hover:shadow-lg mx-auto text-sm md:text-base`}
            >
              <Plus size={16} className="md:size-5" /> {addButtonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsSection;
