import React from "react";
import "./Services.css";

function Services() {
  return (
    <div className="container services-container">
      <div className="row">
        <div className="col-12">
          <h2 className="services-title">Our Services</h2>
          <p className="services-subtitle">
            Professional auto repair and maintenance services. Detailed service
            lists and pricing will be available soon.
          </p>
          <div className="services-placeholder-box">
            <p className="mb-0">
              Service catalog data is currently pending integration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;
