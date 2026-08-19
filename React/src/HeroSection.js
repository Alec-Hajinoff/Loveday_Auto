import React from "react";
import "./HeroSection.css";

function HeroSection() {
  return (
    <section className="hero-section-wrapper">
      <div className="container text-center">
        <div className="row">
          <div className="col-12">
            <div className="hero-content">
              <h1 className="hero-heading">Reliable Vehicle Care.</h1>
              <p className="hero-subheading">
                Professional vehicle servicing and repairs from a trusted local
                garage.
              </p>
              <p className="hero-description">
                From routine servicing and maintenance to repairs and essential
                vehicle checks, Loveday Auto makes it easy to look after your
                vehicle. Check availability, book a convenient time and manage
                your appointment online.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
