// Client / src / components / Navbar / Navbar.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../assets/assets";
import { ChevronDown, LogOut, User } from "lucide-react";
import { fetchCurrentUser } from "../../services/fetch";

const Navbar = ({ user: propUser, onLogout }) => {
  const navigate = useNavigate();
  const menuRef = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
  const [localUser, setLocalUser] = useState(null);

  // const user = propUser || { name: "", email: "" };
  const user = propUser || localUser || { name: "", email: "" };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleLogout = () => {
    setMenuOpen(false);
    localStorage.removeItem("token");
    onLogout?.();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const data = await fetchCurrentUser();
        const userData = data?.user || data;

        setLocalUser(userData);
      } catch (error) {}
    };

    if (!propUser) {
      fetchUserData();
    }
  }, [propUser]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 md:px-8 max-w-7xl mx-auto">
        {/* -------- Logo -------- */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-0 cursor-pointer"
        >
          <div className="w-15 h-15 rounded-xl overflow-hidden">
            <img src={Logo} alt="Spendora Logo" />
          </div>

          <span className="lg:text-3xl md:text-3xl text-2xl text-gray-900 font-[550] lobster-regular">
            Spendora
          </span>
        </div>

        {/* -------- If User is Present -------- */}
        {user && (
          <div ref={menuRef} className="relative">
            <button
              onClick={toggleMenu}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="relative">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-linear-to-br from-purple-600 to-violet-500 text-white font-bold text-lg">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>

              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-gray-800 truncate max-w-30">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate max-w-30">
                  {user?.email || "user@spendora.com"}
                </p>
              </div>

              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* -------- Dropdown Menu -------- */}
            {menuOpen && (
              <div className="absolute top-14 right-0 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-600 to-violet-500 flex items-center justify-center text-white font-bold text-lg">
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>

                    <div>
                      <div className="text-sm text-gray-800 ">
                        {user?.name || "User"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user?.email || "user@spendora.com"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-1.5">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 text-sm text-black flex items-center gap-3 rounded-lg"
                  >
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </button>
                </div>

                <div className="p-1.5 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-rose-50 text-rose-600 rounded-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
