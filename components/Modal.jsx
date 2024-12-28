import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md relative transform transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 
                   transition-colors duration-200 group"
          aria-label="Close modal"
        >
          <X className="w-6 h-6 text-gray-500 group-hover:text-gray-700" />
        </button>

        {/* Content */}
        <div className="text-center pt-2">
          {/* Warning Icon */}
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
            <svg 
              className="w-8 h-8 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Error Message */}
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            נמצאה תקלה באחת המערכות
          </h2>
          
          {/* Action Button */}
          <button
            onClick={onClose}
            className="mt-6 w-full bg-red-600 text-white py-3 px-6 rounded-lg 
                     font-semibold hover:bg-red-700 active:bg-red-800
                     transform transition-all duration-200 
                     hover:shadow-lg active:shadow-md
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            סגרו אותי
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;