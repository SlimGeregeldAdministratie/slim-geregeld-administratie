import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Upload, AlertCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FormData {
  fullName: string;
  birthDate: string;
  bsn: string;
  address: string;
  email: string;
  phone: string;
  hasPartner: string;
  partnerName: string;
  partnerBirthDate: string;
  partnerBsn: string;
  hasChildren: string;
  childrenCount: string;
  childrenNames: string;
  childrenBirthDates: string;
  childrenBsns: string;
  livedInNL: string;
  nlPeriod: string;
  has30PercentRuling: string;
  rulingFor: string;
  rulingPeriod: string;
  partialTaxLiability: string;
  rulingDocument: File | null;
  hasEmploymentIncome: string;
  employerDocuments: File[];
  employerNames: string;
  employerCountries: string;
  employerWorkLocations: string;
  employerPeriods: string;
  partnerEmployerDocuments: File[];
  partnerEmployerNames: string;
  partnerEmployerCountries: string;
  partnerEmployerWorkLocations: string;
  partnerEmployerPeriods: string;
  hasCommuteExpenses: string;
  hasBusinessIncome: string;
  businessOwner: string;
  businessDocuments: File[];
  businessNames: string;
  businessLegalForms: string;
  businessKvkNumbers: string;
  businessStartDates: string;
  businessHours1225: string;
  selfEmployedDeductionHistory: string;
  wasNotEntrepreneur: string;
  hadStartupYears: string;
  aovPremium: string;
  businessSpecialItems: string[];
  partnerBusinessDocuments: File[];
  partnerBusinessNames: string;
  partnerBusinessLegalForms: string;
  partnerBusinessKvkNumbers: string;
  partnerBusinessStartDates: string;
  partnerBusinessHours1225: string;
  partnerSelfEmployedDeductionHistory: string;
  partnerWasNotEntrepreneur: string;
  partnerHadStartupYears: string;
  partnerAovPremium: string;
  partnerBusinessSpecialItems: string[];
  hasFreelanceIncome: string;
  freelanceOwner: string;
  freelanceDetails: string;
  partnerFreelanceDetails: string;
  hasSocialBenefits: string;
  benefitsOwner: string;
  benefitsDetails: string;
  partnerBenefitsDetails: string;
  hasPensionIncome: string;
  pensionOwner: string;
  pensionDetails: string;
  pensionStartedIn2024: string;
  partnerPensionDetails: string;
  partnerPensionStartedIn2024: string;
  receivesAlimony: string;
  alimonyOwner: string;
  alimonyAmount: string;
  partnerAlimonyAmount: string;
  hasSubstantialInterest: string;
  substantialInterestOwner: string;
  dividendReceived: string;
  sharessold: string;
  partnerDividendReceived: string;
  partnerSharesSold: string;
  hasAssets: string;
  assetsOwner: string;
  savingsBalance: string;
  investments: string;
  realEstate: string;
  otherAssets: string;
  debts: string;
  partnerSavingsBalance: string;
  partnerInvestments: string;
  partnerRealEstate: string;
  partnerOtherAssets: string;
  partnerDebts: string;
  hasOwnHome: string;
  ownHomeOwner: string;
  homeAddress: string;
  homeWozValue: string;
  homeMortgageInterest: string;
  homeBoughtOrSold: string;
  partnerHomeAddress: string;
  partnerHomeWozValue: string;
  partnerHomeMortgageInterest: string;
  partnerHomeBoughtOrSold: string;
  mortgageDistribution: string;
  paysAlimony: string;
  alimonyPaid: string;
  partnerAlimonyPaid: string;
  hasMedicalExpenses: string;
  medicalExpenses: string;
  partnerMedicalExpenses: string;
  hasDonations: string;
  donations: string;
  partnerDonations: string;
  hasAnnuityPremiums: string;
  annuityPremiums: string;
  partnerAnnuityPremiums: string;
  otherDeductions: string;
  partnerOtherDeductions: string;
  provisionalAssessment: string;
  partnerProvisionalAssessment: string;
  additionalRemarks: string;
  truthfulDeclaration: string;
}

const TaxForm2024 = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    birthDate: '',
    bsn: '',
    address: '',
    email: '',
    phone: '',
    hasPartner: '',
    partnerName: '',
    partnerBirthDate: '',
    partnerBsn: '',
    hasChildren: '',
    childrenCount: '',
    childrenNames: '',
    childrenBirthDates: '',
    childrenBsns: '',
    livedInNL: '',
    nlPeriod: '',
    has30PercentRuling: '',
    rulingFor: '',
    rulingPeriod: '',
    partialTaxLiability: '',
    rulingDocument: null,
    hasEmploymentIncome: '',
    employerDocuments: [],
    employerNames: '',
    employerCountries: '',
    employerWorkLocations: '',
    employerPeriods: '',
    partnerEmployerDocuments: [],
    partnerEmployerNames: '',
    partnerEmployerCountries: '',
    partnerEmployerWorkLocations: '',
    partnerEmployerPeriods: '',
    hasCommuteExpenses: '',
    hasBusinessIncome: '',
    businessOwner: '',
    businessDocuments: [],
    businessNames: '',
    businessLegalForms: '',
    businessKvkNumbers: '',
    businessStartDates: '',
    businessHours1225: '',
    selfEmployedDeductionHistory: '',
    wasNotEntrepreneur: '',
    hadStartupYears: '',
    aovPremium: '',
    businessSpecialItems: [],
    partnerBusinessDocuments: [],
    partnerBusinessNames: '',
    partnerBusinessLegalForms: '',
    partnerBusinessKvkNumbers: '',
    partnerBusinessStartDates: '',
    partnerBusinessHours1225: '',
    partnerSelfEmployedDeductionHistory: '',
    partnerWasNotEntrepreneur: '',
    partnerHadStartupYears: '',
    partnerAovPremium: '',
    partnerBusinessSpecialItems: [],
    hasFreelanceIncome: '',
    freelanceOwner: '',
    freelanceDetails: '',
    partnerFreelanceDetails: '',
    hasSocialBenefits: '',
    benefitsOwner: '',
    benefitsDetails: '',
    partnerBenefitsDetails: '',
    hasPensionIncome: '',
    pensionOwner: '',
    pensionDetails: '',
    pensionStartedIn2024: '',
    partnerPensionDetails: '',
    partnerPensionStartedIn2024: '',
    receivesAlimony: '',
    alimonyOwner: '',
    alimonyAmount: '',
    partnerAlimonyAmount: '',
    hasSubstantialInterest: '',
    substantialInterestOwner: '',
    dividendReceived: '',
    sharesS: '',
    partnerDividendReceived: '',
    partnerSharesSold: '',
    hasAssets: '',
    assetsOwner: '',
    savingsBalance: '',
    investments: '',
    realEstate: '',
    otherAssets: '',
    debts: '',
    partnerSavingsBalance: '',
    partnerInvestments: '',
    partnerRealEstate: '',
    partnerOtherAssets: '',
    partnerDebts: '',
    hasOwnHome: '',
    ownHomeOwner: '',
    homeAddress: '',
    homeWozValue: '',
    homeMortgageInterest: '',
    homeBoughtOrSold: '',
    partnerHomeAddress: '',
    partnerHomeWozValue: '',
    partnerHomeMortgageInterest: '',
    partnerHomeBoughtOrSold: '',
    mortgageDistribution: '',
    paysAlimony: '',
    alimonyPaid: '',
    partnerAlimonyPaid: '',
    hasMedicalExpenses: '',
    medicalExpenses: '',
    partnerMedicalExpenses: '',
    hasDonations: '',
    donations: '',
    partnerDonations: '',
    hasAnnuityPremiums: '',
    annuityPremiums: '',
    partnerAnnuityPremiums: '',
    otherDeductions: '',
    partnerOtherDeductions: '',
    provisionalAssessment: '',
    partnerProvisionalAssessment: '',
    additionalRemarks: '',
    truthfulDeclaration: '',
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentSection]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      const currentValues = formData[name as keyof FormData] as string[];

      if (checkbox.checked) {
        setFormData({ ...formData, [name]: [...currentValues, value] });
      } else {
        setFormData({ ...formData, [name]: currentValues.filter(v => v !== value) });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof FormData) => {
    const files = e.target.files;
    if (files) {
      if (fieldName === 'rulingDocument') {
        setFormData({ ...formData, [fieldName]: files[0] });
      } else {
        setFormData({ ...formData, [fieldName]: Array.from(files) });
      }
    }
  };

  const validateSection = (sectionIndex: number): boolean => {
    switch (sectionIndex) {
      case 0:
        return !!(formData.fullName && formData.birthDate && formData.bsn && formData.address && formData.email);
      case 1:
        return !!formData.hasPartner;
      case 2:
        if (formData.hasPartner === 'Ja') {
          return !!(formData.partnerName && formData.partnerBirthDate && formData.partnerBsn);
        }
        return true;
      default:
        return true;
    }
  };

  const getNextSection = (current: number): number => {
    if (current === 1 && formData.hasPartner === 'Nee') {
      return 3;
    }
    if (current === 3 && formData.hasChildren === 'Nee') {
      return 5;
    }
    if (current === 5 && formData.livedInNL === 'Ja') {
      return 7;
    }
    if (current === 7 && formData.has30PercentRuling === 'Nee') {
      return 9;
    }
    if (current === 9 && formData.hasEmploymentIncome === 'Nee') {
      return 11;
    }
    if (current === 11 && formData.hasBusinessIncome === 'Nee') {
      return 13;
    }
    if (current === 13 && formData.hasFreelanceIncome === 'Nee') {
      return 15;
    }
    if (current === 15 && formData.hasSocialBenefits === 'Nee') {
      return 17;
    }
    if (current === 17 && formData.hasPensionIncome === 'Nee') {
      return 19;
    }
    if (current === 19 && formData.receivesAlimony === 'Nee') {
      return 21;
    }
    if (current === 21 && formData.hasSubstantialInterest === 'Nee') {
      return 23;
    }
    if (current === 23 && formData.hasAssets === 'Nee') {
      return 25;
    }
    if (current === 25 && formData.hasOwnHome === 'Nee') {
      return 27;
    }

    return current + 1;
  };

  const handleNext = () => {
    if (!validateSection(currentSection)) {
      alert('Vul alle verplichte velden in voordat u verder gaat.');
      return;
    }

    setCompletedSections(new Set([...completedSections, currentSection]));
    const nextSection = getNextSection(currentSection);
    setCurrentSection(nextSection);
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = async () => {
    if (!formData.truthfulDeclaration) {
      alert('U moet bevestigen dat u alles naar waarheid heeft ingevuld.');
      return;
    }

    console.log('Form submitted:', formData);
    navigate('/bedankt');
  };

  const sections = [
    {
      id: 0,
      title: 'Welkom',
      category: 'Introductie',
      render: () => (
        <div className="space-y-6">
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-900 mb-3">
              Welkom bij het Inkomstenbelasting 2024 formulier
            </h3>
            <p className="text-blue-800 mb-4">
              Op basis van uw antwoorden tonen we alleen de vragen die voor uw situatie relevant zijn
              (loondienst, zzp/onderneming, eigen woning, partner/kinderen, box 2/3, buitenlands inkomen/vermogen).
            </p>
            <div className="space-y-3 text-blue-800">
              <p className="font-medium">Houd — voor zover van toepassing — gereed:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Jaaropgaven 2024</li>
                <li>Aanslag IB 2023</li>
                <li>WOZ + hypotheekoverzicht 2024</li>
                <li>Jaarrekening of W&V + balans (zzp)</li>
                <li>Bank/beleggings-jaaroverzichten (per 1-1-2024)</li>
                <li>Bewijsstukken (giften, zorgkosten, dividend, etc.)</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <AlertCircle className="h-6 w-6 text-gray-600" />
              <h4 className="font-semibold text-gray-900">Invultijd</h4>
            </div>
            <p className="text-gray-700">
              Circa 25–45 minuten afhankelijk van uw situatie
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h4 className="font-semibold text-green-900">Privacy & Controle</h4>
            </div>
            <p className="text-green-800">
              Wij behandelen uw gegevens vertrouwelijk en dienen pas in na uw akkoord op het concept.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: 'Persoonlijke Gegevens',
      category: 'Persoonsgegevens',
      render: () => (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Volledige naam <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Geboortedatum <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Burgerservicenummer (BSN) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="bsn"
              value={formData.bsn}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adres <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-mailadres <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefoonnummer
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'Fiscale Partner',
      category: 'Gezinsgegevens',
      render: () => (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Heeft u een fiscale partner? <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="hasPartner"
                  value="Ja"
                  checked={formData.hasPartner === 'Ja'}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600"
                />
                <span>Ja</span>
              </label>
              <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="hasPartner"
                  value="Nee"
                  checked={formData.hasPartner === 'Nee'}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600"
                />
                <span>Nee</span>
              </label>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: 'Gegevens Partner',
      category: 'Gezinsgegevens',
      render: () => (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Volledige naam partner <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="partnerName"
              value={formData.partnerName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Geboortedatum partner <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="partnerBirthDate"
              value={formData.partnerBirthDate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Burgerservicenummer (BSN) partner <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="partnerBsn"
              value={formData.partnerBsn}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: 'Kinderen',
      category: 'Gezinsgegevens',
      render: () => (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Heeft u kinderen die in 2024 bij u woonden? <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="hasChildren"
                  value="Ja"
                  checked={formData.hasChildren === 'Ja'}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600"
                />
                <span>Ja</span>
              </label>
              <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="hasChildren"
                  value="Nee"
                  checked={formData.hasChildren === 'Nee'}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600"
                />
                <span>Nee</span>
              </label>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentSectionData = sections[currentSection];
  const progress = ((currentSection + 1) / sections.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Inkomstenbelasting 2024
            </h1>
            <p className="text-blue-100">
              Sectie {currentSection + 1} van {sections.length}: {currentSectionData.category}
            </p>

            <div className="mt-4 bg-white/20 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {currentSectionData.title}
            </h2>

            <div className="mb-8">
              {currentSectionData.render()}
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={currentSection === 0}
                className="flex items-center space-x-2 px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Vorige</span>
              </button>

              {currentSection < sections.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span>Volgende</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Verzenden</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Uw gegevens worden vertrouwelijk behandeld</p>
        </div>
      </div>
    </div>
  );
};

export default TaxForm2024;
