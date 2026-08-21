import React from "react";
import HeroSection from "./HeroSection";
import ShopPage from "./ShopPage";
import BookingCallToAction from "./BookingCallToAction";

import "./Main.css";

function Main({ isAuthenticated, userRole, isLoading }) {
  return (
    <div>
      <HeroSection />

      <div className="container text-center">
        <div className="row">
          <div className="col-12">
            <div className="main-container">
              <BookingCallToAction
                isAuthenticated={isAuthenticated}
                userRole={userRole}
                isLoading={isLoading}
              />

              <section className="hero">
                <h2 className="hero-title">Our Products</h2>
              </section>

              <div className="intro-section">
                <ShopPage />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
