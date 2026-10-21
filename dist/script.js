const music = document.querySelector('#wedding-music');
const entry = document.querySelector('#entry');
const enterButton = document.querySelector('#enter-button');
const musicControl = document.querySelector('#music-control');
const musicLabel = document.querySelector('#music-label');
const langButtons = [...document.querySelectorAll('[data-lang]')];

document.body.classList.add('locked');
music.volume = 0.36;

const translations = {
  rw: {
    kicker:'Urukundo rw’abantu babiri', verseTitle:'Icyo Imana yateranyije', verse:'“Ni cyo gituma umuntu azasiga se na nyina, akabana n’umugore we akaramata, bombi bakaba umubiri umwe.”', verseRef:'Itangiriro 2:24',
    familyKicker:'Hamwe n’imiryango yabo', familyTitle:'Bishimiye kubatumira', familyIntro:'Umuryango wa Hon. Rev. Senani Benoît n’uwa Mwunvaneza Sebuhinja Pecos, uhagarariwe na Bucana Sebuhinja, bishimiye kubatumira mu bukwe bw’abana babo.',
    dateKicker:'Muzirikane iyi tariki', dateTitle:'Ku wa Gatandatu, 13 Gashyantare 2027', saturday:'Ku wa Gatandatu', february:'Gashyantare', celebration:'Umunsi w’urukundo, ukwizera n’ibyishimo', seeProgramme:'Reba gahunda ↓',
    programmeKicker:'Ibirori', programmeTitle:'Gahunda y’ubukwe', dowryTitle:'Gusaba no gukwa', dowryText:'Umuhango wo gusaba no gukwa', churchTitle:'Umuhango w’idini', churchText:'Église Methodiste Libre mu Rwanda, Paroisse Cathedral ya Gikondo', receptionTitle:'Kwakira abatumiwe', receptionText:'Ibirori byo kwakira abatumiwe', map:'Reba aho biherereye ↗',
    countKicker:'Tubara iminsi isigaye', countTitle:'Kugeza ku munsi wacu', days:'Iminsi', hours:'Amasaha', minutes:'Iminota', seconds:'Amasegonda', presence:'Kwifatanya natwe bizadushimisha cyane!',
    keepClose:'Mugumane itariki', downloadTitle:'Ubutumire bw’ubukwe', downloadText:'Bika ubutumire bwuzuye kuri telefoni yawe.', downloadButton:'Bika ubutumire',
    contactKicker:'Dutegereje kubana namwe', contactTitle:'Muduhamagare', contactText:'Ku bindi bisobanuro, mushobora kuduhamagara.', bride:'Umugeni', groom:'Umukwe', family:'Umuryango'
  },
  fr: {
    kicker:'Deux vies, un amour', verseTitle:'Ce que Dieu a uni', verse:"« C’est pourquoi l’homme quittera son père et sa mère, et s’attachera à sa femme, et ils deviendront une seule chair. »", verseRef:'Genèse 2:24',
    familyKicker:'Avec leurs familles', familyTitle:'Ont le plaisir de vous inviter', familyIntro:'Les familles Hon. Rev. Senani Benoît et Mwunvaneza Sebuhinja Pecos, représentées par Bucana Sebuhinja, ont le grand plaisir de vous inviter aux cérémonies de mariage de leurs chers enfants.',
    dateKicker:'Réservez la date', dateTitle:'Samedi 13 février 2027', saturday:'Samedi', february:'Février', celebration:"Une journée d’amour, de foi et de célébration", seeProgramme:'Voir le programme ↓',
    programmeKicker:'La célébration', programmeTitle:'Programme du mariage', dowryTitle:'Présentation et remise de la dot', dowryText:'Cérémonie traditionnelle', churchTitle:'Cérémonie religieuse', churchText:'Église Methodiste Libre au Rwanda, Gikondo Cathedral Parish', receptionTitle:'Réception de mariage', receptionText:'Réception avec nos familles et nos amis', map:'Voir la carte ↗',
    countKicker:'Le compte à rebours', countTitle:'Jusqu’à notre “oui”', days:'Jours', hours:'Heures', minutes:'Minutes', seconds:'Secondes', presence:'Votre présence sera grandement appréciée !',
    keepClose:'Gardez la date près de vous', downloadTitle:'Notre invitation de mariage', downloadText:'Enregistrez l’invitation bilingue complète sur votre téléphone.', downloadButton:"Télécharger l’invitation",
    contactKicker:'Nous avons hâte de célébrer avec vous', contactTitle:'Contacts', contactText:"Pour toute question ou information complémentaire, n’hésitez pas à appeler.", bride:'La mariée', groom:'Le marié', family:'Famille'
  }
};

function setLanguage(lang){
  document.documentElement.lang = lang === 'rw' ? 'rw' : 'fr';
  document.querySelectorAll('[data-copy]').forEach(el => {
    const value = translations[lang][el.dataset.copy];
    if(value) el.textContent = value;
  });
  langButtons.forEach(button => button.classList.toggle('active', button.dataset.lang === lang));
  localStorage.setItem('invitationLanguage', lang);
}

langButtons.forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));
setLanguage(localStorage.getItem('invitationLanguage') || 'rw');

async function startMusic(){
  try { await music.play(); setMusicState(true); }
  catch { setMusicState(false); }
}

function setMusicState(playing){
  musicControl.classList.toggle('paused', !playing);
  musicControl.setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
  musicLabel.textContent = playing ? 'Music on' : 'Music off';
}

enterButton.addEventListener('click', async () => {
  await startMusic();
  entry.classList.add('hidden');
  document.body.classList.remove('locked');
});

musicControl.addEventListener('click', async () => {
  if(music.paused) await startMusic();
  else { music.pause(); setMusicState(false); }
});

window.addEventListener('load', () => music.play().then(() => setMusicState(true)).catch(() => setMusicState(false)));

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if(entry.isIntersecting){ entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: .14 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const petals = document.querySelector('#petals');
for(let i=0;i<22;i++){
  const petal = document.createElement('i');
  petal.className = 'petal';
  petal.style.left = `${Math.random()*100}%`;
  petal.style.opacity = (.25 + Math.random()*.65).toFixed(2);
  petal.style.animationDuration = `${9 + Math.random()*12}s`;
  petal.style.animationDelay = `${-Math.random()*18}s`;
  petal.style.setProperty('--drift', `${-90 + Math.random()*180}px`);
  petal.style.transform = `scale(${.45 + Math.random()*.85})`;
  petals.appendChild(petal);
}

const weddingTime = new Date('2027-02-13T09:00:00+02:00').getTime();
function updateCountdown(){
  const distance = Math.max(0, weddingTime - Date.now());
  const values = {
    days: Math.floor(distance / 86400000),
    hours: Math.floor(distance / 3600000) % 24,
    minutes: Math.floor(distance / 60000) % 60,
    seconds: Math.floor(distance / 1000) % 60
  };
  Object.entries(values).forEach(([id,value]) => document.querySelector(`#${id}`).textContent = String(value).padStart(id === 'days' ? 3 : 2,'0'));
}
updateCountdown();
setInterval(updateCountdown,1000);
