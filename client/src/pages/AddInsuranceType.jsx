import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Přidání useParams pro čtení ID z URL
import { apiGet, apiPost, apiPut } from "../utils/api";
import FlashMessage from "../components/FlashMessage";
import { Spinner } from "../components/Spinner";

function AddInsuranceType() {
  const { id } = useParams(); // Načtení ID z URL
  const [formData, setFormData] = useState({
    name: "",
  });
  const [flashMessage, setFlashMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Stav pro spinner
  const navigate = useNavigate();

  // Načtení dat existujícího typu pojištění
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      apiGet(`insuranceTypes/${id}`)
        .then((data) => {
          setFormData(data); // Načtení dat do formuláře
          setIsLoading(false);
        })
        .catch(() => {
          setFlashMessage({
            message: "Nepodařilo se načíst data typu pojištění.",
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
    setIsLoading(true); // Zobrazení spinneru během odesílání
    try {
      if (id) {
        // Aktualizace existujícího typu pojištění
        await apiPut(`insuranceTypes/${id}`, formData);
        setFlashMessage({
          message: "Změny byly úspěšně uloženy.",
          type: "success",
        });
      } else {
        // Přidání nového typu pojištění
        await apiPost("insuranceTypes", formData);
        setFlashMessage({
          message: "Nový typ pojištění byl úspěšně přidán.",
          type: "success",
        });
        setFormData({ name: "" }); // Reset formuláře po úspěchu
      }
    } catch {
      setFlashMessage({
        message: "Chyba při ukládání dat.",
        type: "danger",
      });
    } finally {
      setIsLoading(false); // Skrytí spinneru po dokončení požadavku
    }
  };

  const handleBack = () => {
    navigate("/typ-pojisteni"); // Přesměrování zpět na seznam typů pojištění
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">{id ? "Upravit typ pojištění" : "Přidat nový typ pojištění"}</h2>
      {flashMessage && (
        <FlashMessage message={flashMessage.message} type={flashMessage.type} />
      )}
      {isLoading ? (
        <Spinner /> // Zobrazení spinneru při načítání
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Název pojištění
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="d-flex gap-3">
            <button type="submit" className="btn btn-success">
              {id ? "Uložit změny" : "Přidat pojištění"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleBack}>
              Zpět
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default AddInsuranceType;