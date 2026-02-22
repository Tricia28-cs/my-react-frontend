import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TestApi from "./components/TestApi.jsx";
import Items from "./components/Items.jsx";
import ItemDetail from "./components/ItemDetail.jsx";
import "./index.css";

function AppRouter() {
  return (
    <Routes>
      <Route path="/test_api" element={<TestApi />} />

      <Route path="/items" element={<Items />} />
      <Route path="/items/:id" element={<ItemDetail />} />

      <Route path="/" element={<Navigate to="/items" replace />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </React.StrictMode>
);