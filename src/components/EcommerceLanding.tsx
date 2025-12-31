import React, { useState } from 'react';
import { MessageCircle, ArrowRight, CheckCircle, Star, Bot, Users, Clock, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EcommerceLanding = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/31621311043', '_blank');
  };

  const handlePlanKennismakingClick = () => {
    navigate('/', { replace: true });
    setTimeout(() => {
      document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handlePackageClick = (packageType: string) => {
    navigate('/', { replace: true });
    setTimeout(() => {
      const contactForm = document.getElementById('contact-form');
      if (contactForm) {
        contactForm.scrollIntoView({ behavior: 'smooth' });
        
        const url = new URL(window.location.href);
        url.searchParams.set('package', packageType);
        window.history.pushState({}, '', url.toString());
        
        window.dispatchEvent(new CustomEvent('packageSelected', { detail: packageType }));
      }
    }, 100);
  };

  const handleGoogleReviewsClick = () => {
    window.open('https://www.google.com/maps/place/Slim+Geregeld+Administratie/@52.1615328,2.640828,583026m/data=!3m1!1e3!4m18!1m9!3m8!1s0x6e2416ab86cbb037:0xbe819561033f9841!2sSlim+Geregeld+Administratie!8m2!3d52.1909763!4d5.2795551!9m1!1b1!16s%2Fg%2F11xgj0kk8j!3m7!1s0x6e2416ab86cbb037:0xbe819561033f9841!8m2!3d52.1909763!4d5.2795551!9m1!1b1!16s%2Fg%2F11xgj0kk8j?entry=ttu&g_ep=EgoyMDI1MDYxNy4wIKXMDSoASAFQAw%3D%3D', '_blank');
  };

  const features = [
    "Klanten toevoegen en beheren",
    "Facturen of offertes opmaken", 
    "Zakelijke uitgaven en bonnetjes verwerken",
    "Vragen over administratie en belasting",
    "Direct contact met Kyle (je persoonlijke boekhouder)"
  ];

  const testimonials = [
    {
      name: "byserenaarendzen / Serena Arendzen",
      role: "Fotograaf",
      text: "Ik ben altijd een grote kluns geweest als het aankomt op mijn administratie. Rekeningen, deadlines, formulieren… het was altijd een rommeltje. Sinds ik gebruik maak van Slim Geregeld is dat volledig veranderd. Alles is ...",
      rating: 5,
      avatar: "/IMG_4113.PNG",
      hasFullReview: true,
      onReadMore: () => window.open('https://maps.app.goo.gl/mWxn26yeQ85gMNfh6', '_blank')
    },
    {
      name: "Gomes Media / Jeremy Gomes",
      role: "Zelfstandig Marketeer",
      text: "Maakt het boekhouden veel gemakkelijker en ook sneller! Onderweg kan ik vrij rap wat facturen versturen door een simpel appje. Top systeem.",
      rating: 5,
      avatar: "/Jeremy Google Reviews.png",
      hasFullReview: true,
      onReadMore: () => window.open('https://maps.app.goo.gl/4hzddgC4sesnrEkZ8', '_blank')
    }
  ];

  const packages = [
    {
      name: "Alleen Slim",
      description: "Perfect voor e-commerce & detailhandel ondernemers die zelf hun administratie doen",
      branchBenefit: "Voor ondernemers die hun administratie zelf willen regelen, volledig via WhatsApp",
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
        "24/7 vragen beantwoorden over e-commerce kosten",
        "Klanten beheer",
        "Voorraadkosten herkenning"
      ],
      buttonText: "Start gratis proef",
      buttonStyle: "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50",
      cardStyle: "bg-white border border-gray-200 hover:shadow-lg"
    },
    {
      name: "Volledige Service",
      description: "Voor e-commerce & detailhandel ondernemers die alles uit handen willen geven",
      branchBenefit: "Ideaal voor ondernemers die hun tijd willen besteden aan groei, niet op administratie",
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
        "BTW-aangifte voor e-commerce",
        "Jaarrekening",
        "Persoonlijk contact met Kyle",
        "E-commerce aftrekposten optimalisatie"
      ],
      buttonText: "Start gratis proef",
      buttonStyle: "bg-blue-600 hover:bg-blue-700 text-white",
      cardStyle: "bg-white border-2 border-emerald-600 hover:shadow-xl"
    },
    {
      name: "Maatwerk",
      description: "Voor BV's en grotere e-commerce & detailhandel bedrijven",
      branchBenefit: "Aangepaste service voor bedrijven met complexe voorraadadministraties en meerdere entiteiten",
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
        "Aangepaste service voor e-commerce",
        "Complexe voorraadadministraties",
        "Meerdere entiteiten",
        "Strategisch advies voor groei",
        "Multi-platform administratie"
      ],
      buttonText: "Vraag gratis advies",
      buttonStyle: "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50",
      cardStyle: "bg-white border border-gray-200 hover:shadow-lg"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* 1. Header/Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 pt-16 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="lg:pr-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                Nooit meer wakker liggen van je{' '}
                <span className="text-emerald-600">boekhouding</span>
              </h1>
              
              <div className="text-xl md:text-2xl font-normal text-gray-600 mb-6 leading-relaxed">
                – vanaf nu is administratie <span className="text-blue-600 font-bold">Slim Geregeld.</span>
              </div>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Als Shopify-eigenaar, bol.com-verkoper of webshop-ondernemer wil je je tijd besteden aan het uitbreiden van je assortiment en verkopen, niet aan administratie. 
                Wij regelen je boekhouding, zodat jij kunt focussen op groei en meer omzet.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={handlePlanKennismakingClick}
                  className="bg-blue-600 text-white px-7 py-3.5 rounded-xl text-base font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <span>Start 30 dagen gratis</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button 
                  onClick={handleWhatsAppClick}
                  className="bg-white text-blue-600 border-2 border-blue-600 px-7 py-3.5 rounded-xl text-base font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Chat met Kyle</span>
                </button>
              </div>
            </div>

            <div className="lg:pl-4">
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-xl p-6 relative overflow-hidden">
                  <img 
                    src="/IMG_4370 (2).jpg" 
                    alt="Kyle" 
                    className="w-full h-96 object-cover rounded-xl"
                  />
                  
                  <div className="absolute bottom-3 right-3 bg-white rounded-full shadow-lg px-3 py-1.5 flex items-center space-x-2 border border-gray-100">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-600 font-medium text-sm">Kyle is beschikbaar</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Waarom kiezen voor SGA */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Waarom kiezen webshop eigenaren en bol.com verkopers voor Slim Geregeld Administratie?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We begrijpen de uitdagingen van ondernemers. Daarom hebben we onze service 
              afgestemd op jouw behoeften als webshop eigenaar of online verkoper.
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

      {/* 3. Wat maakt Slim Geregeld uniek */}
      <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-emerald-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-end">
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

      {/* 4. Pakketten */}
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
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Meest Populair
                    </div>
                  </div>
                )}

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
                  <p className="text-emerald-600 text-xs mt-2 font-medium italic">
                    {pkg.branchBenefit}
                  </p>
                </div>

                <div className="text-center mb-6">
                  <div className="mb-2">
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

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700 text-sm leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

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

      {/* 5. Reviews */}
      <section id="reviews" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Wat ondernemers zeggen over Slim Geregeld
            </h2>
            
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-3xl mx-auto mb-12">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  <svg className="w-8 h-8" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-xl font-semibold text-gray-900">Google</span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-3xl font-bold text-gray-900">5.0 / 5.0</span>
                </div>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  We zijn er trots op dat ondernemers uit alle branches ons telkens weer met 5 sterren beoordelen.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4 mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{testimonial.role}</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {testimonial.text}
                </p>

                {testimonial.hasFullReview && (
                  <button
                    onClick={testimonial.onReadMore}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1 transition-colors mt-4"
                  >
                    <span>Bekijk volledige review</span>
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="text-center bg-gray-50 rounded-2xl p-8">
            <p className="text-lg text-gray-700 mb-6">
              Sluit je aan bij ondernemers die meer tijd overhouden voor hun passie
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleGoogleReviewsClick}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Bekijk alle Google Reviews</span>
              </button>
              <button 
                onClick={handlePlanKennismakingClick}
                className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
              >
                Plan een gratis kennismaking
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Contact Form */}
      <section id="contact-form" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-stretch">
            <div className="flex flex-col space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 flex-grow">
                <div className="text-center h-full flex flex-col">
                  <img 
                    src="/SGA Foto 2.jpg" 
                    alt="Kyle aan de telefoon" 
                    className="w-full h-[28rem] object-cover rounded-xl flex-grow"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900">Kyle neemt contact op</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-gray-700 font-medium">Reactie binnen 24-72 uur</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">Volledig vrijblijvend telefonisch gesprek (15min)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">Persoonlijke aandacht gegarandeerd</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Meer verkopen, minder administratie</h2>
              <p className="text-gray-600 mb-8">
                Vertel ons over je webshop en ontdek hoe we je kunnen helpen om meer tijd over te houden voor groei. 
                Geen gedoe met voorraadadministratie, gewoon verkopen.
              </p>

              <form 
                name="contact" 
                method="POST" 
                data-netlify="true" 
                data-netlify-honeypot="bot-field"
                action="/bedankt"
                className="space-y-6 flex-grow flex flex-col"
              >
                <input type="hidden" name="form-name" value="contact" />
                
                <div style={{ display: 'none' }}>
                  <label>
                    Don't fill this out if you're human: 
                    <input name="bot-field" />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                      Naam *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Je volledige naam"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                      E-mailadres *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="je@email.nl"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                      Telefoonnummer
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="06 - 12 34 56 78 (optioneel)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-semibold text-gray-900 mb-2">
                      Bedrijfsnaam
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      placeholder="Je bedrijfsnaam (optioneel)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="businessType" className="block text-sm font-semibold text-gray-900 mb-2">
                    Type onderneming *
                  </label>
                  <select
                    id="businessType"
                    name="businessType"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900"
                    required
                  >
                    <option value="">Selecteer je ondernemingsvorm</option>
                    <option value="eenmanszaak">Eenmanszaak</option>
                    <option value="vof">Vennootschap onder Firma</option>
                    <option value="bv">Besloten Vennootschap</option>
                    <option value="anders">Anders</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="packageType" className="block text-sm font-semibold text-gray-900 mb-2">
                    Type pakket *
                  </label>
                  <select
                    id="packageType"
                    name="packageType"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900"
                    required
                  >
                    <option value="">Selecteer je type pakket</option>
                    <option value="alleen-slim">Alleen Slim</option>
                    <option value="volledige-service">Volledige Service</option>
                    <option value="maatwerk">Maatwerk</option>
                    <option value="weet-nog-niet">Weet ik nog niet</option>
                  </select>
                </div>

                <div className="flex-grow">
                  <label htmlFor="situation" className="block text-sm font-semibold text-gray-900 mb-2">
                    Vertel ons over je situatie
                  </label>
                  <textarea
                    id="situation"
                    name="situation"
                    rows={4}
                    placeholder="Waar loop je tegenaan met je administratie? Hoeveel tijd besteed je er nu aan? Wat zijn je grootste uitdagingen? (optioneel)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none placeholder-gray-400 h-full min-h-[6rem]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 mt-auto"
                >
                  <span>Plan gratis kennismaking</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EcommerceLanding;