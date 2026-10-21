// Gedeeld aanvraagformulier. Staat op /daft/ (DAFT, doel 453), /djft/ (Japans
// verdrag, doel 510) en /daft/renewal/ (verlenging). Alle drie posten naar
// dezelfde n8n-webhook daft-aanvraag; het veld 'aanbod' zegt welk product het is.
// Instellingen per pagina staan als data-attributen op het formulier:
//   data-pagina="daft|djft|renewal"  welke landingspagina dit is
//   data-soort="verlenging"          formulier staat vast op verlenging
(function(){
  var form=document.getElementById('daftform');
  if(!form) return;
  var pagina=form.getAttribute('data-pagina')||'daft';
  var vasteSoort=form.getAttribute('data-soort')||'';
  var planVink=document.getElementById('d-plan');

  // Prijzen excl. btw per soort aanvraag. Verlenging staat voorlopig gelijk aan
  // een eerste aanvraag (besluit Kyle 21-10-2026); hier aanpassen als dat verandert.
  var PRIJZEN={
    eerste:{standard:'€495',rush:'€595'},
    verlenging:{standard:'€495',rush:'€595'}
  };

  function zetOptie(v){
    if(v==='plan'){ planVink.checked=true; }
    else{
      var r=document.querySelector('#d-keuze input[value="'+v+'"]');
      if(r)r.checked=true;
    }
    markeer();
  }

  function markeer(){
    document.querySelectorAll('#d-keuze label, #d-checklist label, #d-inbreng-rij').forEach(function(l){
      var i=l.querySelector('input');
      if(i)l.classList.toggle('aan',i.checked);
    });
    // met het Plan zit het document erbij, dus streep de losse prijs door
    var plan=planVink.checked;
    document.getElementById('d-plan-blok').classList.toggle('aan',plan);
    document.getElementById('d-omzet-blok').classList.toggle('verborgen',!plan);
    document.querySelectorAll('#d-keuze .k-prijs').forEach(function(p){
      p.classList.toggle('door',plan);
      var gratis=p.parentNode.querySelector('.k-gratis');
      if(plan&&!gratis){
        gratis=document.createElement('span');
        gratis.className='k-gratis';
        gratis.textContent='included';
        p.parentNode.appendChild(gratis);
      }else if(!plan&&gratis){ gratis.remove(); }
    });
  }

  // wie de storting heeft afgevinkt, kent het bedrag: dan is het veld verplicht
  var depositVink=document.getElementById('d-deposit-done');
  function stortingVerplicht(){ return depositVink.checked; }
  depositVink.addEventListener('change',function(){
    document.getElementById('d-storting-opt').textContent =
      stortingVerplicht() ? 'required' : 'optional';
  });

  // Eerste aanvraag of verlenging. De IND vraagt bij een verlenging andere stukken
  // (balans en W&V over twee boekjaren, bankafschrift volstaat niet), dus de halve
  // vragenlijst van een eerste aanvraag is dan niet van toepassing. In plaats van
  // die vragen te laten staan wisselt het formulier van inhoud.
  function isVerlenging(){
    return document.getElementById('d-soort-verlenging').checked;
  }
  function wisselSoort(){
    var v=isVerlenging();
    document.getElementById('d-lijst-eerste').classList.toggle('verborgen',v);
    document.getElementById('d-lijst-verleng').classList.toggle('verborgen',!v);
    document.getElementById('d-inv-eerste').classList.toggle('verborgen',v);
    document.getElementById('d-inv-verleng').classList.toggle('verborgen',!v);
    document.getElementById('d-stap3-titel').childNodes[0].nodeValue=v?'Your figures':'Your investment';
    document.getElementById('d-dot3').textContent=v?'3 · Your figures':'3 · Your investment';
    document.getElementById('d-stap3-sub').textContent=v
      ? 'This tells me whether the statement is a check on figures that exist, or whether they have to be drawn up first.'
      : 'This lets me prepare your draft balance sheet straight away.';
    var prijzen=PRIJZEN[v?'verlenging':'eerste'];
    document.querySelectorAll('#d-keuze input[name="snelheid"]').forEach(function(r){
      var p=r.parentNode.querySelector('.k-prijs');
      if(p&&prijzen[r.value]) p.textContent=prijzen[r.value];
    });
    markeer();
  }
  // Welk product dit is, voor de melding aan Kyle en de telling per aanbod.
  function aanbod(){
    if(isVerlenging()) return 'renewal';
    return document.getElementById('d-nationaliteit').value==='jp' ? 'djft' : 'daft';
  }
  document.querySelectorAll('input[name="soort"]').forEach(function(r){
    r.addEventListener('change',wisselSoort);
  });
  // Partnerlink: /daft/?via=<partner>. De bron wordt bewaard voor deze sessie
  // (ook als iemand eerst de verlengingspagina bekijkt) en gaat mee met de
  // aanvraag, zodat per verwijzer te tellen is wat er binnenkomt.
  var via='';
  try{
    var viaUrl=(new URLSearchParams(location.search).get('via')||'').toLowerCase();
    if(/^[a-z0-9-]{2,30}$/.test(viaUrl)) sessionStorage.setItem('sg_via',viaUrl);
    via=sessionStorage.getItem('sg_via')||'';
  }catch(e){}
  // Oude links en mails wijzen nog naar /daft/?soort=verlenging#request. Die
  // blijven werken; de verlengingspagina zelf zet de soort vast via data-soort.
  try{
    if(vasteSoort==='verlenging'||new URLSearchParams(location.search).get('soort')==='verlenging'){
      document.getElementById('d-soort-verlenging').checked=true;
    }
  }catch(e){}
  wisselSoort();
  var boekenKeuze=document.getElementById('d-boeken');
  boekenKeuze.addEventListener('change',function(){
    document.getElementById('d-boeken-blok').classList.toggle('verborgen',boekenKeuze.value!=='anders');
  });

  // inbreng-blok tonen zodra iemand aangeeft spullen in te brengen
  var inbrengJa=document.getElementById('d-inbreng-ja');
  inbrengJa.addEventListener('change',function(){
    document.getElementById('d-inbreng-blok').classList.toggle('verborgen',!inbrengJa.checked);
    markeer();
  });

  // datumveld: niet in het verleden, en waarschuwen bij een korte deadline
  var planning=document.getElementById('d-planning');
  var vandaag=new Date(); vandaag.setHours(0,0,0,0);
  planning.min=new Date(vandaag.getTime()-vandaag.getTimezoneOffset()*60000).toISOString().slice(0,10);
  planning.addEventListener('change',function(){
    var hint=document.getElementById('d-hint-deadline');
    if(!planning.value){ hint.classList.add('verborgen'); return; }
    var d=new Date(planning.value+'T00:00:00');
    var dagen=Math.round((d-vandaag)/86400000);
    if(dagen<0){ hint.classList.add('verborgen'); return; }
    if(dagen<=2){
      hint.innerHTML='<b>That is very soon.</b> Even the 48 hour option needs your documents in hand today. Send the form anyway and you get an honest answer about whether it can still be done.';
      hint.classList.remove('verborgen');
    }else if(dagen<=8){
      hint.innerHTML='<b>Only '+dagen+' days.</b> Standard delivery takes five working days, which leaves you almost no margin. The 48 hour option below is the safer choice for a deadline like this.';
      hint.classList.remove('verborgen');
    }else{
      hint.classList.add('verborgen');
    }
  });

  // waarschuwen zodra de storting onder de 4.500 zit
  var storting=document.getElementById('d-storting');
  storting.addEventListener('input',function(){
    var n=parseFloat(storting.value.replace(/[^0-9,.]/g,'').replace(/\./g,'').replace(',','.'));
    var laag=(!isNaN(n)&&n>0&&n<4500);
    document.getElementById('d-hint-laag').classList.toggle('verborgen',!laag);
  });

  // uitleg en invulveld bij lening of combinatie
  var herkomst=document.getElementById('d-herkomst');
  herkomst.addEventListener('change',function(){
    var v=herkomst.value;
    document.getElementById('d-hint-lening').classList.toggle('verborgen',!(v==='loan'||v==='mix'));
    document.getElementById('d-herkomst-blok').classList.toggle('verborgen',v!=='mix');
  });

  // Hoe iemand hier terechtkwam. Optioneel, en de vervolgvraag komt alleen bij
  // de antwoorden waar het detail iets waard is: welk model, welke groep, en
  // vooral wie de adviseur was, want die kun je bedanken.
  var gevonden=document.getElementById('d-gevonden');
  var gevondenBlok=document.getElementById('d-gevonden-blok');
  var gevondenLabel=document.getElementById('d-gevonden-label');
  var gevondenTekst=document.getElementById('d-gevonden-tekst');
  var VRAAG={
    ai:['Which one? <span class="opt">optional</span>','ChatGPT, Claude, Gemini, Copilot'],
    reddit:['Which subreddit, if you remember? <span class="opt">optional</span>','r/Netherlands'],
    facebook:['Which group? <span class="opt">optional</span>','Americans in the Netherlands'],
    adviseur:['Who was it? We would like to thank them. <span class="opt">optional</span>','Name of the lawyer or adviser'],
    anders:['Where was it? <span class="opt">optional</span>','']
  };
  gevonden.addEventListener('change',function(){
    var v=VRAAG[gevonden.value];
    gevondenBlok.classList.toggle('verborgen',!v);
    if(v){ gevondenLabel.innerHTML=v[0]; gevondenTekst.placeholder=v[1]; }
    else { gevondenTekst.value=''; }
  });
  // Kwam iemand binnen via een partnerlink, dan staat de bron al goed.
  if(via && !gevonden.value){
    gevonden.value='adviseur';
    gevonden.dispatchEvent(new Event('change'));
  }

  document.querySelectorAll('#d-keuze input, #d-checklist input, #d-plan').forEach(function(i){
    i.addEventListener('change',markeer);
  });
  markeer();

  // prijskaart-knoppen zetten de keuze in het formulier alvast goed
  // De twee tredes van het Compliance Plan. Zonder JavaScript blijft de rustige
  // trede gewoon staan, dat is de trede waar de meeste mensen beginnen.
  (function(){
    var schakel=document.getElementById('plan-schakel');
    if(!schakel) return;
    var bedrag=document.getElementById('plan-bedrag');
    var wanneer=document.getElementById('plan-wanneer');
    var teksten={
      rustig:{prijs:'\u20ac79',uitleg:'Quiet: up to 1 invoice and 3 receipts a month, on the KOR so no VAT returns.'},
      handel:{prijs:'\u20ac149',uitleg:'Active: more than that and/or you charge VAT.'}
    };
    schakel.querySelectorAll('button').forEach(function(k){
      k.addEventListener('click',function(){
        var trede=k.getAttribute('data-trede');
        schakel.querySelectorAll('button').forEach(function(b){
          var aan=b===k;
          b.classList.toggle('aan',aan);
          b.setAttribute('aria-pressed',aan?'true':'false');
        });
        bedrag.innerHTML=teksten[trede].prijs+'<small>/month</small>';
        wanneer.textContent=teksten[trede].uitleg;
        document.querySelectorAll('ul[data-trede]').forEach(function(u){
          u.hidden=u.getAttribute('data-trede')!==trede;
        });
      });
    });
  })();

  document.querySelectorAll('[data-optie]').forEach(function(a){
    a.addEventListener('click',function(){ zetOptie(a.getAttribute('data-optie')); });
  });

  var melding=document.getElementById('d-melding');
  var stap=1;
  var terug=document.getElementById('d-terug');
  var verder=document.getElementById('d-verder');
  var verstuur=document.getElementById('d-verstuur');

  function toonStap(n,scroll){
    stap=n;
    document.querySelectorAll('.fstap').forEach(function(f){
      f.classList.toggle('actief',f.getAttribute('data-stap')==String(n));
    });
    document.querySelectorAll('.stap-dot').forEach(function(d){
      var i=Number(d.getAttribute('data-dot'));
      d.classList.toggle('actief',i===n);
      d.classList.toggle('klaar',i<n);
    });
    terug.style.display=n>1?'inline-flex':'none';
    verder.style.display=n<3?'inline-flex':'none';
    verstuur.style.display=n===3?'inline-flex':'none';
    // bij wisselen van stap terug naar de bovenkant van het formulier,
    // anders sta je middenin een stap die net van hoogte veranderd is
    if(scroll){
      var blok=document.querySelector('.vraagblok');
      var y=blok.getBoundingClientRect().top+window.scrollY-90;
      window.scrollTo({top:y,behavior:'smooth'});
    }
  }
  verder.addEventListener('click',function(){
    if(stap>=3)return;
    melding.className='melding';
    if(stap===1){
      var naam=document.getElementById('d-naam').value.trim();
      var email=document.getElementById('d-email').value.trim();
      if(!naam||!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)){
        melding.textContent='Please fill in your name and a valid email address.';
        melding.className='melding fout';return;
      }
      window.dataLayer=window.dataLayer||[];
      window.dataLayer.push({event:'daft_form_stap2',pagina:pagina});
    }
    toonStap(stap+1,true);
  });
  terug.addEventListener('click',function(){
    if(stap<=1)return;
    melding.className='melding';
    toonStap(stap-1,true);
  });

  form.addEventListener('submit',async function(e){
    e.preventDefault();
    melding.className='melding';
    var naam=document.getElementById('d-naam').value.trim();
    var email=document.getElementById('d-email').value.trim();
    if(!naam||!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)){
      melding.textContent='Please fill in your name and a valid email address.';
      melding.className='melding fout';toonStap(1,true);return;
    }
    // wie het plan kiest, moet kiezen tussen rustig en actief: dat bepaalt de prijs
    if(planVink.checked&&!document.querySelector('#d-drukte input:checked')){
      melding.textContent='You ticked the Compliance Plan, so please choose quiet or active. It decides your monthly price.';
      melding.className='melding fout';
      toonStap(3,true);
      setTimeout(function(){document.getElementById('d-drukte').scrollIntoView({block:'center'});},400);
      return;
    }
    // Het bronveld is verplicht, met 'Rather not say' als uitweg. Zo weet Kyle bij
    // elke aanvraag waar die vandaan kwam, of in elk geval dat iemand het niet zegt.
    if(!gevonden.value){
      melding.textContent='Please tell us how you found us, or choose Rather not say.';
      melding.className='melding fout';
      toonStap(3,true);
      setTimeout(function(){gevonden.focus();},400);
      return;
    }
    if(stortingVerplicht()&&!storting.value.trim()){
      melding.textContent='You ticked that the €4,500 is in the business, so please fill in the amount. It is what your balance sheet is built on.';
      melding.className='melding fout';
      toonStap(3,true);
      setTimeout(function(){storting.focus();},400);
      return;
    }
    verstuur.disabled=true;verstuur.textContent='Sending...';
    var verstuurdAanbod=aanbod();
    try{
      var r=await fetch('https://n8n.slim-geregeld.nl/webhook/daft-aanvraag',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
        naam:naam,email:email,
        telefoon:document.getElementById('d-tel').value.trim(),
        nationaliteit:document.getElementById('d-nationaliteit').value,
        bedrijf:document.getElementById('d-bedrijf').value.trim(),
        kvk:document.getElementById('d-kvk').value.trim(),
        vorm:document.getElementById('d-vorm').value,
        kvkDone:document.getElementById('d-kvk-done').checked,
        bankDone:document.getElementById('d-bank-done').checked,
        depositDone:document.getElementById('d-deposit-done').checked,
        appointmentDone:isVerlenging()
          ? document.getElementById('d-appointment-done-v').checked
          : document.getElementById('d-appointment-done').checked,
        renewal:isVerlenging(),
        aanbod:verstuurdAanbod,
        pagina:pagina,
        vorigJaarDone:document.getElementById('d-vorigjaar-done').checked,
        ditJaarDone:document.getElementById('d-ditjaar-done').checked,
        boeken:document.getElementById('d-boeken').value,
        boekenTekstVrij:document.getElementById('d-boeken-tekst').value.trim(),
        vermogen:document.getElementById('d-vermogen').value,
        planning:document.getElementById('d-planning').value.trim(),
        storting:document.getElementById('d-storting').value.trim(),
        inbrengJa:document.getElementById('d-inbreng-ja').checked,
        inbreng:document.getElementById('d-inbreng').value.trim(),
        herkomst:document.getElementById('d-herkomst').value,
        herkomstTekst:document.getElementById('d-herkomst-tekst').value.trim(),
        snelheid:(document.querySelector('#d-keuze input:checked')||{value:'standard'}).value,
        plan:planVink.checked,
        drukte:planVink.checked?((document.querySelector('#d-drukte input:checked')||{}).value||''):'',
        bericht:document.getElementById('d-bericht').value.trim(),
        gevonden:document.getElementById('d-gevonden').value,
        gevondenTekst:document.getElementById('d-gevonden-tekst').value.trim(),
        via:via,
        website2:document.getElementById('d-website2').value
      })});
      if(!r.ok)throw new Error('status '+r.status);
      form.reset();
      document.getElementById('d-inbreng-blok').classList.add('verborgen');
      document.getElementById('d-omzet-blok').classList.add('verborgen');
      document.getElementById('d-herkomst-blok').classList.add('verborgen');
      document.getElementById('d-gevonden-blok').classList.add('verborgen');
      document.getElementById('d-hint-laag').classList.add('verborgen');
      document.getElementById('d-hint-lening').classList.add('verborgen');
      document.getElementById('d-hint-deadline').classList.add('verborgen');
      document.getElementById('d-storting-opt').textContent='optional';
      wisselSoort();
      toonStap(1);
      melding.textContent='Sent. Check your inbox: a confirmation with the next steps is on its way, and you will get a personal reply within one working day.';
      melding.className='melding ok';
      verstuur.disabled=false;verstuur.textContent='Send request →';
      window.dataLayer=window.dataLayer||[];
      window.dataLayer.push({event:'daft_aanvraag_verstuurd',aanbod:verstuurdAanbod});
    }catch(err){
      melding.textContent='Sending failed. Please email kyle@slim-geregeld.nl directly and you will get the same fast reply.';
      melding.className='melding fout';
      verstuur.disabled=false;verstuur.textContent='Send request →';
    }
  });
})();
