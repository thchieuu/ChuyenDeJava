import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "../components/Admin/Header/Header";
import Sidebar from "../components/Admin/Sidebar/Sidebar";
import Dashboard from "../components/Admin/Dashboard/Dashboard";
import NewsMgmt from "../components/Admin/Dashboard/NewsMgmt";
import AddNews from "../components/Admin/Dashboard/AddNews";
import UsersMgmt from "../components/Admin/Dashboard/UsersMgmt";
import CommentsMgmt from "../components/Admin/Dashboard/CommentsMgmt";
import UpdateNews from "../components/Admin/Dashboard/UpdateNew";


const AdminRoutes = () => {
  return (
    <div className="app sidebar-mini rtl">
      <Header />
      <Sidebar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/news-management" element={<NewsMgmt />} />
        <Route path="/add-news" element={<AddNews />} />
        <Route path="/update-news/:id" element={<UpdateNews />} />
        <Route path="/users-management" element={<UsersMgmt />} />
        <Route path="/comments-management" element={<CommentsMgmt />} />
      </Routes>
    </div>
  );
};

export default AdminRoutes;

