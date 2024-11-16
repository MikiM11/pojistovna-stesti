//funkce pro načítání dat z API

const API_URL = 'http://localhost:3001/api/';

export async function apiGet(endpoint) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Chyba při načítání dat z ${endpoint}:`, error);
      throw error; 
    }
  };

  // TODO možná doplnit parametry pro URL