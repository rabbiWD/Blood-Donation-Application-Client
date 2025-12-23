import React from "react";
import Container from "../../Container";
import useAuth from "../../../hooks/useAuth";
import { Link, NavLink } from "react-router";

const Navbar = () => {
  const { user, logOut } = useAuth();

  // Common links for both mobile & desktop
  const navLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg font-medium transition-all ${
              isActive
                ? "bg-red-500 text-white shadow-md"
                : "hover:bg-red-100 text-gray-700"
            }`
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/donation-request"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg font-medium transition-all ${
              isActive
                ? "bg-red-500 text-white shadow-md"
                : "hover:bg-red-100 text-gray-700"
            }`
          }
        >
          Donation Requests
        </NavLink>
      </li>

      {/* Funding link - only if user is logged in */}
      {user && (
        <li>
          <NavLink
            to="/funding"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-medium transition-all ${
                isActive
                  ? "bg-red-500 text-white shadow-md"
                  : "hover:bg-red-100 text-gray-700"
              }`
            }
          >
            Funding
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <Container>
      <div className="navbar bg-white shadow-md rounded-xl mt-2 px-4 py-3 border border-red-200/30">
        
        {/* LEFT: Logo & Mobile Menu */}
        <div className="navbar-start">
          {/* Mobile Dropdown */}
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>

            {/* Mobile Menu */}
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-white rounded-xl shadow-xl mt-3 w-60 p-4 z-50 border border-red-100 space-y-2"
            >
              {navLinks}

              {/* Auth buttons in mobile */}
              {!user ? (
                <>
                  <li className="mt-4">
                    <NavLink
                      to="/login"
                      className="btn btn-outline btn-sm w-full border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                    >
                      Login
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/register"
                      className="btn btn-sm w-full bg-red-600 text-white hover:bg-red-700"
                    >
                      Register
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="mt-4">
                    <NavLink
                      to="/dashboard"
                      className="btn btn-outline btn-sm w-full border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <button
                      onClick={logOut}
                      className="btn btn-sm w-full bg-red-600 text-white hover:bg-red-700"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-400 text-white px-5 py-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            Blood Donation
          </Link>
        </div>

        {/* CENTER: Desktop Menu */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 space-x-2">
            {navLinks}
          </ul>
        </div>

        {/* RIGHT: Auth Section (Desktop) */}
        <div className="navbar-end">
          {!user ? (
            <div className="hidden md:flex gap-3"> {/* md+ তে দেখাবে */}
              <Link
                to="/login"
                className="px-6 py-2.5 rounded-lg font-semibold border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition-all"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 shadow-md transition-all"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar ring-2 ring-red-400 ring-offset-2">
                <div className="w-12 rounded-full overflow-hidden">
                  <img
                    src={user?.photoURL || "https://i.ibb.co.com/4pZ4Yk0/user.png"}
                    alt="User"
                    className="object-cover"
                  />
                </div>
              </label>

              <ul
                tabIndex={0}
                className="menu dropdown-content mt-3 z-50 p-4 shadow-lg bg-white rounded-xl w-56 border border-red-100"
              >
                <li className="menu-title text-center pb-2 border-b">
                  <span className="text-sm font-medium text-gray-600">
                    {user?.displayName || user?.email}
                  </span>
                </li>
                <li className="mt-3">
                  <NavLink
                    to="/dashboard"
                    className="font-medium justify-center py-3 hover:bg-red-50"
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={logOut}
                    className="text-red-600 font-semibold justify-center py-3 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Navbar;