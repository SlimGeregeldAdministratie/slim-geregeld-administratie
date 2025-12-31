import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleGratisToolsClick = () => {
    navigate('/gratis-tools');
  };

  const handlePlanKennismakingClick = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const faqs = [
    {
      question: "Wat is het verschil tussen Alleen Slim en de Volledige Service?",
      answer: "De Slim Chatbot is perfect voor ondernemers die zelf hun administratie willen doen maar hulp nodig hebben. Je krijgt toegang tot onze AI-chatbot via WhatsApp voor facturen, offertes en basis vragen. De Volledige Service neemt je complete administratie uit handen - inclusief boekhouding, BTW-aangiftes en persoonlijk contact met Kyle."
    },
    {
      question: "Hoe werkt Slim (de WhatsApp-chatbot) precies?",
      answer: "Slim is onze AI-chatbot die je helpt via WhatsApp. Je kunt facturen laten maken, instructies krijgen voor het uploaden van bonnetjes, klanten toevoegen en vragen stellen over je administratie. Slim werkt 24/7 en geeft direct antwoord op je vragen."
    },
    {
      question: "Welke kosten kan ik aftrekken als ZZP'er?",
      answer: "Als ZZP'er kun je veel zakelijke kosten aftrekken: kantoorkosten, telefoon, internet, zakelijke reizen, cursussen, software, marketing en nog veel meer. Slim helpt je deze kosten te herkennen en correct te verwerken."
    },
    {
      question: "Hoe moeilijk is het om over te stappen naar jullie midden in het boekjaar?",
      answer: "Helemaal niet moeilijk. We regelen de overstap gratis voor je – inclusief het overnemen van je vorige administratie. Jij hoeft alleen je gegevens aan te leveren, de rest doen wij. Binnen vijf werkdagen ben je up and running en kun jij ondernemen in nieuwe stijl zonder gedoe."
    },
    {
      question: "Hou ik zelf nog wel controle en inzicht als jullie alles doen?",
      answer: "Jazeker. Jij blijft 100% inzicht houden in je financiën. Je krijgt toegang tot de online omgeving en app, waar je op elk moment grafieken en rapportages kunt zien over omzet, kosten, winst, noem maar op. Daarnaast houden wij je op de hoogte – je krijgt een seintje bij elke belangrijke deadline. Het is jouw bedrijf, wij zorgen er alleen voor dat jij altijd up-to-date én in control bent."
    },
    {
      question: "Doen jullie ook de aangifte inkomstenbelasting voor ondernemers?",
      answer: "Ja, zeker! We verzorgen ook de inkomstenbelasting voor zzp'ers en ondernemers. Deze zit alleen niet standaard in onze pakketten inbegrepen. Wil je dat wij dit voor je regelen? Geen probleem – voor een vast bedrag van €235 nemen we de hele aangifte uit handen. Wel zo makkelijk."
    },
    {
      question: "Hoe werkt de 30 dagen gratis proefperiode?",
      answer: "Heel simpel: je kunt 30 dagen lang geheel vrijblijvend gebruik maken van onze services. Geen verborgen kosten, geen verplichtingen. Als je na 30 dagen tevreden bent, gaan we verder. Zo niet? Dan stoppen we gewoon, zonder gedoe. We zijn er zo van overtuigd dat je tevreden zult zijn, dat we dit risico graag nemen."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Veelgestelde vragen
          </h2>
          <p className="text-xl text-gray-600">
            Heb je nog vragen? Hier vind je antwoorden op de meest gestelde vragen.
            Staat je vraag er niet bij? Bekijk onze gratis tools!
          </p>
        </div>

        <div className="space-y-4 mb-12">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-8 pb-6">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Staat je vraag er niet bij?</h3>
          <p className="text-gray-600 mb-8">
            Geen probleem! Bekijk onze gratis tools of plan een gratis kennismaking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGratisToolsClick}
              className="bg-green-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center space-x-2 justify-center"
            >
              <Star className="h-5 w-5" />
              <span>Gratis Tools</span>
            </button>
            <button 
              onClick={handlePlanKennismakingClick}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Plan een kennismaking
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;