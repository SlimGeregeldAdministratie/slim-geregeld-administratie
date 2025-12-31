import React, { useState, useEffect } from 'react';
import { Phone, ArrowRight, CheckCircle, Clock } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    businessType: '',
    packageType: '',
    situation: ''
  });

  // Check for package selection from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedPackage = urlParams.get('package');
    
    if (selectedPackage) {
      setFormData(prev => ({
        ...prev,
        packageType: selectedPackage
      }));
      
      // Clear the URL parameter after setting the form
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Listen for package selection events
    const handlePackageSelected = (event: CustomEvent) => {
      setFormData(prev => ({
        ...prev,
        packageType: event.detail
      }));
    };

    window.addEventListener('packageSelected', handlePackageSelected as EventListener);
    
    return () => {
      window.removeEventListener('packageSelected', handlePackageSelected as EventListener);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-stretch">
          {/* Left Column - Kyle's Photo and Contact Info */}
          <div className="flex flex-col space-y-8">
            {/* Kyle aan de telefoon foto - vergroot */}
            <div className="bg-white rounded-2xl shadow-lg p-6 flex-grow">
              <div className="text-center h-full flex flex-col">
                <img 
                  src="/SGA Foto 2.jpg" 
                  alt="Kyle aan de telefoon" 
                  className="w-full h-[28rem] object-cover rounded-xl flex-grow"
                />
              </div>
            </div>

            {/* Kyle Contact Info Only */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              {/* Kyle Header - zonder profielfoto */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900">Kyle neemt contact op</h3>
              </div>
              
              {/* Contact Badges */}
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

          {/* Right Column - Contact Form */}
          <div id="contact-form" className="bg-white rounded-2xl shadow-lg p-8 flex flex-col">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Plan je gratis kennismaking</h2>
            <p className="text-gray-600 mb-8">
              Vertel ons over je situatie en ontdek hoe we je kunnen helpen om meer tijd over te houden voor ondernemen. 
              Geen verplichtingen, gewoon een goed gesprek.
            </p>

            <form 
              name="contact" 
              method="POST" 
              data-netlify="true" 
              data-netlify-honeypot="bot-field"
              action="/bedankt"
              className="space-y-6 flex-grow flex flex-col"
            >
              {/* Hidden form name field for Netlify */}
              <input type="hidden" name="form-name" value="contact" />
              
              {/* Honeypot field to prevent spam */}
              <div style={{ display: 'none' }}>
                <label>
                  Don't fill this out if you're human: 
                  <input name="bot-field" />
                </label>
              </div>

              {/* Naam en E-mail op 1 regel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                    Naam *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
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
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="je@email.nl"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Telefoonnummer en Bedrijfsnaam op 1 regel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                    Telefoonnummer
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
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
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Je bedrijfsnaam (optioneel)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Type onderneming - nu op eigen regel */}
              <div>
                <label htmlFor="businessType" className="block text-sm font-semibold text-gray-900 mb-2">
                  Type onderneming *
                </label>
                <select
                  id="businessType"
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900"
                  style={{
                    color: formData.businessType === '' ? '#9CA3AF' : '#111827'
                  }}
                  required
                >
                  <option value="" className="text-gray-400">Selecteer je ondernemingsvorm</option>
                  <option value="eenmanszaak" className="text-gray-900">Eenmanszaak</option>
                  <option value="vof" className="text-gray-900">Vennootschap onder Firma</option>
                  <option value="bv" className="text-gray-900">Besloten Vennootschap</option>
                  <option value="anders" className="text-gray-900">Anders</option>
                </select>
              </div>

              {/* Type pakket - nu verplicht */}
              <div>
                <label htmlFor="packageType" className="block text-sm font-semibold text-gray-900 mb-2">
                  Type pakket *
                </label>
                <select
                  id="packageType"
                  name="packageType"
                  value={formData.packageType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900"
                  style={{
                    color: formData.packageType === '' ? '#9CA3AF' : '#111827'
                  }}
                  required
                >
                  <option value="" className="text-gray-400">Selecteer je type pakket</option>
                  <option value="alleen-slim" className="text-gray-900">Alleen Slim</option>
                  <option value="volledige-service" className="text-gray-900">Volledige Service</option>
                  <option value="maatwerk" className="text-gray-900">Maatwerk</option>
                  <option value="weet-nog-niet" className="text-gray-900">Weet ik nog niet</option>
                </select>
              </div>

              <div className="flex-grow">
                <label htmlFor="situation" className="block text-sm font-semibold text-gray-900 mb-2">
                  Vertel ons over je situatie
                </label>
                <textarea
                  id="situation"
                  name="situation"
                  value={formData.situation}
                  onChange={handleInputChange}
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
  );
};

export default Contact;