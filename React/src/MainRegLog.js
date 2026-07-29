import React, { useState, useEffect, useRef } from "react";
import "./MainRegLog.css";
import Main from "./Main.js";
import UserRegistration from "./UserRegistration.js";
import UserLogin from "./UserLogin.js";

function MainRegLog() {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);

  const toggleTooltip = (e) => {
    e.stopPropagation();
    setShowTooltip((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div className="container text-center">
      <div className="row">
        <div className="col-12">
          <Main />
        </div>
      </div>
    </div>
  );
}

export default MainRegLog;
