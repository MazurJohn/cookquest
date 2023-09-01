import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import ErrorPage from "./error.page";
import Recipe from "./routes/recipe";
import AddRecipe from "./routes/addRecipe";
import Admin from "./routes/admin";
import ShoppingList from "./routes/shoppingList";
import InfoList from "./routes/info";
import Home from "./routes/home";
import "./index.css";
import { ThemeProvider } from "@material-tailwind/react";

const router = createBrowserRouter([
  {
    path: "/cookquest",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "recipe/",
        element: <Recipe />,
      },
      {
        path: "addRecipe/",
        element: <AddRecipe />,
      },
      {
        path: "admin/",
        element: <Admin />,
      },
      {
        path: "shoppingList/",
        element: <ShoppingList />,
      },
      {
        path: "info/",
        element: <InfoList />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <RouterProvider router={router} />
  </ThemeProvider>
);
