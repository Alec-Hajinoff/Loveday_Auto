import React from "react";
import ShopPage from "./ShopPage";
import BookingCallToAction from "./BookingCallToAction";
import "./Main.css";

function Main({ isAuthenticated, userRole, isLoading }) {
  return (
    <div className="main-container">
      <BookingCallToAction
        isAuthenticated={isAuthenticated}
        userRole={userRole}
        isLoading={isLoading}
      />

      <section className="hero">
        <h2 className="hero-title">Loveday Auto Repairs — Services & Parts</h2>
      </section>

      <div className="intro-section">
        <ShopPage />
      </div>
    </div>
  );
}

export default Main;
