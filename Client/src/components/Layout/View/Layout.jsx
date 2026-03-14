import { useEffect, useMemo, useState } from "react";
import Navbar from "../../Navbar/Navbar";
import Sidebar from "../../Sidebar/Sidebar";
import {
  LayoutDashboard,
  TrendingDown,
  TrendingUp,
  UserCog,
} from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
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
import { fetchCurrentUser } from "../../../services/fetch";
import { BeatLoader } from "react-spinners";

const Layout = ({ onLogout, user }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [timeFrame, setTimeFrame] = useState("monthly");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [localUser, setLocalUser] = useState(null);
  const { pathname } = useLocation();

  const resolvedUser = user || localUser;

  const fetchTransactions = async () => {
    try {
      setSummaryLoading(true);
      setTransactionsLoading(true);
      setShowAllTransactions(true);
      const allTransactions = await fetchTransactionsApi();
      setTransactions(allTransactions);
      setLastUpdated(new Date());
    } catch (error) {
      throw error;
    } finally {
      setSummaryLoading(false);
      setTransactionsLoading(false);
      setShowAllTransactions(false);
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
    const fetchUserData = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) return;

        const data = await fetchCurrentUser();
        const userData = data?.user || data;
        setLocalUser(userData);
      } catch (error) {
        //
      }
    };

    if (!user?.name && !user?.email) {
      fetchUserData();
    }
  }, [user]);

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
    ? filteredTransactions.slice(0, 10)
    : filteredTransactions.slice(0, 5);

  const pageConfig = {
    "/": {
      title: "Financial Overview",
      icon: <LayoutDashboard className="w-6 h-6 text-purple-500" />,
      loaderColor: "#9333EA",
    },
    "/income": {
      title: "Income Overview",
      icon: <TrendingUp className="w-6 h-6 text-emerald-500" />,
      loaderColor: "#059669",
    },
    "/expense": {
      title: "Expense Overview",
      icon: <TrendingDown className="w-6 h-6 text-amber-500" />,
      loaderColor: "#D97706",
    },
    "/profile": {
      title: "Profile Overview",
      icon: <UserCog className="w-6 h-6 text-purple-500" />,
      loaderColor: "#9333EA",
    },
  };

  const currentPage = pageConfig[pathname] || pageConfig["/"];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <Navbar user={resolvedUser} onLogout={onLogout} />
      <Sidebar
        user={resolvedUser}
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

        <SummaryCards
          stats={stats}
          getSavingsRating={getSavingsRating}
          loading={summaryLoading}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  {currentPage.icon}
                  {currentPage.title}
                  <span className="text-sm text-gray-500 font-normal flex items-center min-w-17.5">
                    {summaryLoading ? (
                      <BeatLoader size={5} color={currentPage.loaderColor} />
                    ) : (
                      `(${timeFrameLabel})`
                    )}
                  </span>
                </h3>
              </div>

              <Outlet context={outletContext} />
            </div>
          </div>

          <RecentTransactionsCard
            loading={transactionsLoading}
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
