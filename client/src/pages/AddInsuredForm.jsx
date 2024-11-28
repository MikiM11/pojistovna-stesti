import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/api";
import FlashMessage from "../components/FlashMessage";
import { Spinner } from "../components/Spinner";
import AddInsuranceForm from "../components/AddInsuranceForm";

function AddInsuredForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    postalCode: "",
    email: "",
    phone: "",
    insurances: [], // Přidáme pojištění do stavu
  });
  const [flashMessage, setFlashMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddInsuranceForm, setShowAddInsuranceForm] = useState(false);

  // Načítání dat pojištěnce včetně pojištění
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      apiGet(`insureds/${id}`)
        .then((data) => {
          console.log("Načtený pojištěnec:", data); // Debug
          setFormData(data); // Uložíme data pojištěnce včetně jeho pojištění
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await apiPut(`insureds/${id}`, formData);
        setFlashMessage({
          message: "Změny byly úspěšně uloženy.",
          type: "success",
        });
      } else {
        const createdInsured = await apiPost("insureds", formData);
        setFlashMessage({
          message: "Nový pojištěnec byl úspěšně přidán.",
          type: "success",
        });
        setFormData({ ...formData, id: createdInsured.id });
      }
    } catch {
      setFlashMessage({
        message: "Chyba při ukládání dat.",
        type: "danger",
      });
    }
  };

  const handleDeleteInsurance = async (insuranceId) => {
    if (window.confirm("Opravdu chcete toto pojištění odstranit?")) {
      try {
        // Krok 1: Odebrání ID pojištění z pojištěnce
        const updatedInsured = {
          ...formData,
          insurances: formData.insurances.filter((id) => id !== insuranceId),
        };
        await apiPut(`insureds/${formData._id}`, updatedInsured);
  
        // Krok 2: Smazání samotného pojištění
        await apiDelete(`insurances/${insuranceId}`);
  
        // Aktualizace dat ve formuláři
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

  //vykreslování komponenty
  return (
    <div className="container mt-4">
      <h6 className="mb-3">
        {id ? "Upravte údaje pojištěnce, spravujte jeho pojištění" : "Přidejte nového pojištěnce"}
      </h6>
      {flashMessage && (
        <FlashMessage message={flashMessage.message} type={flashMessage.type} />
      )}
      {isLoading ? (
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
            </div>
          </form>

          {/* Tabulka pro zobrazení pojištění */}
          {console.log("handleReset typ:", typeof handleReset)}
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
