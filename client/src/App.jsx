import React, { useState } from "react";
import InsuredList from "./InsuredList";
import Navigation from "./Navigation"; // Import navigace
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("insureds");

  const handleNavClick = (page) => {
    setActivePage(page);
  };

  return (
    <div>
      <Navigation activePage={activePage} onNavClick={handleNavClick} />

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
  );
}

export default App;