import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import EmployeeList from "./pages/EmployeeList.js";
import EmployeeProfile from "./pages/EmployeeProfile.js";
import AddEmployee from "./pages/AddEmployee.js";
import EditEmployee from "./pages/EditEmployee.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";

// ProtectedRoute as a function returning React.createElement
function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return token ? children : null;
}

function App() {
  return React.createElement(
    Router,
    null,
    React.createElement(
      Routes,
      null,
      React.createElement(Route, { path: "/login", element: React.createElement(Login) }),
      React.createElement(Route, { path: "/register", element: React.createElement(Register) }),
      React.createElement(Route, {
        path: "/",
        element: React.createElement(
          ProtectedRoute,
          null,
          React.createElement(EmployeeList)
        )
      }),
      React.createElement(Route, {
        path: "/employee/:id",
        element: React.createElement(
          ProtectedRoute,
          null,
          React.createElement(EmployeeProfile)
        )
      }),
      React.createElement(Route, {
        path: "/add",
        element: React.createElement(
          ProtectedRoute,
          null,
          React.createElement(AddEmployee)
        )
      }),
      React.createElement(Route, {
        path: "/edit/:id",
        element: React.createElement(
          ProtectedRoute,
          null,
          React.createElement(EditEmployee)
        )
      })
    )
  );
}

export default App;
