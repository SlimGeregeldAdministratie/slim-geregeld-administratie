import React from 'react';
import { Award, Users, Clock } from 'lucide-react';

const About = () => {
  return (
    <section id="over-kyle" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Maak kennis met Kyle
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              Als ervaren boekhouder begrijp ik hoe belangrijk een goed geregelde administratie is voor het succes van je bedrijf. 
              Daarom heb ik Slim Geregeld Administratie opgericht - om ondernemers te helpen met moderne, efficiënte oplossingen.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Door AI en automatisering te combineren met persoonlijke service, zorgen we ervoor dat je administratie niet alleen 
              correct wordt bijgehouden, maar dat je ook tijd overhoudt voor waar je echt goed in bent: ondernemen.
            </p>
            
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-2xl w-fit mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">100%</div>
                <div className="text-gray-600">Persoonlijk</div>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-2xl w-fit mx-auto mb-4">
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">24/7</div>
                <div className="text-gray-600">AI-ondersteuning</div>
              </div>
              <div className="text-center">
                <div className="bg-green-100 p-4 rounded-2xl w-fit mx-auto mb-4">
                  <Award className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">5.0★</div>
                <div className="text-gray-600">Google Reviews</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl shadow-lg">
              <img 
                src="/SGA foto 1.jpg" 
                alt="Kyle - Boekhouder en oprichter" 
                className="w-full h-80 object-cover rounded-2xl mb-6"
              />
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Kyle</h3>
                <p className="text-blue-600 font-semibold mb-4">Boekhouder & Oprichter</p>
                <blockquote className="text-gray-700 italic leading-relaxed">
                  "Administratie hoeft niet ingewikkeld te zijn. Met de juiste tools en persoonlijke begeleiding maken we het simpel en overzichtelijk."
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;