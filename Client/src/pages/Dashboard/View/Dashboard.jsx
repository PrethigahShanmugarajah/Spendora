// Client / src / pages / Dashboard / View / Dashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  calculateData,
  CURRENCY,
  getPreviousTimeFrameRange,
  getTimeFrameRange,
} from "../../../utils/helpers";
import {
  DollarSign,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  EXPENSE_CATEGORY_ICONS,
  EXPENSE_CHART_COLORS,
  GAUGE_COLORS,
  INCOME_CATEGORY_ICONS,
  INCOME_CHART_COLORS,
} from "../../../constants/theme";
import {
  buildGaugeData,
  calculateExpenseChange,
  getDisplayedTransactions,
  getDisplaySummaryValues,
  getRecentTransactionsByType,
  getTransactionListForDisplay,
  isDateInRange,
} from "../../../utils/dashboardUtils";
import {
  addDashboardTransactionApi,
  fetchDashboardOverviewApi,
} from "../Service/DashboardService";
import DashboardHeader from "../Components/DashboardHeader";
import DashboardSummaryCards from "../Components/DashboardSummaryCards";
import GaugeCard from "../Components/GaugeCard";
import TransactionSection from "../Components/TransactionSection";
import AddTransactionModal from "../../../components/AddTransactionModal";
import DistributionChart from "../Components/DistributionChart";

const Dashboard = () => {
  const {
    transactions: outletTransactions = [],
    timeFrame = "monthly",
    setTimeFrame = () => {},
    refreshTransactions,
  } = useOutletContext();

  const [showModal, setShowModal] = useState(false);
  const [gaugeData, setGaugeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [overviewMeta, setOverviewMeta] = useState({});
  const [showAllIncome, setShowAllIncome] = useState(false);
  const [showAllExpense, setShowAllExpense] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    amount: "",
    type: "expense",
    category: "Groceries",
  });

  const timeFrameRange = useMemo(
    () => getTimeFrameRange(timeFrame),
    [timeFrame],
  );
  const prevTimeFrameRange = useMemo(
    () => getPreviousTimeFrameRange(timeFrame),
    [timeFrame],
  );

  const filteredTransactions = useMemo(
    () =>
      (outletTransactions || []).filter((t) =>
        isDateInRange(t.date, timeFrameRange.start, timeFrameRange.end),
      ),
    [outletTransactions, timeFrameRange],
  );

  const prevFilteredTransactions = useMemo(
    () =>
      (outletTransactions || []).filter((t) =>
        isDateInRange(t.date, prevTimeFrameRange.start, prevTimeFrameRange.end),
      ),
    [outletTransactions, prevTimeFrameRange],
  );

  const currentTimeFrameData = useMemo(() => {
    const data = calculateData(filteredTransactions);
    data.savings = data.income - data.expenses;
    return data;
  }, [filteredTransactions]);

  const prevTimeFrameData = useMemo(() => {
    const data = calculateData(prevFilteredTransactions);
    data.savings = data.income - data.expenses;
    return data;
  }, [prevFilteredTransactions]);

  useEffect(() => {
    setGaugeData(
      buildGaugeData(
        currentTimeFrameData.income,
        currentTimeFrameData.expenses,
        currentTimeFrameData.savings,
      ),
    );
  }, [currentTimeFrameData]);

  const { displayIncome, displayExpenses, displaySavings } = useMemo(
    () =>
      getDisplaySummaryValues(timeFrame, overviewMeta, currentTimeFrameData),
    [timeFrame, overviewMeta, currentTimeFrameData],
  );

  const expenseChange = useMemo(
    () => calculateExpenseChange(prevTimeFrameData.expenses, displayExpenses),
    [prevTimeFrameData, displayExpenses],
  );

  const expenseDistributionData = useMemo(
    () =>
      (overviewMeta?.expense?.distribution || []).map((item) => ({
        name: item.category,
        value: item.amount,
        percentage: item.percent,
      })),
    [overviewMeta],
  );

  const incomeDistributionData = useMemo(
    () =>
      (overviewMeta?.income?.distribution || []).map((item) => ({
        name: item.category,
        value: item.amount,
        percentage: item.percent,
      })),
    [overviewMeta],
  );

  const serverRecent = overviewMeta.recentTransactions || [];

  const serverRecentIncome = useMemo(
    () => getRecentTransactionsByType(serverRecent, "income"),
    [serverRecent],
  );

  const serverRecentExpense = useMemo(
    () => getRecentTransactionsByType(serverRecent, "expense"),
    [serverRecent],
  );

  const incomeTransactions = useMemo(
    () => getRecentTransactionsByType(filteredTransactions, "income"),
    [filteredTransactions],
  );

  const expenseTransactions = useMemo(
    () => getRecentTransactionsByType(filteredTransactions, "expense"),
    [filteredTransactions],
  );

  const incomeListForDisplay = useMemo(
    () =>
      getTransactionListForDisplay(
        timeFrame,
        serverRecentIncome,
        incomeTransactions,
      ),
    [timeFrame, serverRecentIncome, incomeTransactions],
  );

  const expenseListForDisplay = useMemo(
    () =>
      getTransactionListForDisplay(
        timeFrame,
        serverRecentExpense,
        expenseTransactions,
      ),
    [timeFrame, serverRecentExpense, expenseTransactions],
  );

  const displayedIncome = useMemo(
    () => getDisplayedTransactions(incomeListForDisplay, showAllIncome, 3),
    [incomeListForDisplay, showAllIncome],
  );

  const displayedExpense = useMemo(
    () => getDisplayedTransactions(expenseListForDisplay, showAllExpense, 3),
    [expenseListForDisplay, showAllExpense],
  );

  const fetchDashboardOverviewService = async () => {
    try {
      setLoading(true);
      const result = await fetchDashboardOverviewApi(timeFrame);
      if (!result?.overviewMeta) return;
      setOverviewMeta((prev) => ({
        ...prev,
        ...result.overviewMeta,
      }));
      if (result?.gaugeData) {
        setGaugeData(result.gaugeData);
      }
    } catch (error) {
      //
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardOverviewService();
  }, [timeFrame]);

  const handleAddTransaction = async () => {
    if (!newTransaction.description || !newTransaction.amount) return;
    try {
      setLoading(true);

      await addDashboardTransactionApi(newTransaction);
      await refreshTransactions();
      await fetchDashboardOverviewService();
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
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <DashboardHeader
        setShowModal={setShowModal}
        timeFrame={timeFrame}
        setTimeFrame={setTimeFrame}
      />

      <DashboardSummaryCards
        displayIncome={displayIncome}
        displayExpenses={displayExpenses}
        displaySavings={displaySavings}
        expenseChange={expenseChange}
        prevTimeFrameRange={prevTimeFrameRange}
        timeFrameRange={timeFrameRange}
        overviewMeta={overviewMeta}
      />

      {/* -------- Gauges -------- */}
      <div className="grid grid-cols-1 -mx-5 xl:-mx-5 md:grid-cols-3 md:gap-13 lg:gap-3 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {gaugeData.map((gauge) => (
          <GaugeCard
            key={gauge.name}
            gauge={gauge}
            colorInfo={GAUGE_COLORS[gauge.name]}
            timeFrameLabel={timeFrameRange.label}
          />
        ))}
      </div>

      <DistributionChart
        title="Expense Distribution"
        chartData={expenseDistributionData}
        timeFrameRange={timeFrameRange}
        colors={EXPENSE_CHART_COLORS}
        iconColor="text-amber-500"
        tooltipLabel="Expense"
      />

      <DistributionChart
        title="Income Distribution"
        chartData={incomeDistributionData}
        timeFrameRange={timeFrameRange}
        colors={INCOME_CHART_COLORS}
        iconColor="text-emerald-500"
        tooltipLabel="Income"
      />

      <div className="grid grid-cols-1 gap-6">
        {/* -------- Income Column -------- */}
        <TransactionSection
          title="Recent Income"
          icon={<TrendingUp className="w-6 h-6 text-emerald-500" />}
          labelColor="text-emerald-600"
          badgeColor="bg-emerald-100 text-emerald-800"
          bgColor="bg-emerald-50"
          iconBg="bg-emerald-100"
          textColor="text-emerald-600"
          emptyIcon={
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-emerald-400" />
            </div>
          }
          emptyText="No income transactions"
          transactions={incomeListForDisplay}
          displayedTransactions={displayedIncome}
          showAll={showAllIncome}
          setShowAll={setShowAllIncome}
          currency={CURRENCY}
          timeFrameLabel={timeFrameRange.label}
          categoryIcons={INCOME_CATEGORY_ICONS}
        />

        {/* -------- Expense Column -------- */}
        <TransactionSection
          title="Recent Expenses"
          icon={<TrendingDown className="w-6 h-6 text-amber-500" />}
          badgeColor="bg-amber-100 text-amber-800"
          bgColor="bg-amber-50"
          iconBg="bg-amber-100"
          textColor="text-amber-600"
          emptyIcon={
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-amber-400" />
            </div>
          }
          emptyText="No expense transactions"
          transactions={expenseListForDisplay}
          displayedTransactions={displayedExpense}
          showAll={showAllExpense}
          setShowAll={setShowAllExpense}
          currency={CURRENCY}
          timeFrameLabel={timeFrameRange.label}
          categoryIcons={EXPENSE_CATEGORY_ICONS}
        />
      </div>

      <AddTransactionModal
        showModal={showModal}
        setShowModal={setShowModal}
        newTransaction={newTransaction}
        setNewTransaction={setNewTransaction}
        handleAddTransaction={handleAddTransaction}
        loading={loading}
      />
    </div>
  );
};

export default Dashboard;
