import React from 'react';
import InsuredList from './InsuredList'; // Import komponenty InsuredList

function App() {
  return (
    <div className="container"> {/* Přidání kontejneru */}
      <h1>Seznam pojištěnců</h1>
      <InsuredList />
    </div>
  );
}

export default App;