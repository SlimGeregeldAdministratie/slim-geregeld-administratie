import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

const WhatsAppPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosedByUser, setIsClosedByUser] = useState(false);

  useEffect(() => {
    // Check if user has already closed the popup in this session
    const hasClosedPopup = sessionStorage.getItem('whatsapp-popup-closed');
    if (hasClosedPopup) {
      setIsClosedByUser(true);
      return;
    }

    // Show popup after 30 seconds
    const timer = setTimeout(() => {
      if (!isClosedByUser) {
        setIsVisible(true);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [isClosedByUser]);

  const handleClose = () => {
    setIsVisible(false);
    setIsClosedByUser(true);
    // Remember that user closed the popup for this session
    sessionStorage.setItem('whatsapp-popup-closed', 'true');
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/31621311043', '_blank');
    handleClose(); // Close popup after clicking
  };

  if (!isVisible || isClosedByUser) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 animate-slide-up">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Sluit popup"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>

        {/* Content */}
        <div className="pr-6">
          <div className="flex items-start space-x-3">
            <img 
              src="/Pofielfoto Kyle.jpg" 
              alt="Kyle - Boekhouder" 
              className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-green-200"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 mb-3 leading-relaxed">
                Heb je vragen? App Kyle (boekhouder) direct via WhatsApp!
              </p>
              <button
                onClick={handleWhatsAppClick}
                className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors flex items-center space-x-2 w-full justify-center"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat met Kyle</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add custom animation styles
const styles = `
  @keyframes slide-up {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .animate-slide-up {
    animation: slide-up 0.3s ease-out;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default WhatsAppPopup;