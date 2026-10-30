import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const TEKSTEN = {
  nl: {
    terug: 'Terug naar stap 1', titel: 'Jouw', accent: 'factuurinstellingen', sub: 'Stap 2 van 2: vul de gegevens in die automatisch op je facturen en offertes komen te staan.',
    subMb: 'Stap 2 van 2: je werkt met Moneybird, dus je factuurgegevens staan daar al. Slim heeft alleen een API-token nodig.',
    stap1: 'Basisgegevens', stap2: 'Factuurinstellingen',
    mbKop: 'Koppeling met Moneybird', mbUitleg1: 'Maak in Moneybird een API-token aan via moneybird.com/user/applications/new. Kies een naam (bijvoorbeeld Slim) en vink Verkoopfacturen, Offertes en Instellingen aan.', mbUitleg2: 'Plak het token hieronder. Slim controleert het en je krijgt een mail zodra je kunt beginnen, meestal binnen een half uur. Later aanleveren per mail kan ook.',
    mbToken: 'Moneybird API-token', phToken: 'Plak hier je token',
    bedrijfKop: 'Bedrijfsgegevens', website: 'Zakelijke website (optioneel)', kvk: 'KVK-nummer *', btw: 'Btw-nummer *', iban: 'IBAN *', tnv: 'Rekening t.n.v. *', adres: 'Adres *', postcode: 'Postcode *', plaats: 'Plaats *',
    factuurKop: 'Factuurinstellingen', termijn: 'Betalingstermijn (dagen) *', geldig: 'Geldigheid offertes (dagen) *', prijzen: 'Prijzen *', dagen: 'dagen', excl: 'Exclusief btw', incl: 'Inclusief btw',
    viaMail: 'Facturen na jouw akkoord direct naar je klant mailen? *', viaMailJa: 'Ja, met mij in de cc', viaMailNee: 'Nee, alleen naar mij',
    templateKop: 'Opmaak', t1: 'Professioneel grijs', t2: 'Accent geel', t3: 'Modern blauw',
    tekstenKop: 'Standaardteksten', voorwaarden: 'Betalingsvoorwaarden op de factuur', tekstBoven: 'Offertetekst boven de tabel', tekstOnder: 'Offertetekst onder de tabel',
    phVoorwaarden: 'Leeg laten mag: dan gebruikt Slim een standaardtekst met je betalingstermijn en IBAN.', phBoven: 'Leeg laten mag: "Geachte {naam}, bedankt voor uw aanvraag. Hieronder vindt u onze offerte."', phOnder: 'Leeg laten mag: "Deze offerte is 30 dagen geldig."',
    extraKop: 'Extra opmerkingen', extra: 'Nog iets wat je kwijt wilt?', phExtra: 'Bijvoorbeeld: specifieke wensen voor facturen, bijzondere situaties, vragen over de service.',
    opslaan: 'Opslaan en starten', bedankt: 'Bedankt, je instellingen zijn opgeslagen.', klaar: 'Slim staat voor je klaar. Stuur hem een berichtje op +31 6 23818236, het nummer staat ook in je welkomstmail.', klaarMb: 'Zodra je token is gecontroleerd krijg je een mail dat je kunt beginnen, meestal binnen een half uur.', home: 'Terug naar homepage',
  },
  en: {
    terug: 'Back to step 1', titel: 'Your', accent: 'invoice settings', sub: 'Step 2 of 2: fill in the details that go on your invoices and quotes automatically.',
    subMb: 'Step 2 of 2: you use Moneybird, so your invoice details are already there. Slim only needs an API token.',
    stap1: 'Basic details', stap2: 'Invoice settings',
    mbKop: 'Connecting to Moneybird', mbUitleg1: 'In Moneybird, create an API token at moneybird.com/user/applications/new. Choose a name (for example Slim) and tick Sales invoices, Estimates and Settings.', mbUitleg2: 'Paste the token below. Slim checks it and you get an e-mail as soon as you can start, usually within half an hour. Sending it later by e-mail also works.',
    mbToken: 'Moneybird API token', phToken: 'Paste your token here',
    bedrijfKop: 'Business details', website: 'Business website (optional)', kvk: 'Chamber of Commerce (KVK) number *', btw: 'VAT number *', iban: 'IBAN *', tnv: 'Account holder *', adres: 'Address *', postcode: 'Postal code *', plaats: 'City *',
    factuurKop: 'Invoice settings', termijn: 'Payment term (days) *', geldig: 'Quote validity (days) *', prijzen: 'Prices *', dagen: 'days', excl: 'Excluding VAT', incl: 'Including VAT',
    viaMail: 'E-mail invoices straight to your customer after your approval? *', viaMailJa: 'Yes, with me in cc', viaMailNee: 'No, only to me',
    templateKop: 'Layout', t1: 'Professional grey', t2: 'Yellow accent', t3: 'Modern blue',
    tekstenKop: 'Standard texts', voorwaarden: 'Payment terms on the invoice', tekstBoven: 'Quote text above the table', tekstOnder: 'Quote text below the table',
    phVoorwaarden: 'May be left empty: Slim then uses a standard text with your payment term and IBAN.', phBoven: 'May be left empty: "Dear {name}, thank you for your request. Below you find our quote."', phOnder: 'May be left empty: "This quote is valid for 30 days."',
    extraKop: 'Anything else', extra: 'Anything you want to tell us?', phExtra: 'For example: specific wishes for invoices, special situations, questions about the service.',
    opslaan: 'Save and start', bedankt: 'Thank you, your settings are saved.', klaar: 'Slim is ready for you. Send him a message at +31 6 23818236, the number is also in your welcome e-mail.', klaarMb: 'As soon as your token is checked you get an e-mail that you can start, usually within half an hour.', home: 'Back to homepage',
  },
};

const leesLead = () => { try { return JSON.parse(sessionStorage.getItem('slimLead') || '{}'); } catch (e) { return {}; } };

const SlimChatbotInstellingen = ({ lang = 'nl' }: { lang?: 'nl' | 'en' }) => {
  const t = TEKSTEN[lang];
  const lead = leesLead();
  const isMb = lead.moneybird === 'ja';
  const stap1Pad = lang === 'en' ? '/en/slim-chatbot' : '/slim-chatbot';
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
    offerteTekstOnder: '',
    extraOpmerkingen: '',
    viaMail: 'ja',
    moneybirdToken: ''
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
    formDataToSubmit.append('extraOpmerkingen', formData.extraOpmerkingen);
    formDataToSubmit.append('viaMail', formData.viaMail);
    formDataToSubmit.append('moneybirdToken', formData.moneybirdToken.trim());
    // koppeling aan stap 1 (zelfde browser): e-mail en telefoon uit sessionStorage
    formDataToSubmit.append('email', lead.email || '');
    formDataToSubmit.append('telefoon', lead.telefoon || '');
    formDataToSubmit.append('taal', lang);
    formDataToSubmit.append('moneybird', lead.moneybird || '');

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
      name: t.t1,
      image: '/Template 1.png'
    },
    {
      id: 'template2',
      name: t.t2,
      image: '/Template 2.png'
    },
    {
      id: 'template3',
      name: t.t3,
      image: '/Template 3.png'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            to={stap1Pad}
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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {t.titel} <span className="text-blue-600">{t.accent}</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              {isMb ? t.subMb : t.sub}
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
                  <span className="text-green-600 font-medium">{t.stap1}</span>
                </div>
                <div className="w-12 h-0.5 bg-blue-600"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <span className="text-blue-600 font-medium">{t.stap2}</span>
                </div>
              </div>
              
              {/* Mobile: show only current step */}
              <div className="sm:hidden">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <span className="text-blue-600 font-medium">{t.stap2}</span>
                </div>
              </div>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
                {/* Hidden form name field for Netlify */}
                <input type="hidden" name="form-name" value="slim-chatbot-instellingen" />

                {isMb && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4">{t.mbKop}</h3>
                    <p className="text-gray-700 leading-relaxed">{t.mbUitleg1}</p>
                    <p className="text-gray-700 leading-relaxed">{t.mbUitleg2}</p>
                    <div>
                      <label htmlFor="moneybirdToken" className="block text-sm font-semibold text-gray-900 mb-2">{t.mbToken}</label>
                      <input type="text" id="moneybirdToken" name="moneybirdToken" value={formData.moneybirdToken} onChange={handleInputChange} placeholder={t.phToken} autoComplete="off" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400 font-mono text-sm" />
                    </div>
                  </div>
                )}

                {/* Bedrijfsgegevens (alleen zonder Moneybird; daar staan ze al in de administratie) */}
                {!isMb && (<>
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4">
                    {t.bedrijfKop}
                  </h3>
                  
                  <div>
                    <label htmlFor="website" className="block text-sm font-semibold text-gray-900 mb-2">
                      {t.website}
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
                        {t.kvk}
                      </label>
                      <input
                        type="text"
                        id="kvkNummer"
                        name="kvkNummer"
                        value={formData.kvkNummer}
                        onChange={handleInputChange}
                        placeholder="12345678"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                        required={!isMb}
                      />
                    </div>

                    <div>
                      <label htmlFor="btwNummer" className="block text-sm font-semibold text-gray-900 mb-2">
                        {t.btw}
                      </label>
                      <input
                        type="text"
                        id="btwNummer"
                        name="btwNummer"
                        value={formData.btwNummer}
                        onChange={handleInputChange}
                        placeholder="NL123456789B01"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                        required={!isMb}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="iban" className="block text-sm font-semibold text-gray-900 mb-2">
                        {t.iban}
                      </label>
                      <input
                        type="text"
                        id="iban"
                        name="iban"
                        value={formData.iban}
                        onChange={handleInputChange}
                        placeholder="NL91 ABNA 0417 1643 00"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                        required={!isMb}
                      />
                    </div>

                    <div>
                      <label htmlFor="rekeningTnv" className="block text-sm font-semibold text-gray-900 mb-2">
                        {t.tnv}
                      </label>
                      <input
                        type="text"
                        id="rekeningTnv"
                        name="rekeningTnv"
                        value={formData.rekeningTnv}
                        onChange={handleInputChange}
                        placeholder="Jouw Bedrijfsnaam"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                        required={!isMb}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="adres" className="block text-sm font-semibold text-gray-900 mb-2">
                        {t.adres}
                      </label>
                      <input
                        type="text"
                        id="adres"
                        name="adres"
                        value={formData.adres}
                        onChange={handleInputChange}
                        placeholder="Straatnaam 123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                        required={!isMb}
                      />
                    </div>

                    <div>
                      <label htmlFor="postcode" className="block text-sm font-semibold text-gray-900 mb-2">
                        {t.postcode}
                      </label>
                      <input
                        type="text"
                        id="postcode"
                        name="postcode"
                        value={formData.postcode}
                        onChange={handleInputChange}
                        placeholder="1234 AB"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                        required={!isMb}
                      />
                    </div>

                    <div>
                      <label htmlFor="plaats" className="block text-sm font-semibold text-gray-900 mb-2">
                        {t.plaats}
                      </label>
                      <input
                        type="text"
                        id="plaats"
                        name="plaats"
                        value={formData.plaats}
                        onChange={handleInputChange}
                        placeholder="Amsterdam"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                        required={!isMb}
                      />
                    </div>
                  </div>
                </div>

                {/* Factuur instellingen */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4">
                    {t.factuurKop}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="betalingstermijn" className="block text-sm font-semibold text-gray-900 mb-2">
                        {t.termijn}
                      </label>
                      <select
                        id="betalingstermijn"
                        name="betalingstermijn"
                        value={formData.betalingstermijn}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        required={!isMb}
                      >
                        <option value="7">7 {t.dagen}</option>
                        <option value="14">14 {t.dagen}</option>
                        <option value="30">30 {t.dagen}</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="geldigheidOffertes" className="block text-sm font-semibold text-gray-900 mb-2">
                        {t.geldig}
                      </label>
                      <select
                        id="geldigheidOffertes"
                        name="geldigheidOffertes"
                        value={formData.geldigheidOffertes}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        required={!isMb}
                      >
                        <option value="14">14 {t.dagen}</option>
                        <option value="30">30 {t.dagen}</option>
                        <option value="60">60 {t.dagen}</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="prijzenInclBtw" className="block text-sm font-semibold text-gray-900 mb-2">
                        {t.prijzen}
                      </label>
                      <select
                        id="prijzenInclBtw"
                        name="prijzenInclBtw"
                        value={formData.prijzenInclBtw}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        required={!isMb}
                      >
                        <option value="excl">{t.excl}</option>
                        <option value="incl">{t.incl}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="viaMail" className="block text-sm font-semibold text-gray-900 mb-2">{t.viaMail}</label>
                    <select id="viaMail" name="viaMail" value={formData.viaMail} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" required>
                      <option value="ja">{t.viaMailJa}</option>
                      <option value="nee">{t.viaMailNee}</option>
                    </select>
                  </div>
                </div>

                {/* Template keuze */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4">
                    {t.templateKop}
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
                    {t.tekstenKop}
                  </h3>

                  <div>
                    <label htmlFor="betalingsvoorwaarden" className="block text-sm font-semibold text-gray-900 mb-2">
                      {t.voorwaarden}
                    </label>
                    <textarea
                      id="betalingsvoorwaarden"
                      name="betalingsvoorwaarden"
                      value={formData.betalingsvoorwaarden}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder={t.phVoorwaarden}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="offerteTekstBoven" className="block text-sm font-semibold text-gray-900 mb-2">
                      {t.tekstBoven}
                    </label>
                    <textarea
                      id="offerteTekstBoven"
                      name="offerteTekstBoven"
                      value={formData.offerteTekstBoven}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder={t.phBoven}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="offerteTekstOnder" className="block text-sm font-semibold text-gray-900 mb-2">
                      {t.tekstOnder}
                    </label>
                    <textarea
                      id="offerteTekstOnder"
                      name="offerteTekstOnder"
                      value={formData.offerteTekstOnder}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder={t.phOnder}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none placeholder-gray-400"
                    />
                  </div>
                </div>

                </>)}

                {/* Extra opmerkingen */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4">
                    {t.extraKop}
                  </h3>

                  <div>
                    <label htmlFor="extraOpmerkingen" className="block text-sm font-semibold text-gray-900 mb-2">
                      {t.extra}
                    </label>
                    <textarea
                      id="extraOpmerkingen"
                      name="extraOpmerkingen"
                      value={formData.extraOpmerkingen}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder={t.phExtra}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none placeholder-gray-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {t.opslaan}
                </button>
              </form>
            ) : (
              <div className="max-w-xl mx-auto text-center">
                <div className="bg-green-50 rounded-2xl p-8 border border-green-200">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {t.bedankt}
                  </h3>
                  <p className="text-lg text-gray-700 mb-6">
                    {isMb ? t.klaarMb : t.klaar}
                  </p>
                  
                  <Link
                    to="/"
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl inline-block"
                  >
                    {t.home}
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