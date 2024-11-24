import React, { useState, useEffect } from "react"; 
import { FlashMessage } from "../components/FlashMessage"; // Komponenta pro zobrazení chybové zprávy
import { Spinner } from "../components/Spinner"; // Komponenta pro zobrazení indikátoru načítání
import { apiGet } from "../utils/api"; // Funkce pro získávání dat z API

function InsuredList() {
  // Stavy komponenty
  const [insureds, setInsureds] = useState([]); // Pole pro seznam pojištěnců
  const [error, setError] = useState(null); // Stav pro uchování případné chybové zprávy
  const [selectedInsuredId, setSelectedInsuredId] = useState(null); // Uchovává ID aktuálně vybraného pojištěnce
  const [isLoading, setIsLoading] = useState(true); // Stav pro indikaci načítání dat

  // useEffect pro načítání dat při prvním renderu komponenty
  useEffect(() => {
    const loadInsureds = async () => {
      try {
        const data = await apiGet("insureds"); // Získání dat z API
        setInsureds(data); // Nastavení seznamu pojištěnců do stavu
        setIsLoading(false); // Ukončení načítání
      } catch (error) {
        setError("Chyba načítání dat. ...asi vítr... 🤷🏻‍♂️"); // Nastavení chybové zprávy
        setIsLoading(false); // Ukončení načítání i při chybě
      }
    };

    loadInsureds(); // Volání funkce pro načtení dat
  }, []); // Prázdné pole závislostí znamená, že se useEffect spustí jen při prvním renderu

  // Funkce pro obsluhu kliknutí na řádek tabulky
  const handleRowClick = (insuredID) => {
    setSelectedInsuredId(selectedInsuredId === insuredID ? null : insuredID); // Přepíná zobrazení detailů pojištěnce
  };

  return (
    <div>
      {/* Zobrazení indikátoru načítání */}
      {isLoading && <Spinner />}
      {/* Zobrazení chybové zprávy */}
      {error && <FlashMessage message={error} type="danger" />}
      {/* Zobrazení tabulky, pokud nejsou chyby */}
      {!error && (
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
            {/* Iterace přes seznam pojištěnců */}
            {insureds.map((insured) => (
              <>
                {/* Řádek tabulky pro základní údaje pojištěnce */}
                <tr
                  key={insured._id} // Klíč pro React
                  onClick={() => handleRowClick(insured._id)} // Přepíná detaily pojištěnce
                  className={
                    selectedInsuredId === insured._id ? "table-active" : "" // Zvýraznění vybraného řádku
                  }
                >
                  <td>{insured.firstName}</td>
                  <td>{insured.lastName}</td>
                  <td>{insured.street}</td>
                  <td>{insured.city}</td>
                  <td>{insured.postalCode}</td>
                </tr>
                {/* Řádek pro zobrazení detailů pojištěnce */}
                {selectedInsuredId === insured._id && (
                  <tr key={`${insured._id}-details`}>
                    <td colSpan="5"> {/* Spojení všech sloupců pro detaily */}
                      <div className="p-3 bg-light border">
                        <h5>Detail pojištěnce</h5>
                        {/* Základní detaily pojištěnce */}
                        <p>
                          <strong>Email:</strong> {insured.email}
                        </p>
                        <p>
                          <strong>Telefon:</strong> {insured.phone}
                        </p>
                        <h6>Seznam pojištění</h6>
                        {/* Kontrola, zda pojištěnec má sjednaná pojištění */}
                        {insured.insurances && insured.insurances.length > 0 ? (
                          <ul>
                            {/* Iterace přes pojištění pojištěnce */}
                            {insured.insurances.map((insurance) => (
                              <li key={insurance._id}>
                                <strong>Typ:</strong> {insurance.type.name}<br />
                                <strong>Předmět:</strong> {insurance.subject}<br />
                                <strong>Částka:</strong> {insurance.amount} Kč<br />
                                <strong>Platnost:</strong>
                                {new Date(
                                  insurance.validFrom
                                ).toLocaleDateString()}
                                -
                                {new Date(
                                  insurance.validTo
                                ).toLocaleDateString()}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>Žádné sjednané pojištění</p> // Pokud pojištěnec nemá žádná pojištění
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default InsuredList;