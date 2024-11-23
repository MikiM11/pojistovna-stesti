import React from "react";
import { NavLink } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <div className="container">
        <ul className="navbar-nav me-auto">
          {/* Odkaz na stránku pojištěnců */}
          <li className="nav-item">
            <NavLink
              to="/pojistenci"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Seznam pojištěnců
            </NavLink>
          </li>
          {/* Odkaz na stránku pojištění */}
          <li className="nav-item">
            <NavLink
              to="/pojisteni"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Seznam pojištění
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;