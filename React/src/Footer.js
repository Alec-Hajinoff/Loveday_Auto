import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();
  const user = ["i", "n", "f", "o"].join("");
  const domain = ["lovedayauto", "com"].join(".");
  const email = `${user}@${domain}`;
  return (
    <div className="container text-center">
      <div className="row">
        <div className="col-12">
          <p className="footer">
            <em>
              &copy; Copyright 2025 - {currentYear}. Address: 50A Southbury Rd,
              Enfield, EN1 1YB. Phone: 020 8367 5888. Email:{" "}
              <a href={`mailto:${email}`}>{email}</a>
            </em>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
