import React, { useEffect } from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors mb-6 font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Terug naar homepage</span>
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-blue-100 p-4 rounded-2xl">
              <Shield className="h-10 w-10 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Privacybeleid</h1>
              <p className="text-gray-600 text-lg">Laatst bijgewerkt: 1 juli 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-12 border border-gray-100">
          
          {/* 1. Wie zijn wij */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Wie zijn wij?</h2>
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
              <p className="font-semibold text-gray-900 mb-3 text-lg">Slim Geregeld Administratie</p>
              <p className="text-gray-700 mb-2">Slijpakker 14, 1541TE Koog aan de Zaan</p>
              <p className="text-gray-700 mb-2">KVK: 92596991 – BTW: NL004963420B24</p>
              <p className="text-gray-700">E-mail: kyle@slim-geregeld.nl</p>
            </div>
          </section>

          {/* 2. Welke gegevens verzamelen wij */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Welke gegevens verzamelen wij?</h2>
            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
              Wij verwerken alleen persoonsgegevens die nodig zijn voor onze diensten. Denk aan:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Naam, e-mailadres, telefoonnummer</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Bedrijfsnaam, KVK-nummer, btw-nummer</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Administratieve gegevens (zoals facturen, bonnen, jaarstukken)</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>WhatsApp- of e-mailberichten</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Betaalgegevens</span>
              </li>
            </ul>
          </section>

          {/* 3. Waarom verwerken wij gegevens */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">3. Waarom verwerken wij gegevens?</h2>
            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
              Wij gebruiken persoonsgegevens voor:
            </p>
            <ul className="space-y-3 text-gray-700 mb-8">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Het uitvoeren van onze diensten</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Wettelijke verplichtingen (zoals belastingwetgeving)</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Klantcommunicatie</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Beveiliging en back-ups van administratie</span>
              </li>
            </ul>
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <p className="text-gray-700 leading-relaxed mb-4 font-medium">
                Wij verwerken gegevens op basis van:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700">Overeenkomst</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700">Wettelijke verplichting</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700">Gerechtvaardigd belang</span>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Bewaartermijn */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Bewaartermijn</h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Administratieve gegevens:</strong> 7 jaar (fiscale bewaarplicht)</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Klantcommunicatie:</strong> 3 jaar</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Overige gegevens:</strong> zolang de klantrelatie bestaat + max. 1 jaar daarna</span>
              </li>
            </ul>
          </section>

          {/* 5. Delen van gegevens */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Delen van gegevens</h2>
            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
              Wij delen gegevens uitsluitend met:
            </p>
            <ul className="space-y-3 text-gray-700 mb-6">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>De Belastingdienst</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Softwareleveranciers (zoals boekhoud- of cloudopslagdiensten), onder verwerkersovereenkomst</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Wettelijke instanties, indien verplicht</span>
              </li>
            </ul>
            <div className="bg-red-50 rounded-xl p-6 border border-red-200 text-center">
              <p className="text-red-700 font-bold text-lg">
                Wij verkopen nooit gegevens aan derden.
              </p>
            </div>
          </section>

          {/* 6. Uw rechten */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Uw rechten</h2>
            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
              U heeft altijd recht op:
            </p>
            <ul className="space-y-3 text-gray-700 mb-6">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Inzage in uw gegevens</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Correctie van foutieve gegevens</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Verwijdering van gegevens (voor zover wettelijk toegestaan)</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Bezwaar tegen verwerking</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Gegevensoverdracht</span>
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed text-center font-medium">
              U kunt deze rechten uitoefenen door contact met ons op te nemen.
            </p>
          </section>

          {/* 7. Beveiliging */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Beveiliging</h2>
            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
              Wij beschermen uw gegevens met:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>SSL-versleuteling</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Sterke wachtwoorden en toegangsbeheer</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Professionele software en veilige opslag</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Regelmatige back-ups</span>
              </li>
            </ul>
          </section>

          {/* 8. Cookies */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Cookies</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              Onze website gebruikt alleen functionele en analytische cookies. Wij plaatsen geen trackingcookies zonder toestemming.
            </p>
          </section>

          {/* 9. Klachten */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">9. Klachten</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              U kunt een klacht indienen bij de Autoriteit Persoonsgegevens via <strong>autoriteitpersoonsgegevens.nl</strong>.
            </p>
          </section>

          {/* 10. Wijzigingen */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">10. Wijzigingen</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              Wij behouden ons het recht voor dit beleid aan te passen. De meest actuele versie vindt u altijd op <strong>slim-geregeld.nl</strong>.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-blue-50 rounded-xl p-8 border border-blue-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Vragen over dit privacybeleid?</h2>
            <p className="text-gray-700 leading-relaxed mb-6 text-center text-lg">
              Heeft u vragen over dit privacybeleid of wilt u gebruik maken van uw rechten? 
              Neem dan contact met ons op:
            </p>
            <div className="text-center space-y-2 text-gray-700">
              <p><strong>E-mail:</strong> kyle@slim-geregeld.nl</p>
              <p><strong>Adres:</strong> Slijpakker 14, 1541TE Koog aan de Zaan</p>
              <p><strong>KVK:</strong> 92596991 – <strong>BTW:</strong> NL004963420B24</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;