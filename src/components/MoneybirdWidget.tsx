import { useEffect } from 'react';

// Expert-widget van Moneybird (moneybird.nl/experts/widget): sterren en reviews van ons Expert-profiel.
// adviser.js zoekt één element met id "moneybird-widget" en vult dat bij het laden; bij elke mount
// opnieuw laden, anders blijft hij leeg na een routewissel in de app.
const MoneybirdWidget = ({ layout = 'landscape' }: { layout?: 'landscape' | 'portrait' }) => {
  useEffect(() => {
    document.querySelectorAll('script[data-moneybird-widget]').forEach((s) => s.remove());
    const script = document.createElement('script');
    script.src = 'https://www.moneybird.nl/widget/adviser.js';
    script.async = true;
    script.dataset.moneybirdWidget = '1';
    document.body.appendChild(script);
    return () => script.remove();
  }, []);

  return <div id="moneybird-widget" data-layout={layout} data-adviser="kyle-slim-geregeld-administratie" />;
};

export default MoneybirdWidget;
