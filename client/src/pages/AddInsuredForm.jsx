// Stránka s formulářem pro přidání nebo úpravu pojištěnce včetně jeho pojištění

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/api"; // Funkce pro práci s API
import FlashMessage from "../components/FlashMessage"; // Komponenta pro zobrazení flash zpráv
import { Spinner } from "../components/Spinner"; // Komponenta spinneru
import AddInsuranceForm from "../components/AddInsuranceForm"; // Komponenta pro přidání pojištění

function AddInsuredForm() {
  const { id } = useParams(); // Získání ID pojištěnce z URL parametrů
  const navigate = useNavigate(); // Navigace zpět po úspěšné akci
  const [formData, setFormData] = useState({ // Stav formuláře pro údaje pojištěnce
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    postalCode: "",
    email: "",
    phone: "",
    insurances: [], // Počáteční stav pro údaje pojištěnce včetně seznamu pojištění
  });
  const [flashMessage, setFlashMessage] = useState(null); // Pro zobrazení zpráv uživateli
  const [isLoading, setIsLoading] = useState(false); // Indikátor načítání dat
  const [showAddInsuranceForm, setShowAddInsuranceForm] = useState(false); // Řízení viditelnosti formuláře pro přidání pojištění

  // Načítání dat pojištěnce (pouze při úpravě existujícího pojištěnce)
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      apiGet(`insureds/${id}`)
        .then((data) => {
          setFormData(data); // Nastavení dat pojištěnce
          setIsLoading(false);
        })
        .catch(() => {
          setFlashMessage({
            message: "Nepodařilo se načíst data pojištěnce.",
            type: "danger",
          });
          setIsLoading(false);
        });
    }
  }, [id]);

  // Zpracování změn v polích formuláře
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Odeslání formuláře (uložení nového nebo aktualizace existujícího pojištěnce)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        // Aktualizace existujícího pojištěnce
        await apiPut(`insureds/${id}`, formData);
        setFlashMessage({
          message: "Změny byly úspěšně uloženy.",
          type: "success",
        });
      } else {
        // Vytvoření nového pojištěnce
        const createdInsured = await apiPost("insureds", formData);
  
        // Přesměrování na stránku úprav nového pojištěnce
        navigate(`/upravit-pojistence/${createdInsured._id}`);
        setFlashMessage({
          message: "Nový pojištěnec byl úspěšně přidán.",
          type: "success",
        });
      }
    } catch (error) {
      setFlashMessage({
        message: error.response?.data?.message || "Chyba při ukládání dat.",
        type: "danger",
      });
    }
  };

  // Mazání konkrétního pojištění přiřazeného pojištěnci
  const handleDeleteInsurance = async (insuranceId) => {
    if (window.confirm("Opravdu chcete toto pojištění odstranit?")) {
      try {
        // Krok 1: Odebrání ID pojištění z pole `insurances` pojištěnce
        const updatedInsured = {
          ...formData,
          insurances: formData.insurances.filter((id) => id !== insuranceId),
        };
        await apiPut(`insureds/${formData._id}`, updatedInsured); // Aktualizace dat pojištěnce

        // Krok 2: Smazání samotného pojištění
        await apiDelete(`insurances/${insuranceId}`);

        // Načtení aktualizovaných dat pojištěnce
        const updatedData = await apiGet(`insureds/${formData._id}`);
        setFormData(updatedData);

        setFlashMessage({
          message: "Pojištění bylo úspěšně odstraněno.",
          type: "success",
        });
      } catch (error) {
        setFlashMessage({
          message: "Chyba při odstraňování pojištění.",
          type: "danger",
        });
      }
    }
  };

  // Mazání pojištěnce (povoleno pouze, pokud nemá žádné pojištění)
  const handleDeleteInsured = async () => {
    if (formData.insurances.length > 0) {
      setFlashMessage({
        message: "Pojištěnec nemůže být smazán, protože má přiřazená pojištění.",
        type: "danger",
      });
      return;
    }

    if (window.confirm("Opravdu chcete tohoto pojištěnce smazat?")) {
      try {
        await apiDelete(`insureds/${id}`); // Smazání pojištěnce
        setFlashMessage({
          message: "Pojištěnec byl úspěšně smazán.",
          type: "success",
        });
        navigate(-1); // Návrat na předchozí stránku
      } catch (error) {
        setFlashMessage({
          message: "Chyba při mazání pojištěnce.",
          type: "danger",
        });
      }
    }
  };
  //vykreslování komponenty
  return (
    <div className="container mt-4">
      <h6 className="mb-3">
        {id ? "Upravte údaje pojištěnce, spravujte jeho pojištění" : "Přidejte nového pojištěnce"}
      </h6>
      {flashMessage && (
        <FlashMessage message={flashMessage.message} type={flashMessage.type} /> // Zobrazení flash zprávy
      )}
      {isLoading ? ( // Zobrazení spinneru během načítání dat
        <Spinner />
      ) : (
        <>
          {/* Formulář pro úpravu pojištěnce */}
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="firstName" className="form-label">
                  Jméno
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="lastName" className="form-label">
                  Příjmení
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="street" className="form-label">
                  Ulice
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="city" className="form-label">
                  Město
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="postalCode" className="form-label">
                  PSČ
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="phone" className="form-label">
                  Telefon
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="d-flex gap-3">
              <button type="submit" className="btn btn-outline-success">
                {id ? "Uložit změny" : "Přidat pojištěnce"}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate(-1)}
              >
                Zpět
              </button>
              {id && (
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={handleDeleteInsured}
                >
                  Smazat pojištěnce
                </button>
              )}
            </div>
          </form>

          {/* Tabulka pro zobrazení pojištění */}
          <h3 className="mt-4">Uzavřená pojištění</h3>
          {formData.insurances.length > 0 ? (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Typ pojištění</th>
                  <th>Pojistná částka</th>
                  <th>Předmět pojištění</th>
                  <th>Platnost od</th>
                  <th>Platnost do</th>
                </tr>
              </thead>
              <tbody>
                {formData.insurances.map((insurance) => (
                  <tr key={insurance._id}>
                    <td>{insurance.type?.name || "N/A"}</td>
                    <td>{insurance.amount} Kč</td>
                    <td>{insurance.subject}</td>
                    <td>{new Date(insurance.validFrom).toLocaleDateString()}</td>
                    <td>{new Date(insurance.validTo).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteInsurance(insurance._id)}
                      >
                        Odstranit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Žádné sjednané pojištění</p>
          )}

          {/* Tlačítko pro přidání pojištění */}
          {id && !showAddInsuranceForm && (
            <button
              className="btn btn-outline-primary mt-4"
              onClick={() => setShowAddInsuranceForm(true)}
            >
              Pojistit
            </button>
          )}

          {/* Formulář pro přidání pojištění */}
          {id && showAddInsuranceForm && (
            <AddInsuranceForm
              insuredId={id}
              onInsuranceAdded={() => {
                setShowAddInsuranceForm(false); // Skryj formulář po přidání
                apiGet(`insureds/${id}`).then((updatedData) => {
                  setFormData(updatedData); // Aktualizuj všechna data včetně pojištění
                });
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

export default AddInsuredForm;
