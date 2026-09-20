import React from "react";
import "./AboutUs.css";

function AboutUs() {
  return (
    <div className="about-us-page">
      <section className="about-us-hero-wrapper">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8">
              <h1 className="about-us-hero-headline">
                Roots in the Community: A Century of Motoring Heritage
              </h1>
            </div>
          </div>
        </div>
      </section>

      <div className="container about-us-container">
        <div className="row">
          <div className="col-12">
            <h2 className="about-us-title">About Loveday Auto Repairs</h2>
            <p className="about-us-subtitle">
              Learn more about our garage history, team, certifications, and
              licenses. Full business details coming soon.
            </p>
            <div className="about-us-placeholder-box">
              <p className="mb-0">
                Business information and certification data are currently
                pending integration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
