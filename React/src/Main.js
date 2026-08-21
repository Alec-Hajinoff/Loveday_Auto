import React from "react";
import HeroSection from "./HeroSection";
import ShopPage from "./ShopPage";
import BookingCallToAction from "./BookingCallToAction";

import "./Main.css";

function Main({ isAuthenticated, userRole, isLoading }) {
  return (
    <div className="overflow-hidden">
      <div className="slide-in-left">
        <HeroSection />
      </div>

      <div className="container text-center">
        <div className="row">
          <div className="col-12">
            <div className="main-container">
              <div className="slide-in-right">
                <BookingCallToAction
                  isAuthenticated={isAuthenticated}
                  userRole={userRole}
                  isLoading={isLoading}
                />
              </div>

              <section className="hero">
                <h2 className="hero-title">Our Products</h2>
              </section>

              {/* 3. ShopPage slides in from the LEFT */}
              <div className="intro-section slide-in-left">
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
