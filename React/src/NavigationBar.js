import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavigationBar.css";

function NavigationBar({ isAuthenticated, userRole }) {
  const location = useLocation();

  const dashboardPath =
    userRole === "customer" ? "/UserDashboard" : "/AdminDashboard";

  const isHomePage = location.pathname === "/";

  const isOnDashboard =
    location.pathname === "/UserDashboard" ||
    location.pathname === "/AdminDashboard";

  return (
    <nav className="navigation-bar">
      {!isHomePage && (
        <Link to="/" className="nav-bar-link">
          Home
        </Link>
      )}

      {isAuthenticated && !isOnDashboard && (
        <Link to={dashboardPath} className="nav-bar-link">
          Dashboard
        </Link>
      )}
    </nav>
  );
}

export default NavigationBar;
