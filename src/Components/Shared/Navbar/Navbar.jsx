import React from "react";
import { Link, NavLink } from "react-router";
import Container from './../../Container';
import useAuth from './../../../hooks/useAuth';




const Navbar = () => {
  // const { user, logout } = useContext(AuthContext);  // user data
  const {user, logout} = useAuth()

  // Common Links (Home + Donation Request)
  const commonLinks = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/donation-request">Donation Request</NavLink>
      </li>
    </>
  );

  return (
    <Container>
      <div className="navbar bg-base-100 shadow-sm">
        {/* Left - Logo & Mobile Menu */}
        <div className="navbar-start">
          {/* Mobile dropdown */}
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>

            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
            >
              {commonLinks}

              {/* Login na thakle → Login Link */}
              {/* {!user && (
                <li>
                  <NavLink to="/login">Login</NavLink>
                </li>
              )} */}

              {/* Login thakle → Funding & Avatar dropdown */}
              {user && (
                <>
                  <li>
                    <NavLink to="/funding">Funding</NavLink>
                  </li>

                  <li>
                    <NavLink to="/dashboard">Dashboard</NavLink>
                  </li>

                  <li>
                    <button onClick={logout}>Logout</button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Logo */}
          <Link to="/" className="btn btn-ghost text-xl">
            Blood Donation
          </Link>
        </div>

        {/* Middle - Desktop Menu */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {commonLinks}

            {/* Login na thakle */}
            {/* {!user && (
              <li>
                <NavLink to="/login">Login</NavLink>
              </li>
            )} */}

            {/* Login thakle */}
            {user && (
              <>
                <li>
                  <NavLink to="/funding">Funding</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Right - Avatar / Login button */}
        <div className="navbar-end">
          {!user ? (
            <Link to="/login" className="btn">
              Login
            </Link>
          ) : (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src={user?.photoURL || "https://i.ibb.co/1RQ6gQD/user.png"} />
                </div>
              </label>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-10 p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <NavLink to="/dashboard">Dashboard</NavLink>
                </li>
                <li>
                  <button onClick={logout}>Logout</button>
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
