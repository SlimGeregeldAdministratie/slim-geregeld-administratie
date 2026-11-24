/* Eigen foutmeldingen in plaats van de browserballon ("Vul dit veld in" /
   "Please fill out this field"). Werkt voor elk formulier zonder novalidate;
   de twee intakes hebben hun eigen stapcontrole. De melding komt onder het
   veld, in de taal van de pagina, en verdwijnt zodra je het veld aanpast. */
(function () {
  var en = /^en/.test(document.documentElement.lang);
  var T = en
    ? { leeg: 'Please fill in this field.', email: 'Please enter a valid email address.', keuze: 'Please choose one of the options.', vink: 'Please tick this box.', anders: 'Please check this field.' }
    : { leeg: 'Vul dit veld in.', email: 'Vul een geldig e-mailadres in.', keuze: 'Kies een van de opties.', vink: 'Vink dit vakje aan.', anders: 'Controleer dit veld.' };
  function tekst(el) {
    var v = el.validity;
    if (el.type === 'radio') return T.keuze;
    if (el.type === 'checkbox') return T.vink;
    if (v.valueMissing) return T.leeg;
    if (v.typeMismatch && el.type === 'email') return T.email;
    return T.anders;
  }
  function plek(el) { return el.type === 'radio' ? (el.closest('.veld, fieldset, .sjablonen') || el.parentNode) : el; }
  function wis(el) {
    var p = plek(el);
    p.classList && p.classList.remove('sg-fout');
    var omhulsel = el.closest('.euro, .tel-rij') || p;
    var m = omhulsel.parentNode && omhulsel.parentNode.querySelector(':scope > .sg-melding[data-voor="' + (el.name || el.id) + '"]');
    if (el.type === 'radio') m = p.querySelector('.sg-melding');
    if (m) m.remove();
  }
  function toon(el) {
    wis(el);
    var p = plek(el), m = document.createElement('p');
    m.className = 'sg-melding'; m.setAttribute('role', 'alert'); m.setAttribute('data-voor', el.name || el.id || ''); m.textContent = tekst(el);
    p.classList.add('sg-fout');
    if (el.type === 'radio') p.appendChild(m); else (el.closest('.euro, .tel-rij') || p).insertAdjacentElement('afterend', m);
  }
  function klaar() {
    document.querySelectorAll('form:not([novalidate])').forEach(function (f) { f.setAttribute('novalidate', ''); f.setAttribute('data-sg-validatie', ''); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', klaar); else klaar();
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (!f.hasAttribute || !f.hasAttribute('data-sg-validatie')) return;
    var fout = [].slice.call(f.elements).filter(function (el) { return el.willValidate && !el.checkValidity(); });
    if (!fout.length) return;
    e.preventDefault(); e.stopImmediatePropagation();
    var gezien = {};
    fout.forEach(function (el) { if (el.type === 'radio') { if (gezien[el.name]) return; gezien[el.name] = 1; } toon(el); });
    fout[0].focus({ preventScroll: true });
    fout[0].scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, true);
  ['input', 'change'].forEach(function (t) {
    document.addEventListener(t, function (e) {
      var el = e.target; if (!el.form || !el.form.hasAttribute('data-sg-validatie')) return;
      if (el.checkValidity()) wis(el);
    }, true);
  });
})();
