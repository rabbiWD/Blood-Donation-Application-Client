
// import { Link, NavLink } from "react-router-dom";
// import { useContext, useEffect, useState } from "react";
// import { BiLogIn } from "react-icons/bi";
// import { Logs } from "lucide-react";
// import { AuthContext } from "../context/AuthContext";

// const Navbar = () => {

// const {user , logOut} = useContext(AuthContext)

// console.log(user)
//   // 🔁 Theme state
//   const getInitialTheme = () => {
//     const saved = localStorage.getItem("theme");
//     if (saved) return saved;
//     if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
//       return "dark";
//     }
//     return "light";
//   };

//   const [theme, setTheme] = useState(getInitialTheme);

//   // Apply theme to html (daisyui) and also set Tailwind's dark class
//   useEffect(() => {
//     document.documentElement.setAttribute("data-theme", theme);
//     localStorage.setItem("theme", theme);

//     if (theme === "dark") {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }, [theme]);

//   const toggleTheme = () => {
//     setTheme((prev) => (prev === "light" ? "dark" : "light"));
//   };

//   return (
//     <div className="navbar bg-base-100 shadow-md px-4 md:px-10">

//       {/* Left */}
//       <div className="navbar-start">
//         <div className="dropdown">
//           <label tabIndex={0} className="btn btn-ghost lg:hidden">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
//               viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                 d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           </label>

//           {/* Mobile Menu */}
//           <ul tabIndex={0}
//             className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">

//             <li><NavLink to="/">Home</NavLink></li>
//             <li><NavLink to="/blood-requests">Donation Requests</NavLink></li>

//             {user ? (
//               <>
//                 <li><NavLink to="/funding">Funding</NavLink></li>
//                 <li><NavLink to="/dashboard">Dashboard</NavLink></li>
//                 <li><button onClick={logOut}>Logout</button></li>
//               </>
//             ) : (
//               <>
//                 <li><NavLink to="/login">Login</NavLink></li>
//                 <li><NavLink to="/register">Register</NavLink></li>
//               </>
//             )}

//             {/* 🌙 Theme Toggle (Mobile) */}
//             <li>
//               <button onClick={toggleTheme}>
//                 {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
//               </button>
//             </li>
//           </ul>
//         </div>

//         <Link to="/" className="text-xl font-bold text-red-600">
//           🩸 BloodCare
//         </Link>
//       </div>

//       {/* Center */}
//       <div className="navbar-center hidden lg:flex">
//         <ul className="menu menu-horizontal gap-2">
//           <li><NavLink to="/">Home</NavLink></li>
//           <li><NavLink to="/donationRequest">Donation Requests</NavLink></li>
//           {user && <li><NavLink to="/funding">Funding</NavLink></li>}
//         </ul>
//       </div>

//       {/* Right */}
//       <div className="navbar-end flex items-center gap-3">

//         {/* 🌙 Theme Toggle (Desktop) */}
//         <button
//           onClick={toggleTheme}
//           className="btn btn-ghost btn-circle"
//           title="Toggle Theme"
//         >
//           {theme === "light" ? "🌙" : "☀️"}
//         </button>

//         {user ? (
//           <div className="dropdown dropdown-end">
//             <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
//               <div className="w-10 rounded-full">
//                 <img
//                   src={user?.photoURL || "https://i.ibb.co/ZYW3VTp/brown-brim.png"}
//                   alt="user"
//                 />
//               </div>
//             </label>
//             <ul tabIndex={0}
//               className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
//               <li className="font-semibold px-2">{user?.displayName}</li>
//               <li><NavLink to="/dashboard">Dashboard</NavLink></li>
//               <li><button onClick={logOut}>Logout</button></li>
//             </ul>
//           </div>
//         ) : (
//           <div className="flex gap-2">
//             <NavLink to="/login" className="btn btn-outline btn-sm">
//               Login
//             </NavLink>
//             <NavLink to="/register" className="btn btn-error btn-sm text-white">
//               Register
//             </NavLink>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Navbar;



import React from "react";
import { Link, NavLink } from "react-router";
import Container from "../../Container";
import useAuth from "../../../hooks/useAuth";

const Navbar = () => {
  const { user, logOut } = useAuth();

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
           <li>
              <NavLink to="/funding" className="font-medium">
                      Funding
              </NavLink>
            </li>
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



