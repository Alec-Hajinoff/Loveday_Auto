// React\src\Main.js
import React from "react";
import ShopPage from "./ShopPage";
import "./Main.css";

function Main() {
  return (
    <div className="main-container">
      <section className="hero">
        <h2 className="hero-title">Loveday Auto Repairs — Services & Parts</h2>
      </section>

      <div className="intro-section">
        {/* Render ShopPage instead of ProductCatalogue */}
        <ShopPage />
      </div>
    </div>
  );
}

export default Main;