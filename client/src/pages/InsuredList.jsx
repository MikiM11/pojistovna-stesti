import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Přidání navigace
import { FlashMessage } from "../components/FlashMessage";
import { Spinner } from "../components/Spinner";
import { apiGet } from "../utils/api";

function InsuredList() {
  const [insureds, setInsureds] = useState([]);
  const [error, setError] = useState(null);
  const [selectedInsuredId, setSelectedInsuredId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Navigace pro přesměrování na editaci

  useEffect(() => {
    const loadInsureds = async () => {
      try {
        const data = await apiGet("insureds");
        setInsureds(data);
        setIsLoading(false);
      } catch (error) {
        setError("Chyba načítání dat. ...asi vítr... 🤷🏻‍♂️");
        setIsLoading(false);
      }
    };

    loadInsureds();
  }, []);

  const handleRowClick = (insuredID) => {
    setSelectedInsuredId(selectedInsuredId === insuredID ? null : insuredID);
  };

  const handleEditClick = (insuredID) => {
    navigate(`/upravit-pojistence/${insuredID}`); // Přesměrování na formulář s ID
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Seznam pojištěnců</h1>
        <Link to="/pridat-pojistence" className="btn btn-outline-primary">
          Přidat pojištěnce
        </Link>
      </div>

      {isLoading && <Spinner />}
      {error && <FlashMessage message={error} type="danger" />}
      {!error && !isLoading && (
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
              <>
                <tr
                  key={insured._id}
                  onClick={() => handleRowClick(insured._id)}
                  className={
                    selectedInsuredId === insured._id ? "table-active" : ""
                  }
                >
                  <td>{insured.firstName}</td>
                  <td>{insured.lastName}</td>
                  <td>{insured.street}</td>
                  <td>{insured.city}</td>
                  <td>{insured.postalCode}</td>
                </tr>
                {selectedInsuredId === insured._id && (
                  <tr key={`${insured._id}-details`}>
                    <td colSpan="5">
                      <div className="p-3 bg-light border">
                        <h5>Detail pojištěnce</h5>
                        <p>
                          <strong>Email:</strong> {insured.email}
                        </p>
                        <p>
                          <strong>Telefon:</strong> {insured.phone}
                        </p>
                        <h6>Seznam pojištění</h6>
                        {insured.insurances && insured.insurances.length > 0 ? (
                          <ul>
                            {insured.insurances.map((insurance) => (
                              <li key={insurance._id}>
                                <strong>Typ: </strong> {insurance.type.name}
                                <strong> Předmět: </strong> {insurance.subject}
                                <strong> Částka: </strong> {insurance.amount} Kč
                                <strong> Platnost: </strong>
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
                          <p>Žádné sjednané pojištění</p>
                        )}
                        {/* Tlačítko Upravit */}
                        <button
                          className="btn btn-outline-primary mt-3"
                          onClick={() => handleEditClick(insured._id)}
                        >
                          Upravit
                        </button>
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
