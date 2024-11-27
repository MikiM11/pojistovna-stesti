// Import API utility
import { apiGet, apiPost, apiPut, apiDelete } from "./api"; 

// Načtení seznamu pojištění
export const fetchInsurances = async () => {
  try {
    const data = await apiGet("insurances");
    return data;
  } catch (error) {
    throw new Error("Nepodařilo se načíst seznam pojištění.");
  }
};

// Načtení typů pojištění
export const fetchInsuranceTypes = async () => {
  try {
    const data = await apiGet("insurance-types");
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