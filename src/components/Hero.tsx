import React from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleGratisToolsClick = () => {
    navigate('/gratis-tools');
  };

  const handleStartFreeClick = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-16 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="lg:pr-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Nooit meer wakker liggen van je{' '}
              <span className="text-blue-600">boekhouding</span>
            </h1>
            
            <div className="text-xl md:text-2xl font-normal text-gray-600 mb-6 leading-relaxed">
              – vanaf nu is administratie <span className="text-blue-600 font-bold">Slim Geregeld.</span>
            </div>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Slim Geregeld Administratie combineert persoonlijke aandacht met slimme AI, 
              zodat jij kunt focussen op ondernemen.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleStartFreeClick}
                className="bg-blue-600 text-white px-7 py-3.5 rounded-xl text-base font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Start 30 dagen gratis</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={handleGratisToolsClick}
                className="bg-white text-blue-600 border-2 border-blue-600 px-7 py-3.5 rounded-xl text-base font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <Star className="h-4 w-4" />
                <span>Gratis Tools</span>
              </button>
            </div>
          </div>

          {/* Right Column - Kyle's Photo */}
          <div className="lg:pl-2">
            <div className="relative">
              {/* Video Introduction Text */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Ontdek hoe we je administratie simpel maken
                </h3>
              </div>
              
              {/* Vimeo Video - Kyle's explanation */}
              <div className="bg-white rounded-2xl shadow-xl p-2 relative overflow-hidden">
                <div className="relative rounded-xl overflow-hidden" style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
                  <iframe
  src="https://player.vimeo.com/video/1119860614?api=1&player_id=vimeo_hero&badge=0&autopause=0&app_id=58479"
  id="vimeo_hero"
  title="Boekhouden met persoonlijke aandacht en slimme AI | Slim Geregeld Administratie"
  frameBorder="0"
  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
  referrerPolicy="strict-origin-when-cross-origin"
  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
  className="rounded-xl"
  allowFullScreen
/>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;