// components/Modal.jsx
import React from 'react';

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-lg font-semibold">חלונית זו היא חלונית הפרעה</h2>
        <p className="mt-4">סגור אותה הכי מהר שאפשר</p>
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          סגרו אותי
        </button>
      </div>
    </div>
  );
};

export default Modal;
