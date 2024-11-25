import React, { useState } from "react";
import { FlashMessage } from "../components/FlashMessage"; // Pro chybové zprávy
import { apiPost } from "../utils/api"; // Pro odesílání dat na API

function AddInsuredForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    postalCode: "",
    email: "",
    phone: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await apiPost("insureds", formData);
      setSuccess("Nový pojištěnec byl úspěšně přidán!");
      setFormData({
        firstName: "",
        lastName: "",
        street: "",
        city: "",
        postalCode: "",
        email: "",
        phone: "",
      });
    } catch (err) {
      setError("Chyba při přidávání pojištěnce. Zkuste to prosím znovu.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Přidat nového pojištěnce</h2>
      {error && <FlashMessage message={error} type="danger" />}
      {success && <FlashMessage message={success} type="success" />}
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
        <div className="d-flex justify-content-start">
          <button type="submit" className="btn btn-success">
            Přidat pojištěnce
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddInsuredForm;