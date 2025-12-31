import React from 'react';
import { Clock, Shield, Users } from 'lucide-react';

const Problems = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Waarom kiezen ondernemers voor Slim Geregeld Administratie?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We begrijpen de uitdagingen van ondernemers. Daarom hebben we onze service 
            afgestemd op jouw behoeften als zelfstandige ondernemer/ZZP'er.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow">
            <div className="bg-blue-600 p-4 rounded-2xl w-fit mx-auto mb-6">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Meer tijd voor je bedrijf</h3>
            <p className="text-gray-700 leading-relaxed">
              Bespaar gemiddeld <span className="font-bold">8 uur per maand</span>. Facturen opmaken via WhatsApp, 
              bonnetjes inscannen via je telefoon. Zo heb je je avonden weer vrij!
            </p>
          </div>

          <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-shadow">
            <div className="bg-green-600 p-4 rounded-2xl w-fit mx-auto mb-6">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Geen stress, altijd op orde</h3>
            <p className="text-gray-700 leading-relaxed">
              Jouw <span className="font-bold">vaste boekhouder</span> bewaakt alle deadlines. 
              Geen stress meer over vergeten aangiftes of rommelige administratie.
            </p>
          </div>

          <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-shadow">
            <div className="bg-purple-600 p-4 rounded-2xl w-fit mx-auto mb-6">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Eerlijk tarief, persoonlijk contact</h3>
            <p className="text-gray-700 leading-relaxed">
              <span className="font-bold">Één vast maandbedrag</span>, geen verrassingen. 
              Onbeperkt advies – bel, mail of app wanneer je wilt.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problems;