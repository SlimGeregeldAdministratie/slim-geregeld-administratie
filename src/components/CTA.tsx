import React from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CTA = () => {
  const navigate = useNavigate();

  const handleGratisToolsClick = () => {
    navigate('/gratis-tools');
  };

  const handlePlanKennismakingClick = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Klaar voor rust in je administratie?
        </h2>
        <p className="text-xl text-blue-100 mb-12 leading-relaxed">
          Laat de administratieve stress achter je en focus op wat je het beste kunt: ondernemen. 
          Wij regelen de rest, zodat jij kunt groeien.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGratisToolsClick}
            className="bg-green-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 justify-center"
          >
            <Star className="h-6 w-6" />
            <span>Gratis Tools</span>
          </button>
          <button 
            onClick={handlePlanKennismakingClick}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 justify-center"
          >
            <span>Plan een kennismaking</span>
            <ArrowRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;