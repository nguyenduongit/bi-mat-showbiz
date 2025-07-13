// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import { PostRedirect } from "./PostRedirect.tsx";
import "./index.css"; // Import global styles

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Trang quản lý
  },
  {
    path: "/posts/:slug",
    element: <PostRedirect />, // Trang xử lý chuyển hướng
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
