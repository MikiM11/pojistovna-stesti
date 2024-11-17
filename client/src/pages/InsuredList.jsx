import React, { useState, useEffect } from "react";
import { FlashMessage } from "../components/FlashMessage"; // Import komponenty pro zobrazení chybové hlášky
import { Spinner } from "../components/Spinner"; // Import komponenty pro zobrazení spineru
import { apiGet } from "../utils/api"; // importování funkce pro načítání dat z API

function InsuredList() {
  const [insureds, setInsureds] = useState([]);
  const [error, setError] = useState(null); // State pro chybovou hlášku
  const [selectedInsuredId, setSelectedInsuredId] = useState(null); // State pro vybraného pojištěnce
  const [isLoading, setIsLoading] = useState(true); // State pro nacítání dat - zobrazení spineru

  useEffect(() => {
    const loadInsureds = async () => {
      try {
        const data = await apiGet("insureds");
        setInsureds(data);
        setIsLoading(false); // Skrytí spineru
      } catch (error) {
        setError("Chyba načítání dat. ...asi vítr... 🤷🏻‍♂️"); // Uložení chyby do state
        setIsLoading(false); // Skrytí spineru
      }
    };

    loadInsureds();
  }, []);

  const handleRowClick = (insuredID) => {
    setSelectedInsuredId(insuredID);
  };

  return (
    <div>
      {isLoading && (
          <Spinner /> // Zobrazení spineru při načítání dat
      )
        }

      {error && ( // Pokud existuje chyba
        <FlashMessage message={error} type="danger" /> // Zobrazení chybové hlášky
      )}
      {!error && ( // Pokud neexistuje chyba vykreslí se tabulka pojištěnců
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Jméno</th>
            <th>Příjmení</th>
            <th>Ulice</th>
            <th>Město</th>
            <th>PSČ</th>
          </tr>
        </thead>
        <tbody>
          {insureds.map((insured) => (
            <tr
              key={insured._id}
              onClick={() => handleRowClick(insured._id)}
              className={selectedInsuredId === insured._id ? "table-active" : ""} // Přidání třídy pro aktivní řádek      
            >
              <td>{insured.firstName}</td>
              <td>{insured.lastName}</td>
              <td>{insured.street}</td>
              <td>{insured.city}</td>
              <td>{insured.postalCode}</td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
      {selectedInsuredId && ( // Podmíněné vykreslování detailu pojištěnce
        <div className="mt-3">
          <h2>Detail pojištěnce</h2>
          {/* Zde zobraz detaily pojištěnce */}
          {insureds
            .filter((insured) => insured._id === selectedInsuredId)
            .map((insured) => (
              <div key={insured._id}>
                <p>Jméno: {insured.firstName}</p>
                <p>Email: {insured.email}</p>
                <p>Telefon: {insured.phone}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default InsuredList;
