import { createBrowserRouter } from "react-router";
import MainLayout from './../Layouts/MainLayout';
import Home from "../Components/Home/Home";
import Register from "../Components/Auth/Register/Register";
import Login from "../Components/Auth/Login/Login";
import DashboardLayout from "../DashboardLayout/DashboardLayout";
import MainDashboard from "../Pages/Dashboard/MainDashboard";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout/>,
    children: [
      {
        index: true,
        element: <Home/>
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
    path:'/dashboard',
    element: <DashboardLayout/>,
    children: [
      {
        path:'main',
        element: <MainDashboard/>
      }
    ]

  }
  
]);