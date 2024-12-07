import React, { useState, useEffect } from "react";
import { FlashMessage } from "../components/FlashMessage";
import { Spinner } from "../components/Spinner";
import { fetchInsurances, fetchInsuranceTypes } from "../utils/insuranceUtils";

function InsuranceList() {
  const [insurances, setInsurances] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [type, setType] = useState(""); // Filtrování podle typu
  const [insuredName, setInsuredName] = useState(""); // Filtrování podle jména
  const [page, setPage] = useState(1); // Aktuální stránka
  const [totalPages, setTotalPages] = useState(1); // Celkový počet stránek
  const [insuranceTypes, setInsuranceTypes] = useState([]); // Dostupné typy pojištění

  // Načtení typů pojištění
  const loadInsuranceTypes = async () => {
    try {
      const types = await fetchInsuranceTypes();
      setInsuranceTypes(types);
    } catch (error) {
      setError("Nepodařilo se načíst typy pojištění.");
    }
  };

  // Načtení typů pojištění při prvním renderu
  useEffect(() => {
    loadInsuranceTypes();
  }, []);

  // Načtení pojištění při změně filtrů nebo stránky
  useEffect(() => {
    // Načtení seznamu pojištění
    const loadInsurances = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchInsurances({ type, insuredName, page });
        setInsurances(data.data);
        setTotalPages(data.totalPages);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadInsurances();
  }, [type, insuredName, page]);

  // Obsluha změny stránky
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Reset filtrů
  const handleResetFilters = () => {
    setType("");
    setInsuredName("");
    setPage(1);
  };

  return (
    <div>
      {isLoading && <Spinner />}
      {error && <FlashMessage message={error} type="danger" />}

      {/* Filtrovací formulář */}
      <div className="mb-3">
        <div className="d-flex justify-content-between">
          <select
            className="form-select me-2"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Všechny typy</option>
            {insuranceTypes.map((insuranceType) => (
              <option key={insuranceType._id} value={insuranceType._id}>
                {insuranceType.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="form-control me-2"
            placeholder="Jméno pojištěnce"
            value={insuredName}
            onChange={(e) => setInsuredName(e.target.value)}
          />
          <button
            className="btn btn-outline-secondary"
            onClick={handleResetFilters}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Tabulka */}
      {!isLoading && !error && insurances.length > 0 && (
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
              <tr key={insurance._id}>
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

      {/* Žádná data */}
      {!isLoading && !error && insurances.length === 0 && (
        <p>Žádná pojištění nejsou k dispozici.</p>
      )}

      {/* Stránkování */}
      {!isLoading && !error && totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(page - 1)}
              >
                Předchozí
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <li
                key={pageNumber}
                className={`page-item ${pageNumber === page ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </button>
              </li>
            ))}
            <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(page + 1)}
              >
                Další
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

export default InsuranceList;