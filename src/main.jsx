import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Users from "./components/Users.jsx";
import UserDetail from "./components/UserDetail.jsx";
import Items from "./components/Items.jsx";
import ItemDetail from "./components/ItemDetail.jsx";
import TestApi from "./components/TestApi.jsx";

function AppRouter() {
  return (
    <Routes>
      <Route path="/users" element={<Users />} />
      <Route path="/users/:id" element={<UserDetail />} />

      <Route path="/items" element={<Items />} />
      <Route path="/items/:id" element={<ItemDetail />} />

      <Route path="/test_api" element={<TestApi />} />

      <Route path="/" element={<Navigate to="/users" replace />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* ✅ THIS is the fix */}
    <BrowserRouter basename="/my-react-frontend">
      <AppRouter />
    </BrowserRouter>
  </React.StrictMode>
);