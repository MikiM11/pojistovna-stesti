import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import InsuredList from "./pages/InsuredList";    // Import stránky s pojištěnci
import InsuranceList from "./pages/InsuranceList"; // Import stránky s pojištěním
import InsuranceType from "./pages/InsuranceType"; // Import stránky s typy pojištění
import AddInsuredForm from "./pages/AddInsuredForm"; // Import stránky s formulářem pro přidání pojištěnce
import AddInsuranceType from "./pages/AddInsuranceType"; // Import stránky s formulářem pro přidání typu pojištění
import Navigation from "./components/Navigation"; // Import navigace
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="page-header">
          <h1>Pojišťovna Štěstí - evidence pojištěnců</h1>
          <i className="bi bi-umbrella" title="Pojišťovna Štěstí"></i>
        </header>
        <Navigation />
        <div className="content-wrapper">
          <div className="container mt-4">
            <Routes>
              {/* Přesměrování na výchozí stránku */}
              <Route path="/" element={<Navigate to="/pojistenci" />} />

              {/* Seznam pojištěnců */}
              <Route
                path="/pojistenci"
                element={
                  <div>
                    <h1>Seznam pojištěnců</h1>
                    <InsuredList />
                  </div>
                }
              />

              {/* Stránka pro přidání pojištěnce */}
              <Route
                path="/pridat-pojistence"
                element={
                  <div>
                    <h1>Přidat pojištěnce</h1>
                    <AddInsuredForm />
                  </div>
                }
              />

              {/* Stránka pro úpravu pojištěnce */}
              <Route
                path="/upravit-pojistence/:id"
                element={
                  <div>
                    <h1>Upravit pojištěnce</h1>
                    <AddInsuredForm />
                  </div>
                }
              />

              {/* Seznam pojištění */}
              <Route
                path="/pojisteni"
                element={
                  <div>
                    <h1>Seznam pojištění</h1>
                    <InsuranceList />
                  </div>
                }
              />

              {/* Typy pojištění */}
              <Route
                path="/typ-pojisteni"
                element={
                  <div>
                    <h1>Typy pojištění</h1>
                    <InsuranceType />
                  </div>
                }
              />

              {/* Stránka 404 */}
              <Route
                path="*"
                element={
                  <div>
                    <h1>404 - Stránka nenalezena</h1>
                  </div>
                }
              />
              <Route path="/pridat-typ-pojisteni" element={<AddInsuranceType />} />
              <Route path="/upravit-typ-pojisteni/:id" element={<AddInsuranceType />} />
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