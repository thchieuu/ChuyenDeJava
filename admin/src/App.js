import React from "react";
import { BrowserRouter } from "react-router-dom";
import AdminRoutes from "./pages/AdminRoutes";
import "./components/css/main.css";

const App = () => {
  return (
    <BrowserRouter>
      <AdminRoutes />
    </BrowserRouter>
  );
};

export default App;
