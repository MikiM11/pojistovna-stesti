import React, { useState, useEffect } from "react";
import { FlashMessage } from "../components/FlashMessage"; // Import komponenty pro chybové hlášky
import { Spinner } from "../components/Spinner"; // Import komponenty spinneru
import { fetchInsurances } from "../utils/insuranceUtils"; // Import funkce z insuranceUtils

function InsuranceList() {
  const [insurances, setInsurances] = useState([]); // State pro seznam pojištění
  const [error, setError] = useState(null); // State pro chybové hlášky
  const [selectedInsuranceId, setSelectedInsuranceId] = useState(null); // State pro vybrané pojištění
  const [isLoading, setIsLoading] = useState(true); // State pro indikaci načítání

  // Funkce pro načítání seznamu pojištění
  useEffect(() => {
    const loadInsurances = async () => {
      try {
        const data = await fetchInsurances(); // Volání sdílené funkce pro načtení pojištění
        setInsurances(data);
        setIsLoading(false); // Skrytí spinneru
      } catch (error) {
        setError(error.message); // Uložení chyby do state
        setIsLoading(false); // Skrytí spinneru
      }
    };

    loadInsurances();
  }, []);

  // Obsluha kliknutí na řádek v tabulce
  const handleRowClick = (insuranceID) => {
    setSelectedInsuranceId(insuranceID);
  };

  return (
    <div>
      {/* Zobrazení spinneru při načítání */}
      {isLoading && <Spinner />}

      {/* Zobrazení chybové hlášky */}
      {error && <FlashMessage message={error} type="danger" />}

      {/* Tabulka se seznamem pojištění */}
      {!isLoading && !error && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Typ pojištění</th>
              <th>Pojistná částka</th>
              <th>Pojištěnec</th>
              <th>Předmět</th>
              <th>Platnost od</th>
              <th>Platnost do</th>
            </tr>
          </thead>
          <tbody>
            {insurances.map((insurance) => (
              <tr
                key={insurance._id}
                onClick={() => handleRowClick(insurance._id)} // Kliknutí na řádek
              >
                <td>{insurance.type?.name || "N/A"}</td>
                <td>{insurance.amount} Kč</td>
                <td>
                  {insurance.insured
                    ? `${insurance.insured.firstName} ${insurance.insured.lastName}`
                    : "N/A"}
                </td>
                <td>{insurance.subject}</td>
                <td>{new Date(insurance.validFrom).toLocaleDateString()}</td>
                <td>{new Date(insurance.validTo).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pokud není žádné pojištění */}
      {!isLoading && !error && insurances.length === 0 && (
        <p>Žádná pojištění nejsou k dispozici.</p>
      )}
    </div>
  );
}

export default InsuranceList;