import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Subjects from "./pages/Subjects.tsx";
import React from "react";
import Root from "./pages/Root.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import ReviewEnrollment from "./pages/ReviewEnrollment.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/disciplinas",
    element: <Subjects />,
  },
  {
    path: "/revisar-matricula",
    element: <ReviewEnrollment/>
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} fallbackElement={<p>Carregando...</p>} />,
    <Toaster richColors position="top-center" />
  </React.StrictMode>,
);
