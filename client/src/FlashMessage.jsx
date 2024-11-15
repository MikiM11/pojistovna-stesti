import React from "react";

export function FlashMessage({ message, type }) {
  return (
    <div className={`alert alert-${type}`} role="alert">
      {message}
    </div>
  );
}