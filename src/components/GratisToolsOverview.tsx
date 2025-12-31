import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Calculator, ArrowRight } from 'lucide-react';

const GratisToolsOverview = () => {
  const tools = [
    {
      title: 'Slim WhatsApp Chatbot',
      description: 'Onze WhatsApp-geïntegreerde chatbot is jouw persoonlijke assistent voor alle zakelijke administratie. Werk slimmer, overal waar je bent.',
      features: [
        'Facturen en offertes binnen 1 minuut',
        'Vragen over administratie en belasting',
        'Direct contact met een boekhouder',
        '24/7 beschikbaar via WhatsApp'
      ],
      icon: MessageSquare,
      link: '/slim-chatbot',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      badge: 'Tijdelijk Gratis'
    },
    {
      title: 'NettoCheck',
      description: 'Bereken eenvoudig je netto-inkomen als ondernemer. Krijg direct inzicht in wat je maandelijks overhoudt na inkomstenbelasting.',
      features: [
        'Snel en accuraat',
        'Rekening houdend met BTW',
        'Inzicht in netto-inkomen',
        'Gratis te gebruiken'
      ],
      icon: Calculator,
      link: '/nettocheck',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      badge: 'Populair'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Gratis Tools
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Handige tools om je als ondernemer te helpen. Helemaal gratis, geen verplichtingen.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                <div className={`${tool.bgColor} p-8 relative`}>
                  <div className="absolute top-4 right-4">
                    <span className={`inline-block bg-gradient-to-r ${tool.color} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                      {tool.badge}
                    </span>
                  </div>
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${tool.color} shadow-lg mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {tool.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {tool.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {tool.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6">
                  <Link
                    to={tool.link}
                    className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl group-hover:transform group-hover:-translate-y-0.5"
                  >
                    <span>Start direct</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Meer hulp nodig?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto text-lg">
            Onze tools zijn een goed startpunt, maar voor complete ontzorging kun je rekenen op onze professionele administratiediensten.
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
              Neem contact op
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GratisToolsOverview;
