//Stránka pro přidání nebo úpravu typu pojištění

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/api"; // Funkce pro práci s API
import FlashMessage from "../components/FlashMessage"; // Komponenta pro zobrazení flash zprávy
import { Spinner } from "../components/Spinner"; // Komponenta spinneru


function AddInsuranceType() {
  const { id } = useParams();  // Parametr z URL, který určuje ID existujícího typu pojištění
  const [formData, setFormData] = useState({ // Stav pro data formuláře
    name: "",
  });
  const [flashMessage, setFlashMessage] = useState(null); // Stav pro flash zprávu
  const [isLoading, setIsLoading] = useState(false); // Stav pro zobrazení spinneru
  const navigate = useNavigate(); // Funkce pro přesměrování uživatele

  // Načtení dat existujícího typu pojištění
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      apiGet(`insuranceTypes/${id}`)
        .then((data) => {
          setFormData(data);
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

  // Funkce pro změnu stavu formuláře při změně hodnoty v poli
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Funkce pro odeslání formuláře
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (id) {
        await apiPut(`insuranceTypes/${id}`, formData); // PUT požadavek na API pro úpravu existujícího typu pojištění
        setFlashMessage({
          message: "Změny byly úspěšně uloženy.",
          type: "success",
        });
      } else {
        await apiPost("insuranceTypes", formData); // POST požadavek na API pro přidání nového typu pojištění
        setFlashMessage({
          message: "Nový typ pojištění byl úspěšně přidán.",
          type: "success",
        });
        setFormData({ name: "" });
      }
    } catch {
      setFlashMessage({
        message: "Chyba při ukládání dat.",
        type: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Funkce pro smazání typu pojištění
  const handleDelete = async () => {
    if (!id) return;
    const confirmDelete = window.confirm("Opravdu chcete smazat tento typ pojištění?");
    if (!confirmDelete) return;

    setIsLoading(true);
    try {
      await apiDelete(`insuranceTypes/${id}`);
      setFlashMessage({
        message: "Typ pojištění byl úspěšně smazán.",
        type: "success",
      });
      navigate("/typ-pojisteni");
    } catch (error) {
      // Zpracování chybové zprávy z backendu
      const errorMessage = error.message || "Chyba při mazání typu pojištění.";
      setFlashMessage({
        message: errorMessage,
        type: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Funkce pro přesměrování zpět na seznam typů pojištění
  const handleBack = () => {
    navigate("/typ-pojisteni");
  };

  // Vykreslení stránky
  return (
    <div className="container mt-4">
      <h2 className="mb-3">{id ? "Upravit typ pojištění" : "Přidat nový typ pojištění"}</h2>
      {flashMessage && (
        <FlashMessage message={flashMessage.message} type={flashMessage.type} />
      )}
      {isLoading ? (
        <Spinner />
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
            <button type="submit" className="btn btn-outline-success">
              {id ? "Uložit změny" : "Přidat pojištění"}
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={handleBack}>
              Zpět
            </button>
            {id && (
              <button type="button" className="btn btn-outline-danger" onClick={handleDelete}>
                Smazat
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

export default AddInsuranceType;