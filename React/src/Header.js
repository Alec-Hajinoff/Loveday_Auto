import React from "react";
import { Link } from "react-router-dom";
import blue from "./Images/Loveday_Auto_Logo.svg";
import LogoutComponent from "./LogoutComponent";
import BasketWidget from "./BasketWidget";

import "./Header.css";

function Header({ isAuthenticated, isLoading, onLogoutComplete }) {
  return (
    <header className="header-wrapper">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-12 col-md-6">
            <Link to="/">
              <img
                id="logo"
                src={blue}
                alt="Loveday Auto Repairs Logo"
                title="Loveday Auto Repairs"
              />
            </Link>
          </div>

          <div className="col-12 col-md-6 text-end d-flex align-items-center justify-content-end gap-3">
            {!isLoading &&
              (isAuthenticated ? (
                <LogoutComponent onLogoutComplete={onLogoutComplete} />
              ) : (
                <div className="d-flex align-items-center justify-content-end gap-3">
                  <Link to="/UserLogin" className="btn-text">
                    Log in
                  </Link>
                  <Link to="/UserRegistration" className="btn-text">
                    Sign up
                  </Link>
                </div>
              ))}
            <BasketWidget />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
