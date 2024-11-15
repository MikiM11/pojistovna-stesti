import React, { useState, useEffect } from 'react';
import { FlashMessage } from './FlashMessage';
import { apiGet } from './utils/api'; // importování funkce pro načítání dat z API

function InsuredList() {
  const [insureds, setInsureds] = useState([]);
  const [error, setError] = useState(null); // State pro chybovou hlášku

  useEffect(() => {
    const loadInsureds = async () => {
      try {
        const data = await apiGet('insureds'); 
        setInsureds(data);
      } catch (error) {
        setError('Nepodařilo se načíst data'); // Uložení chyby do state
      }
    };
  
    loadInsureds();
  }, []);

  return (
    <div>
    {error && ( // Pokud existuje chyba
      <FlashMessage message={error} type="danger" />  // Zobrazení chybové hlášky
    )}
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          <th>Jméno</th>
          <th>Příjmení</th>
          <th>Ulice</th>
          <th>Město</th>
          <th>PSČ</th>
        </tr>
      </thead>
      <tbody>
        {insureds.map(insured => (
          <tr key={insured._id}>
            <td>{insured.firstName}</td>
            <td>{insured.lastName}</td>
            <td>{insured.street}</td>
            <td>{insured.city}</td>
            <td>{insured.postalCode}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

export default InsuredList;