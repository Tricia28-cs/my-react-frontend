import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import TestApi from "./components/TestApi";
import RequireAuth from "./middleware/RequireAuth";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Logout from "./components/Logout";

import Users from "./components/Users.jsx";
import UserDetail from "./components/UserDetail.jsx";
import Items from "./components/Items.jsx";
import ItemDetail from "./components/ItemDetail.jsx";

function App() {
  const [message, setMessage] = useState("...Loading...");

  useEffect(() => {
    fetch("http://localhost:3000/api/hello")
      .then((r) => r.json())
      .then((d) => setMessage(d.message))
      .catch(() => setMessage("Failed to load"));
  }, []);

  return (
    <>
      <Routes>
        <Route path="/test_api" element={<TestApi />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />

        <Route
          path="/logout"
          element={
            <RequireAuth>
              <Logout />
            </RequireAuth>
          }
        />

        {/* CRUD pages already in your project */}
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetail />} />

        <Route path="/items" element={<Items />} />
        <Route path="/items/:id" element={<ItemDetail />} />
      </Routes>

      <div style={{ padding: 12 }}>Message: {message}</div>
    </>
  );
}

export default App;