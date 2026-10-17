import {TypingTest} from './engine.js';
import {resultSummary} from './results.js';
const passages = [
  'small steps can lead to great things every morning brings a chance to learn something new build a useful habit and move a little closer to your goals take a deep breath relax your hands and let the words flow focus on the next letter and trust that speed will follow with practice the best way to improve is to show up again tomorrow a quiet moment of effort can change the shape of your day',
  'the city wakes slowly as the sun rises above the rooftops a small cafe opens its doors and the smell of fresh bread drifts into the street people walk to work with warm cups in their hands somewhere nearby a bicycle bell rings and a dog waits patiently by a gate these simple moments remind us to look around enjoy the journey and find a little joy in the everyday things we often pass without a thought',
  'a good idea often starts with a simple question what could be easier clearer or more useful you do not need to have every answer before you begin make a small plan try the first step and learn from what happens progress is built through patient work and honest reflection stay curious about the world around you and keep making things that help others each attempt is another chance to grow',
];
// Long passages keep fast typists supplied through a full sixty-second test.
const $ = id => document.getElementById(id);
let duration = 30, round = 0, test;
// Decorative flight layer is separate from the typing controls and scoring.
const sky = document.createElement('div');
sky.className = 'flight-sky';
sky.setAttribute('aria-hidden', 'true');
for (let i = 0; i < 12; i++) {
  const cloud = document.createElement('div');
  cloud.className = 'flight-cloud';
  cloud.style.setProperty('--i', i);
  cloud.style.setProperty('--x', `${i % 2 ? 75 : -75}vw`);
  cloud.style.setProperty('--y', `${[-48, 35, -15, 58, -62, 15][i % 6]}vh`);
  sky.append(cloud);
}
document.body.prepend(sky);
function render() {
  const state = test.snapshot(performance.now());
  document.body.classList.toggle('in-flight', test.started !== null && !state.done);
  document.body.classList.toggle('flight-paused', document.hidden);
  $('time').textContent = state.remaining; $('wpm').textContent = state.wpm; $('accuracy').textContent = state.accuracy;
  $('progress').style.width = `${state.remaining / duration * 100}%`;
  document.querySelector('.progress').setAttribute('aria-valuenow',state.remaining);
  $('badge').textContent = state.done ? 'Test complete' : test.started === null ? 'Ready when you are' : 'Find your flow';
  if (state.done && !$('typing').disabled) {
    $('typing').disabled = true; $('results').hidden = false;
    $('summary').textContent = resultSummary(state);
    $('hint').textContent = 'All done. Take a breath and try again.';
  }
}
function highlight() {
  [...$('passage').children].forEach((span,i)=>{span.className = i < test.text.length ? test.text[i] === test.passage[i] ? 'correct' : 'error' : i === test.text.length ? 'current' : '';});
  const current = $('passage').querySelector('.current');
  if(current) $('passage').scrollTop = Math.max(0,current.offsetTop - $('passage').offsetTop - 65);
}
function reset(focus=false) {
  const passage = [0,1,2].map(i=>passages[(round+i)%passages.length]).join(' ');round++;
  test = new TypingTest(passage,duration); $('typing').value='';$('typing').disabled=false;$('typing').maxLength=passage.length;
  $('passage').replaceChildren(...[...passage].map(c=>{const span=document.createElement('span');span.textContent=c;return span;}));
  $('results').hidden=true;$('hint').textContent='The clock starts with your first character.';
  document.querySelector('.progress').setAttribute('aria-valuemax',duration);
  highlight();render();if(focus)$('typing').focus();
}
$('typing').addEventListener('input',()=>{test.input($('typing').value,performance.now());$('typing').value=test.text;highlight();render();});
for(const event of ['paste','drop']) $('typing').addEventListener(event,e=>e.preventDefault());
$('typing').addEventListener('beforeinput',e=>{if(e.inputType==='insertFromPaste'||e.inputType==='insertFromDrop')e.preventDefault();});
document.querySelectorAll('[data-duration]').forEach(button=>button.addEventListener('click',()=>{duration=Number(button.dataset.duration);document.querySelectorAll('[data-duration]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));reset(true);}));
$('restart').addEventListener('click',()=>reset(true));$('again').addEventListener('click',()=>reset(true));
document.addEventListener('visibilitychange',render);setInterval(render,100);reset();
