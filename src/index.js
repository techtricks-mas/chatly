import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import firebaseConfig from "./firebaseConfig";
import "react-toastify/dist/ReactToastify.css";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import store from "./store";
import { Provider } from "react-redux";
import Registration from "./pages/registration";
import Login from "./pages/log in";
import Home from "./pages/home";
import ForgotPassword from "./pages/forgot password";
import Chat from "./pages/chat";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
  {
    path: "/registration",
    element: <Registration />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgotpassword",
    element: <ForgotPassword />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
