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

// Funkce pro odesílání dat na API pomocí POST
export async function apiPost(endpoint, body) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Chyba při POST na ${endpoint}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Chyba při odesílání dat na ${endpoint}:`, error);
    throw error;
  }
}