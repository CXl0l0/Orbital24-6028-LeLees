import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUpForm from "./components/auth/SignUpPage/SignUpForm";
import ForgotPassword from "./components/auth/ForgotPasswordPage/ForgotPassword";
import AdminHome from "./components/HomePage/Admin Page/AdminHome";
import UserHome from "./components/HomePage/User Page/UserHome";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "register",
    element: <SignUpForm />,
  },
  {
    path: "forgotpassword",
    element: <ForgotPassword />,
  },
  {
    path: "adminHome",
    element: <AdminHome />,
  },
  {
    path: "userHome",
    element: <UserHome />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
