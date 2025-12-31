import React, { useEffect } from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsConditions = () => {
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
              <FileText className="h-10 w-10 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Algemene Voorwaarden</h1>
              <p className="text-gray-600 text-lg">Laatst bijgewerkt: 1 juli 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-12 border border-gray-100">
          
          {/* 1. Bedrijfsgegevens */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Bedrijfsgegevens</h2>
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
              <p className="font-semibold text-gray-900 mb-3 text-lg">Slim Geregeld Administratie</p>
              <p className="text-gray-700 mb-2">Slijpakker 14, 1541TE Koog aan de Zaan</p>
              <p className="text-gray-700 mb-2">KVK: 92596991 – BTW: NL004963420B24</p>
              <p className="text-gray-700">E-mail: kyle@slim-geregeld.nl</p>
            </div>
          </section>

          {/* 2. Definities */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Definities</h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Opdrachtnemer:</strong> Slim Geregeld Administratie</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Opdrachtgever:</strong> De natuurlijke of rechtspersoon die gebruik maakt van de diensten van opdrachtnemer.</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Diensten:</strong> Administratieve en fiscale dienstverlening, inclusief communicatie via WhatsApp en andere digitale middelen.</span>
              </li>
            </ul>
          </section>

          {/* 3. Toepasselijkheid */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">3. Toepasselijkheid</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              Deze voorwaarden zijn van toepassing op alle diensten, offertes, overeenkomsten en contacten, tenzij schriftelijk anders overeengekomen.
            </p>
          </section>

          {/* 4. Totstandkoming van de overeenkomst */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Totstandkoming van de overeenkomst</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              Een overeenkomst komt tot stand zodra de opdrachtgever een dienst afneemt, een offerte accepteert of opdrachtnemer start met de uitvoering van werkzaamheden.
            </p>
          </section>

          {/* 5. Uitvoering */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Uitvoering</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Opdrachtnemer voert de diensten naar beste kunnen uit. Opdrachtgever is verantwoordelijk voor het tijdig en volledig aanleveren van juiste gegevens.</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Opdrachtnemer mag werkzaamheden (deels) laten uitvoeren door derden.</span>
              </li>
            </ul>
          </section>

          {/* 6. Prijzen en betaling */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Prijzen en betaling</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Alle bedragen zijn exclusief btw.</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Betaling dient te gebeuren binnen 14 dagen na factuurdatum.</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Bij te late betaling is opdrachtgever automatisch in verzuim en wordt 1% rente per maand berekend.</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Buitengerechtelijke incassokosten zijn voor rekening van opdrachtgever.</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Bij wanbetaling mag opdrachtnemer werkzaamheden opschorten of beëindigen.</span>
              </li>
            </ul>
          </section>

          {/* 7. Aansprakelijkheid */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Aansprakelijkheid</h2>
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Aansprakelijkheid is beperkt tot directe schade en tot maximaal het factuurbedrag van de betreffende dienst, met een absoluut maximum van €5.000.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Opdrachtnemer is niet aansprakelijk voor indirecte schade, gevolgschade of fouten als gevolg van onjuiste informatie van opdrachtgever.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Opdrachtgever vrijwaart opdrachtnemer voor aanspraken van derden.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* 8. Vertrouwelijkheid */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Vertrouwelijkheid</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              Alle gegevens van opdrachtgever worden vertrouwelijk behandeld. Informatie wordt alleen gedeeld met derden als dat noodzakelijk is voor uitvoering van de opdracht of wettelijk verplicht.
            </p>
          </section>

          {/* 9. Opzegging */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">9. Opzegging</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              Doorlopende overeenkomsten kunnen maandelijks worden opgezegd per e-mail. Bij opzegging blijft opdrachtgever gehouden tot betaling van reeds uitgevoerde werkzaamheden.
            </p>
          </section>

          {/* 10. Overmacht */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">10. Overmacht</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              Bij overmacht (bijvoorbeeld stroomstoringen, ziekte, software-uitval) kan opdrachtnemer haar verplichtingen tijdelijk opschorten of de overeenkomst beëindigen zonder aansprakelijkheid.
            </p>
          </section>

          {/* 11. Wijzigingen */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">11. Wijzigingen</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              Opdrachtnemer mag deze voorwaarden wijzigen. De meest recente versie is altijd beschikbaar via <strong>slim-geregeld.nl</strong>.
            </p>
          </section>

          {/* 12. Toepasselijk recht */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">12. Toepasselijk recht</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              Op alle rechtsverhoudingen is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter in Noord-Holland.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-blue-50 rounded-xl p-8 border border-blue-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Vragen over deze voorwaarden?</h2>
            <p className="text-gray-700 leading-relaxed mb-6 text-center text-lg">
              Heeft u vragen over deze algemene voorwaarden? Neem dan contact met ons op:
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

export default TermsConditions;