import React from "react";
import { NavLink } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <div className="container">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <NavLink // Odkaz na stránku pojištěnců
              to="/pojistenci"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Seznam pojištěnců
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink // Odkaz na stránku pojištění
              to="/pojisteni"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Seznam pojištění
            </NavLink>
          </li>
          <li>
            <NavLink // Odkaz na stránku typů pojištění
              to="/typ-pojisteni"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Typy pojištění
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
