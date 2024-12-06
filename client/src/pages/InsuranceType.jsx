// Stránka pro zobrazení typů pojištění

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FlashMessage } from "../components/FlashMessage"; // Import komponenty pro zobrazení chybové hlášky
import { Spinner } from "../components/Spinner"; // Import komponenty pro zobrazení spinneru
import { apiGet } from "../utils/api"; // Importování funkce pro načítání dat z API

function InsuranceType() {
  const [insuranceTypes, setInsuranceTypes] = useState([]);
  const [error, setError] = useState(null); // State pro chybovou hlášku
  const [isLoading, setIsLoading] = useState(true); // State pro načítání dat - zobrazení spinneru
  const navigate = useNavigate();

  useEffect(() => {
    const loadInsuranceTypes = async () => {
      try {
        const data = await apiGet("insuranceTypes");
        setInsuranceTypes(data);
        setIsLoading(false); // Skrytí spinneru
      } catch (error) {
        setError("Chyba načítání dat. ...asi vítr... 🤷🏻‍♂️"); // Uložení chyby do state
        setIsLoading(false); // Skrytí spinneru
      }
    };
    loadInsuranceTypes();
  }, []);

  const handleAddInsuranceType = () => {
    navigate("/pridat-typ-pojisteni"); // Přesměrování na stránku pro přidání nového typu pojištění
  };

  const handleEditInsuranceType = (id) => {
    navigate(`/upravit-typ-pojisteni/${id}`); // Přesměrování na stránku pro úpravu typu pojištění
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6>Zde je možné přidat, nebo upravit typy pojištění</h6>
        <button
          className="btn btn-outline-primary"
          onClick={handleAddInsuranceType}
        >
          Přidat pojištění
        </button>
      </div>
      {isLoading && (
        <Spinner /> // Zobrazení spinneru při načítání dat
      )}

      {error && ( // Pokud existuje chyba
        <FlashMessage message={error} type="danger" /> // Zobrazení chybové hlášky
      )}
      {!error && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Název</th>
              <th className="text-end">Akce</th> {/* Sloupec pro tlačítko */}
            </tr>
          </thead>
          <tbody>
            {insuranceTypes.map((insuranceType) => (
              <tr key={insuranceType._id}>
                <td>{insuranceType.name}</td>
                <td className="text-end">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleEditInsuranceType(insuranceType._id)}
                  >
                    Upravit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!isLoading && !error && insuranceTypes.length === 0 && (
        <p>Žádné typy pojištění nejsou k dispozici.</p>
      )}
    </div>
  );
}

export default InsuranceType;