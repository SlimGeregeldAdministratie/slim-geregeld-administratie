import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calculator, CheckCircle, Mail, Shield, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface FormData {
  naam: string;
  email: string;
  boekjaar: string;
  maandenActief: string;
  omzet: string;
  kosten: string;
  urencriterium: string;
  startende: string;
  partner: string;
  hypotheek: string;
  extraInkomen: string;
  bedrijfsnaam?: string;
}

interface CalculationResult {
  belasting: number;
  nettoMaand: number;
  nettoJaar: number;
}

const NettoCheck = () => {
  const [formData, setFormData] = useState<FormData>({
    naam: '',
    email: '',
    boekjaar: '',
    maandenActief: '12',
    omzet: '',
    kosten: '100',
    urencriterium: '',
    startende: '',
    partner: '',
    hypotheek: '',
    extraInkomen: '',
    bedrijfsnaam: ''
  });
  
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Calculate boekjaar options based on current date
  const getBoekjaarOptions = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11
    
    let years = [];
    let defaultYear = currentYear;
    
    if (currentMonth >= 10) {
      // October to December: show current and next year
      years = [currentYear, currentYear + 1];
      defaultYear = currentYear;
    } else {
      // January to September: show previous and current year
      years = [currentYear - 1, currentYear];
      defaultYear = currentYear;
    }
    
    return { years, defaultYear };
  };

  // Initialize boekjaar with default value
  useEffect(() => {
    const { defaultYear } = getBoekjaarOptions();
    setFormData(prev => ({
      ...prev,
      boekjaar: defaultYear.toString()
    }));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Slider value conversion functions
  const sliderToValue = (sliderPosition: number): number => {
    // Slider van 0-100, waarbij elke 5% een stap is
    const percentage = sliderPosition / 100;
    
    if (percentage <= 0.5) {
      // 0-50%: €0 tot €500 (step 50)
      return Math.round((percentage * 2) * 500 / 50) * 50;
    } else if (percentage <= 0.75) {
      // 50-75%: €500 tot €1000 (step 100)
      const rangePercentage = (percentage - 0.5) / 0.25;
      return 500 + Math.round(rangePercentage * 500 / 100) * 100;
    } else {
      // 75-100%: €1000 tot €2000 (step 250)
      const rangePercentage = (percentage - 0.75) / 0.25;
      return 1000 + Math.round(rangePercentage * 1000 / 250) * 250;
    }
  };

  const valueToSlider = (value: number): number => {
    if (value <= 500) {
      // €0-€500 = 0-50% van slider
      return (value / 500) * 50;
    } else if (value <= 1000) {
      // €500-€1000 = 50-75% van slider
      return 50 + ((value - 500) / 500) * 25;
    } else {
      // €1000-€2000 = 75-100% van slider
      return 75 + ((value - 1000) / 1000) * 25;
    }
  };

  const formatKostenValue = (value: number): string => {
    if (value >= 2000) {
      return '€2.000+';
    }
    return `€${value.toLocaleString()}`;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sliderValue = parseInt(e.target.value);
    const actualValue = sliderToValue(sliderValue);
    handleInputChange('kosten', actualValue.toString());
  };

  const calculateTax = (omzet: number, kosten: number, urencriterium: boolean, startende: boolean): CalculationResult => {
    // Basis berekening (vereenvoudigd)
    const maandenActief = parseInt(formData.maandenActief) || 12;
    const jaarlijkseKosten = kosten * maandenActief;
    let winst = omzet - jaarlijkseKosten;
    
    // Zelfstandigenaftrek (2024 tarieven)
    let zelfstandigenaftrek = 0;
    if (urencriterium && winst > 0) {
      if (startende) {
        zelfstandigenaftrek = Math.min(6670, winst); // Startersaftrek
      } else {
        zelfstandigenaftrek = Math.min(3750, winst); // Normale zelfstandigenaftrek
      }
    }
    
    const belastbaarInkomen = Math.max(0, winst - zelfstandigenaftrek);
    
    // Vereenvoudigde belastingberekening (schijven 2024)
    let belasting = 0;
    if (belastbaarInkomen > 0) {
      if (belastbaarInkomen <= 37149) {
        belasting = belastbaarInkomen * 0.3693; // Schijf 1
      } else if (belastbaarInkomen <= 73031) {
        belasting = 37149 * 0.3693 + (belastbaarInkomen - 37149) * 0.3693; // Schijf 2
      } else {
        belasting = 37149 * 0.3693 + (73031 - 37149) * 0.3693 + (belastbaarInkomen - 73031) * 0.495; // Schijf 3
      }
    }
    
    const nettoJaar = winst - belasting;
    const nettoMaand = nettoJaar / maandenActief;
    
    return {
      belasting: Math.round(belasting),
      nettoMaand: Math.round(nettoMaand),
      nettoJaar: Math.round(nettoJaar)
    };
  };


  const handleWhatsAppClick = () => {
    window.open('https://wa.me/31621311043', '_blank');
  };

  const handlePlanKennismakingClick = () => {
    navigate('/', { replace: true });
    setTimeout(() => {
      document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const { years } = getBoekjaarOptions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors mb-6 font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Terug naar homepage</span>
          </Link>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-blue-100 p-4 rounded-2xl">
              <Calculator className="h-10 w-10 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                NettoCheck
              </h1>
              <p className="text-lg text-gray-600">
               Ontdek wat je écht overhoudt als zelfstandig ondernemer. Beantwoord 5 korte vragen en ontvang een schatting van je inkomstenbelasting en netto inkomen.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          
          {!showResult ? (
            <>
              {/* Hero Section */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Boekjaar veld */}
                  <div>
                    <label className="block text-base font-semibold text-white mb-3">
                      Voor welk boekjaar? *
                    </label>
                    <select
                      name="boekjaar"
                      value={formData.boekjaar}
                      onChange={(e) => handleInputChange('boekjaar', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-colors text-base"
                      required
                    >
                      {years.map(year => (
                        <option key={year} value={year.toString()}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Aantal maanden actief */}
                  <div>
                    <label className="block text-base font-semibold text-white mb-3">
                      Totaal aantal maanden actief in boekjaar? *
                    </label>
                    <select
                      name="maandenActief"
                      value={formData.maandenActief}
                      onChange={(e) => handleInputChange('maandenActief', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-colors text-base"
                      required
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                        <option key={month} value={month.toString()}>
                          {month} {month === 1 ? 'maand' : 'maanden'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div className="px-8 py-12">
                <form 
                  name="nettocheck" 
                  method="POST" 
                  data-netlify="true" 
                  data-netlify-honeypot="bot-field"
                  action="/bedankt"
                  className="space-y-8"
                >
                  {/* Hidden form name field for Netlify */}
                  <input type="hidden" name="form-name" value="nettocheck" />
                  <input type="hidden" name="boekjaar" value={formData.boekjaar} />
<input type="hidden" name="maandenActief" value={formData.maandenActief} />

                  
                  {/* Honeypot field to prevent spam */}
                  <div style={{ display: 'none' }}>
                    <label>
                      Don't fill this out if you're human: 
                      <input name="bot-field" />
                    </label>
                  </div>


                  {/* Naam veld toegevoegd */}

                  {/* Vraag 1: Omzet */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-3">
                      1. Wat is je geschatte omzet dit jaar (excl. btw)? *
                    </label>
                   <p className="text-sm text-gray-600 mb-4">
                     Weet je alleen je gemiddelde maandomzet? Vermenigvuldig met het aantal maanden dat je actief bent in het boekjaar.
                   </p>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                      <input
                        type="text"
                        name="omzet"
                        value={formData.omzet}
                       onChange={(e) => {
                         // Parse verschillende formaten: 45.000, 45,000, 45k, etc.
                         let value = e.target.value;
                         
                         // Verwijder punten en komma's die als duizendtallen gebruikt worden
                         value = value.replace(/[.,]/g, '');
                         
                         // Handel 'k' af (45k = 45000)
                         if (value.toLowerCase().includes('k')) {
                           value = value.toLowerCase().replace('k', '000');
                         }
                         
                         // Zorg dat het een geldig getal is
                         const numericValue = value.replace(/[^0-9]/g, '');
                         
                         handleInputChange('omzet', numericValue);
                       }}
                        placeholder="Bijv. 45000"
                        className="w-full pl-8 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-lg"
                        required
                      />
                    </div>
                  </div>

                  {/* Vraag 2: Kosten */}
<div>
  <label className="block text-lg font-semibold text-gray-900 mb-3">
    2. Wat zijn je gemiddelde zakelijke kosten per maand? *
  </label>
  <div className="space-y-4">

    {/* Slider = alleen UI, andere naam */}
    <input
      type="range"
      name="kosten_slider"           // <-- was: name="kosten"
      min="0"
      max="100"
      step="5"
      value={valueToSlider(parseInt(formData.kosten) || 100)}
      onChange={(e) => {
        const sliderVal = parseInt(e.target.value, 10);
        const actual = sliderToValue(sliderVal);      // 0–2000 met jouw stappen
        handleInputChange('kosten', actual.toString()); // zet euro-bedrag in state
      }}
      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      required
      aria-label="Kosten per maand slider"
    />

    {/* Dit veld wordt naar Netlify gepost met de euro-waarde */}
    <input
      type="hidden"
      name="kosten"                   // <-- Netlify ontvangt dit veld
      value={formData.kosten}         // <-- euro-bedrag, bv. "150"
    />

    <div className="text-center">
      <span className="text-2xl font-bold text-blue-600">
        {formatKostenValue(parseInt(formData.kosten) || 100)}
      </span>
      <p className="text-sm text-gray-500 mt-1">per maand</p>
    </div>

    <div className="flex justify-between text-xs text-gray-400 relative">
      <span>€0</span>
      <span>€500</span>
      <span>€2.000+</span>
    </div>
  </div>
</div>

                  {/* Vraag 3: Urencriterium */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-3">
                      3. Werk je minstens 1.225 uur per jaar aan je bedrijf? *
                    </label>
                    <p className="text-sm text-gray-600 mb-4">Dat is ongeveer 24 uur per week. Hiermee voldoe je aan het urencriterium.</p>
                    <div className="space-y-3">
                      {[
                        { value: 'ja', label: 'Ja' },
                        { value: 'nee', label: 'Nee' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="urencriterium"
                            value={option.value}
                            checked={formData.urencriterium === option.value}
                            onChange={(e) => handleInputChange('urencriterium', e.target.value)}
                            className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                            required
                          />
                          <span className="text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Vraag 4: Startende ondernemer (alleen als urencriterium = ja) */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-3">
                      4. Ben je een startende ondernemer (eerste 3 jaar actief)? *
                    </label>
                    <div className="space-y-3">
                      {[
                        { value: 'ja', label: 'Ja' },
                        { value: 'nee', label: 'Nee' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="startende"
                            value={option.value}
                            checked={formData.startende === option.value}
                            onChange={(e) => handleInputChange('startende', e.target.value)}
                            className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                            required
                          />
                          <span className="text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Vraag 5: Gecombineerde vraag */}
<div>
  <label className="block text-lg font-semibold text-gray-900 mb-3">
    5. Welke van de volgende situaties zijn op jou van toepassing? *
  </label>
  <p className="text-sm text-gray-600 mb-4">
    Selecteer alle opties die op jou van toepassing zijn.
  </p>
  <div className="space-y-3">
    
    {/* Partner */}
    <input type="hidden" name="partner" value="nee" />
    <label className="flex items-center space-x-3 cursor-pointer">
      <input
        type="checkbox"
        name="partner"
        value="ja"
        checked={formData.partner === 'ja'}
        onChange={(e) =>
          handleInputChange('partner', e.target.checked ? 'ja' : 'nee')
        }
        className="w-5 h-5 text-blue-600 focus:ring-blue-500 rounded"
      />
      <span className="text-gray-700">
        Ik heb een fiscale partner (getrouwd of samen aangifte)
      </span>
    </label>

    {/* Hypotheek */}
    <input type="hidden" name="hypotheek" value="nee" />
    <label className="flex items-center space-x-3 cursor-pointer">
      <input
        type="checkbox"
        name="hypotheek"
        value="ja"
        checked={formData.hypotheek === 'ja'}
        onChange={(e) =>
          handleInputChange('hypotheek', e.target.checked ? 'ja' : 'nee')
        }
        className="w-5 h-5 text-blue-600 focus:ring-blue-500 rounded"
      />
      <span className="text-gray-700">Ik heb een eigen woning met hypotheek</span>
    </label>

    {/* Extra inkomen */}
    <input type="hidden" name="extraInkomen" value="nee" />
    <label className="flex items-center space-x-3 cursor-pointer">
      <input
        type="checkbox"
        name="extraInkomen"
        value="ja"
        checked={formData.extraInkomen === 'ja'}
        onChange={(e) =>
          handleInputChange('extraInkomen', e.target.checked ? 'ja' : 'nee')
        }
        className="w-5 h-5 text-blue-600 focus:ring-blue-500 rounded"
      />
      <span className="text-gray-700">
        Ik heb ander inkomen of bijzondere aftrekposten (loon, pensioen, uitkering, hypotheekrente, giften)
      </span>
    </label>

    {/* Geen van bovenstaande */}
    <input type="hidden" name="geenVanDrie" value="nee" />
    <label className="flex items-center space-x-3 cursor-pointer">
      <input
        type="checkbox"
        name="geenVanDrie"
        value="ja"
        checked={
          formData.partner === 'nee' &&
          formData.hypotheek === 'nee' &&
          formData.extraInkomen === 'nee'
        }
        onChange={(e) => {
          if (e.target.checked) {
            handleInputChange('partner', 'nee');
            handleInputChange('hypotheek', 'nee');
            handleInputChange('extraInkomen', 'nee');
          }
        }}
        className="w-5 h-5 text-blue-600 focus:ring-blue-500 rounded"
      />
      <span className="text-gray-700">
        Geen van bovenstaande is op mij van toepassing
      </span>
    </label>
  </div>
</div>
                  
                  {/* E-mail Info Sectie */}
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Mail className="h-6 w-6 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Je persoonlijke berekening per e-mail</h3>
                    </div>
                    <p className="text-sm text-gray-700">
                      We sturen je de uitgebreide berekening en tips om slim belasting te besparen direct naar je inbox.
                    </p>
                  </div>
                  {/* Naam veld - optioneel */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-3">
                      Voornaam
                    </label>
                    <input
                      type="text"
                      name="naam"
                      value={formData.naam}
                      onChange={(e) => handleInputChange('naam', e.target.value)}
                      placeholder="Je voornaam"
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-lg"
                    />
                  </div>

                  {/* Bedrijfsnaam veld - optioneel */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-3">
                      Bedrijfsnaam
                    </label>
                    <input
                      type="text"
                      name="bedrijfsnaam"
                      value={formData.bedrijfsnaam || ''}
                      onChange={(e) => handleInputChange('bedrijfsnaam', e.target.value)}
                      placeholder="Je bedrijfsnaam"
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-lg"
                    />
                  </div>

                  {/* E-mail veld */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-3">
                      E-mailadres *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="je@email.nl"
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-lg"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-4 px-8 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                    >
                      <Calculator className="h-5 w-5" />
                      <span>Verstuur & bereken</span>
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            /* Result Section */
            <div id="result-section">
              {/* Result Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-12 text-center">
                <CheckCircle className="h-16 w-16 text-white mx-auto mb-4" />
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Berekening verstuurd!
                </h2>
                <p className="text-green-100 text-lg">
                  Check je inbox voor je persoonlijke NettoCheck resultaat.
                </p>
              </div>

              {/* Result Content */}
              <div className="px-8 py-12">
                {result && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 mb-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">📧 Verstuurd naar {formData.email}</h3>
                      <p className="text-lg text-gray-700 leading-relaxed">
                        Je uitgebreide NettoCheck berekening met persoonlijke tips is onderweg naar je inbox. 
                        Hier alvast een voorproefje van je resultaat:
                      </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 text-center">
                      <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="text-3xl font-bold text-gray-900 mb-2">€{parseFloat(formData.omzet).toLocaleString()}</div>
                        <div className="text-gray-600">Jaaromzet</div>
                      </div>
                      <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="text-3xl font-bold text-red-600 mb-2">€{result.belasting.toLocaleString()}</div>
                        <div className="text-gray-600">Inkomstenbelasting</div>
                      </div>
                      <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="text-3xl font-bold text-green-600 mb-2">€{result.nettoMaand.toLocaleString()}</div>
                        <div className="text-gray-600">Netto per maand</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* CTA Section */}
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">
                    Twijfel je over je situatie of wil je zeker weten dat je alles uit je aftrekposten haalt?
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={handlePlanKennismakingClick}
                      className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Plan gratis intakegesprek
                    </button>
                    <button 
                      onClick={handleWhatsAppClick}
                      className="bg-green-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span>Chat met Kyle</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-500 leading-relaxed">
              <p className="font-medium text-gray-600 mb-2">⚠️ Let op:</p>
              <p>
                Deze berekening is een indicatie op basis van je ondernemingswinst. We houden geen rekening met andere inkomsten 
                (zoals loon of pensioen), fiscale partners, hypotheekrenteaftrek of toeslagen. Je werkelijke belastingaanslag kan afwijken. 
                Neem bij twijfel gerust contact op voor een persoonlijke check.
              </p>
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Een service van{' '}
            <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
              Slim Geregeld Administratie
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NettoCheck;