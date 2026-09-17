import React from "react";
import "./AboutUs.css";

function AboutUs() {
  return (
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
              Business information and certification data are currently pending
              integration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
