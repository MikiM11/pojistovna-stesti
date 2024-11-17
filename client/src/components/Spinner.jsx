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
