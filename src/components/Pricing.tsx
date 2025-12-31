import React from 'react';
import { Check, ArrowRight, Bot, Star, Users } from 'lucide-react';

const Pricing = () => {
  const handlePackageClick = (packageType: string) => {
    // Scroll to contact form and set the package
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.scrollIntoView({ behavior: 'smooth' });
      
      // Set the package in the URL parameter temporarily
      const url = new URL(window.location.href);
      url.searchParams.set('package', packageType);
      window.history.pushState({}, '', url.toString());
      
      // Trigger a custom event to notify the contact form
      window.dispatchEvent(new CustomEvent('packageSelected', { detail: packageType }));
    }
  };

  const packages = [
    {
      name: "Alleen Slim",
      description: "Perfect voor ondernemers die zelf hun administratie doen",
      price: "€75",
      period: "/maand",
      trialText: "30 dagen gratis",
      icon: Bot,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      packageType: "alleen-slim",
      features: [
        "Toegang tot Slim WhatsApp-chatbot",
        "Facturen en offertes opmaken",
        "24/7 vragen beantwoorden",
        "Klanten beheer"
      ],
      buttonText: "Start gratis proef",
      buttonStyle: "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50",
      cardStyle: "bg-white border border-gray-200 hover:shadow-lg"
    },
    {
      name: "Volledige Service",
      description: "Voor ZZP'ers, zelfstandigen en andere eenmanszaken",
      originalPrice: "€125",
      price: "€95",
      period: "/maand",
      trialText: "30 dagen gratis",
      popular: true,
      icon: Star,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      packageType: "volledige-service",
      features: [
        "Toegang tot Slim WhatsApp-chatbot",
        "Facturen en offertes opmaken",
        "24/7 vragen beantwoorden",
        "Klanten beheer",
        "BTW-aangifte",
        "Jaarrekening",
        "Persoonlijk contact met Kyle"
      ],
      buttonText: "Start gratis proef",
      buttonStyle: "bg-blue-600 hover:bg-blue-700 text-white",
      cardStyle: "bg-white border-2 border-slate-600 hover:shadow-xl"
    },
    {
      name: "Maatwerk",
      description: "Voor BV's, VOF's en andere bedrijfsvormen",
      price: "Op maat",
      period: "",
      subPrice: "Prijs op aanvraag",
      trialText: "30 dagen gratis",
      icon: Users,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
      packageType: "maatwerk",
      features: [
        "Persoonlijk intakegesprek",
        "Aangepaste service",
        "Complexe administraties",
        "Meerdere entiteiten",
        "Strategisch advies"
      ],
      buttonText: "Vraag gratis advies",
      buttonStyle: "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50",
      cardStyle: "bg-white border border-gray-200 hover:shadow-lg"
    }
  ];

  return (
    <section id="pakketten" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Kies het pakket dat bij je past
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Van alleen onze AI-chatbot tot volledige administratieve ondersteuning - we hebben voor elke ondernemer de juiste oplossing. Nu de Volledige Service zelfs met{' '}
            <span className="relative inline-block">
              introductiekorting van €125 p/m naar €95 p/m.
              <svg 
                className="absolute -bottom-1 left-0 w-full h-2" 
                viewBox="0 0 100 6" 
                preserveAspectRatio="none"
              >
                <path 
                  d="M2,3 L98,3" 
                  stroke="#ef4444" 
                  strokeWidth="2" 
                  fill="none"
                  strokeLinecap="round"
                />
                <path 
                  d="M2,4 L98,4" 
                  stroke="#ef4444" 
                  strokeWidth="1" 
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.5"
                />
              </svg>
            </span>
          </p>
          
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-6 py-3 rounded-full text-lg font-semibold">
            Alle pakketten komen met een 30 dagen gratis proefperiode - geheel vrijblijvend!
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start relative">
          {packages.map((pkg, index) => (
            <div key={index} className={`rounded-2xl p-8 transition-all duration-200 relative ${pkg.cardStyle} ${pkg.popular ? 'transform scale-105' : ''}`}>
              {/* Popular badge - now blue */}
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Meest Populair
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className="text-center mb-6">
                <div className={`w-16 h-16 ${pkg.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <pkg.icon className={`h-8 w-8 ${pkg.iconColor}`} />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {pkg.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {pkg.description}
                </p>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="mb-2">
                  {/* Show crossed out original price with red line but gray text */}
                  {pkg.originalPrice && (
                    <div className="text-lg text-gray-500 mb-1 font-medium relative inline-block">
                      {pkg.originalPrice}{pkg.period}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-0.5 bg-red-500"></div>
                      </div>
                    </div>
                  )}
                  <div>
                    <span className="text-4xl font-bold text-gray-900">
                      {pkg.price}
                    </span>
                    {pkg.period && (
                      <span className="text-gray-600 text-lg">
                        {pkg.period}
                      </span>
                    )}
                  </div>
                </div>
                {pkg.subPrice && (
                  <div className="text-sm text-gray-500 mb-2">
                    {pkg.subPrice}
                  </div>
                )}
                <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block">
                  {pkg.trialText}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <button 
                onClick={() => handlePackageClick(pkg.packageType)}
                className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 ${pkg.buttonStyle} flex items-center justify-center space-x-2`}
              >
                <span>{pkg.buttonText}</span>
                {pkg.buttonText.includes('Start') && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;