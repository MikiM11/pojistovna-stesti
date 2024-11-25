import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet, apiPost, apiPut } from "../utils/api";
import FlashMessage from "../components/FlashMessage"; // Import FlashMessage
import { Spinner } from "../components/Spinner"; // Import Spinner

function AddInsuredForm() {
  const { id } = useParams(); // Načtení ID z URL
  const navigate = useNavigate(); // Navigace
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    postalCode: "",
    email: "",
    phone: "",
  });
  const [flashMessage, setFlashMessage] = useState(null); // FlashMessage state
  const [isLoading, setIsLoading] = useState(false); // Stav načítání

  // Načítání dat pro úpravu pojištěnce
  useEffect(() => {
    if (id) {
      setIsLoading(true); // Spustit spinner
      apiGet(`insureds/${id}`)
        .then((data) => {
          setFormData(data); // Načtená data do formuláře
          setIsLoading(false); // Zastavit spinner
        })
        .catch(() => {
          setFlashMessage({
            message: "Nepodařilo se načíst data pojištěnce.",
            type: "danger",
          });
          setIsLoading(false); // Zastavit spinner
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
        await apiPut(`insureds/${id}`, formData); // Aktualizace dat
        setFlashMessage({
          message: "Změny byly úspěšně uloženy.",
          type: "success",
        });
      } else {
        const createdInsured = await apiPost("insureds", formData); // Přidání nového pojištěnce
        setFlashMessage({
          message: "Nový pojištěnec byl úspěšně přidán.",
          type: "success",
        });
        setFormData({ ...formData, id: createdInsured.id }); // Nastavit ID nově vytvořeného pojištěnce
      }
    } catch {
      setFlashMessage({
        message: "Chyba při ukládání dat.",
        type: "danger",
      });
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      street: "",
      city: "",
      postalCode: "",
      email: "",
      phone: "",
    });
    setFlashMessage(null);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">{id ? "Upravit pojištěnce" : "Přidat nového pojištěnce"}</h2>
      {flashMessage && (
        <FlashMessage message={flashMessage.message} type={flashMessage.type} />
      )}
      {isLoading ? (
        <Spinner /> // Zobrazení spinneru během načítání
      ) : (
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
                type="tel"
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
            <button type="submit" className="btn btn-success">
              {id ? "Uložit změny" : "Přidat pojištěnce"}
            </button>
            <button type="button" className="btn btn-warning" onClick={handleReset}>
              Vyčistit formulář
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Zpět</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default AddInsuredForm;