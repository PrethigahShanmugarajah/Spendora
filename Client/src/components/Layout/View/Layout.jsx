// Client / src / components / Layout / View / Layout.jsx
import { useEffect, useMemo, useState } from "react";
import Navbar from "../../Navbar/Navbar";
import Sidebar from "../../Sidebar/Sidebar";
import { TrendingUp } from "lucide-react";
import { Outlet } from "react-router-dom";
import SummaryCards from "../Components/SummaryCards";
import RecentTransactionsCard from "../Components/RecentTransactionsCard";
import {
  calculateTransactionStats,
  filterTransactions,
  getSavingsRating,
  getTimeFrameLabel,
  getTopCategories,
} from "../../../utils/layoutUtils";
import {
  addTransactionApi,
  deleteTransactionApi,
  editTransactionApi,
  fetchTransactionsApi,
} from "../Service/LayoutService";

const Layout = ({ onLogout, user }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [timeFrame, setTimeFrame] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const allTransactions = await fetchTransactionsApi();
      setTransactions(allTransactions);
      setLastUpdated(new Date());
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction) => {
    try {
      await addTransactionApi(transaction);
      await fetchTransactions();
      return true;
    } catch (error) {
      throw error;
    }
  };

  const editTransaction = async (id, transaction) => {
    try {
      await editTransactionApi(id, transaction);
      await fetchTransactions();
      return true;
    } catch (error) {
      throw error;
    }
  };

  const deleteTransaction = async (id, type) => {
    try {
      await deleteTransactionApi(id, type);
      await fetchTransactions();
      return true;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = useMemo(
    () => filterTransactions(transactions, timeFrame),
    [transactions, timeFrame],
  );

  const stats = useMemo(
    () => calculateTransactionStats(transactions),
    [transactions],
  );

  const timeFrameLabel = useMemo(
    () => getTimeFrameLabel(timeFrame),
    [timeFrame],
  );

  const outletContext = {
    transactions: filteredTransactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
    refreshTransactions: fetchTransactions,
    timeFrame,
    setTimeFrame,
    lastUpdated,
  };

  const topCategories = useMemo(
    () => getTopCategories(transactions),
    [transactions],
  );

  const displayedTransactions = showAllTransactions
    ? transactions
    : transactions.slice(0, 4);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <Navbar user={user} onLogout={onLogout} />
      <Sidebar
        user={user}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />

      <div
        className={`p-4 pt-6 transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">Welcome Back</p>
          </div>
        </div>

        <SummaryCards stats={stats} getSavingsRating={getSavingsRating} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-purple-500" />
                  Financial Overview
                  <span className="text-sm text-gray-500 font-normal">
                    ({timeFrameLabel})
                  </span>
                </h3>
              </div>

              <Outlet context={outletContext} />
            </div>
          </div>

          <RecentTransactionsCard
            loading={loading}
            fetchTransactions={fetchTransactions}
            displayedTransactions={displayedTransactions}
            transactions={transactions}
            showAllTransactions={showAllTransactions}
            setShowAllTransactions={setShowAllTransactions}
            topCategories={topCategories}
            stats={stats}
          />
        </div>
      </div>
    </div>
  );
};

export default Layout;
