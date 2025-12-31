import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const SlimChatbotInstellingen = () => {
  const [formData, setFormData] = useState({
    website: '',
    kvkNummer: '',
    btwNummer: '',
    iban: '',
    rekeningTnv: '',
    betalingstermijn: '14',
    geldigheidOffertes: '30',
    prijzenInclBtw: 'excl',
    adres: '',
    postcode: '',
    plaats: '',
    template: 'template1',
    betalingsvoorwaarden: '',
    offerteTekstBoven: '',
    offerteTekstOnder: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Submit to Netlify
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('form-name', 'slim-chatbot-instellingen');
    formDataToSubmit.append('website', formData.website);
    formDataToSubmit.append('kvkNummer', formData.kvkNummer);
    formDataToSubmit.append('btwNummer', formData.btwNummer);
    formDataToSubmit.append('iban', formData.iban);
    formDataToSubmit.append('rekeningTnv', formData.rekeningTnv);
    formDataToSubmit.append('betalingstermijn', formData.betalingstermijn);
    formDataToSubmit.append('geldigheidOffertes', formData.geldigheidOffertes);
    formDataToSubmit.append('prijzenInclBtw', formData.prijzenInclBtw);
    formDataToSubmit.append('adres', formData.adres);
    formDataToSubmit.append('postcode', formData.postcode);
    formDataToSubmit.append('plaats', formData.plaats);
    formDataToSubmit.append('template', formData.template);
    formDataToSubmit.append('betalingsvoorwaarden', formData.betalingsvoorwaarden);
    formDataToSubmit.append('offerteTekstBoven', formData.offerteTekstBoven);
    formDataToSubmit.append('offerteTekstOnder', formData.offerteTekstOnder);

    fetch('/', {
      method: 'POST',
      body: formDataToSubmit
    }).then(() => {
      setIsSubmitted(true);
    }).catch((error) => {
      console.error('Error submitting form:', error);
      // Still proceed with the flow even if submission fails
      setIsSubmitted(true);
    });
  };

  const templates = [
    {
      id: 'template1',
      name: 'Professioneel Grijs',
      image: '/Template 1.png'
    },
    {
      id: 'template2',
      name: 'Accent Geel',
      image: '/Template 2.png'
    },
    {
      id: 'template3',
      name: 'Modern Blauw',
      image: '/Template 3.png'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            to="/slim-chatbot" 
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors mb-6 font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Terug naar stap 1</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-16 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Jouw <span className="text-blue-600">factuurinstellingen</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Stap 2 van 2: Vul de gegevens in die automatisch op je facturen en offertes komen te staan.
            </p>
          </div>
        </div>
      </section>

      {/* Formulier Sectie - Stap 2 */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-8">
              {/* Desktop: show both steps */}
              <div className="hidden sm:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    ✓
                  </div>
                  <span className="text-green-600 font-medium">Basisgegevens</span>
                </div>
                <div className="w-12 h-0.5 bg-blue-600"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <span className="text-blue-600 font-medium">Factuurinstellingen</span>
                </div>
              </div>
              
              {/* Mobile: show only current step */}
              <div className="sm:hidden">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <span className="text-blue-600 font-medium">Factuurinstellingen</span>
                </div>
              </div>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
                {/* Hidden form name field for Netlify */}
                <input type="hidden" name="form-name" value="slim-chatbot-instellingen" />
                
                {/* Bedrijfsgegevens */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4">
                    Bedrijfsgegevens
                  </h3>
                  
                  <div>
                    <label htmlFor="website" className="block text-sm font-semibold text-gray-900 mb-2">
                      Zakelijke website (optioneel)
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://jouwbedrijf.nl"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="kvkNummer" className="block text-sm font-semibold text-gray-900 mb-2">
                        KVK nummer *
                      </label>
                      <input
                        type="text"
                        id="kvkNummer"
                        name="kvkNummer"
                        value={formData.kvkNummer}
                        onChange={handleInputChange}
                        placeholder="12345678"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="btwNummer" className="block text-sm font-semibold text-gray-900 mb-2">
                        BTW nummer *
                      </label>
                      <input
                        type="text"
                        id="btwNummer"
                        name="btwNummer"
                        value={formData.btwNummer}
                        onChange={handleInputChange}
                        placeholder="NL123456789B01"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="iban" className="block text-sm font-semibold text-gray-900 mb-2">
                        IBAN *
                      </label>
                      <input
                        type="text"
                        id="iban"
                        name="iban"
                        value={formData.iban}
                        onChange={handleInputChange}
                        placeholder="NL91 ABNA 0417 1643 00"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="rekeningTnv" className="block text-sm font-semibold text-gray-900 mb-2">
                        Rekening t.n.v. *
                      </label>
                      <input
                        type="text"
                        id="rekeningTnv"
                        name="rekeningTnv"
                        value={formData.rekeningTnv}
                        onChange={handleInputChange}
                        placeholder="Jouw Bedrijfsnaam"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="adres" className="block text-sm font-semibold text-gray-900 mb-2">
                        Adres *
                      </label>
                      <input
                        type="text"
                        id="adres"
                        name="adres"
                        value={formData.adres}
                        onChange={handleInputChange}
                        placeholder="Straatnaam 123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="postcode" className="block text-sm font-semibold text-gray-900 mb-2">
                        Postcode *
                      </label>
                      <input
                        type="text"
                        id="postcode"
                        name="postcode"
                        value={formData.postcode}
                        onChange={handleInputChange}
                        placeholder="1234 AB"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="plaats" className="block text-sm font-semibold text-gray-900 mb-2">
                        Plaats *
                      </label>
                      <input
                        type="text"
                        id="plaats"
                        name="plaats"
                        value={formData.plaats}
                        onChange={handleInputChange}
                        placeholder="Amsterdam"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Factuur instellingen */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4">
                    Factuur instellingen
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="betalingstermijn" className="block text-sm font-semibold text-gray-900 mb-2">
                        Betalingstermijn (dagen) *
                      </label>
                      <select
                        id="betalingstermijn"
                        name="betalingstermijn"
                        value={formData.betalingstermijn}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        required
                      >
                        <option value="7">7 dagen</option>
                        <option value="14">14 dagen</option>
                        <option value="30">30 dagen</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="geldigheidOffertes" className="block text-sm font-semibold text-gray-900 mb-2">
                        Geldigheid offertes (dagen) *
                      </label>
                      <select
                        id="geldigheidOffertes"
                        name="geldigheidOffertes"
                        value={formData.geldigheidOffertes}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        required
                      >
                        <option value="14">14 dagen</option>
                        <option value="30">30 dagen</option>
                        <option value="60">60 dagen</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="prijzenInclBtw" className="block text-sm font-semibold text-gray-900 mb-2">
                        Prijzen *
                      </label>
                      <select
                        id="prijzenInclBtw"
                        name="prijzenInclBtw"
                        value={formData.prijzenInclBtw}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        required
                      >
                        <option value="excl">Exclusief BTW</option>
                        <option value="incl">Inclusief BTW</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Template keuze */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4">
                    Template keuze
                  </h3>

                  <div className="grid grid-cols-1 gap-6">
                    {templates.map((template) => (
                      <div key={template.id} className="relative">
                        <input
                          type="radio"
                          id={template.id}
                          name="template"
                          value={template.id}
                          checked={formData.template === template.id}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <label
                          htmlFor={template.id}
                          className={`block cursor-pointer rounded-xl border-2 p-4 transition-all ${
                            formData.template === template.id
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={template.image}
                            alt={template.name}
                            className="w-full h-96 object-contain rounded-lg mb-3 bg-gray-50"
                          />
                          <h4 className="font-semibold text-gray-900 text-center">
                            {template.id === 'template1' && '1. '}
                            {template.id === 'template2' && '2. '}
                            {template.id === 'template3' && '3. '}
                            {template.name}
                          </h4>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Teksten */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4">
                    Standaard teksten
                  </h3>

                  <div>
                    <label htmlFor="betalingsvoorwaarden" className="block text-sm font-semibold text-gray-900 mb-2">
                      Standaard betalingsvoorwaarden factuur
                    </label>
                    <textarea
                      id="betalingsvoorwaarden"
                      name="betalingsvoorwaarden"
                      value={formData.betalingsvoorwaarden}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Bijvoorbeeld: Wij verzoeken u vriendelijk het totale bedrag binnen 30 dagen op rekeningnummer [REKENINGNUMMER] t.n.v. [BEDRIJFSNAAM] over te maken. Graag het factuurnummer als betalingskenmerk toevoegen."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="offerteTekstBoven" className="block text-sm font-semibold text-gray-900 mb-2">
                      Offerte tekst boven tabel
                    </label>
                    <textarea
                      id="offerteTekstBoven"
                      name="offerteTekstBoven"
                      value={formData.offerteTekstBoven}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Bijvoorbeeld: Geachte klant,&#10;&#10;Hierbij ontvangt u van ons de prijsopgave voor de onderstaande diensten."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="offerteTekstOnder" className="block text-sm font-semibold text-gray-900 mb-2">
                      Offerte tekst onder tabel
                    </label>
                    <textarea
                      id="offerteTekstOnder"
                      name="offerteTekstOnder"
                      value={formData.offerteTekstOnder}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Bijvoorbeeld: We hopen u hiermee voldoende geïnformeerd te hebben."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Extra opmerkingen */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4">
                    Extra opmerkingen
                  </h3>

                  <div>
                    <label htmlFor="extraOpmerkingen" className="block text-sm font-semibold text-gray-900 mb-2">
                      Nog iets wat je kwijt wilt?
                    </label>
                    <textarea
                      id="extraOpmerkingen"
                      name="extraOpmerkingen"
                      rows={4}
                      placeholder="Bijvoorbeeld: specifieke wensen voor facturen, bijzondere situaties, vragen over de service, etc."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none placeholder-gray-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Opslaan & activeren
                </button>
              </form>
            ) : (
              <div className="max-w-xl mx-auto text-center">
                <div className="bg-green-50 rounded-2xl p-8 border border-green-200">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Bedankt! Je instellingen zijn opgeslagen.
                  </h3>
                  <p className="text-lg text-gray-700 mb-6">
                    Slim Chatbot is klaar voor gebruik. Je ontvangt binnen 24 uur een WhatsApp-bericht om te starten.
                  </p>
                  
                  <Link
                    to="/"
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl inline-block"
                  >
                    Terug naar homepage
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SlimChatbotInstellingen;