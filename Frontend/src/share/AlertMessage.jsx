import React from "react";

function AlertMessage({ msg }) {
  return (
    <div>
      <p className="bg-red-400 text-white font-semibold text-lg text-center">
        Alert : {msg}
      </p>
    </div>
  );
}

export default AlertMessage;
