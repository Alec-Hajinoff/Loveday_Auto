import React from "react";
import ProductCatalogue from "./ProductCatalogue";
import "./Main.css";

function Main() {
  return (
    <div className="main-container">
      <section className="hero">
        <h2 className="hero-title">Loveday Auto Repairs — Services & Parts</h2>
      </section>

      <div className="intro-section">
        <ProductCatalogue />
      </div>
    </div>
  );
}

export default Main;
