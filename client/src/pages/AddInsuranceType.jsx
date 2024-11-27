import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/api";
import FlashMessage from "../components/FlashMessage";
import { Spinner } from "../components/Spinner";

function AddInsuranceType() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
  });
  const [flashMessage, setFlashMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (id) {
        await apiPut(`insuranceTypes/${id}`, formData);
        setFlashMessage({
          message: "Změny byly úspěšně uloženy.",
          type: "success",
        });
      } else {
        await apiPost("insuranceTypes", formData);
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
      // Logujeme celou strukturu chyby
      console.error("Chyba při mazání typu pojištění:", error);

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

  const handleBack = () => {
    navigate("/typ-pojisteni");
  };

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