import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Upload, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FormData, initialFormData } from './TaxForm2024/types';

const TaxForm2024 = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentSection]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const showSelfFields = (fieldName: keyof FormData): boolean => {
    const value = formData[fieldName];
    return value === 'Ja, beide' || value === 'Ja, alleen ik' || value === 'Ja';
  };

  const showPartnerFields = (fieldName: keyof FormData): boolean => {
    const value = formData[fieldName];
    return (value === 'Ja, beide' || value === 'Ja, alleen mijn partner') && formData.hasPartner === 'Ja';
  };

  const shouldShowSection = (sectionId: number): boolean => {
    switch (sectionId) {
      case 2: return formData.hasPartner === 'Ja';
      case 4: return formData.hasChildren === 'Ja';
      case 6: return formData.livedInNL === 'Nee';
      case 8: return formData.has30PercentRuling === 'Ja';
      case 10: return formData.hasEmploymentIncome === 'Ja';
      case 12: return formData.hasBusinessIncome !== 'Nee';
      case 14: return formData.hasFreelanceIncome !== 'Nee';
      case 16: return formData.hasSocialBenefits !== 'Nee';
      case 18: return formData.hasPensionIncome !== 'Nee';
      case 20: return formData.receivesAlimony !== 'Nee';
      case 22: return formData.hasSubstantialInterest !== 'Nee';
      case 24: return formData.hasAssets !== 'Nee';
      case 26: return formData.hasOwnHome !== 'Nee';
      default: return true;
    }
  };

  const getNextSection = (current: number): number => {
    let next = current + 1;
    while (next < 30 && !shouldShowSection(next)) {
      next++;
    }
    return next;
  };

  const getPreviousSection = (current: number): number => {
    let prev = current - 1;
    while (prev >= 0 && !shouldShowSection(prev)) {
      prev--;
    }
    return prev;
  };

  const handleNext = () => {
    const nextSection = getNextSection(currentSection);
    setCurrentSection(nextSection);
  };

  const handlePrevious = () => {
    const prevSection = getPreviousSection(currentSection);
    if (prevSection >= 0) {
      setCurrentSection(prevSection);
    }
  };

  const handleSubmit = async () => {
    if (formData.truthfulDeclaration !== 'Ja') {
      alert('U moet bevestigen dat u alles naar waarheid heeft ingevuld.');
      return;
    }

    console.log('Form submitted:', formData);
    navigate('/bedankt');
  };

  const renderInput = (name: keyof FormData, label: string, required = false, type = 'text', placeholder = '') => (
    <div className="bg-white rounded-lg border border-gray-300 p-6">
      <label className="block text-sm font-semibold text-gray-900 mb-3">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name] as string}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required={required}
      />
    </div>
  );

  const renderTextArea = (name: keyof FormData, label: string, placeholder = '', rows = 4) => (
    <div className="bg-white rounded-lg border border-gray-300 p-6">
      <label className="block text-sm font-semibold text-gray-900 mb-3">{label}</label>
      <textarea
        name={name}
        value={formData[name] as string}
        onChange={handleInputChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full border border-gray-300 rounded p-3 focus:border-blue-600 focus:outline-none text-sm resize-none"
      />
    </div>
  );

  const renderRadio = (name: keyof FormData, options: { value: string; label: string }[], required = false) => (
    <div className="space-y-3">
      {options.map((option) => (
        <label key={option.value} className="flex items-center cursor-pointer group">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={formData[name] === option.value}
            onChange={handleInputChange}
            required={required}
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          <span className="ml-3 text-gray-900 text-sm font-medium group-hover:text-blue-600 transition-colors">{option.label}</span>
        </label>
      ))}
    </div>
  );

  const sections = [
    {
      id: 0,
      title: 'Inkomstenbelasting 2024',
      subtitle: 'Welkom bij het Inkomstenbelasting 2024 formulier',
      render: () => (
        <div className="bg-white rounded-lg border border-gray-300 p-6 space-y-4">
          <p className="text-sm text-gray-700">
            Op basis van uw antwoorden tonen we alleen de vragen die voor uw situatie relevant zijn
            (loondienst, zzp/onderneming, eigen woning, partner/kinderen, box 2/3, buitenlands inkomen/vermogen).
          </p>
          <p className="text-sm text-gray-700">
            Houd — voor zover van toepassing — gereed: jaaropgaven 2024, aanslag/IB 2023, WOZ + hypotheekoverzicht 2024,
            jaarrekening of w&v + balans (zzp), bank/beleggings-jaaroverzichten (per 1-1-2024) en eventuele bewijsstukken
            (giften, zorgkosten, dividend, etc.).
          </p>
          <div className="border-l-4 border-blue-600 bg-gray-50 rounded p-4">
            <p className="text-sm text-blue-800">
              <strong>Invultijd:</strong> circa 25–45 minuten afhankelijk van uw situatie.
            </p>
          </div>
          <p className="text-sm text-gray-700">
            Wij behandelen uw gegevens vertrouwelijk en dienen pas in na uw akkoord op het concept.
          </p>
        </div>
      )
    },
    {
      id: 1,
      title: 'Persoonlijke en Gezinsgegevens',
      subtitle: 'Deze sectie verzamelt algemene gegevens over uw persoonlijke situatie.',
      render: () => (
        <>
          {renderInput('fullName', 'Volledige naam', true)}
          {renderInput('birthDate', 'Geboortedatum', true, 'date')}
          {renderInput('bsn', 'Burgerservicenummer (BSN)', true)}
          {renderInput('address', 'Adres', true)}
          {renderInput('email', 'E-mailadres', true, 'email')}
          {renderInput('phone', 'Telefoonnummer')}
          <div className="bg-white rounded-lg border border-gray-300 p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Heeft u een fiscale partner? <span className="text-red-500">*</span>
            </label>
            {renderRadio('hasPartner', [
              { value: 'Ja', label: 'Ja' },
              { value: 'Nee', label: 'Nee' }
            ], true)}
          </div>
        </>
      )
    },
    {
      id: 2,
      title: 'Persoonlijke en Gezinsgegevens',
      subtitle: 'Deze sectie verzamelt algemene gegevens over uw persoonlijke situatie.',
      render: () => (
        <>
          {renderInput('partnerName', 'Volledige naam partner', true)}
          {renderInput('partnerBirthDate', 'Geboortedatum partner', true, 'date')}
          {renderInput('partnerBsn', 'Burgerservicenummer (BSN) partner', true)}
        </>
      )
    },
    {
      id: 3,
      title: 'Persoonlijke en Gezinsgegevens',
      subtitle: 'Deze sectie verzamelt algemene gegevens over uw persoonlijke situatie.',
      render: () => (
        <div className="bg-white rounded-lg border border-gray-300 p-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Heeft u kinderen die in 2024 bij u woonden? <span className="text-red-500">*</span>
          </label>
          {renderRadio('hasChildren', [
            { value: 'Ja', label: 'Ja' },
            { value: 'Nee', label: 'Nee' }
          ], true)}
        </div>
      )
    },
    {
      id: 4,
      title: 'Persoonlijke en Gezinsgegevens',
      subtitle: 'Deze sectie verzamelt algemene gegevens over uw persoonlijke situatie.',
      render: () => (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Hoeveel kinderen heeft u die in 2024 bij u woonden? <span className="text-red-500">*</span>
            </label>
            {renderRadio('childrenCount', [
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4', label: '4' },
              { value: '5', label: '5' },
              { value: '5+', label: '5+' }
            ], true)}
          </div>
          {renderTextArea('childrenNames', 'Volledige naam kind(eren) *',
            'Bijvoorbeeld:\n1. Stan de Boer\n2. Esmee de Boer')}
          {renderTextArea('childrenBirthDates', 'Geboortedatum kind(eren) *',
            'Bijvoorbeeld:\n1. 01-07-2010\n2. 01-09-2012')}
          {renderTextArea('childrenBsns', 'BSN kind(eren) *',
            'Bijvoorbeeld:\n1. 238607749\n2. 238601366')}
        </div>
      )
    },
    {
      id: 5,
      title: 'Persoonlijke en Gezinsgegevens',
      subtitle: 'Deze sectie verzamelt algemene gegevens over uw persoonlijke situatie.',
      render: () => (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Woonde u het hele jaar 2024 in Nederland? <span className="text-red-500">*</span>
          </label>
          {renderRadio('livedInNL', [
            { value: 'Ja', label: 'Ja' },
            { value: 'Nee', label: 'Nee' }
          ], true)}
        </div>
      )
    },
    {
      id: 6,
      title: 'Persoonlijke en Gezinsgegevens',
      subtitle: 'Deze sectie verzamelt algemene gegevens over uw persoonlijke situatie.',
      render: () => (
        <div>
          {renderTextArea('nlPeriod', 'In welk deel van 2024 woonde u wel in Nederland? *')}
        </div>
      )
    },
    {
      id: 7,
      title: 'Persoonlijke en Gezinsgegevens',
      subtitle: 'Deze sectie verzamelt algemene gegevens over uw persoonlijke situatie.',
      render: () => (
        <div className="bg-white rounded-lg border border-gray-300 p-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Had u (of uw fiscale partner) in 2024 een 30%-regeling (expat ruling)? <span className="text-red-500">*</span>
          </label>
          {renderRadio('has30PercentRuling', [
            { value: 'Ja', label: 'Ja' },
            { value: 'Nee', label: 'Nee' }
          ], true)}
        </div>
      )
    },
    {
      id: 8,
      title: 'Persoonlijke en Gezinsgegevens',
      subtitle: 'Deze sectie verzamelt algemene gegevens over uw persoonlijke situatie.',
      render: () => (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-300 p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Voor wie was de 30%-regeling? <span className="text-red-500">*</span>
            </label>
            {renderRadio('rulingFor', [
              { value: 'Uzelf', label: 'Uzelf' },
              { value: 'Partner', label: 'Partner' },
              { value: 'Beiden', label: 'Beiden' }
            ], true)}
          </div>
          {renderInput('rulingPeriod', 'Wat was de periode waarin de 30%-regeling gold?', true)}
          <div className="bg-white rounded-lg border border-gray-300 p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Heeft u gekozen/valt u onder de partiële buitenlandse belastingplicht? <span className="text-red-500">*</span>
            </label>
            {renderRadio('partialTaxLiability', [
              { value: 'Ja', label: 'Ja' },
              { value: 'Nee', label: 'Nee' },
              { value: 'Onzeker', label: 'Onzeker' }
            ], true)}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Eventueel: upload beschikking Belastingdienst van 30%-regeling
            </label>
            <input
              type="file"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
        </div>
      )
    },
    {
      id: 9,
      title: 'Inkomsten uit Dienstverband (Loondienst)',
      subtitle: 'In deze sectie bepalen we of u inkomens uit loondienst had in 2024.',
      render: () => (
        <div className="bg-white rounded-lg border border-gray-300 p-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Heeft u of uw fiscale partner in 2024 inkomsten uit loondienst gehad? <span className="text-red-500">*</span>
          </label>
          {renderRadio('hasEmploymentIncome', [
            { value: 'Ja', label: 'Ja' },
            { value: 'Nee', label: 'Nee' }
          ], true)}
        </div>
      )
    },
    {
      id: 10,
      title: 'Inkomsten uit Dienstverband (Loondienst)',
      subtitle: 'Upload jaaropgaven en geef werkgeverdetails.',
      render: () => (
        <div className="space-y-6">
          {showSelfFields('hasEmploymentIncome') && (
            <>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload de jaaropgave(n) van al uw werkgever(s) over 2024
                </label>
                <input type="file" multiple className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
              {renderTextArea('employerNames', 'Naam werkgever(s)', 'Bijvoorbeeld:\n1. BouwExport\n2. Steigers Amsterdam')}
              {renderTextArea('employerCountries', 'Land van vestiging werkgever(s)', 'Bijvoorbeeld:\n1. België\n2. Nederland')}
              {renderTextArea('employerWorkLocations', 'Land waar u het werk feitelijk uitvoerde', 'Bijvoorbeeld:\n1. Nederland\n2. Nederland')}
              {renderTextArea('employerPeriods', 'Werkte u het volledige jaar 2024 bij deze werkgever?', 'Bijvoorbeeld:\n1. Nee, 1 januari t/m 30 april\n2. Ja')}
            </>
          )}

          {showPartnerFields('hasEmploymentIncome') && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h4 className="font-medium text-gray-900 mb-4">Partner werkgever gegevens</h4>
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload de jaaropgave(n) van werkgever(s) partner over 2024
                  </label>
                  <input type="file" multiple className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>
                {renderTextArea('partnerEmployerNames', 'Naam werkgever(s) partner', 'Bijvoorbeeld:\n1. BouwExport\n2. Steigers Amsterdam')}
                {renderTextArea('partnerEmployerCountries', 'Land van vestiging werkgever(s) partner')}
                {renderTextArea('partnerEmployerWorkLocations', 'Land waar uw partner het werk feitelijk uitvoerde')}
                {renderTextArea('partnerEmployerPeriods', 'Werkte uw partner het volledige jaar 2024 bij deze werkgever?')}
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg border border-gray-300 p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Maakte u (of uw partner) reguliere woon-werkreiskosten per openbaar vervoer die niet door een werkgever vergoed zijn? <span className="text-red-500">*</span>
            </label>
            {renderRadio('hasCommuteExpenses', [
              { value: 'Ja', label: 'Ja' },
              { value: 'Nee', label: 'Nee' }
            ], true)}
            <p className="text-sm text-gray-600 mt-2">
              Indien Ja: Mogelijk recht op reisaftrek; we nemen contact op voor details indien van toepassing.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 11,
      title: 'Inkomsten uit Onderneming (Winst uit eigen bedrijf)',
      subtitle: 'Deze sectie betreft inkomen als ondernemer voor de inkomstenbelasting.',
      render: () => (
        <>
          <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Let op:</strong> Heeft u alleen een BV en ontvangt u salaris als DGA? Kies dan "Nee".
              U geeft dit later op als loon uit dienstverband en/of dividend (Box 2).
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-300 p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Heeft u of uw fiscale partner inkomsten gehad als ondernemer in 2024? <span className="text-red-500">*</span>
            </label>
            {renderRadio('hasBusinessIncome', [
              { value: 'Ja, beide', label: 'Ja, beide' },
              { value: 'Ja, alleen ik', label: 'Ja, alleen ik' },
              { value: 'Ja, alleen mijn partner', label: 'Ja, alleen mijn partner' },
              { value: 'Nee', label: 'Nee' }
            ], true)}
          </div>
        </>
      )
    },
    {
      id: 12,
      title: 'Inkomsten uit Onderneming - Details',
      subtitle: 'Upload jaarcijfers en geef ondernemingsdetails.',
      render: () => (
        <div className="space-y-6">
          {showSelfFields('hasBusinessIncome') && (
            <>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload uw jaarcijfers van 2024</label>
                <p className="text-sm text-gray-600 mb-3">Winst- en verliesrekening 2024 + balans OF Jaarrekening</p>
                <input type="file" multiple className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" accept=".pdf,.xlsx,.xls" />
              </div>
              {renderTextArea('businessNames', 'Bedrijfsnaam (per onderneming)', 'Bijvoorbeeld:\n1. BouwExport\n2. Steigers Amsterdam')}
              {renderTextArea('businessLegalForms', 'Rechtsvorm(en)', 'Bijvoorbeeld:\n1. Eenmanszaak\n2. Besloten Vennootschap')}
              {renderTextArea('businessKvkNumbers', 'KVK-nummer(s)', 'Bijvoorbeeld:\n1. 92596991\n2. 19283716')}
              {renderTextArea('businessStartDates', 'Startdatum inschrijving(en)', 'Bijvoorbeeld:\n1. 01-01-2023\n2. 16-07-2022')}

              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Heeft u in 2024 minimaal 1.225 uur aan uw onderneming besteed?
                </label>
                {renderRadio('businessHours1225', [
                  { value: 'Ja', label: 'Ja' },
                  { value: 'Nee', label: 'Nee' }
                ])}
              </div>

              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Heeft u in de afgelopen 5 jaar (2019–2023) zelfstandigenaftrek toegepast?
                </label>
                {renderRadio('selfEmployedDeductionHistory', [
                  { value: 'Nooit', label: 'Nooit' },
                  { value: '1 keer', label: '1 keer' },
                  { value: '2 keer', label: '2 keer' },
                  { value: '3 keer of vaker', label: '3 keer of vaker' }
                ])}
              </div>

              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Had u in 2024 startersjaren (eerste 5 jaar als ondernemer)?
                </label>
                {renderRadio('hadStartupYears', [
                  { value: 'Ja', label: 'Ja' },
                  { value: 'Nee', label: 'Nee' }
                ])}
              </div>

              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Bent u in de afgelopen 5 jaar (2019–2023) minstens 1 jaar géén ondernemer geweest?
                </label>
                {renderRadio('wasNotEntrepreneur', [
                  { value: 'Ja', label: 'Ja' },
                  { value: 'Nee', label: 'Nee' }
                ])}
              </div>

              {renderInput('aovPremium', 'Heeft u in 2024 premie voor een vrijwillige AOV voor ondernemers betaald? (Bedrag in €)')}

              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Heeft u specifieke bedrijfsgerelateerde aftrekposten of bijzondere situaties?
                </label>
                {renderRadio('businessSpecialItems', [
                  { value: 'Investeringen gedaan in 2024 voor uw bedrijf (> €2.400 totaal)', label: 'Investeringen gedaan in 2024 voor uw bedrijf (> €2.400 totaal)' },
                  { value: 'Een zakelijke auto die ook privé werd gebruikt', label: 'Een zakelijke auto die ook privé werd gebruikt' },
                  { value: 'Fiscale Oudedagsreserve (FOR) toevoeging of opname', label: 'Fiscale Oudedagsreserve (FOR) toevoeging of opname' },
                  { value: 'Meerdere van bovenstaande', label: 'Meerdere van bovenstaande' },
                  { value: 'Geen van bovenstaande / Niet van toepassing', label: 'Geen van bovenstaande / Niet van toepassing' }
                ])}
              </div>
            </>
          )}

          {showPartnerFields('hasBusinessIncome') && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h4 className="font-medium text-gray-900 mb-4">Partner onderneming gegevens</h4>
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload jaarcijfers partner van 2024</label>
                  <input type="file" multiple className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>
                {renderTextArea('partnerBusinessNames', 'Bedrijfsnaam partner (per onderneming)')}
                {renderTextArea('partnerBusinessLegalForms', 'Rechtsvorm(en) partner')}
                {renderTextArea('partnerBusinessKvkNumbers', 'KVK-nummer(s) partner')}
                {renderTextArea('partnerBusinessStartDates', 'Startdatum inschrijving(en) partner')}
                <div className="bg-white rounded-lg border border-gray-300 p-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Heeft u specifieke bedrijfsgerelateerde aftrekposten of bijzondere situaties? (Partner)
                  </label>
                  {renderRadio('partnerBusinessSpecialItems', [
                    { value: 'Investeringen gedaan in 2024 voor uw bedrijf (> €2.400 totaal)', label: 'Investeringen gedaan in 2024 voor uw bedrijf (> €2.400 totaal)' },
                    { value: 'Een zakelijke auto die ook privé werd gebruikt', label: 'Een zakelijke auto die ook privé werd gebruikt' },
                    { value: 'Fiscale Oudedagsreserve (FOR) toevoeging of opname', label: 'Fiscale Oudedagsreserve (FOR) toevoeging of opname' },
                    { value: 'Meerdere van bovenstaande', label: 'Meerdere van bovenstaande' },
                    { value: 'Geen van bovenstaande / Niet van toepassing', label: 'Geen van bovenstaande / Niet van toepassing' }
                  ])}
                </div>
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      id: 13,
      title: 'Inkomsten uit Overig Werk (freelance/klussen)',
      subtitle: 'In deze sectie kijken we naar eventuele inkomsten uit overige werkzaamheden.',
      render: () => (
        <div className="bg-white rounded-lg border border-gray-300 p-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Heeft u of uw partner in 2024 inkomsten gehad uit overige werkzaamheden? <span className="text-red-500">*</span>
          </label>
          {renderRadio('hasFreelanceIncome', [
            { value: 'Ja, beide', label: 'Ja, beide' },
            { value: 'Ja, alleen ik', label: 'Ja, alleen ik' },
            { value: 'Ja, alleen mijn partner', label: 'Ja, alleen mijn partner' },
            { value: 'Nee', label: 'Nee' }
          ], true)}
        </div>
      )
    },
    {
      id: 14,
      title: 'Inkomsten uit Overig Werk - Details',
      subtitle: 'Beschrijf uw overige inkomsten.',
      render: () => (
        <div className="space-y-6">
          {showSelfFields('hasFreelanceIncome') && (
            renderTextArea('freelanceDetails', 'Ontving u in 2024 overige inkomsten die nog niet genoemd zijn?',
              'Bijvoorbeeld: "freelance klus € 500" of "hobby-inkomsten € 1.200"')
          )}
          {showPartnerFields('hasFreelanceIncome') && (
            renderTextArea('partnerFreelanceDetails', 'Ontving uw partner in 2024 overige inkomsten die nog niet genoemd zijn?',
              'Bijvoorbeeld: "freelance klus € 500" of "hobby-inkomsten € 1.200"')
          )}
        </div>
      )
    },
    {
      id: 15,
      title: 'Inkomsten uit Uitkeringen (Sociale zekerheid)',
      subtitle: 'Hier bekijken we of u of uw partner in 2024 inkomen ontving uit sociale uitkeringen.',
      render: () => (
        <div className="bg-white rounded-lg border border-gray-300 p-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Heeft u of uw partner in 2024 een sociale zekerheidsuitkering ontvangen? <span className="text-red-500">*</span>
          </label>
          {renderRadio('hasSocialBenefits', [
            { value: 'Ja, beide', label: 'Ja, beide' },
            { value: 'Ja, alleen ik', label: 'Ja, alleen ik' },
            { value: 'Ja, alleen mijn partner', label: 'Ja, alleen mijn partner' },
            { value: 'Nee', label: 'Nee' }
          ], true)}
        </div>
      )
    },
    {
      id: 16,
      title: 'Uitkeringen - Details',
      subtitle: 'Beschrijf de ontvangen uitkeringen.',
      render: () => (
        <div className="space-y-6">
          {showSelfFields('hasSocialBenefits') && (
            renderTextArea('benefitsDetails', 'Welke uitkering(en) heeft u ontvangen, en wat was het ontvangen bedrag in 2024?',
              'Bijvoorbeeld: "WW - €..." of "WIA - €..."')
          )}
          {showPartnerFields('hasSocialBenefits') && (
            renderTextArea('partnerBenefitsDetails', 'Welke uitkering(en) heeft uw partner ontvangen?',
              'Bijvoorbeeld: "WW - €..." of "WIA - €..."')
          )}
        </div>
      )
    },
    {
      id: 17,
      title: 'Inkomsten uit Pensioen en Lijfrente-uitkeringen',
      subtitle: 'In deze sectie behandelen we pensioeninkomsten.',
      render: () => (
        <div className="bg-white rounded-lg border border-gray-300 p-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Heeft u of uw partner in 2024 pensioeninkomsten ontvangen? <span className="text-red-500">*</span>
          </label>
          {renderRadio('hasPensionIncome', [
            { value: 'Ja, beide', label: 'Ja, beide' },
            { value: 'Ja, alleen ik', label: 'Ja, alleen ik' },
            { value: 'Ja, alleen mijn partner', label: 'Ja, alleen mijn partner' },
            { value: 'Nee', label: 'Nee' }
          ], true)}
        </div>
      )
    },
    {
      id: 18,
      title: 'Pensioen - Details',
      subtitle: 'Beschrijf de pensioen- of lijfrente-uitkeringen.',
      render: () => (
        <div className="space-y-6">
          {showSelfFields('hasPensionIncome') && (
            <>
              {renderTextArea('pensionDetails', 'Welke pensioen- of lijfrente-uitkering(en) heeft u ontvangen?',
                'Bijvoorbeeld: "AOW van de SVB – €... ontvangen, €... belasting ingehouden"')}
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Bent u in 2024 voor het eerst AOW-gerechtigd geworden?
                </label>
                {renderRadio('pensionStartedIn2024', [
                  { value: 'Ja', label: 'Ja' },
                  { value: 'Nee', label: 'Nee' }
                ])}
              </div>
            </>
          )}
          {showPartnerFields('hasPensionIncome') && (
            <>
              {renderTextArea('partnerPensionDetails', 'Welke pensioen- of lijfrente-uitkering(en) heeft uw partner ontvangen?')}
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Is uw partner in 2024 voor het eerst AOW-gerechtigd geworden?
                </label>
                {renderRadio('partnerPensionStartedIn2024', [
                  { value: 'Ja', label: 'Ja' },
                  { value: 'Nee', label: 'Nee' }
                ])}
              </div>
            </>
          )}
        </div>
      )
    },
    {
      id: 19,
      title: 'Ontvangen Alimentatie (Partneralimentatie)',
      subtitle: 'Partneralimentatie die u ontvangt van een ex-partner is belast inkomen voor u.',
      render: () => (
        <div className="bg-white rounded-lg border border-gray-300 p-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Heeft u of uw partner in 2024 partneralimentatie ontvangen? <span className="text-red-500">*</span>
          </label>
          {renderRadio('receivesAlimony', [
            { value: 'Ja, beide', label: 'Ja, beide' },
            { value: 'Ja, alleen ik', label: 'Ja, alleen ik' },
            { value: 'Ja, alleen mijn partner', label: 'Ja, alleen mijn partner' },
            { value: 'Nee', label: 'Nee' }
          ], true)}
        </div>
      )
    },
    {
      id: 20,
      title: 'Alimentatie - Details',
      subtitle: 'Geef het bedrag aan ontvangen alimentatie.',
      render: () => (
        <div className="space-y-6">
          {showSelfFields('receivesAlimony') && (
            renderInput('alimonyAmount', 'Hoeveel (€) partneralimentatie heeft u ontvangen in 2024?')
          )}
          {showPartnerFields('receivesAlimony') && (
            renderInput('partnerAlimonyAmount', 'Hoeveel (€) partneralimentatie heeft uw partner ontvangen in 2024?')
          )}
        </div>
      )
    },
    {
      id: 21,
      title: 'Inkomsten uit Aanmerkelijk Belang (Box 2)',
      subtitle: 'In deze sectie controleren we of u of uw partner inkomen had uit een aanmerkelijk belang in 2024.',
      render: () => (
        <>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <p className="text-sm text-blue-800">
              Aanmerkelijk belang betekent meestal dat u minstens 5% aandelen bezit in een vennootschap
              (meestal een BV/NV). Inkomen daaruit (dividend of verkoopwinst) valt in Box 2.
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-300 p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Had u of uw partner in 2024 een aanmerkelijk belang (5% of meer aandelen) in een bedrijf? <span className="text-red-500">*</span>
            </label>
            {renderRadio('hasSubstantialInterest', [
              { value: 'Ja, beide', label: 'Ja, beide' },
              { value: 'Ja, alleen ik', label: 'Ja, alleen ik' },
              { value: 'Ja, alleen mijn partner', label: 'Ja, alleen mijn partner' },
              { value: 'Nee', label: 'Nee' }
            ], true)}
          </div>
        </>
      )
    },
    {
      id: 22,
      title: 'Box 2 - Details',
      subtitle: 'Beschrijf dividend en verkopen.',
      render: () => (
        <div className="space-y-6">
          {showSelfFields('hasSubstantialInterest') && (
            <>
              {renderTextArea('dividendReceived', 'Heeft u in 2024 dividend uitgekeerd gekregen van uw bedrijf?',
                'Bijvoorbeeld: "€10.000 uitgekeerd en €1.500 ingehouden"')}
              {renderTextArea('sharesSold', 'Heeft u in 2024 aandelen met aanmerkelijk belang verkocht?',
                'Bijvoorbeeld: "€120.000 verkoopopbrengst en €90.000 aanschafwaarde"')}
            </>
          )}
          {showPartnerFields('hasSubstantialInterest') && (
            <>
              {renderTextArea('partnerDividendReceived', 'Heeft uw partner in 2024 dividend uitgekeerd gekregen?')}
              {renderTextArea('partnerSharesSold', 'Heeft uw partner in 2024 aandelen met aanmerkelijk belang verkocht?')}
            </>
          )}
        </div>
      )
    },
    {
      id: 23,
      title: 'Vermogen (Box 3) – Bezittingen en Schulden',
      subtitle: 'In deze sectie inventariseren we uw vermogen in Box 3.',
      render: () => (
        <>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <p className="text-sm text-blue-800">
              Met "noemenswaardig" doelen we op vermogen boven de vrijstellingsgrens. In 2024 is de
              heffingsvrije grens ongeveer €57.000 per persoon (voor fiscale partners gezamenlijk circa €114.000).
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-300 p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Had u en/of uw partner op 1 januari 2024 gezamenlijk noemenswaardig vermogen? <span className="text-red-500">*</span>
            </label>
            {renderRadio('hasAssets', [
              { value: 'Ja, beide', label: 'Ja, beide' },
              { value: 'Ja, alleen ik', label: 'Ja, alleen ik' },
              { value: 'Ja, alleen mijn partner', label: 'Ja, alleen mijn partner' },
              { value: 'Nee', label: 'Nee' }
            ], true)}
          </div>
        </>
      )
    },
    {
      id: 24,
      title: 'Vermogen - Details',
      subtitle: 'Inventarisatie van bezittingen en schulden op 1 januari 2024.',
      render: () => (
        <div className="space-y-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Peildatum:</strong> Alle vermogen wordt bepaald op 1 januari 2024
            </p>
          </div>
          {showSelfFields('hasAssets') && (
            <>
              {renderInput('savingsBalance', 'Spaargeld en banktegoeden (€) - Saldo op 1 januari 2024')}
              {renderTextArea('investments', 'Beleggingen - Waarde op 1 januari 2024',
                'Bijvoorbeeld: "Aandelen – €9.000" of "Crypto – €25.000"')}
              {renderTextArea('realEstate', 'Onroerend goed (tweede woning of belegging) - Waarde op 1 januari 2024',
                'Bijvoorbeeld: "Vakantiehuis – €..." of "Huurwoning – €..."')}
              {renderTextArea('otherAssets', 'Overige bezittingen - Waarde op 1 januari 2024',
                'Bijvoorbeeld: "Contant geld – €1.200" of "Kunstobject – €3.000"')}
              {renderTextArea('debts', 'Schulden op 1 januari 2024',
                'Bijvoorbeeld: "Persoonlijke lening – €10.000" of "Creditcardschuld – €600"')}
            </>
          )}

          {showPartnerFields('hasAssets') && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h4 className="font-medium text-gray-900 mb-4">Partner vermogen gegevens</h4>
              {renderInput('partnerSavingsBalance', 'Spaargeld en banktegoeden partner (€) - Saldo op 1 januari 2024')}
              {renderTextArea('partnerInvestments', 'Beleggingen partner')}
              {renderTextArea('partnerRealEstate', 'Onroerend goed partner')}
              {renderTextArea('partnerOtherAssets', 'Overige bezittingen partner')}
              {renderTextArea('partnerDebts', 'Schulden partner')}
            </div>
          )}
        </div>
      )
    },
    {
      id: 25,
      title: 'Eigen Woning (Box 1) – Hypotheek en Woningaftrek',
      subtitle: 'In deze sectie behandelen we uw eigen woning (hoofdverblijf).',
      render: () => (
        <>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <p className="text-sm text-blue-800">
              Dit betreft uw eigen woning (hoofdverblijf). De eigenwoningforfait wordt bij uw inkomen geteld,
              maar hypotheekrente is aftrekbaar.
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-300 p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Had u (of uw partner) in 2024 een eigen woning in bezit waar u zelf in woonde? <span className="text-red-500">*</span>
            </label>
            {renderRadio('hasOwnHome', [
              { value: 'Ja, beide', label: 'Ja, beide' },
              { value: 'Ja, alleen ik', label: 'Ja, alleen ik' },
              { value: 'Ja, alleen mijn partner', label: 'Ja, alleen mijn partner' },
              { value: 'Nee', label: 'Nee' }
            ], true)}
          </div>
        </>
      )
    },
    {
      id: 26,
      title: 'Eigen Woning - Details',
      subtitle: 'Geef details over uw eigen woning.',
      render: () => (
        <div className="space-y-6">
          {showSelfFields('hasOwnHome') && (
            <>
              {renderInput('homeAddress', 'Wat is het adres van uw eigen woning en het eigendomsverhoudingspercentage?')}
              {renderInput('homeWozValue', 'WOZ-waarde van uw woning met peildatum 1 januari 2023 (€)')}
              {renderTextArea('homeMortgageInterest', 'Hoeveel hypotheekrente heeft u in 2024 betaald?',
                'Bijvoorbeeld: "€8.230 – Lineaire hypotheek" of "€9.200 – Aflossingsvrije hypotheek"')}
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Hebt u in 2024 uw eigen woning gekocht of verkocht?
                </label>
                {renderRadio('homeBoughtOrSold', [
                  { value: 'Ja, gekocht', label: 'Ja, gekocht' },
                  { value: 'Ja, verkocht', label: 'Ja, verkocht' },
                  { value: 'Ja, zowel gekocht als verkocht', label: 'Ja, zowel gekocht als verkocht (verhuisd)' },
                  { value: 'Nee', label: 'Nee' }
                ])}
              </div>
            </>
          )}

          {showPartnerFields('hasOwnHome') && (
            <>
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h4 className="font-medium text-gray-900 mb-4">Partner woning gegevens</h4>
                {renderInput('partnerHomeAddress', 'Adres eigen woning partner en eigendomsverhoudingspercentage')}
                {renderInput('partnerHomeWozValue', 'WOZ-waarde woning partner (€)')}
                {renderTextArea('partnerHomeMortgageInterest', 'Hypotheekrente partner in 2024')}
                <div className="bg-white rounded-lg border border-gray-300 p-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Heeft uw partner in 2024 een eigen woning gekocht of verkocht?
                  </label>
                  {renderRadio('partnerHomeBoughtOrSold', [
                    { value: 'Ja, gekocht', label: 'Ja, gekocht' },
                    { value: 'Ja, verkocht', label: 'Ja, verkocht' },
                    { value: 'Ja, zowel gekocht als verkocht', label: 'Ja, zowel gekocht als verkocht' },
                    { value: 'Nee', label: 'Nee' }
                  ])}
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                <label className="block text-sm font-medium text-green-900 mb-2">
                  Optimalisatie Hypotheekrenteaftrek
                </label>
                <p className="text-sm text-green-800 mb-3">
                  Fiscale partners mogen onderling de hypotheekrente en eigenwoningforfait toerekenen in elke
                  gewenste verhouding die het meest gunstig is.
                </p>
                {renderTextArea('mortgageDistribution', 'Willen u en uw partner de hypotheekrenteaftrek onderling anders verdelen?',
                  'Geef % of € voor de verdeling. Bijvoorbeeld: "60% bij mij, 40% bij partner"')}
              </div>
            </>
          )}
        </div>
      )
    },
    {
      id: 27,
      title: 'Persoonsgebonden Aftrekposten',
      subtitle: 'Dit is een belangrijke sectie om geen enkele aftrekpost te missen.',
      render: () => (
        <div className="space-y-6">
          {renderTextArea('alimonyPaid', 'Heeft u in 2024 partneralimentatie betaald aan een ex-partner?',
            'Bijvoorbeeld: "€... – Nicole de Boer 94018844"')}
          {renderTextArea('medicalExpenses', 'Heeft u in 2024 bijzondere zorgkosten gemaakt die niet vergoed zijn?',
            'Bijvoorbeeld: "€... voor tandartskosten, €... voor bril/lenzen"')}
          {renderTextArea('donations', 'Heeft u in 2024 giften gedaan aan goede doelen?',
            'Bijvoorbeeld: "€500 eenmalig" of "€800 periodiek"')}
          {renderTextArea('annuityPremiums', 'Heeft u in 2024 premies betaald voor een lijfrente?',
            'Bijvoorbeeld: "€2.400 ingelegd bij Brand New Day"')}
          {renderTextArea('otherDeductions', 'Heeft u nog andere aftrekbare betalingen gedaan in 2024?')}

          {formData.hasPartner === 'Ja' && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h4 className="font-medium text-gray-900 mb-4">Partner aftrekposten</h4>
              {renderTextArea('partnerAlimonyPaid', 'Heeft uw partner in 2024 partneralimentatie betaald?')}
              {renderTextArea('partnerMedicalExpenses', 'Heeft uw partner bijzondere zorgkosten gemaakt?')}
              {renderTextArea('partnerDonations', 'Heeft uw partner giften gedaan?')}
              {renderTextArea('partnerAnnuityPremiums', 'Heeft uw partner premies betaald voor een lijfrente?')}
              {renderTextArea('partnerOtherDeductions', 'Heeft uw partner nog andere aftrekbare betalingen gedaan?')}
            </div>
          )}
        </div>
      )
    },
    {
      id: 28,
      title: 'Voorlopige aanslagen en teruggaven',
      subtitle: 'Tot slot vragen we of u al voorlopige aanslagen of teruggaven heeft gehad over 2024.',
      render: () => (
        <div className="space-y-6">
          {renderTextArea('provisionalAssessment', 'Heeft u voor 2024 al een voorlopige aanslag inkomstenbelasting of zorgverzekeringswet ontvangen of betaald?',
            'Bijvoorbeeld: "Voorlopige teruggave 2024 inkomstenbelasting: €1200 ontvangen"')}
          {formData.hasPartner === 'Ja' && (
            renderTextArea('partnerProvisionalAssessment', 'Heeft uw partner voor 2024 al een voorlopige aanslag ontvangen of betaald?')
          )}
        </div>
      )
    },
    {
      id: 29,
      title: 'Overig',
      subtitle: 'In deze sectie heeft u de mogelijk om nog iets op te geven wat niet behandeld is.',
      render: () => (
        <div className="space-y-6">
          {renderTextArea('additionalRemarks', 'Zijn er nog andere bijzonderheden of opmerkingen die u wilt meegeven voor uw aangifte 2024?', '', 6)}
          <div className="bg-white rounded-lg border border-gray-300 p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Heeft u alles naar waarheid ingevuld? <span className="text-red-500">*</span>
            </label>
            {renderRadio('truthfulDeclaration', [
              { value: 'Ja', label: 'Ja' },
              { value: 'Nee', label: 'Nee' }
            ], true)}
          </div>
        </div>
      )
    },
    {
      id: 30,
      title: 'Afronding',
      subtitle: 'U heeft nu alle relevante vragen beantwoord.',
      render: () => (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-600 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-green-900 mb-3">
              Gefeliciteerd! U heeft alle relevante vragen beantwoord.
            </h3>
            <p className="text-green-800">
              Op basis van uw antwoorden stellen we de aangifte op. We zorgen ervoor dat alle aftrekposten
              en belastingvoordelen waar u recht op heeft, benut worden.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                title: 'Inkomsten & Heffingskortingen',
                text: 'Alle inkomsten zijn meegenomen, heffingskortingen worden automatisch berekend en toegekend.'
              },
              {
                title: 'Ondernemersaftrek',
                text: 'Indien van toepassing: zelfstandigenaftrek, startersaftrek en urencriterium zijn gecontroleerd.'
              },
              {
                title: 'Aftrekposten',
                text: 'Hypotheekrente, giften, zorgkosten, alimentatie, lijfrente - alles wordt optimaal verdeeld tussen partners.'
              },
              {
                title: 'Vermogen Box 3',
                text: 'Bezittingen en schulden zijn opgegeven, vrijstellingen worden benut, correcte verdeling tussen partners.'
              },
              {
                title: 'Controle & Indienen',
                text: 'U krijgt ter controle een overzicht. Pas na uw akkoord dienen wij de aangifte in.'
              }
            ].map((item, i) => (
              <div key={i} className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-700">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <p className="text-blue-900 font-medium mb-2">Volgende stappen:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Wij verwerken uw gegevens binnen 5 werkdagen</li>
              <li>U ontvangt een concept aangifte ter controle</li>
              <li>Na uw goedkeuring dienen wij de aangifte in bij de Belastingdienst</li>
              <li>U ontvangt een kopie van de ingediende aangifte</li>
            </ol>
          </div>
        </div>
      )
    }
  ];

  const currentSectionData = sections[currentSection];
  const totalSections = 31;
  const progress = ((currentSection + 1) / totalSections) * 100;

  return (
    <div className="min-h-screen bg-gray-100">
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

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
            <div className="border-t-8 border-blue-600 bg-blue-600 p-4">
              <h2 className="text-xl font-normal text-white flex items-center gap-2">
                {currentSectionData.title}
              </h2>
            </div>
            {currentSectionData.subtitle && (
              <div className="p-6">
                <p className="text-sm text-gray-700">{currentSectionData.subtitle}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {currentSectionData.render()}
          </div>

          <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
            {currentSection > 0 ? (
              <button
                onClick={handlePrevious}
                className="px-6 py-2 text-blue-600 hover:bg-blue-50 rounded font-medium text-sm transition-colors"
              >
                Vorige
              </button>
            ) : (
              <div></div>
            )}

            {currentSection < totalSections - 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                Volgende
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Verzenden</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxForm2024;
