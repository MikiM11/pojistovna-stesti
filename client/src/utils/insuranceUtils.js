// Soubor obsahuje funkce pro pro filtrování a práci s pojištěním (načtení, přidání, úprava, odstranění)
import { apiGet, apiPost, apiPut, apiDelete } from "./api";  // Import funkcí pro práci s API

// Načtení seznamu pojištění s podporou filtrování a stránkování
export const fetchInsurances = async ({ type, insuredName, page = 1, limit = 10 } = {}) => {
  try {
    // Sestavení dotazovacího řetězce
    const params = new URLSearchParams();
    if (type) params.append("type", type); //Přidání typu pojištění do dotazovacího řetězce
    if (insuredName) params.append("insuredName", insuredName); //Přidání jména pojištěného do dotazovacího řetězce
    params.append("page", page); //Přidání čísla stránky do dotazovacího řetězce
    params.append("limit", limit); //Přidání limitu záznamů na stránku do dotazovacího řetězce

    const data = await apiGet(`insurances?${params.toString()}`); //Získání dat z API
    return data;
  } catch (error) {
    throw new Error("Nepodařilo se načíst seznam pojištění.");
  }
};

// Načtení typů pojištění
export const fetchInsuranceTypes = async () => {
  try {
    const data = await apiGet("insuranceTypes");
    return data;
  } catch (error) {
    throw new Error("Nepodařilo se načíst typy pojištění.");
  }
};

// Přidání nového pojištění
export const addInsurance = async (insuranceData) => {
  try {
    const response = await apiPost("insurances", insuranceData);
    return response;
  } catch (error) {
    throw new Error("Nepodařilo se přidat pojištění.");
  }
};

// Aktualizace existujícího pojištění
export const updateInsurance = async (insuranceId, updatedData) => {
  try {
    const response = await apiPut(`insurances/${insuranceId}`, updatedData);
    return response;
  } catch (error) {
    throw new Error("Nepodařilo se aktualizovat pojištění.");
  }
};

// Odstranění pojištění
export const deleteInsurance = async (insuranceId) => {
  try {
    const response = await apiDelete(`insurances/${insuranceId}`);
    return response;
  } catch (error) {
    throw new Error("Nepodařilo se odstranit pojištění.");
  }
};