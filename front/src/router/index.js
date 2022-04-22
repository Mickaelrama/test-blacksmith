import { useRoutes, Navigate } from "react-router-dom";
import React from "react";
import Dashboard from "../view/dashboard";
import AuthGuard from "../components/auth-guard/AuthGuard";

const LoginPage = React.lazy(() => import("../view/login"));
const UserPage = React.lazy(() => import("../view/dashboard/user"));
const ParkingPage = React.lazy(() => import("../view/dashboard/parking"));

const RouterView = () => {
  let routes = useRoutes([
    {
      path: "/",
      element: <Dashboard />,
      children: [
        {
          path: "",
          element: <Navigate to="/parking" />,
        },
        {
          path: "user",
          element: (
            <AuthGuard role="ADMIN">
              <UserPage />
            </AuthGuard>
          ),
        },
        {
          path: "parking",
          element: (
            <AuthGuard role="ADMIN">
              <ParkingPage />
            </AuthGuard>
          ),
        },
      ],
    },
    { path: "/login", element: <LoginPage /> },
  ]);
  return routes;
};

export default RouterView;
