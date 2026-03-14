import { useState, useMemo, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import {
  exportToExcel,
  generateChartPoints,
  getFilteredTransactions,
  getTimeFrameRange,
  getTimeFrameTransactions,
} from "../../../utils/helpers";
import AddTransactionModal from "../../../components/AddTransactionModal";
import { toast } from "react-toastify";
import {
  buildExpenseChartData,
  buildExpenseExportData,
  calculateAverageExpense,
  calculateTotalExpense,
  getExpenseTransactions,
} from "../../../utils/expenseUtils";
import {
  addExpenseTransactionApi,
  deleteExpenseTransactionApi,
  downloadExpenseDataApi,
  editExpenseTransactionApi,
  fetchExpenseOverviewApi,
} from "../Service/ExpenseService";
import DeletePopup from "../../../components/DeletePopup";
import TrendChart from "../../../components/TrendChart";
import {
  EXPENSE_CATEGORY_ICONS,
  EXPENSE_COLORS,
} from "../../../constants/theme";
import OverviewHeader from "../../../components/OverviewHeader";
import { TrendingDown } from "lucide-react";
import TransactionsSection from "../../../components/TransactionsSection";
import OverviewSummaryCards from "../../../components/OverviewSummaryCards";

const Expense = () => {
  const {
    transactions: outletTransactions = [],
    timeFrame = "monthly",
    setTimeFrame = () => {},
    refreshTransactions,
  } = useOutletContext();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [overview, setOverview] = useState({
    totalExpense: 0,
    averageExpense: 0,
    numberOfTransactions: 0,
    recentTransactions: [],
    range: "monthly",
  });
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    amount: "",
    type: "expense",
    category: "Groceries",
  });
  const [editForm, setEditForm] = useState({
    description: "",
    amount: "",
    category: "Groceries",
    date: new Date().toISOString().split("T")[0],
  });
  const [deletePopup, setDeletePopup] = useState({
    open: false,
    id: null,
    item: "",
  });
  const [overviewLoading, setOverviewLoading] = useState(false);

  const timeFrameRange = useMemo(
    () => getTimeFrameRange(timeFrame, null),
    [timeFrame],
  );

  const chartPoints = useMemo(
    () => generateChartPoints(timeFrame, timeFrameRange),
    [timeFrame, timeFrameRange],
  );

  const expenseTransactions = useMemo(
    () => getExpenseTransactions(outletTransactions),
    [outletTransactions],
  );

  const timeFrameTransactions = useMemo(
    () => getTimeFrameTransactions(expenseTransactions, timeFrameRange),
    [expenseTransactions, timeFrameRange],
  );

  const filteredTransactions = useMemo(
    () =>
      getFilteredTransactions(timeFrameTransactions, filter, timeFrameRange),
    [timeFrameTransactions, filter, timeFrameRange],
  );

  const chartData = useMemo(
    () => buildExpenseChartData(chartPoints, filteredTransactions, timeFrame),
    [chartPoints, filteredTransactions, timeFrame],
  );

  const fetchExpenseOverviewService = useCallback(
    async (range = timeFrame ?? "monthly") => {
      setOverviewLoading(true);
      try {
        const overviewData = await fetchExpenseOverviewApi(range);
        if (overviewData) {
          setOverview(overviewData);
        }
      } catch (error) {
        //
      } finally {
        setOverviewLoading(false);
      }
    },
    [timeFrame],
  );

  useEffect(() => {
    fetchExpenseOverviewService(timeFrame ?? "monthly");
  }, [fetchExpenseOverviewService, timeFrame]);

  const totalExpense = useMemo(
    () => overview.totalExpense ?? calculateTotalExpense(filteredTransactions),
    [overview.totalExpense, filteredTransactions],
  );

  const averageExpense = useMemo(
    () =>
      overview.averageExpense
        ? Math.round(overview.averageExpense)
        : calculateAverageExpense(filteredTransactions),
    [overview.averageExpense, filteredTransactions],
  );

  const transactionsCount = useMemo(
    () => overview.numberOfTransactions ?? filteredTransactions.length,
    [overview.numberOfTransactions, filteredTransactions],
  );

  const handleAddTransaction = useCallback(async () => {
    if (!newTransaction.description || !newTransaction.amount) return;

    try {
      setLoading(true);
      await addExpenseTransactionApi(newTransaction);
      await refreshTransactions();
      await fetchExpenseOverviewService(timeFrame ?? "monthly");

      setNewTransaction({
        date: new Date().toISOString().split("T")[0],
        description: "",
        amount: "",
        type: "expense",
        category: "Groceries",
      });
      setShowModal(false);
    } catch (error) {
      //
    } finally {
      setLoading(false);
    }
  }, [
    newTransaction,
    refreshTransactions,
    fetchExpenseOverviewService,
    timeFrame,
  ]);

  const handleEditTransaction = useCallback(async () => {
    if (!editingId || !editForm.description || !editForm.amount) return;

    try {
      setLoading(true);
      await editExpenseTransactionApi(editingId, editForm);
      await refreshTransactions();
      await fetchExpenseOverviewService(timeFrame ?? "monthly");

      setEditingId(null);
    } catch (error) {
      //
    } finally {
      setLoading(false);
    }
  }, [
    editingId,
    editForm,
    refreshTransactions,
    fetchExpenseOverviewService,
    timeFrame,
  ]);

  const handleOpenDeletePopup = useCallback((transaction) => {
    setDeletePopup({
      open: true,
      id: transaction.id,
      item: transaction.description || "this expense",
    });
  }, []);

  const handleDeleteTransaction = useCallback(async () => {
    if (!deletePopup.id) return;

    try {
      setLoading(true);
      await deleteExpenseTransactionApi(deletePopup.id);
      await refreshTransactions();
      await fetchExpenseOverviewService(timeFrame ?? "monthly");
      setDeletePopup({
        open: false,
        id: null,
        item: "",
      });
    } catch (error) {
      //
    } finally {
      setLoading(false);
    }
  }, [
    deletePopup.id,
    refreshTransactions,
    fetchExpenseOverviewService,
    timeFrame,
  ]);

  const handleExport = useCallback(async () => {
    try {
      setExportLoading(true);

      const res = await downloadExpenseDataApi({
        counter: 0,
        filter,
        range: timeFrame,
      });

      const blob = new Blob([res.data], {
        type: res.headers["content-type"] || "application/octet-stream",
      });

      const disposition =
        res.headers["content-disposition"] ||
        res.headers["Content-Disposition"];
      let filename = "Expense_Details.xlsx";

      if (disposition) {
        const match =
          disposition.match(/filename="([^"]+)"/) ||
          disposition.match(/filename=([^;]+)/);

        if (match && (match[1] || match[2])) {
          filename = (match[1] || match[2]).trim();
        }
      }

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      try {
        const exportData = buildExpenseExportData(filteredTransactions);
        exportToExcel(
          exportData,
          `expense_${filter}_${new Date().toISOString().slice(0, 10)}`,
        );
      } catch (error) {
        console.error("The fallback export operation failed:", error);
        toast.error(
          "Unable to export the data at this time. Please try again.",
        );
      }
    } finally {
      setExportLoading(false);
    }
  }, [filteredTransactions, filter, timeFrame]);

  return (
    <div className="space-y-4 md:space-y-6 p-3 md:p-4 max-w-7xl mx-auto">
      <OverviewHeader
        title="Expense Overview"
        description="Track and manage your expense sources"
        buttonText="Add Expense"
        setShowModal={setShowModal}
        loading={loading}
        timeFrame={timeFrame}
        setTimeFrame={setTimeFrame}
        gradientFrom="from-amber-600"
        gradientTo="to-orange-600"
        hoverFrom="hover:from-amber-700"
        hoverTo="hover:to-orange-700"
        timeFrameColor="amber"
      />

      <OverviewSummaryCards
        totalValue={totalExpense}
        averageValue={averageExpense}
        transactionsCount={transactionsCount}
        timeFrameRange={timeFrameRange}
        filter={filter}
        type="expense"
        TrendIcon={TrendingDown}
        loading={overviewLoading}
      />

      <TrendChart
        chartData={chartData}
        timeFrame={timeFrame}
        timeFrameRange={timeFrameRange}
        title="Expense Trends"
        dataKey="expense"
        tooltipLabel="Expense"
        colors={EXPENSE_COLORS}
        iconColor="text-amber-500"
        referenceLineColor="#F59E0B"
        loading={overviewLoading}
      />

      <TransactionsSection
        title="Expense Transactions"
        type="expense"
        timeFrameRange={timeFrameRange}
        filter={filter}
        setFilter={setFilter}
        handleExport={handleExport}
        exportLoading={exportLoading}
        filterOptions={[
          { value: "all", label: "All Transactions" },
          { value: "month", label: "This Month" },
          { value: "year", label: "This Year" },
          { value: "Groceries", label: "Groceries" },
          { value: "Dining", label: "Dining" },
          { value: "Rent", label: "Rent" },
          { value: "Utilities", label: "Utilities" },
          { value: "Transport", label: "Transport" },
          { value: "Healthcare", label: "Healthcare" },
          { value: "Other", label: "Other" },
        ]}
        filteredTransactions={filteredTransactions}
        showAll={showAll}
        setShowAll={setShowAll}
        editingId={editingId}
        editForm={editForm}
        setEditForm={setEditForm}
        handleEditTransaction={handleEditTransaction}
        handleDeleteTransaction={handleOpenDeletePopup}
        loading={overviewLoading}
        actionLoading={loading}
        setEditingId={setEditingId}
        setShowModal={setShowModal}
        categoryIcons={EXPENSE_CATEGORY_ICONS}
        emptyTitle="No expense transactions found"
        emptyDescription={
          filter === "all"
            ? "You haven't recorded any expense yet"
            : `No ${filter} transactions found`
        }
        addButtonText="Add Expense"
      />

      <AddTransactionModal
        showModal={showModal}
        setShowModal={setShowModal}
        newTransaction={newTransaction}
        setNewTransaction={setNewTransaction}
        handleAddTransaction={handleAddTransaction}
        loading={loading}
        type="expense"
        title="Add New Expense"
        buttonText="Add Expense"
        categories={[
          "Groceries",
          "Dining",
          "Rent",
          "Utilities",
          "Transport",
          "Healthcare",
          "Other",
        ]}
        color="amber"
      />

      {deletePopup.open && (
        <DeletePopup
          variant="amber"
          onClose={() =>
            setDeletePopup({
              open: false,
              id: null,
              item: "",
            })
          }
          onDelete={handleDeleteTransaction}
          loading={loading}
          item={deletePopup.item}
          title="Delete Expense"
          confirmText="Delete"
          closeText="Cancel"
        />
      )}
    </div>
  );
};

export default Expense;
