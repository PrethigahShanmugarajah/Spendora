// Client / src / components / TransactionItem.jsx
import { useState } from "react";
import { Banknote, Edit, Save, Trash2, X } from "lucide-react";
import { CURRENCY } from "../utils/helpers";
import { InputField } from "./FormField/InputField";
import { ClipLoader } from "react-spinners";

const TransactionItem = ({
  transaction,
  isEditing,
  editForm,
  setEditForm,
  onSave,
  onCancel,
  onDelete,
  loading = false,
  type = "expense",
  categoryIcons,
  setEditingId,
  amountClass = "font-bold truncate block text-right",
  iconClass = "p-3 rounded-xl flex-shrink-0",
}) => {
  const [errors, setErrors] = useState({ description: "", amount: "" });

  const sign = type === "income" ? "+" : "-";

  const validate = () => {
    const nextErrors = { description: "", amount: "" };
    const desc = String(editForm.description ?? "").trim();
    const amtRaw = editForm.amount;
    const amt =
      amtRaw === "" || amtRaw === null || amtRaw === undefined
        ? ""
        : String(amtRaw).trim();

    if (!desc) {
      nextErrors.description = "Description is required.";
    }

    if (amt === "") {
      nextErrors.amount = "Amount is required.";
    } else if (Number(amt) <= 0) {
      nextErrors.amount = "Amount must be greater than 0.";
    }

    setErrors(nextErrors);
    return !nextErrors.description && !nextErrors.amount;
  };

  const handleSaveClick = () => {
    if (validate()) {
      setErrors({ description: "", amount: "" });
      onSave();
    }
  };

  const categoryIcon = categoryIcons?.[transaction.category];

  return (
    <div
      className={`flex flex-row items-center justify-between gap-3 p-4 rounded-xl border border-gray-100 mb-3 last:mb-0 ${
        isEditing
          ? transaction.type === "income"
            ? "bg-emerald-100"
            : "bg-amber-100"
          : "hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className={`${iconClass} ${
            transaction.type === "income" ? "bg-emerald-100" : "bg-amber-100"
          }`}
        >
          {categoryIcon || <Banknote className="w-5 h-5" />}
        </div>

        <div className="min-w-0 flex-1">
          {isEditing ? (
            <>
              <InputField
                className="w-full"
                type="text"
                value={editForm.description}
                onChange={(value) =>
                  setEditForm((prev) => ({
                    ...prev,
                    description: value,
                  }))
                }
                placeholder="Enter description"
                size="s"
                variant={transaction.type === "income" ? "emerald" : "amber"}
                error={errors.description}
              />
            </>
          ) : (
            <p className="font-medium text-gray-800 truncate">
              {transaction.description}
            </p>
          )}

          {!isEditing && (
            <p className="text-xs text-gray-500 mt-1.5 truncate">
              {new Date(transaction.date).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="w-32 shrink-0 flex justify-end">
          {isEditing ? (
            <>
              <InputField
                className="w-full"
                type="number"
                value={editForm.amount}
                onChange={(value) =>
                  setEditForm((prev) => ({ ...prev, amount: value }))
                }
                placeholder="Enter amount"
                size="s"
                variant={transaction.type === "income" ? "emerald" : "amber"}
                error={errors.amount}
              />
            </>
          ) : (
            <span
              className={`${amountClass} ${
                transaction.type === "income"
                  ? "text-emerald-600"
                  : "text-amber-600"
              }`}
            >
              {sign}
              {CURRENCY}{" "}
              {Number(transaction.amount).toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
            </span>
          )}
        </div>

        <div className="flex gap-1 shrink-0">
          {isEditing ? (
            <>
              <button
                onClick={handleSaveClick}
                className={`p-2 rounded-lg ${
                  transaction.type === "income"
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : "bg-amber-500 hover:bg-amber-600 text-white"
                }`}
                title="Save"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <ClipLoader size={18} color="#FFFFFF" />
                  </div>
                ) : (
                  <Save size={16} />
                )}
              </button>

              <button
                onClick={() => {
                  setErrors({ description: "", amount: "" });
                  onCancel();
                }}
                className="p-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                title="Cancel"
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setEditForm({
                    description: transaction.description ?? "",
                    amount: transaction.amount ?? "",
                    category: transaction.category ?? "",
                    date: transaction.date ?? "",
                    type: transaction.type ?? "expense",
                  });
                  setErrors({ description: "", amount: "" });
                  setEditingId(transaction.id);
                }}
                className={`p-2 rounded-lg ${
                  transaction.type === "income"
                    ? "text-emerald-600 hover:bg-emerald-100"
                    : "text-amber-600 hover:bg-amber-100"
                }`}
                title="Edit"
              >
                <Edit size={16} />
              </button>

              <button
                onClick={() => onDelete(transaction.id)}
                className="p-2 rounded-lg text-red-600 hover:bg-red-100"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
