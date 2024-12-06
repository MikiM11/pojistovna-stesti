//Stránka pro zobrazení seznamu pojištěnců

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Přidání navigace
import { FlashMessage } from "../components/FlashMessage";
import { Spinner } from "../components/Spinner";
import { apiGet } from "../utils/api";

function InsuredList() {
  const [insureds, setInsureds] = useState([]); // Pojištěnci načtení z API
  const [error, setError] = useState(null); // Chybová zpráva
  const [selectedInsuredId, setSelectedInsuredId] = useState(null); // ID vybraného pojištěnce pro zobrazení detailů
  const [isLoading, setIsLoading] = useState(true); // Indikátor načítání dat
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    postalCode: "",
  });
  const [totalRecords, setTotalRecords] = useState(0); // Celkový počet záznamů

  // Filtry pro vyhledávání
  const [currentPage, setCurrentPage] = useState(1); // Aktuální stránka
  const [totalPages, setTotalPages] = useState(1); // Celkový počet stránek
  const navigate = useNavigate(); // Navigace pro přesměrování na editaci

  const itemsPerPage = 10; // Počet záznamů na stránku

  useEffect(() => {
    // Načítání pojištěnců z API při změně filtrů nebo aktuální stránky
    const loadInsureds = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          ...filters,
          page: currentPage,
          limit: itemsPerPage,
        }).toString();
        const response = await apiGet(`insureds?${params}`);
        setInsureds(response.data || []); // Zajistit, že response.data je pole
        setTotalPages(response.totalPages || 1); // Zajistit, že totalPages má výchozí hodnotu
        setTotalRecords(response.totalRecords || 0); // Nastavení celkového počtu pojištěnců
        setIsLoading(false);
      } catch (error) {
        setError("Chyba načítání dat. ...asi vítr... 🤷🏻‍♂️");
        setInsureds([]); // Výchozí hodnota při chybě
        setIsLoading(false);
      }
    };

    loadInsureds();
  }, [filters, currentPage]);

  const handleRowClick = (insuredID) => {
    // Nastavení vybraného pojištěnce nebo zrušení výběru
    setSelectedInsuredId(selectedInsuredId === insuredID ? null : insuredID);
  };

  const handleEditClick = (insuredID) => {
    // Navigace na stránku pro úpravu pojištěnce
    navigate(`/upravit-pojistence/${insuredID}`);
  };

  const handleFilterChange = (e) => {
    // Aktualizace filtrů na základě vstupních polí
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setCurrentPage(1); // Resetovat na první stránku při změně filtru
  };

  const handleResetFilters = () => {
    // Resetování všech filtrů
    setFilters({
      firstName: "",
      lastName: "",
      street: "",
      city: "",
      postalCode: "",
    });
    setCurrentPage(1); // Resetovat na první stránku při resetování filtrů
  };

  const handlePageChange = (pageNumber) => {
    // Nastavení aktuální stránky
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h6>Je evidováno {totalRecords} pojištěnců</h6>
        <Link to="/pridat-pojistence" className="btn btn-outline-primary">
          Přidat pojištěnce
        </Link>
      </div>

      {/* Vyhledávací pole */}
      <div className="row mb-3 gx-2">
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Jméno"
            name="firstName"
            value={filters.firstName}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Příjmení"
            name="lastName"
            value={filters.lastName}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Ulice"
            name="street"
            value={filters.street}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Město"
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="PSČ"
            name="postalCode"
            value={filters.postalCode}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-outline-secondary me-2" onClick={handleResetFilters}>
          Resetovat filtry
        </button>
      </div>

      {isLoading && <Spinner />}
      {error && <FlashMessage message={error} type="danger" />}
      {!error && !isLoading && (
        <>
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

          {/* Stránkování */}
          <nav>
            <ul className="pagination justify-content-center">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li
                  key={page}
                  className={`page-item ${page === currentPage ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}

export default InsuredList;
