import React, { useState } from "react";
import InsuredList from "./pages/InsuredList";
import Navigation from "./components/Navigation"; // Import navigace
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("insureds");

  const handleNavClick = (page) => {
    setActivePage(page);
  };

  return (
    <div className="app-container">
      <header className="page-header">
        <i className="bi bi-umbrella" title="Pojišťovna Štěstí"></i>
        <h1>Pojišťovna Štěstí</h1>
      </header>
      <Navigation activePage={activePage} onNavClick={handleNavClick} />
      <div className="content-wrapper">
        <div className="container mt-4">
          {activePage === "insureds" && (
            <div>
              <h1>Seznam pojištěnců</h1>
              <InsuredList />
            </div>
          )}
          {/* ... další stránky */}
        </div>
      </div>
      <footer className="footer mt-4">
        <div className="container">
          <p>&copy; 2024 Pojišťovna Štěstí &amp; Miki</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
