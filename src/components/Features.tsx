import React from 'react';
import { Bot, MessageCircle, CheckCircle, Star } from 'lucide-react';

const Features = () => {
  const features = [
    "Klanten toevoegen en beheren",
    "Facturen of offertes opmaken", 
    "Zakelijke uitgaven en bonnetjes verwerken",
    "Vragen over administratie en belasting",
    "Direct contact met Kyle (je persoonlijke boekhouder)"
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-end">
          {/* Left Column - What Slim can do */}
          <div>
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Star className="h-4 w-4 mr-2" />
              Uniek in Nederland!
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Wat maakt Slim Geregeld uniek?
            </h2>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-2 rounded-lg mt-1">
                  <Bot className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-gray-700 leading-relaxed">
                  <span className="font-semibold">🤖</span> Wij zijn de enige boekhoudservice in Nederland met een 
                  WhatsApp chatbot, genaamd <span className="font-bold text-blue-600">Slim</span>.
                </p>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-2 rounded-lg mt-1">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-gray-700 leading-relaxed">
                  <span className="font-semibold">📲</span> Via WhatsApp kun je 24/7 je administratie regelen - 
                  bonnetjes doorsturen, facturen laten maken, vragen stellen.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Wat kan Slim voor je doen?</h3>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - WhatsApp Screenshot */}
          <div className="lg:pl-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Zo werkt het in de praktijk:</h4>
                <p className="text-gray-600 text-sm">Factuur maken via WhatsApp</p>
              </div>
              <div className="overflow-hidden rounded-xl shadow-md">
                <img 
                  src="/SGA Foto 4 (1).jpg" 
                  alt="WhatsApp chat met Slim - factuur maken" 
                  className="w-full h-[28rem] object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;