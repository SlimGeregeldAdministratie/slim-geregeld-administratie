import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Clock, CheckCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const IntakeForm = () => {
  const navigate = useNavigate();
  const { section } = useParams<{ section?: string }>();
  const [currentSection, setCurrentSection] = useState(section ? parseInt(section) : 0);
  const [navigationHistory, setNavigationHistory] = useState<number[]>([0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Section 1 - Personal and Business Info
    fullName: '',
    birthDate: '',
    businessName: '',
    legalForm: '',
    legalFormOther: '',
    businessEmail: '',
    phoneNumber: '',
    website: '',
    currentBookkeeping: '',
    currentBookkeepingOther: '',

    // Section 2 - Document Upload Check
    sentInvoiceBefore: '',

    // Section 3 - Document Upload (if yes)
    documentsForwarded: '',
    documentsForwardedOther: '',
    changesNeeded: '',
    vatNumber: '',

    // Section 4 - Business Details for Invoices
    kvkNumber: '',
    btwNumber: '',
    businessIban: '',
    paymentTerm: '',
    paymentTermOther: '',
    invoicingMethodUsual: '',
    invoicingMethodUsualOther: '',
    personalizeText: '',

    // Section 5 - Message Personalization
    paymentTermsText: '',
    invoiceEmailText: '',
    quoteHeaderText: '',
    quoteFooterText: '',
    quoteEmailText: '',

    // Section 6 - Moneybird Setup
    moneybirdAccountSetup: '',
    moneybirdAccountSetupOther: '',
    kvkVerification: '',
    kvkVerificationOther: '',
    moneybirdLicense: '',
    moneybirdLicenseOther: '',
    moneybirdAppDownloaded: '',
    moneybirdAppDownloadedOther: '',

    // Section 7-10 - Data Transfer sections
    transferMethod: '',
    accessConfirmation: '',
    accessConfirmationOther: '',
    outstandingInvoices: '',
    outstandingInvoicesOther: '',
    bankBalance: '',
    bankBalanceOther: '',
    btwPosition: '',
    btwPositionOther: '',
    balanceSheet: '',
    balanceSheetOther: '',
    customerSupplierList: '',
    customerSupplierListOther: '',
    moneybirdBookkeeperAccess: '',
    moneybirdBookkeeperAccessOther: '',
    apiToken: '',
    moneybirdAppDownloadedExisting: '',
    moneybirdAppDownloadedExistingOther: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (section) {
      const sectionNum = parseInt(section);
      if (!isNaN(sectionNum) && sectionNum >= 0 && sectionNum <= 10) {
        setCurrentSection(sectionNum);
        if (navigationHistory[navigationHistory.length - 1] !== sectionNum) {
          setNavigationHistory([...navigationHistory, sectionNum]);
        }
      }
    }
  }, [section]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formElement = e.target as HTMLFormElement;
      const formDataToSend = new FormData(formElement);

      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formDataToSend as any).toString()
      });

      navigate('/bedankt');
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Er ging iets mis bij het verzenden. Probeer het opnieuw.');
      setIsSubmitting(false);
    }
  };

  const validateCurrentSection = () => {
    switch (currentSection) {
      case 0:
        return formData.fullName && formData.birthDate && formData.businessName && 
               formData.legalForm && formData.businessEmail && formData.phoneNumber && 
               formData.currentBookkeeping;
      case 1:
        return formData.currentBookkeeping;
      case 2:
        if (formData.sentInvoiceBefore === 'Nee') return true;
        return formData.documentsForwarded && formData.changesNeeded && formData.vatNumber;
      case 3:
        if (formData.sentInvoiceBefore === 'Ja') return true;
        return formData.kvkNumber && formData.btwNumber && formData.businessIban && 
               formData.paymentTerm && formData.invoicingMethodUsual && formData.personalizeText;
      case 4:
        if (formData.personalizeText === 'Nee') return true;
        return formData.paymentTermsText && formData.invoiceEmailText && 
               formData.quoteHeaderText && formData.quoteFooterText && formData.quoteEmailText;
      case 5:
        if (formData.currentBookkeeping === 'Moneybird') return true;
        return formData.moneybirdAccountSetup && formData.kvkVerification && 
               formData.moneybirdLicense && formData.moneybirdAppDownloaded;
      case 6:
        if (formData.currentBookkeeping === 'Moneybird' || formData.currentBookkeeping === 'Nee') return true;
        return formData.transferMethod;
      case 7:
        if (formData.transferMethod !== 'Ik geef jullie (tijdelijk) toegang tot mijn bestaande boekhoudprogramma') return true;
        return formData.accessConfirmation;
      case 8:
        if (formData.transferMethod !== 'Ik verzamel de gegevens zelf en mail ze naar intake.slimgeregeld@gmail.com') return true;
        return formData.outstandingInvoices && formData.bankBalance && formData.btwPosition;
      case 9:
        if (formData.currentBookkeeping !== 'Moneybird') return true;
        return formData.moneybirdBookkeeperAccess && formData.apiToken && formData.moneybirdAppDownloadedExisting;
      case 10:
        return true;
      default:
        return false;
    }
  };


  const handleNext = () => {
    if (!validateCurrentSection()) {
      return;
    }

    let nextSection = currentSection + 1;

    if (currentSection === 0) {
      if (formData.currentBookkeeping === 'Moneybird') {
        nextSection = 9;
      } else {
        nextSection = 1;
      }
    } else if (currentSection === 1) {
      if (formData.sentInvoiceBefore === 'Ja') {
        nextSection = 2;
      } else if (formData.sentInvoiceBefore === 'Nee') {
        nextSection = 3;
      }
    } else if (currentSection === 2) {
      nextSection = 5;
    } else if (currentSection === 3) {
      if (formData.personalizeText === 'Ja') {
        nextSection = 4;
      } else if (formData.personalizeText === 'Nee') {
        nextSection = 5;
      }
    } else if (currentSection === 6) {
      if (formData.transferMethod === 'Ik heb geen bestaande boekhoudprogramma') {
        nextSection = 10;
      } else if (formData.transferMethod === 'Ik geef jullie (tijdelijk) toegang tot mijn bestaande boekhoudprogramma') {
        nextSection = 7;
      } else if (formData.transferMethod === 'Ik verzamel de gegevens zelf en mail ze naar intake.slimgeregeld@gmail.com') {
        nextSection = 8;
      }
    } else if (currentSection === 7 || currentSection === 8) {
      nextSection = 10;
    }

    setNavigationHistory([...navigationHistory, nextSection]);
    navigate(`/intake/${nextSection}`);
    window.scrollTo(0, 0);
  };

  const handlePrevious = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop();
      const prevSection = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      navigate(`/intake/${prevSection}`);
      window.scrollTo(0, 0);
    }
  };

  const calculateProgress = () => {
    return Math.round(((currentSection + 1) / 11) * 100);
  };

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
              <div className="border-t-8 border-blue-600 p-6">
                <h1 className="text-3xl font-normal text-gray-900 mb-4">Intake | Slim Geregeld Administratie</h1>
                <p className="text-sm text-gray-700 mb-4"><strong>Welkom bij Slim Geregeld Administratie!</strong><br />We stellen je een paar korte vragen om jouw administratie goed op te kunnen zetten.</p>
                <div className="flex items-center text-sm text-gray-700 mb-3">
                  <Clock className="h-4 w-4 text-gray-600 mr-2" />
                  <span>Invullen duurt ongeveer 10 - 15 minuten.</span>
                </div>
                <div className="text-sm text-gray-700 mb-2 font-medium">Handig als je het volgende bij de hand hebt:</div>
                <ul className="text-sm text-gray-700 space-y-1 ml-5 list-disc">
                  <li><strong>Toegang tot je e-mail</strong> (om een bestaande factuur/offerte door te sturen)</li>
                  <li>Je <strong>mobiele telefoon</strong> (voor het downloaden van de Moneybird-app)</li>
                  <li>Je <strong>KVK-nummer</strong></li>
                  <li>Je <strong>BTW-nummer</strong></li>
                  <li>Je <strong>zakelijke IBAN</strong></li>
                  <li><strong>Toegang</strong> tot je <strong>huidige boekhoudprogramma</strong> (indien je deze hebt)</li>
                </ul>
                <div className="mt-4 text-sm text-gray-700">
                  <p className="mb-2">We richten jouw administratie efficiënt maar zorgvuldig in, met behulp van AI en automatisering. Hiervoor gebruiken we Moneybird, omdat het een gebruiksvriendelijk boekhoudprogramma is met o.a.:</p>
                  <ul className="ml-5 list-disc space-y-1">
                    <li>Een eerlijke prijs</li>
                    <li>Koppelingen met je bank</li>
                    <li>Automatisch verwerken van facturen, bonnetjes en betalingen</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Wat is je naam? (Voornaam + Achternaam) *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 py-2 focus:border-blue-600 focus:outline-none text-sm"
                  required
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Wat is je geboortedatum? *</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 py-2 focus:border-blue-600 focus:outline-none text-sm"
                  required
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Wat is de naam van je onderneming? *</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 py-2 focus:border-blue-600 focus:outline-none text-sm"
                  required
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Wat is de rechtsvorm van je onderneming? *</label>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="legalForm"
                      value="Eenmanszaak (ZZP)"
                      checked={formData.legalForm === 'Eenmanszaak (ZZP)'}
                      onChange={(e) => handleRadioChange('legalForm', e.target.value)}
                      className="mr-3"
                      required
                    />
                    <span className="text-gray-700 text-sm">Eenmanszaak (ZZP)</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="legalForm"
                      value="Besloten Vennootschap (BV)"
                      checked={formData.legalForm === 'Besloten Vennootschap (BV)'}
                      onChange={(e) => handleRadioChange('legalForm', e.target.value)}
                      className="mr-3"
                    />
                    <span className="text-gray-700 text-sm">Besloten Vennootschap (BV)</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="legalForm"
                      value="Vennootschap onder firma (VOF)"
                      checked={formData.legalForm === 'Vennootschap onder firma (VOF)'}
                      onChange={(e) => handleRadioChange('legalForm', e.target.value)}
                      className="mr-3"
                    />
                    <span className="text-gray-700 text-sm">Vennootschap onder firma (VOF)</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="legalForm"
                      value="Anders…"
                      checked={formData.legalForm === 'Anders…'}
                      onChange={(e) => handleRadioChange('legalForm', e.target.value)}
                      className="mr-3"
                    />
                    <span className="text-gray-700 text-sm">Anders…</span>
                  </label>
                  {formData.legalForm === 'Anders…' && (
                    <div className="ml-6 mt-2">
                      <input
                        type="text"
                        name="legalFormOther"
                        value={formData.legalFormOther}
                        onChange={handleInputChange}
                        placeholder="Typ hier je rechtsvorm"
                        className="w-full border-b border-gray-300 py-2 focus:border-blue-600 focus:outline-none text-sm"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Wat is je zakelijke e-mailadres? *</label>
                <input
                  type="email"
                  name="businessEmail"
                  value={formData.businessEmail}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 py-2 focus:border-blue-600 focus:outline-none text-sm"
                  required
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Wat is je telefoonnummer (WhatsApp)? *</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 py-2 focus:border-blue-600 focus:outline-none text-sm"
                  required
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Wat is je zakelijke website?</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="Sla over als je geen actuele website hebt."
                  className="w-full border-b border-gray-300 py-2 focus:border-blue-600 focus:outline-none text-sm"
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Heb je al een boekhoudprogramma? Zo ja, welke? *</label>
                <div className="space-y-2">
                  {['Nee', 'Moneybird', 'e-Boekhouden.nl', 'Exact Online', 'Rompslomp', 'Tellow', 'SnelStart', 'Informer', 'Silvasoft', 'Visma eAccounting', 'Yuki', 'Anders…'].map((option) => (
                    <label key={option} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="currentBookkeeping"
                        value={option}
                        checked={formData.currentBookkeeping === option}
                        onChange={(e) => handleRadioChange('currentBookkeeping', e.target.value)}
                        className="mr-3"
                        required
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                  {formData.currentBookkeeping === 'Anders…' && (
                    <div className="ml-6 mt-2">
                      <input
                        type="text"
                        name="currentBookkeepingOther"
                        value={formData.currentBookkeepingOther}
                        onChange={handleInputChange}
                        placeholder="Typ hier je boekhoudprogramma"
                        className="w-full border-b border-gray-300 py-2 focus:border-blue-600 focus:outline-none text-sm"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
              <div className="border-t-8 border-blue-600 bg-blue-600 p-4">
                <h2 className="text-xl font-normal text-white flex items-center gap-2">
                  📄 Voorbeelddocument aanleveren
                </h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-700 mb-6">
                  Heb je al eens een factuur of offerte naar een klant gestuurd via de mail?
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-300 p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">Heb je eerder (zelf of via een boekhoudprogramma) een factuur en/of offerte naar een klant gestuurd via de mail? *</label>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="sentInvoiceBefore"
                    value="Ja"
                    checked={formData.sentInvoiceBefore === 'Ja'}
                    onChange={(e) => handleRadioChange('sentInvoiceBefore', e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-gray-700 text-sm">Ja</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="sentInvoiceBefore"
                    value="Nee"
                    checked={formData.sentInvoiceBefore === 'Nee'}
                    onChange={(e) => handleRadioChange('sentInvoiceBefore', e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-gray-700 text-sm">Nee</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
              <div className="border-t-8 border-blue-600 bg-blue-600 p-4">
                <h2 className="text-xl font-normal text-white flex items-center gap-2">
                  📄 Factuur en/of Offerte uploaden (kortere route)
                </h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-700 mb-3">Mooi dat je eerder een factuur of offerte hebt gestuurd naar een klant! Kun je deze mail(s) doorsturen naar <strong>intake.slimgeregeld@gmail.com</strong>?</p>
                <p className="text-sm text-gray-700 mb-2">Door deze met ons te delen, kunnen wij automatisch de volgende dingen voor je overnemen:</p>
                <ul className="text-sm text-gray-700 space-y-1 ml-5 list-disc mb-3">
                  <li>Je bedrijfsgegevens (zoals KVK, BTW en IBAN)</li>
                  <li>Je huisstijl en logo</li>
                  <li>De opmaak van je facturen</li>
                  <li>De teksten die je gebruikt richting klanten via mail en op de factuur</li>
                  <li>Je betalingstermijn</li>
                </ul>
                <p className="text-sm text-gray-600 italic mb-4">Zo kunnen we je Moneybird-account goed instellen zonder dat jij alles opnieuw hoeft in te voeren.</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 mb-2">📧 <strong>Graag je eerdere factuur en/of offerte met ons delen.</strong></p>
                  <p className="text-sm text-gray-700 mb-2">Stuur de e-mail die je eerder naar je klant hebt gestuurd (inclusief bijlage én mailtekst) door naar:</p>
                  <p className="text-blue-600 font-medium text-sm mb-2">📧 intake.slimgeregeld@gmail.com</p>
                  <p className="text-sm text-gray-600 italic">💡 Stuur indien aanwezig zowel factuur als offerte door — dan kunnen we beide teksten en opmaak precies goed overnemen in jouw administratie.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Wat heb je doorgestuurd? *</label>
                <div className="space-y-2">
                  {[
                    'Ik heb alleen een factuur doorgestuurd > gebruik die stijl voor mijn facturen',
                    'Ik heb alleen een offerte doorgestuurd > gebruik die stijl voor mijn offertes',
                    'Ik heb beide doorgestuurd > gebruik die stijl voor mijn facturen én offertes',
                    'Anders…'
                  ].map((option) => (
                    <label key={option} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="documentsForwarded"
                        value={option}
                        checked={formData.documentsForwarded === option}
                        onChange={(e) => handleRadioChange('documentsForwarded', e.target.value)}
                        className="mr-3"
                        required
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                  {formData.documentsForwarded === 'Anders…' && (
                    <div className="ml-6 mt-2">
                      <input
                        type="text"
                        name="documentsForwardedOther"
                        value={formData.documentsForwardedOther}
                        onChange={handleInputChange}
                        placeholder="Typ hier je toelichting"
                        className="w-full border-b border-gray-300 py-2 focus:border-blue-600 focus:outline-none text-sm"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Wil je op basis van het voorbeeld nog iets aanpassen aan je factuur en/of offerte? *</label>
                <textarea
                  name="changesNeeded"
                  value={formData.changesNeeded}
                  onChange={handleInputChange}
                  placeholder="Vul 'Nee' in als alles mag worden overgenomen. Denk aan:
- Bedrijfsgegevens (KvK, btw, IBAN)
- Huisstijl of logo
- Opmaak van facturen/offertes
- Teksten op de factuur of in mails
- Betalingstermijn"
                  rows={6}
                  className="w-full border border-gray-300 rounded p-3 focus:border-blue-600 focus:outline-none text-sm resize-none"
                  required
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Wat is je omzetbelastingnummer? *</label>
                <p className="text-sm text-gray-600 mb-3">Je kunt dit vinden in Mijn Belastingdienst Zakelijk (<a href="https://mijn.belastingdienstzakelijk.nl" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">mijn.belastingdienstzakelijk.nl</a>) onder Omzetbelasting → Overzicht aangiften (rechtsboven).</p>
                <input
                  type="text"
                  name="vatNumber"
                  value={formData.vatNumber || ''}
                  onChange={handleInputChange}
                  placeholder="123456789B01"
                  className="w-full border-b border-gray-300 py-2 focus:border-blue-600 focus:outline-none text-sm"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
              <div className="border-t-8 border-blue-600 bg-blue-600 p-4">
                <h2 className="text-xl font-normal text-white flex items-center gap-2">
                  📋 Gegevens voor je facturen en/of offertes
                </h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-700 mb-4">Om je administratie volledig in te kunnen richten, stellen we je hieronder nog een aantal aanvullende vragen. We vragen onder andere naar:</p>
                <ul className="text-sm text-gray-700 space-y-2 ml-5 list-disc mb-4">
                  <li>Je bedrijfsgegevens (zoals KVK, BTW en IBAN)</li>
                  <li>Je betalingstermijn</li>
                  <li>Je huisstijl en logo</li>
                  <li>De opmaak van je facturen</li>
                  <li>De teksten die je gebruikt richting klanten via mail en op de factuur</li>
                </ul>
                <p className="text-sm text-gray-700">Op basis van jouw antwoorden richten we je facturen en offertes professioneel en persoonlijk in, volledig in jouw stijl binnen Moneybird.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Wat is je KVK nummer? *</label>
                <input
                  type="text"
                  name="kvkNumber"
                  value={formData.kvkNumber}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 py-2 focus:border-blue-600 focus:outline-none text-sm"
                  required
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Wat is je BTW nummer? *</label>
                <input
                  type="text"
                  name="btwNumber"
                  value={formData.btwNumber}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 py-2 focus:border-blue-600 focus:outline-none text-sm"
                  required
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Wat is je zakelijke IBAN? *</label>
                <input
                  type="text"
                  name="businessIban"
                  value={formData.businessIban}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 py-2 focus:border-blue-600 focus:outline-none text-sm"
                  required
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Wat is je standaard betalingstermijn? *</label>
                <div className="space-y-2">
                  {[
                    '7 dagen',
                    '14 dagen',
                    '30 dagen',
                    '60 dagen',
                    'Anders…'
                  ].map((option) => (
                    <label key={option} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="paymentTerm"
                        value={option}
                        checked={formData.paymentTerm === option}
                        onChange={(e) => handleRadioChange('paymentTerm', e.target.value)}
                        className="mr-3"
                        required
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                  {formData.paymentTerm === 'Anders…' && (
                    <div className="ml-6 mt-2">
                      <input
                        type="text"
                        name="paymentTermOther"
                        value={formData.paymentTermOther || ''}
                        onChange={handleInputChange}
                        placeholder="Typ hier je betalingstermijn"
                        className="w-full border-b border-gray-300 py-2 focus:border-blue-600 focus:outline-none text-sm"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Hoe factureer je meestal? (bijvoorbeeld aan particulieren of bedrijven, inclusief of exclusief btw) *</label>
                <div className="space-y-2">
                  {[
                    'Aan bedrijven, exclusief btw',
                    'Aan particulieren, inclusief btw',
                    'Aan beide groepen, exclusief btw',
                    'Aan beide groepen, inclusief btw',
                    'In verband met de KOR, 0% btw',
                    'Anders…'
                  ].map((option) => (
                    <label key={option} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="invoicingMethodUsual"
                        value={option}
                        checked={formData.invoicingMethodUsual === option}
                        onChange={(e) => handleRadioChange('invoicingMethodUsual', e.target.value)}
                        className="mr-3"
                        required
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                  {formData.invoicingMethodUsual === 'Anders…' && (
                    <div className="ml-6 mt-2">
                      <input
                        type="text"
                        name="invoicingMethodUsualOther"
                        value={formData.invoicingMethodUsualOther || ''}
                        onChange={handleInputChange}
                        placeholder="Typ hier hoe je factureert"
                        className="w-full border-b border-gray-300 py-2 focus:border-blue-600 focus:outline-none text-sm"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Wil je dat we de teksten op je facturen en offertes persoonlijk maken? *</label>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="personalizeText"
                      value="Ja"
                      checked={formData.personalizeText === 'Ja'}
                      onChange={(e) => handleRadioChange('personalizeText', e.target.value)}
                      className="mr-3"
                    />
                    <span className="text-gray-700 text-sm">Ja</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="personalizeText"
                      value="Nee"
                      checked={formData.personalizeText === 'Nee'}
                      onChange={(e) => handleRadioChange('personalizeText', e.target.value)}
                      className="mr-3"
                    />
                    <span className="text-gray-700 text-sm">Nee</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
              <div className="border-t-8 border-blue-600 bg-blue-600 p-4">
                <h2 className="text-xl font-normal text-white flex items-center gap-2">
                  ✏️ Factuur- en offerteteksten personaliseren
                </h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-700 mb-3">In deze stap geef je aan welke tekst je wilt gebruiken bij het versturen van een factuur of offerte. Denk aan een persoonlijke aanhef, een korte toelichting, betalingsinformatie of een vriendelijke afsluiting.</p>
                <p className="text-sm text-gray-700 mb-3">Zo zorgen we voor een professionele en herkenbare uitstraling naar je klanten.</p>
                <p className="text-sm text-gray-600 italic">Wil je de standaardtekst gebruiken? Kopieer en plak deze dan als antwoord.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Wat wil je dat er in de betalingsvoorwaarden op je factuur staat? *</label>
                <p className="text-sm text-gray-600 mb-3">Standaardtekst is:</p>
                <div className="border border-gray-200 rounded-lg p-4 mb-3 text-sm text-gray-700">
                  "Wij verzoeken u vriendelijk het bovenstaande bedrag van {'{bedrag}'} voor {'{vervaldatum}'} te voldoen op onze bankrekening onder vermelding van de omschrijving {'{betalingskenmerk}'}.<br />Voor vragen kunt u contact opnemen per e-mail."
                </div>
                <textarea
                  name="paymentTermsText"
                  value={formData.paymentTermsText}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded p-3 focus:border-blue-600 focus:outline-none text-sm resize-none"
                  required
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Wat wil je dat er in de e-mailtekst staat wanneer je een factuur verstuurt? *</label>
                <p className="text-sm text-gray-600 mb-3">Standaardtekst is:</p>
                <div className="border border-gray-200 rounded-lg p-4 mb-3 text-sm text-gray-700">
                  "Geachte {'{naam}'},<br /><br />In de bijlage kunt u factuur {'{factuurnummer}'} voor onze diensten vinden. Wij verzoeken u vriendelijk de factuur voor {'{document.due_date}'} te voldoen.<br /><br />Met vriendelijke groet,<br /><br />{'{bedrijfsnaam}'}"
                </div>
                <textarea
                  name="invoiceEmailText"
                  value={formData.invoiceEmailText}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full border border-gray-300 rounded p-3 focus:border-blue-600 focus:outline-none text-sm resize-none"
                  required
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Wat voor tekst wil je dat er boven je offerteregels staat? *</label>
                <p className="text-sm text-gray-600 mb-3">Standaardtekst is:</p>
                <div className="border border-gray-200 rounded-lg p-4 mb-3 text-sm text-gray-700">
                  "Geachte {'{naam}'},<br /><br />Hierbij ontvangt u van ons de prijsopgave {'{offertenummer}'} voor de onderstaande diensten."
                </div>
                <textarea
                  name="quoteHeaderText"
                  value={formData.quoteHeaderText}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded p-3 focus:border-blue-600 focus:outline-none text-sm resize-none"
                  required
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Wat voor tekst wil je dat er onder je offerteregels staat? *</label>
                <p className="text-sm text-gray-600 mb-3">Standaardtekst is:</p>
                <div className="border border-gray-200 rounded-lg p-4 mb-3 text-sm text-gray-700">
                  "We hopen u hiermee voldoende geïnformeerd te hebben.<br /><br />Met vriendelijke groet,<br /><br />{'{bedrijfsnaam}'}"
                </div>
                <textarea
                  name="quoteFooterText"
                  value={formData.quoteFooterText}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded p-3 focus:border-blue-600 focus:outline-none text-sm resize-none"
                  required
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Wat wil je dat er in de e-mailtekst staat wanneer je een offerte verstuurt? *</label>
                <p className="text-sm text-gray-600 mb-3">Standaardtekst is:</p>
                <div className="border border-gray-200 rounded-lg p-4 mb-3 text-sm text-gray-700">
                  "Geachte {'{naam}'},<br /><br />Hierbij ontvangt u van ons een prijsopgave {'{offertenummer}'} voor onze diensten.<br /><br />Met vriendelijke groet,<br /><br />{'{bedrijfsnaam}'}"
                </div>
                <textarea
                  name="quoteEmailText"
                  value={formData.quoteEmailText}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full border border-gray-300 rounded p-3 focus:border-blue-600 focus:outline-none text-sm resize-none"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
              <div className="border-t-8 border-blue-600 bg-blue-600 p-4">
                <h2 className="text-xl font-normal text-white flex items-center gap-2">
                  ⚙️ Instellingen voor je Moneybird-account
                </h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-700 mb-3">Voor jouw administratie maken we gebruik van Moneybird, zodat alles overzichtelijk en efficiënt wordt ingericht.</p>
                <p className="text-sm text-gray-700">In deze stap vragen we naar jouw voorkeuren voor het account. Je kunt ervoor kiezen dat wij het account voor je aanmaken (aanbevolen) of dat je dit liever zelf doet.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Wil je dat wij je Moneybird-account voor je aanmaken? *</label>
                <p className="text-sm text-gray-600 mb-3">We raden dit wel aan – dat is het snelst geregeld</p>
                <div className="space-y-2">
                  {[
                    'Ja, maak jij het account voor mij aan en geef mij eigenaarstoegang',
                    'Nee, ik maak zelf een account aan en geef jou toegang als boekhouder',
                    'Anders…'
                  ].map((option) => (
                    <label key={option} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="moneybirdAccountSetup"
                        value={option}
                        checked={formData.moneybirdAccountSetup === option}
                        onChange={(e) => handleRadioChange('moneybirdAccountSetup', e.target.value)}
                        className="mr-3"
                        required
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                  {formData.moneybirdAccountSetup === 'Anders…' && (
                    <div className="ml-6 mt-2">
                      <input
                        type="text"
                        name="moneybirdAccountSetupOther"
                        value={formData.moneybirdAccountSetupOther || ''}
                        onChange={handleInputChange}
                        placeholder="Typ hier je voorkeur"
                        className="w-full border-b border-gray-300 py-2 focus:border-blue-600 focus:outline-none text-sm"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Wil je dat we jouw KvK-verificatie regelen in Moneybird? (vereist bij btw-aangifte via Moneybird) *</label>
                <div className="border border-gray-200 rounded-lg p-4 mb-3 text-sm text-gray-700">
                  <p className="mb-2">Binnen 5 werkdagen ontvang je per post een verificatiecode op het bij KvK geregistreerde adres.</p>
                  <p>Deze stap is nodig als je via Moneybird btw-aangifte wilt doen.</p>
                </div>
                <div className="space-y-2">
                  {[
                    'Ja, ik wil btw-aangifte doen vanuit Moneybird (aanrader!)',
                    'Nee, ik zal zelf mijn btw-aangiftes doen',
                    'Anders…'
                  ].map((option) => (
                    <label key={option} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="kvkVerification"
                        value={option}
                        checked={formData.kvkVerification === option}
                        onChange={(e) => handleRadioChange('kvkVerification', e.target.value)}
                        className="mr-3"
                        required
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                  {formData.kvkVerification === 'Anders…' && (
                    <div className="ml-6 mt-2">
                      <input
                        type="text"
                        name="kvkVerificationOther"
                        value={formData.kvkVerificationOther || ''}
                        onChange={handleInputChange}
                        placeholder="Typ hier je voorkeur"
                        className="w-full border-b border-gray-300 py-2 focus:border-blue-600 focus:outline-none text-sm"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Welke Moneybird-licentie past volgens jou het beste bij jouw administratie? *</label>
                <p className="text-sm text-gray-600 mb-3">We koppelen standaard je zakelijke bankrekening aan Moneybird. Dit kost €4 per maand extra.</p>
                <div className="space-y-2">
                  {[
                    'Tot 20 banktransacties p/m = Moneybird €14 + €4 p/m',
                    'Tot 50 banktransacties p/m = Moneybird €25 + €4 p/m',
                    'Onbeperkt banktransacties p/m = Moneybird €35 + €4 p/m',
                    'Ik weet het nog niet / overleg ik graag',
                    'Anders…'
                  ].map((option) => (
                    <label key={option} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="moneybirdLicense"
                        value={option}
                        checked={formData.moneybirdLicense === option}
                        onChange={(e) => handleRadioChange('moneybirdLicense', e.target.value)}
                        className="mr-3"
                        required
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                  {formData.moneybirdLicense === 'Anders…' && (
                    <div className="ml-6 mt-2">
                      <input
                        type="text"
                        name="moneybirdLicenseOther"
                        value={formData.moneybirdLicenseOther || ''}
                        onChange={handleInputChange}
                        placeholder="Typ hier je voorkeur"
                        className="w-full border-b border-gray-300 py-2 focus:border-blue-600 focus:outline-none text-sm"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Heb je de Moneybird-app al geïnstalleerd op je telefoon? Doe dat nu alvast. *</label>
                <div className="border border-gray-200 rounded-lg p-4 mb-3 text-sm text-gray-700">
                  <p className="mb-3">📲 Met de app kun je eenvoudig bonnetjes scannen en je facturen inzien.</p>
                  <ol className="space-y-1 mb-4">
                    <li>1. Ga naar app store</li>
                    <li>2. Zoek naar Moneybird</li>
                    <li>3. Klik op het blauwe logo met vogel</li>
                    <li>4. Download de app</li>
                    <li>5. Log later in met de gegevens die je krijgt van ons</li>
                  </ol>
                  <div className="space-y-2">
                    <p><a href="https://play.google.com/store/apps/details?id=com.moneybird.android&pli=1" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Android</a></p>
                    <p><a href="https://apps.apple.com/nl/app/moneybird-boekhouding/id1169487040" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">iPhone</a></p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    'Ja, ik heb de app (nu) gedownload',
                    'Anders…'
                  ].map((option) => (
                    <label key={option} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="moneybirdAppDownloaded"
                        value={option}
                        checked={formData.moneybirdAppDownloaded === option}
                        onChange={(e) => handleRadioChange('moneybirdAppDownloaded', e.target.value)}
                        className="mr-3"
                        required
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                  {formData.moneybirdAppDownloaded === 'Anders…' && (
                    <div className="ml-6 mt-2">
                      <input
                        type="text"
                        name="moneybirdAppDownloadedOther"
                        value={formData.moneybirdAppDownloadedOther || ''}
                        onChange={handleInputChange}
                        placeholder="Typ hier je toelichting"
                        className="w-full border-b border-gray-300 py-2 focus:border-blue-600 focus:outline-none text-sm"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
              <div className="border-t-8 border-blue-600 bg-blue-600 p-4">
                <h2 className="text-xl font-normal text-white flex items-center gap-2">
                  🔄 Overdracht vanuit je huidige boekhoudpakket
                </h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-700 mb-3">Wil je overstappen van een ander boekhoudprogramma? Dan hebben we enkele gegevens nodig om je administratie volledig en foutloos over te zetten naar Moneybird.</p>
                <p className="text-sm text-gray-700 mb-3">Je hebt twee opties:</p>
                <ul className="text-sm text-gray-700 space-y-2 ml-5 list-disc">
                  <li>Tijdelijk toegang geven tot je oude boekhoudprogramma (aanbevolen – wij regelen alles voor je), of</li>
                  <li>Zelf de benodigde gegevens verzamelen en e-mailen naar intake.slimgeregeld@gmail.com</li>
                </ul>
              </div>
            </div>
            <div className="bg-gray-50 rounded p-4 text-sm text-gray-700 mb-4">
              <h3 className="font-semibold text-gray-900 mb-4">Voor een correcte overdracht ontvangen we graag onderstaande gegevens:</h3>
              <ol className="space-y-3 text-sm text-gray-700">
                <li><strong>1. Verkoop- & inkoopfacturen die op 1 januari 2026 nog openstonden</strong><br />Factuurnummer, datum, bedrag incl. btw, klant/leverancier, betaald/onbetaald</li>
                <li><strong>2. Bankstand per 1 januari 2026</strong><br />Rekeningnummer + saldo per 1 januari 2026 (Je mag dit ook aanleveren via een bankoverzicht of screenshot)</li>
                <li><strong>3. Btw-positie per 31 december 2025</strong><br />Btw-aangifte van Q4 (okt-dec)<br />– Of een balansrapport van 31 december met te betalen/vorderen btw</li>
                <li><strong>4. Begin- of eindbalans per 31 december 2025 (optioneel, maar handig)</strong><br />Balans met activa/passiva (bv. kas, inventaris etc.)</li>
                <li><strong>5. Klanten- of leverancierslijst (optioneel)</strong><br />Naam, e-mail, adres, IBAN (indien van toepassing)</li>
              </ol>
              <p className="text-gray-600 text-sm mt-4">👇 Laat hieronder weten wat jij het liefste doet. Uitleg volgt.</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-300 p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">Hoe wil je de overdracht van je administratie aanleveren? *</label>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="transferMethod"
                    value="Ik heb geen bestaande boekhoudprogramma"
                    checked={formData.transferMethod === 'Ik heb geen bestaande boekhoudprogramma'}
                    onChange={(e) => handleRadioChange('transferMethod', e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-gray-700 text-sm">Ik heb geen bestaande boekhoudprogramma</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="transferMethod"
                    value="Ik geef jullie (tijdelijk) toegang tot mijn bestaande boekhoudprogramma"
                    checked={formData.transferMethod === 'Ik geef jullie (tijdelijk) toegang tot mijn bestaande boekhoudprogramma'}
                    onChange={(e) => handleRadioChange('transferMethod', e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-gray-700 text-sm">Ik geef jullie (tijdelijk) toegang tot mijn bestaande boekhoudprogramma</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="transferMethod"
                    value="Ik verzamel de gegevens zelf en mail ze naar intake.slimgeregeld@gmail.com"
                    checked={formData.transferMethod === 'Ik verzamel de gegevens zelf en mail ze naar intake.slimgeregeld@gmail.com'}
                    onChange={(e) => handleRadioChange('transferMethod', e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-gray-700 text-sm">Ik verzamel de gegevens zelf en mail ze naar intake.slimgeregeld@gmail.com</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
              <div className="border-t-8 border-blue-600 bg-blue-600 p-4">
                <h2 className="text-xl font-normal text-white flex items-center gap-2">
                  ✅ Wij regelen de overdracht voor je
                </h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-700">Als je ons toegang geeft tot je huidige boekhoudprogramma, verzorgen wij de volledige overdracht.</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded p-4 text-sm text-gray-700 mb-4">
              <h3 className="font-semibold text-gray-900 mb-4">De volgende gegevens zullen we exporteren en importeren in je Moneybird omgeving:</h3>
              <ol className="space-y-3 text-sm text-gray-700">
                <li><strong>1. Verkoop- & inkoopfacturen die op 1 januari 2026 nog openstonden</strong><br />Factuurnummer, datum, bedrag incl. btw, klant/leverancier, betaald/onbetaald</li>
                <li><strong>2. Bankstand per 1 januari 2026</strong><br />Rekeningnummer + saldo per 1 januari 2025 (Je mag dit ook aanleveren via een bankoverzicht of screenshot)</li>
                <li><strong>3. Btw-positie per 31 december 2025</strong><br />Btw-aangifte van Q4 (okt-dec)<br />– Of een balansrapport van 31 december met te betalen/vorderen btw</li>
                <li><strong>4. Begin- of eindbalans per 31 december 2025 (optioneel, maar handig)</strong><br />Balans met activa/passiva (bv. kas, inventaris etc.)</li>
                <li><strong>5. Klanten- of leverancierslijst (optioneel)</strong><br />Naam, e-mail, adres, IBAN (indien van toepassing)</li>
              </ol>

              <h3 className="font-semibold text-gray-900 mb-4 mt-6">Graag ons toevoegen aan je bestaande boekhoudprogramma</h3>
              <p className="text-blue-800 mb-3">Log in bij je huidige boekhoudprogramma en voeg ons toe als gebruiker:</p>
              <p className="text-blue-600 font-semibold">intake.slimgeregeld@gmail.com</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-300 p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">Bevestig hieronder of je ons hebt toegevoegd: *</label>
              <div className="space-y-2">
                {[
                  'Ik heb jullie toegevoegd aan mijn administratie op intake.slimgeregeld@gmail.com',
                  'Anders…'
                ].map((option) => (
                  <label key={option} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="accessConfirmation"
                      value={option}
                      checked={formData.accessConfirmation === option}
                      onChange={(e) => handleRadioChange('accessConfirmation', e.target.value)}
                      className="mr-3"
                      required
                    />
                    <span className="text-gray-700 text-sm">{option}</span>
                  </label>
                ))}
                {formData.accessConfirmation === 'Anders…' && (
                  <div className="ml-6 mt-2">
                    <input
                      type="text"
                      name="accessConfirmationOther"
                      value={formData.accessConfirmationOther || ''}
                      onChange={handleInputChange}
                      placeholder="Typ hier je toelichting"
                      className="w-full border-b border-gray-300 py-2 focus:border-blue-600 focus:outline-none text-sm"
                      required
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
              <div className="border-t-8 border-blue-600 bg-blue-600 p-4">
                <h2 className="text-xl font-normal text-white flex items-center gap-2">
                  📧 Je levert de gegevens zelf aan
                </h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-700">Geen probleem! Hieronder zie je welke gegevens je zelf kunt verzamelen en mailen naar intake.slimgeregeld@gmail.com. Je mag alles in één e-mail aanleveren. Neem hier wel even de tijd voor.</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded p-4 text-sm text-gray-700 mb-4">
              <h3 className="font-semibold text-gray-900 mb-4">Graag mailen (CSV, Excel of PDF):</h3>
              <ol className="space-y-3 text-sm text-gray-700">
                <li><strong>1. Verkoop- & inkoopfacturen die op 1 januari 2026 nog openstonden</strong><br />Factuurnummer, datum, bedrag incl. btw, klant/leverancier, betaald/onbetaald</li>
                <li><strong>2. Bankstand per 1 januari 2026</strong><br />Rekeningnummer + saldo per 1 januari 2026 (Je mag dit ook aanleveren via een bankoverzicht of screenshot)</li>
                <li><strong>3. Btw-positie per 31 december 2025</strong><br />Btw-aangifte van Q4 (okt-dec)<br />– Of een balansrapport van 31 december met te betalen/vorderen btw</li>
                <li><strong>4. Begin- of eindbalans per 31 december 2025 (optioneel, maar handig)</strong><br />Balans met activa/passiva (bv. kas, inventaris etc.)</li>
                <li><strong>5. Klanten- of leverancierslijst (optioneel)</strong><br />Naam, e-mail, adres, IBAN (indien van toepassing)</li>
              </ol>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">1. Heb je de verkoop- & inkoopfacturen die op 31 december 2025 nog openstonden kunnen verzamelen? *</label>
                <div className="border border-gray-200 rounded-lg p-4 mb-3 text-sm text-gray-700">
                  <p className="mb-2">Mail het naar:</p>
                  <p className="text-blue-600 font-semibold mb-3">intake.slimgeregeld@gmail.com</p>
                  <p className="mb-2">Lever dit aan als een export uit je boekhoudpakket of een duidelijke lijst. Vermeld daarin:</p>
                  <ul className="space-y-1 mb-3">
                    <li>- Factuurnummer</li>
                    <li>- Datum</li>
                    <li>- Bedrag incl. btw</li>
                    <li>- Klant of leverancier</li>
                    <li>- Betaald/Onbetaald</li>
                  </ul>
                  <p className="font-medium">Let op: stuur zowel openstaande verkoop- als inkoopfacturen mee</p>
                </div>
                <div className="space-y-2">
                  {[
                    'Nee, ik zie dat ik geen openstaande verkoop- & inkoopfacturen had per 31 december',
                    'Ja, ik heb je alle openstaande verkoop- & inkoopfacturen gemaild.',
                    'Anders…'
                  ].map((option) => (
                    <label key={option} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="outstandingInvoices"
                        value={option}
                        checked={formData.outstandingInvoices === option}
                        onChange={(e) => handleRadioChange('outstandingInvoices', e.target.value)}
                        className="mr-3"
                        required
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                  {formData.outstandingInvoices === 'Anders…' && (
                    <div className="ml-6 mt-2">
                      <input
                        type="text"
                        name="outstandingInvoicesOther"
                        value={formData.outstandingInvoicesOther || ''}
                        onChange={handleInputChange}
                        placeholder="Typ hier je toelichting"
                        className="w-full border-b border-gray-300 py-2 focus:border-blue-600 focus:outline-none text-sm"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">2. Heb je een overzicht van je bankstand (saldo) per 31 december 2025? *</label>
                <div className="border border-gray-200 rounded-lg p-4 mb-3 text-sm text-gray-700">
                  <p className="mb-2">Mail het naar:</p>
                  <p className="text-blue-600 font-semibold mb-3">intake.slimgeregeld@gmail.com</p>
                  <p className="mb-2">Je mag dit aanleveren als export uit je boekhouding of als PDF/screenshot uit je bankomgeving. Graag inclusief:</p>
                  <ul className="space-y-1">
                    <li>- Bankrekeningnummer</li>
                    <li>- Saldo per 31 december 2025</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  {[
                    'Ja, ik heb het overzicht van mijn bankstand gemaild.',
                    'Anders…'
                  ].map((option) => (
                    <label key={option} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="bankBalance"
                        value={option}
                        checked={formData.bankBalance === option}
                        onChange={(e) => handleRadioChange('bankBalance', e.target.value)}
                        className="mr-3"
                        required
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                  {formData.bankBalance === 'Anders…' && (
                    <div className="ml-6 mt-2">
                      <input
                        type="text"
                        name="bankBalanceOther"
                        value={formData.bankBalanceOther || ''}
                        onChange={handleInputChange}
                        placeholder="Typ hier je toelichting"
                        className="w-full border-b border-gray-300 py-2 focus:border-blue-600 focus:outline-none text-sm"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">3. Heb je je btw-positie per 31 december 2025 inzichtelijk? *</label>
                <div className="border border-gray-200 rounded-lg p-4 mb-3 text-sm text-gray-700">
                  <p className="mb-2">Mail het naar:</p>
                  <p className="text-blue-600 font-semibold mb-3">intake.slimgeregeld@gmail.com</p>
                  <p className="mb-2">Je kunt kiezen uit één van de volgende opties:</p>
                  <ul className="space-y-1">
                    <li>- De btw-aangifte van Q4 2025 (okt t/m dec)</li>
                    <li>- Of een balansrapport met te betalen / te vorderen btw</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  {[
                    'Ja, ik heb de BTW-aangifte van Q4 of een balansrapport gemaild.',
                    'Anders…'
                  ].map((option) => (
                    <label key={option} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="btwPosition"
                        value={option}
                        checked={formData.btwPosition === option}
                        onChange={(e) => handleRadioChange('btwPosition', e.target.value)}
                        className="mr-3"
                        required
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                  {formData.btwPosition === 'Anders…' && (
                    <div className="ml-6 mt-2">
                      <input
                        type="text"
                        name="btwPositionOther"
                        value={formData.btwPositionOther || ''}
                        onChange={handleInputChange}
                        placeholder="Typ hier je toelichting"
                        className="w-full border-b border-gray-300 py-2 focus:border-blue-600 focus:outline-none text-sm"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">4. Heb je een begin- of eindbalans per 31 december 2025?</label>
                <div className="border border-gray-200 rounded-lg p-4 mb-3 text-sm text-gray-700">
                  <p className="mb-2">Mail het naar:</p>
                  <p className="text-blue-600 font-semibold mb-3">intake.slimgeregeld@gmail.com</p>
                  <p>Bijvoorbeeld een balansrapport met activa en passiva uit je boekhoudprogramma. Denk aan kasgeld, inventaris, etc.</p>
                </div>
                <div className="space-y-2">
                  {[
                    'Ja, ik heb je een begin- of eindbalans per 31 december gemaild.',
                    'Nee, deze kan ik niet vinden en mail ik niet.',
                    'Anders…'
                  ].map((option) => (
                    <label key={option} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="balanceSheet"
                        value={option}
                        checked={formData.balanceSheet === option}
                        onChange={(e) => handleRadioChange('balanceSheet', e.target.value)}
                        className="mr-3"
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                  {formData.balanceSheet === 'Anders…' && (
                    <div className="ml-6 mt-2">
                      <input
                        type="text"
                        name="balanceSheetOther"
                        value={formData.balanceSheetOther || ''}
                        onChange={handleInputChange}
                        placeholder="Typ hier je toelichting"
                        className="w-full border-b border-gray-300 py-2 focus:border-blue-600 focus:outline-none text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">5. Heb je een klanten- of leverancierslijst die vaak terugkomt?</label>
                <div className="border border-gray-200 rounded-lg p-4 mb-3 text-sm text-gray-700">
                  <p className="mb-2">Mail het naar:</p>
                  <p className="text-blue-600 font-semibold mb-3">intake.slimgeregeld@gmail.com</p>
                  <p>Stuur een lijst met namen, e-mailadressen, adressen en (indien beschikbaar) IBAN van vaste klanten of leveranciers.</p>
                </div>
                <div className="space-y-2">
                  {[
                    'Ja, ik heb alle relevante contacten gemaild.',
                    'Nee, deze kan ik niet vinden en mail ik niet.',
                    'Anders…'
                  ].map((option) => (
                    <label key={option} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="customerSupplierList"
                        value={option}
                        checked={formData.customerSupplierList === option}
                        onChange={(e) => handleRadioChange('customerSupplierList', e.target.value)}
                        className="mr-3"
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                  {formData.customerSupplierList === 'Anders…' && (
                    <div className="ml-6 mt-2">
                      <input
                        type="text"
                        name="customerSupplierListOther"
                        value={formData.customerSupplierListOther || ''}
                        onChange={handleInputChange}
                        placeholder="Typ hier je toelichting"
                        className="w-full border-b border-gray-300 py-2 focus:border-blue-600 focus:outline-none text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
              <div className="border-t-8 border-blue-600 bg-blue-600 p-4">
                <h2 className="text-xl font-normal text-white flex items-center gap-2">
                  🐦 Je werkt al met Moneybird
                </h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-700 mb-3">Goed om te zien dat je al met Moneybird werkt!</p>
                <p className="text-sm text-gray-700 mb-3">Om je administratie goed over te nemen en optimaal in te richten, hebben we toegang tot je Moneybird-account nodig. Daarnaast vragen we om een API-token, zodat Slim (onze WhatsApp-chatbot) gekoppeld kan worden.</p>
                <p className="text-sm text-gray-700 mb-3">✅ Met deze gegevens kunnen we automatisch facturen opstellen, bonnetjes verwerken en instellingen automatiseren.</p>
                <p className="text-sm text-gray-700">🔐 We hebben uitsluitend toegang tot onderdelen die nodig zijn voor het beheer van jouw administratie. Je behoudt altijd de controle.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Heb je ons al toegevoegd als boekhouder in jouw Moneybird-account? *</label>
                <div className="border border-gray-200 rounded-lg p-4 mb-3 text-sm text-gray-700">
                  <p className="mb-2">Voeg mij toe via:</p>
                  <p className="mb-2">Instellingen &gt; Beheer jouw administratie &gt; Gebruikers &gt; Gebruiker uitnodigen &gt; Boekhouder</p>
                  <p className="text-blue-600 font-semibold mb-3">E-mailadres: kyle@slim-geregeld.nl</p>
                  <p>Selecteer jouw administratie en wijs ons de rol 'Boekhouder' toe.</p>
                </div>
                <div className="space-y-2">
                  {[
                    'Ja, ik heb je (nu) toegevoegd',
                    'Anders…'
                  ].map((option) => (
                    <label key={option} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="moneybirdBookkeeperAccess"
                        value={option}
                        checked={formData.moneybirdBookkeeperAccess === option}
                        onChange={(e) => handleRadioChange('moneybirdBookkeeperAccess', e.target.value)}
                        className="mr-3"
                        required
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                  {formData.moneybirdBookkeeperAccess === 'Anders…' && (
                    <div className="ml-6 mt-2">
                      <input
                        type="text"
                        name="moneybirdBookkeeperAccessOther"
                        value={formData.moneybirdBookkeeperAccessOther || ''}
                        onChange={handleInputChange}
                        placeholder="Typ hier je toelichting"
                        className="w-full border-b border-gray-300 py-2 focus:border-blue-600 focus:outline-none text-sm"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Kun je een API-token aanmaken in je Moneybird-account en hieronder invullen? *</label>
                <div className="border border-gray-200 rounded-lg p-4 mb-3 text-sm text-gray-700">
                  <p className="mb-3">Een API-token kun je zelf aanmaken via:</p>
                  <ol className="space-y-1 mb-3">
                    <li>1. Instellingen &gt; Uitbreidingen &gt; Externe applicaties &gt; API token aanmaken</li>
                    <li>2. Geef het een naam en toegang tot alle onderdelen &gt; dan opslaan.</li>
                    <li>3. Kopieer de API token en plaats hieronder.</li>
                  </ol>
                  <p className="mb-2">Voorbeeld van API token =</p>
                  <p className="font-mono text-xs">e30_VC4nT3Q387dL6RCQy0QQszj2dxf5OeyKZF8PPuc</p>
                </div>
                <input
                  type="text"
                  name="apiToken"
                  value={formData.apiToken}
                  onChange={handleInputChange}
                  placeholder="Plak hier je API token"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  required
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Heb je de Moneybird-app al gedownload op je telefoon? Doe dat nu alvast. *</label>
                <div className="border border-gray-200 rounded-lg p-4 mb-3 text-sm text-gray-700">
                  <p className="mb-3">📲 Met de app kun je eenvoudig bonnetjes scannen en je facturen inzien.</p>
                  <ol className="space-y-1 mb-4">
                    <li>1. Ga naar app store</li>
                    <li>2. Zoek naar Moneybird</li>
                    <li>3. Klik op het blauwe logo met vogel</li>
                    <li>4. Download de app</li>
                    <li>5. Je kunt inloggen met je bestaande Moneybird-gegevens</li>
                  </ol>
                  <div className="space-y-2">
                    <p><a href="https://play.google.com/store/apps/details?id=com.moneybird.android&pli=1" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Android</a></p>
                    <p><a href="https://apps.apple.com/nl/app/moneybird-boekhouding/id1169487040" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">iPhone</a></p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    'Ja, ik heb de app (nu) gedownload',
                    'Anders…'
                  ].map((option) => (
                    <label key={option} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="moneybirdAppDownloadedExisting"
                        value={option}
                        checked={formData.moneybirdAppDownloadedExisting === option}
                        onChange={(e) => handleRadioChange('moneybirdAppDownloadedExisting', e.target.value)}
                        className="mr-3"
                        required
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                  {formData.moneybirdAppDownloadedExisting === 'Anders…' && (
                    <div className="ml-6 mt-2">
                      <input
                        type="text"
                        name="moneybirdAppDownloadedExistingOther"
                        value={formData.moneybirdAppDownloadedExistingOther || ''}
                        onChange={handleInputChange}
                        placeholder="Typ hier je toelichting"
                        className="w-full border-b border-gray-300 py-2 focus:border-blue-600 focus:outline-none text-sm"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 10:
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
              <div className="border-t-8 border-blue-600 bg-blue-600 p-4">
                <h2 className="text-xl font-normal text-white flex items-center gap-2">
                  🎯 Wat zijn de vervolgstappen?
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="border-l-4 border-blue-600 bg-gray-50 rounded p-4">
                  <p className="text-gray-900 mb-2 font-semibold">Binnen 5 werkdagen is jouw administratie volledig ingericht in Moneybird.</p>
                  <p className="text-gray-700 text-sm">Heb je zelf nog geen Moneybird-account? Dan maken wij dat voor je aan. Je ontvangt je persoonlijke inloggegevens zodra alles klaarstaat.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-300 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Tegelijk krijg je toegang tot Slim, onze WhatsApp AI-chatbot. Daarmee kun je via WhatsApp eenvoudig:</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Klanten toevoegen aan je administratie</li>
                <li>• Facturen en/of offertes opmaken</li>
                <li>• Inkoopfacturen en bonnetjes verwerken (met duidelijke instructies)</li>
                <li>• Vragen stellen over je administratie of belasting</li>
                <li>• Direct in contact komen met Kyle voor hulp of overleg</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg border border-gray-300 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Wat moet je daarna nog zelf doen?</h3>
              <p className="text-gray-700 mb-3 text-sm">Je betalingsgegevens + bankrekening koppelen aan Moneybird en je KvK verifiëren. Geen zorgen — binnen diezelfde 5 werkdagen ontvang je van ons een korte video waarin precies wordt uitgelegd hoe je dat doet.</p>
              <p className="text-gray-700 text-sm">Alles is zo ingericht dat jij zo min mogelijk hoeft te doen — wij regelen het slim.</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-300 p-6">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Bijna klaar!</h3>
                <p className="text-gray-700 mb-4 text-sm">Je hebt alle vragen beantwoord. Vergeet niet om hieronder op <strong>"Verstuur formulier"</strong> te klikken om je gegevens aan ons door te sturen.</p>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700 text-sm"><strong>Let op:</strong> Pas nadat je op "Verstuur formulier" hebt geklikt ontvangen wij je gegevens en kunnen we aan de slag!</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors mb-2 text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Terug naar homepage</span>
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form
          name="intake"
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Hidden form name field for Netlify */}
          <input type="hidden" name="form-name" value="intake" />
          
          {/* Honeypot field to prevent spam */}
          <div style={{ display: 'none' }}>
            <label>
              Don't fill this out if you're human: 
              <input name="bot-field" />
            </label>
          </div>

          {/* Hidden fields for all form data */}
          <input type="hidden" name="fullName" value={formData.fullName} />
          <input type="hidden" name="birthDate" value={formData.birthDate} />
          <input type="hidden" name="businessName" value={formData.businessName} />
          <input type="hidden" name="legalForm" value={formData.legalForm} />
          <input type="hidden" name="legalFormOther" value={formData.legalFormOther} />
          <input type="hidden" name="businessEmail" value={formData.businessEmail} />
          <input type="hidden" name="phoneNumber" value={formData.phoneNumber} />
          <input type="hidden" name="website" value={formData.website} />
          <input type="hidden" name="currentBookkeeping" value={formData.currentBookkeeping} />
          <input type="hidden" name="currentBookkeepingOther" value={formData.currentBookkeepingOther} />
          <input type="hidden" name="sentInvoiceBefore" value={formData.sentInvoiceBefore} />
          <input type="hidden" name="documentsForwarded" value={formData.documentsForwarded} />
          <input type="hidden" name="documentsForwardedOther" value={formData.documentsForwardedOther} />
          <input type="hidden" name="changesNeeded" value={formData.changesNeeded} />
          <input type="hidden" name="vatNumber" value={formData.vatNumber} />
          <input type="hidden" name="kvkNumber" value={formData.kvkNumber} />
          <input type="hidden" name="btwNumber" value={formData.btwNumber} />
          <input type="hidden" name="businessIban" value={formData.businessIban} />
          <input type="hidden" name="paymentTerm" value={formData.paymentTerm} />
          <input type="hidden" name="paymentTermOther" value={formData.paymentTermOther} />
          <input type="hidden" name="invoicingMethodUsual" value={formData.invoicingMethodUsual} />
          <input type="hidden" name="invoicingMethodUsualOther" value={formData.invoicingMethodUsualOther} />
          <input type="hidden" name="personalizeText" value={formData.personalizeText} />
          <input type="hidden" name="paymentTermsText" value={formData.paymentTermsText} />
          <input type="hidden" name="invoiceEmailText" value={formData.invoiceEmailText} />
          <input type="hidden" name="quoteHeaderText" value={formData.quoteHeaderText} />
          <input type="hidden" name="quoteFooterText" value={formData.quoteFooterText} />
          <input type="hidden" name="quoteEmailText" value={formData.quoteEmailText} />
          <input type="hidden" name="moneybirdAccountSetup" value={formData.moneybirdAccountSetup} />
          <input type="hidden" name="moneybirdAccountSetupOther" value={formData.moneybirdAccountSetupOther} />
          <input type="hidden" name="kvkVerification" value={formData.kvkVerification} />
          <input type="hidden" name="kvkVerificationOther" value={formData.kvkVerificationOther} />
          <input type="hidden" name="moneybirdLicense" value={formData.moneybirdLicense} />
          <input type="hidden" name="moneybirdLicenseOther" value={formData.moneybirdLicenseOther} />
          <input type="hidden" name="moneybirdAppDownloaded" value={formData.moneybirdAppDownloaded} />
          <input type="hidden" name="moneybirdAppDownloadedOther" value={formData.moneybirdAppDownloadedOther} />
          <input type="hidden" name="transferMethod" value={formData.transferMethod} />
          <input type="hidden" name="accessConfirmation" value={formData.accessConfirmation} />
          <input type="hidden" name="accessConfirmationOther" value={formData.accessConfirmationOther} />
          <input type="hidden" name="outstandingInvoices" value={formData.outstandingInvoices} />
          <input type="hidden" name="outstandingInvoicesOther" value={formData.outstandingInvoicesOther} />
          <input type="hidden" name="bankBalance" value={formData.bankBalance} />
          <input type="hidden" name="bankBalanceOther" value={formData.bankBalanceOther} />
          <input type="hidden" name="btwPosition" value={formData.btwPosition} />
          <input type="hidden" name="btwPositionOther" value={formData.btwPositionOther} />
          <input type="hidden" name="balanceSheet" value={formData.balanceSheet} />
          <input type="hidden" name="balanceSheetOther" value={formData.balanceSheetOther} />
          <input type="hidden" name="customerSupplierList" value={formData.customerSupplierList} />
          <input type="hidden" name="customerSupplierListOther" value={formData.customerSupplierListOther} />
          <input type="hidden" name="moneybirdBookkeeperAccess" value={formData.moneybirdBookkeeperAccess} />
          <input type="hidden" name="moneybirdBookkeeperAccessOther" value={formData.moneybirdBookkeeperAccessOther} />
          <input type="hidden" name="apiToken" value={formData.apiToken} />
          <input type="hidden" name="moneybirdAppDownloadedExisting" value={formData.moneybirdAppDownloadedExisting} />
          <input type="hidden" name="moneybirdAppDownloadedExistingOther" value={formData.moneybirdAppDownloadedExistingOther} />

          {/* Current Section Content */}
          {renderSection()}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
            {currentSection > 0 ? (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-2 text-blue-600 hover:bg-blue-50 rounded font-medium text-sm transition-colors"
              >
                Vorige
              </button>
            ) : (
              <div></div>
            )}

            {currentSection < 10 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!validateCurrentSection()}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Volgende
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Verzenden...' : 'Verstuur formulier'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default IntakeForm;
