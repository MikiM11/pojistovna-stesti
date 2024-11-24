import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import InsuredList from "./pages/InsuredList";
import InsuranceList from "./pages/InsuranceList";
import InsuranceType from "./pages/InsuranceType";
import Navigation from "./components/Navigation";
import Test from "./pages/Test";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="page-header">
        <h1>Pojišťovna Štěstí</h1>
          <i className="bi bi-umbrella" title="Pojišťovna Štěstí"></i> 
        </header>
        <Navigation />
        <div className="content-wrapper">
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<Navigate to="/pojistenci" />} />
              <Route
                path="/pojistenci"
                element={
                  <div>
                    <h1>Seznam pojištěnců</h1>
                    <InsuredList />
                  </div>
                }
              />
              <Route
                path="/pojisteni"
                element={
                  <div>
                    <h1>Seznam pojištění</h1>
                    <InsuranceList />
                  </div>
                }
              />
              {/* Můžeme přidat další cesty */}
              <Route
                path="/typ-pojisteni"
                element={
                  <div>
                    <h1>Typy pojištění</h1>
                    <InsuranceType />
                  </div>
                }
              />
              <Route
                path="/test"
                element={
                  <div>
                    <h1>Testovací stránka</h1>
                    <Test />
                  </div>
                }
              />
              <Route
                path="*"
                element={
                  <div>
                    <h1>404 - Stránka nenalezena</h1>
                  </div>
                }
              />
            </Routes>
          </div>
        </div>
        <footer className="footer mt-4">
          <div className="container">
            <p>&copy; 2024 Pojišťovna Štěstí &amp; Miki</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;