import React from "react";

const Popup = ({ message, onClose }) => {
  if (!message) return null; // Hide if no message

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative">
        <h2 className="text-lg font-bold text-red-600">⚠️ Warning</h2>
        <p className="mt-2 text-gray-800">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Popup;
