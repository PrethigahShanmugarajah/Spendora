// Client / src / pages / Income / View / Income.jsx
import { useState, useMemo, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import {
  exportToExcel,
  generateChartPoints,
  getTimeFrameRange,
} from "../../../utils/helpers";
import AddTransactionModal from "../../../components/AddTransactionModal";
import { toast } from "react-toastify";
import {
  buildIncomeChartData,
  buildIncomeExportData,
  calculateAverageIncome,
  calculateTotalIncome,
  getFilteredTransactions,
  getIncomeTransactions,
  getTimeFrameTransactions,
} from "../../../utils/incomeUtils";
import {
  addIncomeTransactionApi,
  deleteIncomeTransactionApi,
  downloadIncomeDataApi,
  editIncomeTransactionApi,
  fetchIncomeOverviewApi,
} from "../Service/IncomeService";
import DeletePopup from "../../../components/DeletePopup";
import TrendChart from "../../../components/TrendChart";
import { INCOME_CATEGORY_ICONS, INCOME_COLORS } from "../../../constants/theme";
import OverviewHeader from "../../../components/OverviewHeader";
import SummaryCards from "../../../components/SummaryCards";
import { TrendingUp } from "lucide-react";
import TransactionsSection from "../../../components/TransactionsSection";

const Income = () => {
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
    totalIncome: 0,
    averageIncome: 0,
    numberOfTransactions: 0,
    recentTransactions: [],
    range: "monthly",
  });
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    amount: "",
    type: "income",
    category: "Salary",
  });
  const [editForm, setEditForm] = useState({
    description: "",
    amount: "",
    category: "Salary",
    date: new Date().toISOString().split("T")[0],
  });
  const [deletePopup, setDeletePopup] = useState({
    open: false,
    id: null,
    item: "",
  });

  const timeFrameRange = useMemo(
    () => getTimeFrameRange(timeFrame, null),
    [timeFrame],
  );

  const chartPoints = useMemo(
    () => generateChartPoints(timeFrame, timeFrameRange),
    [timeFrame, timeFrameRange],
  );

  const incomeTransactions = useMemo(
    () => getIncomeTransactions(outletTransactions),
    [outletTransactions],
  );

  const timeFrameTransactions = useMemo(
    () => getTimeFrameTransactions(incomeTransactions, timeFrameRange),
    [incomeTransactions, timeFrameRange],
  );

  const filteredTransactions = useMemo(
    () =>
      getFilteredTransactions(timeFrameTransactions, filter, timeFrameRange),
    [timeFrameTransactions, filter, timeFrameRange],
  );

  const chartData = useMemo(
    () => buildIncomeChartData(chartPoints, filteredTransactions, timeFrame),
    [chartPoints, filteredTransactions, timeFrame],
  );

  const fetchIncomeOverviewService = useCallback(
    async (range = timeFrame ?? "monthly") => {
      try {
        const overviewData = await fetchIncomeOverviewApi(range);
        if (overviewData) {
          setOverview(overviewData);
        }
      } catch (error) {
        //
      }
    },
    [timeFrame],
  );

  useEffect(() => {
    fetchIncomeOverviewService(timeFrame ?? "monthly");
  }, [fetchIncomeOverviewService, timeFrame]);

  const totalIncome = useMemo(
    () => overview.totalIncome ?? calculateTotalIncome(filteredTransactions),
    [overview.totalIncome, filteredTransactions],
  );

  const averageIncome = useMemo(
    () =>
      overview.averageIncome
        ? Math.round(overview.averageIncome)
        : calculateAverageIncome(filteredTransactions),
    [overview.averageIncome, filteredTransactions],
  );

  const transactionsCount = useMemo(
    () => overview.numberOfTransactions ?? filteredTransactions.length,
    [overview.numberOfTransactions, filteredTransactions],
  );

  const handleAddTransaction = useCallback(async () => {
    if (!newTransaction.description || !newTransaction.amount) return;

    try {
      setLoading(true);
      await addIncomeTransactionApi(newTransaction);
      await refreshTransactions();
      await fetchIncomeOverviewService(timeFrame ?? "monthly");

      setNewTransaction({
        date: new Date().toISOString().split("T")[0],
        description: "",
        amount: "",
        type: "income",
        category: "Salary",
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
    fetchIncomeOverviewService,
    timeFrame,
  ]);

  const handleEditTransaction = useCallback(async () => {
    if (!editingId || !editForm.description || !editForm.amount) return;

    try {
      setLoading(true);
      await editIncomeTransactionApi(editingId, editForm);
      await refreshTransactions();
      await fetchIncomeOverviewService(timeFrame ?? "monthly");

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
    fetchIncomeOverviewService,
    timeFrame,
  ]);

  const openDeletePopup = useCallback((id, item = "this income") => {
    if (!id) return;
    setDeletePopup({
      open: true,
      id,
      item,
    });
  }, []);

  const handleDeleteTransaction = useCallback(async () => {
    if (!deletePopup.id) return;

    try {
      setLoading(true);
      await deleteIncomeTransactionApi(deletePopup.id);
      await refreshTransactions();
      await fetchIncomeOverviewService(timeFrame ?? "monthly");
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
    fetchIncomeOverviewService,
    timeFrame,
  ]);

  const handleExport = useCallback(async () => {
    try {
      setExportLoading(true);
      const res = await downloadIncomeDataApi(0);
      const blob = new Blob([res.data], {
        type: res.headers["content-type"] || "application/octet-stream",
      });
      const disposition = res.headers["content-disposition"];
      let filename = "Income_Details.xlsx";

      if (disposition) {
        const match = disposition.match(/filename="?(.+)"?/);
        if (match && match[1]) filename = match[1];
      }

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      try {
        const exportData = buildIncomeExportData(filteredTransactions);
        exportToExcel(
          exportData,
          `income_${new Date().toISOString().slice(0, 10)}`,
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
  }, [filteredTransactions]);

  return (
    <div className="space-y-4 md:space-y-6 p-3 md:p-4 max-w-7xl mx-auto">
      <OverviewHeader
        title="Income Overview"
        description="Track and manage your income sources"
        buttonText="Add Income"
        setShowModal={setShowModal}
        loading={loading}
        timeFrame={timeFrame}
        setTimeFrame={setTimeFrame}
        gradientFrom="from-emerald-600"
        gradientTo="to-green-600"
        hoverFrom="hover:from-emerald-700"
        hoverTo="hover:to-green-700"
        timeFrameColor="emerald"
      />

      <SummaryCards
        totalValue={totalIncome}
        averageValue={averageIncome}
        transactionsCount={transactionsCount}
        timeFrameRange={timeFrameRange}
        filter={filter}
        type="income"
        TrendIcon={TrendingUp}
      />

      <TrendChart
        chartData={chartData}
        timeFrame={timeFrame}
        timeFrameRange={timeFrameRange}
        title="Income Trends"
        dataKey="income"
        tooltipLabel="Income"
        colors={INCOME_COLORS}
        iconColor="text-emerald-500"
        referenceLineColor="#10B981"
      />

      <TransactionsSection
        title="Income Transactions"
        type="income"
        timeFrameRange={timeFrameRange}
        filter={filter}
        setFilter={setFilter}
        handleExport={handleExport}
        exportLoading={exportLoading}
        filterOptions={[
          { value: "all", label: "All Transactions" },
          { value: "month", label: "This Month" },
          { value: "year", label: "This Year" },
          { value: "Salary", label: "Salary" },
          { value: "Freelance", label: "Freelance" },
          { value: "Business", label: "Business" },
          { value: "Tuition", label: "Tuition" },
          { value: "Rental", label: "Rental" },
          { value: "Bank Interest", label: "Bank Interest" },
          { value: "Other", label: "Other" },
        ]}
        filteredTransactions={filteredTransactions}
        showAll={showAll}
        setShowAll={setShowAll}
        editingId={editingId}
        editForm={editForm}
        setEditForm={setEditForm}
        handleEditTransaction={handleEditTransaction}
        handleDeleteTransaction={handleDeleteTransaction}
        loading={loading}
        setEditingId={setEditingId}
        setShowModal={setShowModal}
        categoryIcons={INCOME_CATEGORY_ICONS}
        emptyTitle="No income transactions found"
        emptyDescription={
          filter === "all"
            ? "You haven't recorded any income yet"
            : `No ${filter} transactions found`
        }
        addButtonText="Add Income"
      />

      <AddTransactionModal
        showModal={showModal}
        setShowModal={setShowModal}
        newTransaction={newTransaction}
        setNewTransaction={setNewTransaction}
        handleAddTransaction={handleAddTransaction}
        loading={loading}
        type="income"
        title="Add New Income"
        buttonText="Add Income"
        categories={[
          "Salary",
          "Freelance",
          "Business",
          "Tuition",
          "Rental",
          "Bank Interest",
          "Other",
        ]}
        color="purple"
      />

      {deletePopup.open && (
        <DeletePopup
          variant="emerald"
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
          title="Delete Income"
          confirmText="Delete"
          closeText="Cancel"
        />
      )}
    </div>
  );
};

export default Income;
