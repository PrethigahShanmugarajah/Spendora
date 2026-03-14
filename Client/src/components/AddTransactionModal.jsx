import { X } from "lucide-react";
import { InputField } from "./FormField/InputField";
import { SelectInput } from "./FormField/SelectInput";
import { ClipLoader } from "react-spinners";

const AddTransactionModal = ({
  showModal,
  setShowModal,
  newTransaction,
  setNewTransaction,
  handleAddTransaction,
  loading = false,
  type = "both",
  title = "Add New Transaction",
  buttonText = "Add Transaction",
  incomeCategories = [
    "Salary",
    "Freelance",
    "Business",
    "Tuition",
    "Rental",
    "Bank Interest",
    "Other",
  ],
  expenseCategories = [
    "Groceries",
    "Dining",
    "Rent",
    "Utilities",
    "Transport",
    "Healthcare",
    "Other",
  ],
}) => {
  if (!showModal) return null;

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentDate = today.toISOString().split("T")[0];
  const minDate = `${currentYear}-01-01`;

  const selectedCategories =
    newTransaction.type === "income" ? incomeCategories : expenseCategories;

  const categoryOptions = selectedCategories.map((cat) => ({
    label: cat,
    value: cat,
  }));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddTransaction();
          }}
        >
          <div className="space-y-4">
            <InputField
              label="Description"
              labelPosition="top"
              name="description"
              type="text"
              value={newTransaction.description}
              onChange={(value) =>
                setNewTransaction((prev) => ({
                  ...prev,
                  description: value,
                }))
              }
              placeholder={
                type === "both" ? "Salary, Funds, etc" : "Groceries, Rent, etc"
              }
              size="s"
              variant={newTransaction.type === "income" ? "emerald" : "amber"}
              required
            />

            <InputField
              label="Amount"
              labelPosition="top"
              name="amount"
              type="number"
              value={newTransaction.amount}
              onChange={(value) =>
                setNewTransaction((prev) => ({
                  ...prev,
                  amount: value,
                }))
              }
              placeholder="LKR 100.00"
              size="s"
              variant={newTransaction.type === "income" ? "emerald" : "amber"}
              required
            />

            {type === "both" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>

                <div className="flex gap-4">
                  {["income", "expense"].map((t) => {
                    const isActive = newTransaction.type === t;

                    const activeStyle =
                      t === "income"
                        ? "bg-emerald-500 text-white shadow-md"
                        : "bg-amber-500 text-white shadow-md";

                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() =>
                          setNewTransaction((prev) => {
                            const nextCategories =
                              t === "income"
                                ? incomeCategories
                                : expenseCategories;

                            return {
                              ...prev,
                              type: t,
                              category: nextCategories.includes(prev.category)
                                ? prev.category
                                : nextCategories[0],
                            };
                          })
                        }
                        className={`flex-1 py-2 rounded-lg font-medium ${
                          isActive
                            ? activeStyle
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        {t === "income" ? "Income" : "Expense"}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <SelectInput
              label="Category"
              options={categoryOptions}
              value={newTransaction.category}
              onChange={(value) =>
                setNewTransaction((prev) => ({
                  ...prev,
                  category: value,
                }))
              }
              placeholder="Select Category"
              size="m"
              variant={newTransaction.type === "income" ? "emerald" : "amber"}
              required
            />

            <InputField
              label="Date"
              labelPosition="top"
              name="date"
              type="date"
              value={newTransaction.date}
              onChange={(value) =>
                setNewTransaction((prev) => ({
                  ...prev,
                  date: value,
                }))
              }
              size="s"
              variant={newTransaction.type === "income" ? "emerald" : "amber"}
              min={minDate}
              max={currentDate}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-3 rounded-lg font-medium mt-4 shadow-md hover:shadow-lg transition-all ${
                newTransaction.type === "income"
                  ? "bg-linear-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                  : "bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <ClipLoader size={18} color="#FFFFFF" />
                </div>
              ) : (
                buttonText
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
