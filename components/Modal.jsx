import React from 'react';

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-sm md:max-w-md lg:max-w-lg">
        <h2 className="text-lg font-semibold">חלונית זו היא חלונית הפרעה</h2>
        <p className="mt-4">סגור אותה הכי מהר שאפשר</p>
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 w-full sm:w-auto"
        >
          סגרו אותי
        </button>
      </div>
    </div>
  );
};

export default Modal;
