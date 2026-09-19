import React from "react";
import "./Services.css";

function Services() {
  return (
    <div className="services-page">
      <section className="services-hero-wrapper">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10">
              <h1 className="services-hero-headline">Our Services & Pricing</h1>
              <p className="services-hero-subheadline">
                Expert repairs, routine maintenance and MOT testing to keep you
                safely on the road
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container services-container">
        <div className="row">
          <div className="col-12">
            <h2 className="services-title">Service Catalog</h2>
            <p className="services-subtitle">
              Professional auto repair and maintenance services. Detailed
              service lists and pricing will be available soon.
            </p>
            <div className="services-placeholder-box">
              <p className="mb-0">
                Service catalog data is currently pending integration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;
