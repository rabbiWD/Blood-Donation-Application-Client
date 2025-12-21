import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import useAuth from "../../hooks/useAuth";
import { AuthContext } from "../../Providers/AuthContext";
import { Link, useLocation } from "react-router";
// import { Link, useLocation } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

const Aside = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, role, logOut } = useAuth(AuthContext);
  const location = useLocation();

  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = {
    donor: [
      { name: "Dashboard Home", path: "/dashboard", icon: "🏠" },
      { name: "My Donation Requests", path: "my-donation-requests", icon: "🩸" },
      { name: "Create Donation Request", path: "/dashboard/createRequest", icon: "🆕" },
      { name: "Profile", path: "/dashboard/profile", icon: "👤" },
    ],
    volunteer: [
      { name: "Dashboard Home", path: "/dashboard", icon: "🏠" },
      { name: "All Blood Donation Requests", path: "/dashboard/all-blood-donation-request", icon: "🩸" },
      { name: "Profile", path: "/dashboard/profile", icon: "👤" },
    ],
    admin: [
      { name: "Dashboard Home", path: "/dashboard", icon: "🏠" },
      { name: "All Users", path: "/dashboard/all-users", icon: "👥" },
      { name: "All Blood Donation Requests", path: "/dashboard/all-blood-donation-request", icon: "🩸" },
      { name: "Profile", path: "/dashboard/profile", icon: "👤" },
    ],
  };

  const currentMenu = menuItems[role] || menuItems.donor;

  return (
    <>
      <Helmet>
        <title>BloodCare Dashboard | {role ? role.charAt(0).toUpperCase() + role.slice(1) : "User"}</title>
        <meta name="description" content="BloodCare dashboard for managing blood donation requests and profile." />
        <meta name="theme-color" content={theme === "dark" ? "#991b1b" : "#dc2626"} />
      </Helmet>

      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xl transition"
      >
        {isOpen ? "✖" : "☰"}
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-red-800 to-red-950 text-white transform transition-transform duration-300 ease-in-out overflow-hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-auto`}
      >
        <div className="flex flex-col h-full">

          <div className="p-8 border-b border-red-700">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block text-center"
            >
              <h2 className="text-3xl font-bold">🩸 BloodDonation</h2>
              <p className="text-sm text-red-200 mt-2">Dashboard</p>
            </Link>
          </div>

          <nav className="flex-1 px-6 py-8 space-y-2 overflow-y-auto">
            {currentMenu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-200 ${
                  location.pathname === item.path || location.pathname.includes(item.path)
                    ? "bg-red-700 shadow-xl scale-105"
                    : "hover:bg-red-700 hover:scale-105"
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-semibold text-lg">{item.name}</span>
              </Link>
            ))}

            <div className="pt-8 mt-6 border-t border-red-700">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-4 px-5 py-4 rounded-xl w-full transition-all duration-200 hover:bg-red-700 hover:scale-105"
              >
                <span className="text-2xl">{theme === "dark" ? "☀️" : "🌙"}</span>
                <span className="font-semibold text-lg">
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </span>
              </button>
            </div>
          </nav>

          <div className="p-6 border-t border-red-700">
            <div className="flex items-center gap-4 mb-6">
              <img
                src={user?.photoURL || "https://via.placeholder.com/48"}
                alt="User"
                className="w-12 h-12 rounded-full border-4 border-red-500 object-cover"
              />
              <div>
                <p className="font-bold text-lg">{user?.displayName || user?.name || "User"}</p>
                <p className="text-red-200 capitalize">{role || "doner"}</p>
              </div>
            </div>
            <button
              onClick={logOut}
              className="w-full py-3 bg-red-700 hover:bg-red-900 rounded-xl font-bold text-lg transition shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
        />
      )}
    </>
  );
};

export default Aside;