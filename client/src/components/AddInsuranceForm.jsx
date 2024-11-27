import React, { useState, useEffect } from "react";
import { apiPost, apiGet } from "../utils/api";
import FlashMessage from "../components/FlashMessage";

function AddInsuranceForm({ insuredId, onInsuranceAdded }) {
  const [formData, setFormData] = useState({
    type: "",
    amount: "",
    subject: "",
    validFrom: "",
    validTo: "",
  });
  const [insuranceTypes, setInsuranceTypes] = useState([]); // Stav pro typy pojištění
  const [isLoading, setIsLoading] = useState(true); // Stav pro spinner
  const [error, setError] = useState(null); // Stav pro chyby
  const [flashMessage, setFlashMessage] = useState(null);

  useEffect(() => {
    // Načtení typů pojištění z API
    const loadInsuranceTypes = async () => {
      try {
        const data = await apiGet("insuranceTypes"); // Volání API
        setInsuranceTypes(data);
        setIsLoading(false);
      } catch (error) {
        setError("Nepodařilo se načíst typy pojištění.");
        setIsLoading(false);
      }
    };
    loadInsuranceTypes();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newInsurance = { ...formData, insured: insuredId };
      await apiPost("insurances", newInsurance); // Volání API pro přidání pojištění
      setFlashMessage({
        message: "Pojištění bylo úspěšně přidáno.",
        type: "success",
      });
      setFormData({ type: "", amount: "", subject: "", validFrom: "", validTo: "" }); // Reset formuláře
      onInsuranceAdded(); // Aktualizace seznamu pojištění v nadřazené komponentě
    } catch (error) {
      setFlashMessage({
        message: "Nepodařilo se přidat pojištění.",
        type: "danger",
      });
    }
  };

  return (
    <div className="mt-4">
      <h4>Přidat pojištění</h4>
      {flashMessage && (
        <FlashMessage message={flashMessage.message} type={flashMessage.type} />
      )}
      {isLoading && <p>Načítám typy pojištění...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!isLoading && !error && (
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="type" className="form-label">
                Typ pojištění
              </label>
              <select
                className="form-select"
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Vyberte typ pojištění
                </option>
                {insuranceTypes.map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="amount" className="form-label">
                Pojistná částka
              </label>
              <input
                type="number"
                className="form-control"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="subject" className="form-label">
                Předmět pojištění
              </label>
              <input
                type="text"
                className="form-control"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="validFrom" className="form-label">
                Platnost od
              </label>
              <input
                type="date"
                className="form-control"
                id="validFrom"
                name="validFrom"
                value={formData.validFrom}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="validTo" className="form-label">
                Platnost do
              </label>
              <input
                type="date"
                className="form-control"
                id="validTo"
                name="validTo"
                value={formData.validTo}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-outline-primary">
            Přidat pojištění
          </button>
        </form>
      )}
    </div>
  );
}

export default AddInsuranceForm;