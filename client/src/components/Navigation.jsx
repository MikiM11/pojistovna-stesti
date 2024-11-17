import React from "react";

function Navigation({ activePage, onNavClick }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
      <div className="container">
        <a className="navbar-brand" href="#">
          Pojišťovna
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a
                className={`nav-link ${
                  activePage === "insureds" ? "active" : ""
                }`}
                href="#"
                onClick={() => onNavClick("insureds")}
              >
                Seznam pojištěnců
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${
                  activePage === "insurances" ? "active" : ""
                }`}
                href="#"
                onClick={() => onNavClick("insurances")}
              >
                Seznam pojištění
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${
                  activePage === "insuranceTypes" ? "active" : ""
                }`}
                href="#"
                onClick={() => onNavClick("insuranceTypes")}
              >
                Typy pojištění
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
