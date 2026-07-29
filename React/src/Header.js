import React from "react";
import { Link } from "react-router-dom";
import blue from "./Images/Hertford_Standard_Logo.svg";
import LogoutComponent from "./LogoutComponent";
import "./Header.css";

function Header({ isAuthenticated, isLoading, onLogoutComplete }) {
  return (
    <div className="header-wrapper">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-12 col-md-9">
            <Link to="/">
              <img
                id="logo"
                src={blue}
                alt="A company logo"
                title="A company logo"
              />
            </Link>
          </div>

          <div className="col-12 col-md-3 text-end">
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
