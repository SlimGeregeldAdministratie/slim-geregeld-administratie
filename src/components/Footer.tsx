import React from 'react';
import { Phone, Mail, MapPin, Clock, Star, Instagram, Linkedin, MessageCircle } from 'lucide-react';

const Footer = () => {
  const handleGoogleReviewsClick = () => {
    window.open('https://www.google.com/maps/place/Slim+Geregeld+Administratie/@52.1615328,2.640828,583026m/data=!3m1!1e3!4m18!1m9!3m8!1s0x6e2416ab86cbb037:0xbe819561033f9841!2sSlim+Geregeld+Administratie!8m2!3d52.1909763!4d5.2795551!9m1!1b1!16s%2Fg%2F11xgj0kk8j!3m7!1s0x6e2416ab86cbb037:0xbe819561033f9841!8m2!3d52.1909763!4d5.2795551!9m1!1b1!16s%2Fg%2F11xgj0kk8j?entry=ttu&g_ep=EgoyMDI1MDYxNy4wIKXMDSoASAFQAw%3D%3D', '_blank');
  };

  const handlePrivacyClick = () => {
    window.location.href = '/privacybeleid';
  };

  const handleTermsClick = () => {
    window.location.href = '/algemene-voorwaarden';
  };

  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/slimgeregeldadministratie?igsh=MXM0bDc3cWc5b3MycA==', '_blank');
  };

  const handleLinkedInClick = () => {
    window.open('https://www.linkedin.com/company/107735661/admin/dashboard/', '_blank');
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/31621311043', '_blank');
  };

  const handlePakkettenClick = () => {
    if (window.location.pathname === '/') {
      const element = document.getElementById('pakketten');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = '/pakketten';
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Slim Geregeld Administratie</h3>
            <p className="text-gray-400 mb-6 leading-relaxed text-sm">
              Moderne boekhoudservice voor ondernemers die hun tijd willen besteden aan ondernemen, niet aan administratie. 
              Persoonlijke service gecombineerd met slimme AI-technologie.
            </p>
            
            {/* Google Reviews Badge - Smaller and clickable */}
            <button 
              onClick={handleGoogleReviewsClick}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity mb-6"
            >
              <div className="flex items-center space-x-1 bg-white rounded-lg px-2 py-1">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-gray-900 font-semibold text-xs">5.0</span>
              </div>
              <span className="text-gray-400 text-xs">Google Reviews</span>
            </button>

            {/* Social Media Icons */}
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Volg ons</h4>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleInstagramClick}
                  className="bg-gray-800 hover:bg-pink-600 p-3 rounded-xl transition-all duration-200 group"
                  aria-label="Volg ons op Instagram"
                >
                  <Instagram className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                </button>
                
                <button
                  onClick={handleLinkedInClick}
                  className="bg-gray-800 hover:bg-blue-600 p-3 rounded-xl transition-all duration-200 group"
                  aria-label="Volg ons op LinkedIn"
                >
                  <Linkedin className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                </button>
                
                <button
                  onClick={handleWhatsAppClick}
                  className="bg-gray-800 hover:bg-green-500 p-3 rounded-xl transition-all duration-200 group"
                  aria-label="Chat met ons via WhatsApp"
                >
                  <MessageCircle className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>
          </div>

          {/* Middle Column - Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Onze Diensten</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">
                <a href="/slim-chatbot">Alleen Slim</a>
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                <button onClick={handlePakkettenClick}>Volledige Service</button>
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                <button onClick={handlePakkettenClick}>Maatwerk</button>
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                <a href="/nettocheck">NettoCheck</a>
              </li>
              <li className="text-green-400 font-medium">✓ Al onze diensten met 30 dagen gratis proefperiode</li>
            </ul>
          </div>

          {/* Right Column - Contact & Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact & Info</h3>
            <div className="space-y-4 text-gray-400">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <a 
                  href="tel:+31621311043" 
                  className="hover:text-white transition-colors"
                >
                  +31621311043
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <a 
                  href="mailto:kyle@slim-geregeld.nl" 
                  className="hover:text-white transition-colors"
                >
                  kyle@slim-geregeld.nl
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 flex-shrink-0" />
                <span>Regio Noord-Holland, Nederland</span>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>Maandag t/m zaterdag van 09:00 t/m 21:00 bereikbaar</span>
              </div>

              <div className="flex items-start space-x-3">
                <svg className="h-5 w-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>24/7 AI-ondersteuning</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Reduced padding */}
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              &copy; 2025 Slim Geregeld Administratie. Alle rechten voorbehouden.
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <button 
                onClick={handlePrivacyClick}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Privacybeleid
              </button>
              <button 
                onClick={handleTermsClick}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Algemene Voorwaarden
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;