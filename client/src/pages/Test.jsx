import React, { useState } from 'react';
import { FlashMessage } from "../components/FlashMessage"; // Import komponenty pro zobrazení chybové hlášky

const Test = () => {
    const [error, setError] = useState(null); // State pro chybovou hlášku
    const [typeMessage, setTypeMessage] = useState(null); // State pro typ chybové hlášky


    const handlerBtnClick = (message, type) => {
        setError(message); // Pokud je message null, error se nastaví na null
        setTypeMessage(message ? type : null); // Nastavení typu pouze pokud message není null
    };

    return (
        <div>
            <FlashMessage message={error} type={typeMessage} />
            <p>Testovací stránka</p>
            <button className="btn btn-danger" onClick={() => handlerBtnClick("Chyba", "danger")}>Chyba</button>
            <button className="btn btn-success" onClick={() => handlerBtnClick("Úspěch", "success")}>Úspěch</button>
            <button className="btn btn-warning" onClick={() => handlerBtnClick("Varování", "warning")}>Varování</button>
            <button className="btn btn-info" onClick={() => handlerBtnClick("Info", "info")}>Info</button>
            <button className="btn btn-primary" onClick={() => handlerBtnClick(null, null)}>Nic</button>
        </div>
    )
}

export default Test;