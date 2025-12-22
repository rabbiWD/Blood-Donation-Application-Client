// import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./../Layouts/MainLayout";
import Home from "../Components/Home/Home";
import Register from "../Components/Auth/Register/Register";
import Login from "../Components/Auth/Login/Login";
import DashboardLayout from "../DashboardLayout/DashboardLayout";
import DashboardHome from "../Pages/Dashboard/DashboardHome/DashboardHome";
import CreateDonationRequest from "../Pages/DashboardPages/CreateDonationRequest";
import MyDonationRequests from "../Pages/DashboardPages/MyDonationRequest";
import EditDonationRequest from "../Pages/DashboardPages/EditDonationRequest";
import Profile from "../Pages/DashboardPages/Profile";
import SearchDonor from "../Components/Home/SearchDonors";
import DonationRequest from "../Pages/DashboardPages/DonationRequest";
import DonationRequestDetails from "../Pages/DashboardPages/DonationRequestDetails";
import AddRequest from "../Pages/Dashboard/AllBloodDonationRequest/AllBloodDonationRequest";
import MainDashboard from "../Pages/Dashboard/MainDashboard";
import { createBrowserRouter } from "react-router";
import AllBloodDonationRequest from "../Pages/Dashboard/AllBloodDonationRequest/AllBloodDonationRequest";
import AllUsers from "../Pages/Dashboard/AllUsers/AllUsers";
import Funding from "../Pages/Fundings/Fundings";
import RequestDetails from "../Pages/DashboardPages/RequestDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "search",
        element: <SearchDonor />
      },
      {
        path: "donation-request",
        element: <DonationRequest />
      },
      {
        path: 'funding',
        element:<Funding/>
      },
      {
        path: "donation-request/:id",
        element: <DonationRequestDetails />
      },
      {
        path: "register",
        element: <Register />
      },
      {
        path: "login",
        element: <Login />
      },
    ]
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true, // /dashboard গেলে DashboardHome দেখাবে
        element: <DashboardHome />
      },
      {
        path: "main", // /dashboard/main
        element: <MainDashboard />
      },
      {
        path: "all-blood-donation-request", // /dashboard/add-request
        element: <AllBloodDonationRequest />
      },
      {
        path: "createRequest", // /dashboard/createRequest
        element: <CreateDonationRequest />
      },
      {
        path: "my-donation-request", // <-- ঠিক করা হয়েছে (plural + সঠিক পাথ)
        element: <MyDonationRequests />
      },
      {
        path: '/dashboard/all-users',
        element: <AllUsers/>
      },
      {
        path: "edit-request/:id", // /dashboard/edit-request/:id
        element: <EditDonationRequest />
      },
      {
        path: "/dashboard/request-details/:id",
        element: <RequestDetails/>
      },
      {
        path: "profile", // /dashboard/profile
        element: <Profile />
      },
    ]
  },
  // 404 page (অপশনাল কিন্তু ভালো প্র্যাকটিস)
  {
    path: "*",
    element: <div className="text-center py-20 text-4xl">404 - Page Not Found</div>
  }
]);