import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, MessageCircle, CheckCircle, FileText, Users, HelpCircle, Phone, Play, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const SlimChatbot = () => {
  const [formData, setFormData] = useState({
    voornaam: '',
    achternaam: '',
    bedrijfsnaam: '',
    email: '',
    telefoon: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showRedirect, setShowRedirect] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Submit to Netlify
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('form-name', 'slim-chatbot-basisgegevens');
    formDataToSubmit.append('voornaam', formData.voornaam);
    formDataToSubmit.append('achternaam', formData.achternaam);
    formDataToSubmit.append('bedrijfsnaam', formData.bedrijfsnaam);
    formDataToSubmit.append('email', formData.email);
    formDataToSubmit.append('telefoon', formData.telefoon);

    fetch('/', {
      method: 'POST',
      body: formDataToSubmit
    }).then(() => {
      setIsSubmitted(true);
      setShowRedirect(true);
      
      // Auto redirect after 3 seconds
      setTimeout(() => {
        navigate('/slim-chatbot-instellingen');
      }, 3000);
    }).catch((error) => {
      console.error('Error submitting form:', error);
      // Still proceed with the flow even if submission fails
      setIsSubmitted(true);
      setShowRedirect(true);
      
      setTimeout(() => {
        navigate('/slim-chatbot-instellingen');
      }, 3000);
    });
  };

  const handleActiveerSlimClick = () => {
    document.getElementById('formulier-stap-1')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBekijkHoeHetWerktClick = () => {
    document.getElementById('video-sectie')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartGratisClick = () => {
    document.getElementById('formulier-stap-1')?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      icon: FileText,
      text: "Facturen en offertes opmaken binnen 1 minuut, overal waar je bent"
    },
    {
      icon: HelpCircle,
      text: "Vragen beantwoorden over administratie, belasting en alles wat met je zakelijke administratie te maken heeft"
    },
    {
      icon: Phone,
      text: "In contact brengen met een boekhouder van Slim Geregeld Administratie, voor specifieke vragen of hulp"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors mb-6 font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Terug naar homepage</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-16 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center bg-green-100 text-green-800 px-6 py-3 rounded-full text-lg font-semibold mb-8">
              Nu: 180 dagen gratis (t.w.v. €75 p/m)
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Ontmoet Slim, jouw{' '}
              <span className="text-blue-600">WhatsApp-boekhouder</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-4xl mx-auto">
              Regel je administratie rechtstreeks via WhatsApp. Facturen, offertes, vragen en meer – altijd binnen handbereik.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleActiveerSlimClick}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Activeer Slim Chatbot</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button 
                onClick={handleBekijkHoeHetWerktClick}
                className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <Play className="h-5 w-5" />
                <span>Bekijk hoe het werkt</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Uitleg Sectie */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto mb-12">
              Slim is de enige boekhoud-chatbot in Nederland die jouw administratie direct via WhatsApp regelt. 
              Hij is speciaal gemaakt voor zelfstandigen die minder tijd willen besteden aan administratie.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 p-3 rounded-xl flex-shrink-0">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-gray-700 leading-relaxed">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Sectie */}
<section id="video-sectie" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-gray-900 mb-6">
        Factuur maken in 1 minuut
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Bekijk hoe eenvoudig het is om via WhatsApp een factuur te versturen.
      </p>
    </div>

    {/* Vimeo iframe */}
    <div className="max-w-4xl mx-auto">
      <div className="aspect-video rounded-xl shadow-lg overflow-hidden bg-black">
       <iframe
  src="https://player.vimeo.com/video/1119841757?api=1&player_id=vimeo_slimchatbot&badge=0&autopause=0&app_id=58479"
  id="vimeo_slimchatbot"
  title="Facturen maken via WhatsApp | Slim Geregeld Administratie"
  frameBorder="0"
  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
  referrerPolicy="strict-origin-when-cross-origin"
  allowFullScreen
  className="w-full h-full"
/>
      </div>
    </div>
  </div>
</section>


      {/* Gratis Periode Sectie */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Probeer Slim Chatbot 180 dagen gratis
          </h2>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Normaal €75 per maand – nu tijdelijk een half jaar volledig gratis. Je krijgt onbeperkt toegang tot Slim 
            en kunt zelf ervaren hoeveel tijd en stress je bespaart.
          </p>
          
          <button 
            onClick={handleStartGratisClick}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 mx-auto"
          >
            <span>Start gratis met Slim Chatbot</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Reviews Sectie */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Dit is wat mensen zeggen over de Chatbot
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Dany Review */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4 mb-4">
                <img 
                  src="/Dany Google Review.png" 
                  alt="OMNI fit coaching / Dany Cramer"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">OMNI fit coaching / Dany Cramer</h4>
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">Online fitness coach</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-4">
                Gebruik om o.a. mijn facturen te maken! Alles was heel duidelijk en scheelt super veel tijd. Aanrader!
              </p>

              <button
                onClick={() => window.open('https://maps.app.goo.gl/HZJpLdfC8V7X1DwN7', '_blank')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1 transition-colors"
              >
                <span>Bekijk volledige review</span>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            </div>

            {/* Jeremy Review */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4 mb-4">
                <img 
                  src="/Jeremy Google Reviews.png" 
                  alt="Gomes Media / Jeremy Gomes"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">Gomes Media / Jeremy Gomes</h4>
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">Zelfstandig Marketeer</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-4">
                Maakt het boekhouden veel gemakkelijker en ook sneller! Onderweg kan ik vrij rap wat facturen versturen door een simpel appje. Top systeem.
              </p>

              <button
                onClick={() => window.open('https://maps.app.goo.gl/4hzddgC4sesnrEkZ8', '_blank')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1 transition-colors"
              >
                <span>Bekijk volledige review</span>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Formulier Sectie - Stap 1 */}
      <section id="formulier-stap-1" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-8">
              {/* Desktop: show both steps */}
              <div className="hidden sm:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <span className="text-blue-600 font-medium">Basisgegevens</span>
                </div>
                <div className="w-12 h-0.5 bg-gray-300"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <span className="text-gray-500 font-medium">Factuurinstellingen</span>
                </div>
              </div>
              
              {/* Mobile: show only current step */}
              <div className="sm:hidden">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <span className="text-blue-600 font-medium">Basisgegevens</span>
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Activeer Slim Chatbot
              </h2>
              <p className="text-lg text-gray-600">
                Stap 1 van 2: Vul je basisgegevens in. Wij sturen je binnen 24 uur de bevestiging en activering.
              </p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
                {/* Hidden form name field for Netlify */}
                <input type="hidden" name="form-name" value="slim-chatbot-basisgegevens" />
                
                <div>
                  <label htmlFor="voornaam" className="block text-sm font-semibold text-gray-900 mb-2">
                    Voornaam *
                  </label>
                  <input
                    type="text"
                    id="voornaam"
                    name="voornaam"
                    value={formData.voornaam}
                    onChange={handleInputChange}
                    placeholder="Je voornaam"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="achternaam" className="block text-sm font-semibold text-gray-900 mb-2">
                    Achternaam *
                  </label>
                  <input
                    type="text"
                    id="achternaam"
                    name="achternaam"
                    value={formData.achternaam}
                    onChange={handleInputChange}
                    placeholder="Je achternaam"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="bedrijfsnaam" className="block text-sm font-semibold text-gray-900 mb-2">
                    Bedrijfsnaam *
                  </label>
                  <input
                    type="text"
                    id="bedrijfsnaam"
                    name="bedrijfsnaam"
                    value={formData.bedrijfsnaam}
                    onChange={handleInputChange}
                    placeholder="Je bedrijfsnaam"
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
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="je@email.nl"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="telefoon" className="block text-sm font-semibold text-gray-900 mb-2">
                    Telefoonnummer *
                  </label>
                  <input
                    type="tel"
                    id="telefoon"
                    name="telefoon"
                    value={formData.telefoon}
                    onChange={handleInputChange}
                    placeholder="06 - 12 34 56 78 (voor WhatsApp-koppeling)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <span>Ga verder naar stap 2</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>
            ) : (
              <div className="max-w-xl mx-auto text-center">
                <div className="bg-green-50 rounded-2xl p-8 border border-green-200 mb-8">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Mooi, je basisgegevens zijn opgeslagen ✅
                  </h3>
                  <p className="text-lg text-gray-700 mb-6">
                    Nog één stap: vul je factuurgegevens in zodat Slim de juiste info op je facturen/offertes kan zetten.
                  </p>
                  
                  <Link
                    to="/slim-chatbot-instellingen"
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
                  >
                    <span>Ga naar stap 2</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>

                {showRedirect && (
                  <p className="text-sm text-gray-500">
                    Je wordt automatisch doorgestuurd naar stap 2 in 3 seconden...
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SlimChatbot;