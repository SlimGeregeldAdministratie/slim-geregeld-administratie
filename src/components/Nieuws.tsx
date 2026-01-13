import React, { useEffect } from 'react';
import { Linkedin } from 'lucide-react';

const Nieuws = () => {
  useEffect(() => {
    window.scrollTo(0, 0);

    const script = document.createElement('script');
    script.src = 'https://platform.linkedin.com/in.js';
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://platform.linkedin.com/in.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  const linkedInPosts = [
    {
      url: 'https://www.linkedin.com/embed/feed/update/urn:li:share:7416803919345106944?collapsed=1',
      title: 'Belastingvrij verdienen als startende ondernemer in 2026: zo werkt het'
    },
{
      url: 'https://www.linkedin.com/embed/feed/update/urn:li:share:7413991999038722048?collapsed=1',
      title: 'Pensioenbeleggen: fiscaal voordeel dat veel zzp\'ers missen'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Nieuws & Updates
          </h1>
          <p className="text-lg text-gray-600">
            Blijf op de hoogte van de laatste tips en updates
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Linkedin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Volg mij op LinkedIn
                  </h2>
                  <p className="text-sm text-gray-600">
                    Praktische tips over administratie, ondernemerschap en belastingtips
                  </p>
                </div>
              </div>
              <a
                href="https://www.linkedin.com/in/kylebouwmeester/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm whitespace-nowrap"
              >
                <Linkedin className="w-4 h-4" />
                Volg Kyle
              </a>
            </div>
          </div>

<div className="space-y-8">
            {linkedInPosts.map((post, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{post.title}</h3>
                <div className="linkedin-embed-container">
                  <iframe
                    src={post.url}
                    height="600"
                    width="100%"
                    frameBorder="0"
                    allowFullScreen
                    title={`LinkedIn Post ${index + 1}`}
                    className="rounded-lg"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              Mis geen enkele update!
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Volg Slim Geregeld Administratie op LinkedIn voor wekelijkse tips over administratie,
              belastingen en slimmer ondernemen.
            </p>
            <a
              href="https://www.linkedin.com/in/kylebouwmeester/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium shadow-lg"
            >
              <Linkedin className="w-5 h-5" />
              Volg nu op LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nieuws;
