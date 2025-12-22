import { createBrowserRouter } from "react-router";
import MainLayout from './../Layouts/MainLayout';
import Home from "../Components/Home/Home";
import Register from "../Components/Auth/Register/Register";
import Login from "../Components/Auth/Login/Login";
import DashboardLayout from "../DashboardLayout/DashboardLayout";
import MainDashboard from "../Pages/Dashboard/MainDashboard";
import AddRequest from "../Pages/Dashboard/AddRequest/AddRequest";
import SearchDonor from "../Components/Home/SearchDonors";
import DonationRequest from "../Pages/DashboardPages/DonationRequest";
import DonationRequestDetails from "../Pages/DashboardPages/DonationRequestDetails";
import MyDonationRequests from "../Pages/DashboardPages/MyDonationRequest";
import DashboardHome from "../Pages/Dashboard/DashboardHome/DashboardHome";
import CreateDonationRequest from "../Pages/DashboardPages/CreateDonationRequest";
import Profile from "../Pages/DashboardPages/Profile";




export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout/>,
    children: [
      {
        index: true,
        element: <Home/>
      },
      {
        path: '/search',
        element: <SearchDonor/>
      },
      {
        path: '/donation-request',
        element: <DonationRequest/>
      },
      {
        path:'/donation-request/:id',
        element: <DonationRequestDetails/>
      },
      { path: '/register', 
        element:<Register/>
      },
      { path: '/login',
        element:<Login/>
      },
    ]
  },
  {
    path:'dashboard',
    element: <DashboardLayout/>,
    children: [
      {
        path:'main',
        element: <MainDashboard/>
      },
      {
        path: 'add-request',
        element: <AddRequest/>
      },
      {
        path: '/dashboard',
        element: <DashboardHome/>
      },
      {
        path: '/dashboard/createRequest',
        element: <CreateDonationRequest/>
      },
      {
        path: '/dashboard/profile',
        element: <Profile/>
      },
      {
        path: 'my-donation-request',
        element: <MyDonationRequests/>
      }
      
    ]

  }
  
]);