// Základní URL pro všechny API požadavky
const API_URL = "http://localhost:3001/api/";

// Funkce pro načítání dat z API pomocí GET
export async function apiGet(endpoint) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`Chyba při GET na ${endpoint}: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Chyba při načítání dat z ${endpoint}:`, error);
    throw error;
  }
}

// Funkce pro odesílání dat na API pomocí POST
export async function apiPost(endpoint, body) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

// Funkce pro odesílání dat na API pomocí PUT
export async function apiPut(endpoint, body) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Chyba při PUT na ${endpoint}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Chyba při odesílání dat na ${endpoint}:`, error);
    throw error;
  }
}

// Funkce pro mazání dat z API pomocí DELETE
export async function apiDelete(endpoint) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Chyba při DELETE na ${endpoint}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Chyba při mazání dat na ${endpoint}:`, error);
    throw error;
  }
}
