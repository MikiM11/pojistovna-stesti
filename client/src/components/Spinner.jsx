//komponenta pro zobrazení načítání - spinneru (když se načítají data) - podle bootstrapu

import React from "react";

const Spinner = () => {
    return (
        <div className="d-flex justify-content-center">
            <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Načítání...</span>
            </div>
        </div>
    );
};

export { Spinner };
