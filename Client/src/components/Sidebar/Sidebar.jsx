// Client / src / components / Sidebar / Sidebar.jsx
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  HelpCircle,
  Home,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";

const MENU_ITEMS = [
  { text: "Dashboard", path: "/", icon: <Home size={20} /> },
  { text: "Income", path: "/income", icon: <ArrowUp size={20} /> },
  { text: "Expenses", path: "/expense", icon: <ArrowDown size={20} /> },
  { text: "Profile", path: "/profile", icon: <User size={20} /> },
];

const Sidebar = ({ user, isCollapsed, setIsCollapsed }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHover, setActiveHover] = useState(null);

  const { name: username = "user", email = "user@spendora.com" } = user || {};
  const initial = username.charAt(0).toUpperCase();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        mobileOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleMenu = () => setIsCollapsed((c) => !c);

  const renderMenuItem = ({ text, path, icon }) => {
    const isActive = pathname === path;
    return (
      <motion.li
        key={text}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link
          to={path}
          className={`relative flex items-center gap-3 py-3 rounded-xl font-medium transition-all duration-200 ${
            isActive
              ? "text-purple-600 bg-purple-50"
              : "text-black hover:text-purple-700 hover:bg-gray-50"
          } ${isCollapsed ? "justify-center px-0 mx-2" : "px-4"}`}
          onMouseEnter={() => setActiveHover(text)}
          onMouseLeave={() => setActiveHover(null)}
        >
          <span className={isActive ? "text-purple-600" : "text-black"}>
            {icon}
          </span>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              {text}
            </motion.span>
          )}
          {activeHover === text && !isActive && !isCollapsed && (
            <span className="absolute right-4 w-2 h-2 bg-purple-400 rounded-full animate-ping"></span>
          )}
        </Link>
      </motion.li>
    );
  };

  return (
    <>
      <motion.div
        ref={sidebarRef}
        className="hidden lg:flex flex-col pt-3 fixed top-16 bottom-0 z-30"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1, width: isCollapsed ? 80 : 256 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <div className="bg-white border-r  border-gray-200 shadow-md h-full flex flex-col">
          <button
            onClick={toggleMenu}
            className="absolute -right-3 top-12 z-20 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center text-black hover:text-purple-600 hover:border-purple-400 hover:bg-purple-50 transition-all"
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: isCollapsed ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline
                  points={isCollapsed ? "9 18 15 12 9 6" : "15 18 9 12 15 6"}
                ></polyline>
              </svg>
            </motion.div>
          </button>

          <div
            className={`p-4 border-b pt-20 md:pt-5 lg:pt-5 xl:pt-5 border-gray-100 ${
              isCollapsed ? "px-3" : "px-6"
            }`}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                {initial}
              </div>
              {!isCollapsed && (
                <motion.div
                  className="ml-3 overflow-hidden"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <h2 className="text-sm font-bold text-black truncate">
                    {username}
                  </h2>
                  <p className="text-xs text-gray-500 truncate">{email}</p>
                </motion.div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
            <ul className="space-y-1 px-2">{MENU_ITEMS.map(renderMenuItem)}</ul>
          </div>

          <div
            className={`border-t border-gray-100 p-4 ${
              isCollapsed ? "px-3" : "px-6"
            }`}
          >
            <Link
              to="#"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-black hover:text-purple-700 hover:bg-gray-50 ${
                isCollapsed ? "justify-center" : ""
              }`}
            >
              <HelpCircle size={20} />
              {!isCollapsed && <span>Support</span>}
            </Link>

            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium hover:bg-rose-50 text-rose-600 w-full mt-1 ${
                isCollapsed ? "justify-center" : ""
              }`}
            >
              <LogOut size={20} />
              {!isCollapsed && <span>LogOut</span>}
            </button>
          </div>
        </div>
      </motion.div>

      <motion.button
        onClick={() => setMobileOpen((prev) => !prev)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-linear-to-br from-violet-500 to-purple-600 text-white rounded-full flex items-center justify-center shadow-xl"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              ref={sidebarRef}
              className="absolute left-0 top-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl rounded-r-2xl overflow-hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="relative h-full flex flex-col">
                <div className="p-6 flex justify-between items-center border-b border-gray-100">
                  <div className="flex pt-28 items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                      {initial}
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-black">
                        {username}
                      </h2>
                      <p className="text-sm text-gray-500">{email}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setMobileOpen(false)}
                    className="mt-2 p-0.5 rounded-lg hover:bg-gray-100"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                  <ul className="space-y-1">
                    {MENU_ITEMS.map(({ text, path, icon }) => (
                      <motion.li key={text} whileTap={{ scale: 0.98 }}>
                        <Link
                          to={path}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-4 px-6 py-4 font-medium ${
                            pathname === path
                              ? "text-purple-600 bg-purple-50"
                              : "text-black hover:bg-gray-50"
                          }`}
                        >
                          <span
                            className={
                              pathname === path
                                ? "text-purple-600"
                                : "text-black"
                            }
                          >
                            {icon}
                          </span>
                          <span>{text}</span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-gray-100 p-6">
                  <Link
                    to="#"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-4 px-4 py-3 font-medium  hover:text-purple-700"
                  >
                    <HelpCircle size={20} className="text-black" />
                    <span>Support</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 px-4 py-3 font-medium hover:bg-rose-50 text-rose-600 w-full"
                  >
                    <LogOut size={20} />
                    <span>LogOut</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
