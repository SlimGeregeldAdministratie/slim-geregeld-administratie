import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, MessageCircle, CheckCircle, FileText, Users, HelpCircle, Phone, Play, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Teksten in twee talen; de Engelse versie staat op /en/slim-chatbot en meldt taal 'en' mee in het formulier.
const TEKSTEN = {
  nl: {
    terug: 'Terug naar homepage', badge: 'Nu: 180 dagen gratis, daarna 19,95 per maand', heroTitel: 'Ontmoet Slim, jouw', heroAccent: 'WhatsApp-boekhouder',
    heroSub: 'Regel je administratie rechtstreeks via WhatsApp. Facturen, offertes, bonnetjes en vragen, altijd binnen handbereik.',
    activeer: 'Activeer Slim Chatbot', bekijk: 'Bekijk hoe het werkt',
    uitleg: '{t.uitleg}',
    f1: 'Facturen en offertes opmaken binnen 1 minuut, overal waar je bent', f2: 'Bonnetjes als foto doorsturen en vragen stellen over je administratie, belasting en alles wat met ondernemen te maken heeft', f3: 'In contact komen met een boekhouder van Slim Geregeld Administratie, voor specifieke vragen of hulp',
    videoKop: '{t.videoKop}', videoSub: '{t.videoSub}',
    gratisKop: 'Probeer Slim 180 dagen gratis', gratisSub: 'Daarna 19,95 per maand, maandelijks opzegbaar. Je krijgt onbeperkt toegang tot Slim en ervaart zelf hoeveel tijd en gedoe je bespaart.', startGratis: 'Start gratis met Slim',
    reviewsKop: 'Dit is wat mensen zeggen over Slim', rol1: 'Online fitness coach', rol2: 'Zelfstandig marketeer',
    quote1: '{t.quote1}', quote2: '{t.quote2}', volledigeReview: 'Bekijk volledige review',
    stap1: 'Basisgegevens', stap2: 'Factuurinstellingen', formKop: 'Activeer Slim Chatbot', formSub: 'Stap 1 van 2: vul je basisgegevens in. Je krijgt meteen een mail met hoe je begint.',
    voornaam: 'Voornaam *', achternaam: 'Achternaam *', bedrijf: 'Bedrijfsnaam *', email: 'E-mailadres *', telefoon: 'Telefoonnummer *', phVoornaam: 'Je voornaam', phAchternaam: 'Je achternaam', phBedrijf: 'Je bedrijfsnaam', phEmail: 'je@email.nl', phTelefoon: '06 12 34 56 78 (je WhatsApp-nummer)',
    moneybirdVraag: 'Werk je al met Moneybird? *', mbJa: 'Ja, Slim mag in mijn Moneybird werken', mbNee: 'Nee, Slim maakt mijn facturen als pdf', mbWeetNiet: 'Weet ik niet',
    verder: 'Ga verder naar stap 2', opgeslagen: 'Mooi, je basisgegevens zijn opgeslagen', nogEen: 'Nog één stap: vul je factuurgegevens in, zodat Slim de juiste gegevens op je facturen en offertes zet.', naarStap2: 'Ga naar stap 2', doorgestuurd: 'Je wordt over 3 seconden automatisch doorgestuurd naar stap 2.',
  },
  en: {
    terug: 'Back to homepage', badge: 'Now: 180 days free, then 19.95 per month', heroTitel: 'Meet Slim, your', heroAccent: 'WhatsApp bookkeeper',
    heroSub: 'Run your bookkeeping straight from WhatsApp. Invoices, quotes, receipts and questions, always at hand.',
    activeer: 'Activate Slim Chatbot', bekijk: 'See how it works',
    uitleg: 'Slim is the only bookkeeping chatbot in the Netherlands that handles your administration directly through WhatsApp. Built for freelancers and small business owners who want to spend less time on paperwork.',
    f1: 'Create invoices and quotes within a minute, wherever you are', f2: 'Forward receipts as a photo and ask questions about your bookkeeping, Dutch taxes and running a business', f3: 'Get in touch with a bookkeeper at Slim Geregeld Administratie for specific questions or help',
    videoKop: 'An invoice in one minute', videoSub: 'See how easy it is to send an invoice through WhatsApp (video in Dutch).',
    gratisKop: 'Try Slim free for 180 days', gratisSub: 'After that 19.95 per month, cancel monthly. Unlimited access to Slim, so you can see for yourself how much time and hassle it saves.', startGratis: 'Start with Slim for free',
    reviewsKop: 'What people say about Slim', rol1: 'Online fitness coach', rol2: 'Freelance marketer',
    quote1: 'I use it to make my invoices, among other things. Everything was very clear and it saves a lot of time. Recommended!', quote2: 'Makes bookkeeping much easier and faster. On the road I can send out invoices quickly with a simple message. Great system.', volledigeReview: 'Read the full review',
    stap1: 'Basic details', stap2: 'Invoice settings', formKop: 'Activate Slim Chatbot', formSub: 'Step 1 of 2: fill in your basic details. You get an e-mail right away explaining how to start.',
    voornaam: 'First name *', achternaam: 'Last name *', bedrijf: 'Business name *', email: 'E-mail address *', telefoon: 'Phone number *', phVoornaam: 'Your first name', phAchternaam: 'Your last name', phBedrijf: 'Your business name', phEmail: 'you@email.com', phTelefoon: '+31 6 12 34 56 78 (your WhatsApp number)',
    moneybirdVraag: 'Do you already use Moneybird? *', mbJa: 'Yes, Slim may work in my Moneybird', mbNee: 'No, Slim makes my invoices as pdf', mbWeetNiet: 'I do not know',
    verder: 'Continue to step 2', opgeslagen: 'Great, your basic details are saved', nogEen: 'One more step: fill in your invoice details so Slim puts the right information on your invoices and quotes.', naarStap2: 'Go to step 2', doorgestuurd: 'You will be redirected to step 2 in 3 seconds.',
  },
};

const SlimChatbot = ({ lang = 'nl' }: { lang?: 'nl' | 'en' }) => {
  const t = TEKSTEN[lang];
  const stap2Pad = lang === 'en' ? '/en/slim-chatbot-settings' : '/slim-chatbot-instellingen';
  const [formData, setFormData] = useState({
    voornaam: '',
    achternaam: '',
    bedrijfsnaam: '',
    email: '',
    telefoon: '',
    moneybird: ''
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
    formDataToSubmit.append('taal', lang);
    formDataToSubmit.append('moneybird', formData.moneybird);
    // stap 2 heeft deze nodig om de instellingen aan deze aanmelding te koppelen
    try { sessionStorage.setItem('slimLead', JSON.stringify({ email: formData.email, telefoon: formData.telefoon, taal: lang, moneybird: formData.moneybird })); } catch (e) { /* privémodus */ }

    fetch('/', {
      method: 'POST',
      body: formDataToSubmit
    }).then(() => {
      setIsSubmitted(true);
      setShowRedirect(true);
      
      // Auto redirect after 3 seconds
      setTimeout(() => {
        navigate(stap2Pad);
      }, 3000);
    }).catch((error) => {
      console.error('Error submitting form:', error);
      // Still proceed with the flow even if submission fails
      setIsSubmitted(true);
      setShowRedirect(true);
      
      setTimeout(() => {
        navigate(stap2Pad);
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
      text: t.f1
    },
    {
      icon: HelpCircle,
      text: t.f2
    },
    {
      icon: Phone,
      text: t.f3
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
            <span>{t.terug}</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-16 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center bg-green-100 text-green-800 px-6 py-3 rounded-full text-lg font-semibold mb-8">
              {t.badge}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {t.heroTitel}{' '}
              <span className="text-blue-600">{t.heroAccent}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-4xl mx-auto">
              {t.heroSub}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleActiveerSlimClick}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>{t.activeer}</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button 
                onClick={handleBekijkHoeHetWerktClick}
                className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <Play className="h-5 w-5" />
                <span>{t.bekijk}</span>
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
            {t.gratisKop}
          </h2>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            {t.gratisSub}
          </p>
          
          <button 
            onClick={handleStartGratisClick}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 mx-auto"
          >
            <span>{t.startGratis}</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Reviews Sectie */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              {t.reviewsKop}
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
                  <p className="text-sm text-gray-500 mb-2">{t.rol1}</p>
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
                <span>{t.volledigeReview}</span>
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
                  <p className="text-sm text-gray-500 mb-2">{t.rol2}</p>
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
                <span>{t.volledigeReview}</span>
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
                  <span className="text-blue-600 font-medium">{t.stap1}</span>
                </div>
                <div className="w-12 h-0.5 bg-gray-300"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <span className="text-gray-500 font-medium">{t.stap2}</span>
                </div>
              </div>
              
              {/* Mobile: show only current step */}
              <div className="sm:hidden">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <span className="text-blue-600 font-medium">{t.stap1}</span>
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t.formKop}
              </h2>
              <p className="text-lg text-gray-600">
                {t.formSub}
              </p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
                {/* Hidden form name field for Netlify */}
                <input type="hidden" name="form-name" value="slim-chatbot-basisgegevens" />
                
                <div>
                  <label htmlFor="voornaam" className="block text-sm font-semibold text-gray-900 mb-2">
                    {t.voornaam}
                  </label>
                  <input
                    type="text"
                    id="voornaam"
                    name="voornaam"
                    value={formData.voornaam}
                    onChange={handleInputChange}
                    placeholder={t.phVoornaam}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="achternaam" className="block text-sm font-semibold text-gray-900 mb-2">
                    {t.achternaam}
                  </label>
                  <input
                    type="text"
                    id="achternaam"
                    name="achternaam"
                    value={formData.achternaam}
                    onChange={handleInputChange}
                    placeholder={t.phAchternaam}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="bedrijfsnaam" className="block text-sm font-semibold text-gray-900 mb-2">
                    {t.bedrijf}
                  </label>
                  <input
                    type="text"
                    id="bedrijfsnaam"
                    name="bedrijfsnaam"
                    value={formData.bedrijfsnaam}
                    onChange={handleInputChange}
                    placeholder={t.phBedrijf}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    {t.email}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t.phEmail}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="telefoon" className="block text-sm font-semibold text-gray-900 mb-2">
                    {t.telefoon}
                  </label>
                  <input
                    type="tel"
                    id="telefoon"
                    name="telefoon"
                    value={formData.telefoon}
                    onChange={handleInputChange}
                    placeholder={t.phTelefoon}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <p className="block text-sm font-semibold text-gray-900 mb-2">{t.moneybirdVraag}</p>
                  <div className="space-y-2">
                    {[['ja', t.mbJa], ['nee', t.mbNee], ['weet-niet', t.mbWeetNiet]].map(([waarde, label]) => (
                      <label key={waarde} className={`flex items-center space-x-3 px-4 py-3 border rounded-xl cursor-pointer transition-colors ${formData.moneybird === waarde ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
                        <input type="radio" name="moneybird" value={waarde} checked={formData.moneybird === waarde} onChange={handleInputChange} required className="h-4 w-4 text-blue-600" />
                        <span className="text-gray-800">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <span>{t.verder}</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>
            ) : (
              <div className="max-w-xl mx-auto text-center">
                <div className="bg-green-50 rounded-2xl p-8 border border-green-200 mb-8">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {t.opgeslagen} ✅
                  </h3>
                  <p className="text-lg text-gray-700 mb-6">
                    {t.nogEen}
                  </p>
                  
                  <Link
                    to={stap2Pad}
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
                  >
                    <span>{t.naarStap2}</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>

                {showRedirect && (
                  <p className="text-sm text-gray-500">
                    {t.doorgestuurd}
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