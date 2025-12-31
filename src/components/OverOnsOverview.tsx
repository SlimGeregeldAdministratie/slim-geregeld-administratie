import React from 'react';
import { Link } from 'react-router-dom';
import { User, FileText, MessageCircle, ArrowRight } from 'lucide-react';

const OverOnsOverview = () => {
  const sections = [
    {
      title: 'Over Kyle',
      description: 'Maak kennis met de oprichter van Slim Geregeld Administratie. Kyle is een boekhouder die ondernemers helpt met moderne, efficiënte oplossingen.',
      icon: User,
      link: '/over-kyle',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      image: '/SGA foto 1.jpg',
      imagePosition: 'object-center'
    },
    {
      title: 'Nieuws',
      description: 'Connect op LinkedIn en blijf op de hoogte van de laatste ontwikkelingen, tips en updates van Slim Geregeld Administratie.',
      icon: FileText,
      link: '/nieuws',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      image: '/IMG_4394.JPG',
      imagePosition: 'object-[50%_30%]'
    },
    {
      title: 'Contact',
      description: 'Heb je vragen of wil je kennismaken? Neem gerust contact met ons op. We zijn benieuwd naar jouw verhaal en helpen je graag verder.',
      icon: MessageCircle,
      link: '/contact',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      image: '/SGA Foto 2.jpg',
      imagePosition: 'object-[50%_30%]'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Over Ons
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Leer ons beter kennen en ontdek hoe we jou kunnen helpen met je administratie.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={section.image}
                    alt={section.title}
                    className={`w-full h-full object-cover ${section.imagePosition} group-hover:scale-110 transition-transform duration-500`}
                  />
                  <div className={`absolute top-4 left-4 inline-flex p-3 rounded-xl bg-gradient-to-br ${section.color} shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className={`${section.bgColor} p-6`}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {section.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {section.description}
                  </p>
                </div>
                <div className="p-6 pt-0">
                  <Link
                    to={section.link}
                    className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl group-hover:transform group-hover:-translate-y-0.5"
                  >
                    <span>Meer lezen</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Klaar om te starten?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto text-lg">
            Ontdek hoe we jou kunnen helpen met moderne en efficiënte administratieve oplossingen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/pakketten"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Bekijk onze pakketten
            </Link>
            <Link
              to="/contact"
              className="inline-block bg-blue-800 text-white px-8 py-4 rounded-xl hover:bg-blue-900 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Plan een gesprek
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverOnsOverview;
