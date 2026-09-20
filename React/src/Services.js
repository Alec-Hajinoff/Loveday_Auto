import React from "react";
import ServicesPriceList from "./ServicesPriceList";
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
            <ServicesPriceList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;
