import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Header from "../components/Admin/Header/Header";
import Sidebar from "../components/Admin/Sidebar/Sidebar";
import Dashboard from "../components/Admin/Dashboard/Dashboard";
import NewsMgmt from "../components/Admin/Dashboard/NewsMgmt";
import AddNews from "../components/Admin/Dashboard/AddNews";
import UsersMgmt from "../components/Admin/Dashboard/UsersMgmt";
import CommentsMgmt from "../components/Admin/Dashboard/CommentsMgmt";
import UpdateNews from "../components/Admin/Dashboard/UpdateNew";

const ProtectedRoute = ({ isAdmin }) => {
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const AdminRoutes = ({ isAdmin }) => {
  return (
    <div className="app sidebar-mini rtl">
      <Routes>
        <Route element={<ProtectedRoute isAdmin={isAdmin} />}>
          <Route
            path="/"
            element={
              <>
                <Header />
                <Sidebar />
                <Navigate to="/dashboard" />
              </>
            }
          />
          <Route
            path="/dashboard"
            element={
              <>
                <Header />
                <Sidebar />
                <Dashboard />
              </>
            }
          />
          <Route
            path="/news-management"
            element={
              <>
                <Header />
                <Sidebar />
                <NewsMgmt />
              </>
            }
          />
          <Route
            path="/add-news"
            element={
              <>
                <Header />
                <Sidebar />
                <AddNews />
              </>
            }
          />
          <Route
            path="/update-news/:id"
            element={
              <>
                <Header />
                <Sidebar />
                <UpdateNews />
              </>
            }
          />
          <Route
            path="/users-management"
            element={
              <>
                <Header />
                <Sidebar />
                <UsersMgmt />
              </>
            }
          />
          <Route
            path="/comments-management"
            element={
              <>
                <Header />
                <Sidebar />
                <CommentsMgmt />
              </>
            }
          />
        </Route>
      </Routes>
    </div>
  );
};

export default AdminRoutes;

