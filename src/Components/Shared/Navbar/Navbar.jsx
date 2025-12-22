
import React from "react";
import { Link, NavLink } from "react-router";
import Container from "../../Container";
import useAuth from "../../../hooks/useAuth";

const Navbar = () => {
  const { user, logOut } = useAuth();
  console.log(user)

  const commonLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className="px-4 py-2 rounded-lg hover:bg-red-100 transition-all font-medium"
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/donation-request"
          className="px-4 py-2 rounded-lg hover:bg-red-100 transition-all font-medium"
        >
          Donation Request
        </NavLink>
      </li>
    </>
  );

  return (
    <Container>
      <div className="navbar bg-white shadow-md rounded-xl mt-2 px-4 py-2 border border-red-200/30">
        
        {/* LEFT */}
        <div className="navbar-start">
          {/* Mobile Menu */}
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

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-white rounded-xl shadow-xl mt-3 w-56 p-3 border border-red-100"
            >
              {commonLinks}

              {!user && (
                <>
                  <li>
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
              )}

              {user && (
                <>
                  <li>
                    <NavLink to="/funding" className="font-medium">
                      Funding
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard" className="font-medium">
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <button onClick={logOut} className="text-red-600 font-semibold">
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* LOGO */}
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-400 text-white px-4 py-1 rounded-lg shadow"
          >
            Blood Donation
          </Link>
        </div>

        {/* MIDDLE MENU (Desktop) */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal space-x-2">{commonLinks}</ul>

         {user &&(
              <NavLink to="/funding" className="px-4 py-2 rounded-lg hover:bg-red-100 transition-all font-medium">
                      Funding
              </NavLink>
            
         )}
        </div>
       

        {/* RIGHT */}
        <div className="navbar-end">
          {!user ? (
            <div className="flex gap-3">
              <Link
                to="/login"
                className="px-5 py-2 rounded-lg font-semibold border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition-all"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-5 py-2 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 shadow-md transition-all"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-11 rounded-full border-2 border-red-500">
                  <img src={user?.photoURL} />
                </div>
              </label>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-10 p-3 shadow bg-white rounded-xl w-56 border border-red-100"
              >
                <li>
                  <NavLink to="/dashboard/main" className="font-medium">
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <button onClick={logOut} className="text-red-600 font-semibold">
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



