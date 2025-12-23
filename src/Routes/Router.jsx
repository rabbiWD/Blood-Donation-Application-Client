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
import MainDashboard from "../Pages/Dashboard/MainDashboard";
import { createBrowserRouter } from "react-router";
import AllBloodDonationRequest from "../Pages/Dashboard/AllBloodDonationRequest/AllBloodDonationRequest";
import AllUsers from "../Pages/Dashboard/AllUsers/AllUsers";
import Funding from "../Pages/Fundings/Fundings";
import RequestDetails from "../Pages/DashboardPages/RequestDetails";
import PrivateRoute from "./PrivateRoute";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage/>,
    hydrateFallbackElement: <p className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-xl"></span></p>,
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
        element:(
          <PrivateRoute>
            <Funding/>
          </PrivateRoute>
        )
      },
      {
        path: "donation-request/:id",
        element: (
          <PrivateRoute>
            <DonationRequestDetails />
          </PrivateRoute>
        )
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
        index: true, 
        element: <DashboardHome />
      },
      {
        path: "main", 
        element: <MainDashboard />
      },
      {
        path: "all-blood-donation-request", 
        element: (
          <PrivateRoute>
            <AllBloodDonationRequest />
          </PrivateRoute>
        )
      },
      {
        path: "createRequest", 
        element: <CreateDonationRequest />
      },
      {
        path: "my-donation-request",
        element: (
          <PrivateRoute>
            <MyDonationRequests />
          </PrivateRoute>
        )
      },
      {
        path: '/dashboard/all-users',
        element: (
          <PrivateRoute>
            <AllUsers/>
          </PrivateRoute>
        )
      },
      {
        path: "edit-request/:id", 
        element: (
          <PrivateRoute>
            <EditDonationRequest />
          </PrivateRoute>
        )
      },
      {
        path: "/dashboard/request-details/:id",
        element: (
          <PrivateRoute>
            <RequestDetails/>
          </PrivateRoute>
        )
      },
      {
        path: "profile", 
        element: <Profile />
      },
    ]
  },
 
]);