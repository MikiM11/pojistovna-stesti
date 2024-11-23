import React, { useState, useEffect } from "react";
import { FlashMessage } from "../components/FlashMessage"; // Import komponenty pro zobrazení chybové hlášky
import { Spinner } from "../components/Spinner"; // Import komponenty pro zobrazení spineru
import { apiGet } from "../utils/api"; // importování funkce pro načítání dat z API

function InsuranceType() {
  const [insuranceTypes, setInsuranceTypes] = useState([]);
  const [error, setError] = useState(null); // State pro chybovou hlášku
  const [isLoading, setIsLoading] = useState(true); // State pro nacítání dat - zobrazení spineru

  useEffect(() => {
    const loadInsuranceTypes = async () => {
      try {
        const data = await apiGet("insuranceTypes");
        setInsuranceTypes(data);
        setIsLoading(false); // Skrytí spineru
      } catch (error) {
        setError("Chyba načítání dat. ...asi vítr... 🤷🏻‍♂️"); // Uložení chyby do state
        setIsLoading(false); // Skrytí spineru
      }
    };
    loadInsuranceTypes();
  }, []);

  return (
    <div>
      {isLoading && (
        <Spinner /> // Zobrazení spineru při načítání dat
      )}

      {error && ( // Pokud existuje chyba
        <FlashMessage message={error} type="danger" /> // Zobrazení chybové hlášky
      )}
      {!error && ( // Pokud neexistuje chyba vykreslí se tabulka pojištěnců
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Název</th>
            </tr>
          </thead>
          <tbody>
            {insuranceTypes.map((insuranceType) => (
              <tr
                key={insuranceType._id}
                
              >
                <td>{insuranceType.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
        {/* Pokud není žádné pojištění */}
      {!isLoading && !error && insuranceTypes.length === 0 && (
        <p>Žádné typy pojištění nejsou k dispozici.</p>
      )}

    </div>
  );
}
export default InsuranceType;
