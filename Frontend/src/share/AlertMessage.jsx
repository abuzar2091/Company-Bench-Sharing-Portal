import React from "react";

function AlertMessage({ msg }) {
  return (
    <div>
      <p className="bg-red-400 text-white font-semibold text-3xl">
        AlertMessage : {msg}
      </p>
    </div>
  );
}

export default AlertMessage;
