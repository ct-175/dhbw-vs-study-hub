import {parseNumbers,statistics,business,validateBackup} from './core.js';
import {cards as seedCards,quiz as questions,links,subjects} from './content.js';

const $ = id => document.getElementById(id);
const key = 'dhbw-vs-study-hub-v1';
const blank = () => ({version:1,tasks:[],cards:[],known:[],notes:{}});
let state = blank(), storageProblem = false;
try { const saved=localStorage.getItem(key); if(saved) state=validateBackup(JSON.parse(saved)); } catch { storageProblem=true; }
const node = (tag,text='',className='') => {const n=document.createElement(tag);n.textContent=text;n.className=className;return n;};
let noticeTimer;
function announce(message) { clearTimeout(noticeTimer); $('notice').textContent=message; $('notice').hidden=false; noticeTimer=setTimeout(()=>$('notice').hidden=true,5500); }
function save() {try{localStorage.setItem(key,JSON.stringify(state));}catch{announce('Die Daten konnten nicht dauerhaft gespeichert werden. Bitte ein Backup exportieren.');}renderDashboard();}
const format = value => value===null ? '—' : Math.abs(value)>0 && (Math.abs(value)<.000001 || Math.abs(value)>=1e12) ? value.toExponential(5).replace('.',',') : new Intl.NumberFormat('de-DE',{maximumFractionDigits:6}).format(value);
const money = value => new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR',maximumFractionDigits:2}).format(value);
const date = value => value ? new Date(value+'T12:00:00').toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit',year:'numeric'}) : 'Ohne Datum';
const today = () => {const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
const allCards = () => [...seedCards,...state.cards];
const tasksSorted = () => [...state.tasks].sort((a,b)=>(a.done-b.done)||(a.date||'9999').localeCompare(b.date||'9999'));
function metric(label,value,detail) { const n=node('div','','metric');n.append(node('span',label),node('strong',String(value)),node('small',detail));return n; }
function taskRow(task,compact=false) {
  const row=node('div','','task-row'+(task.done?' done':'')),check=node('input');check.type='checkbox';check.checked=task.done;check.setAttribute('aria-label',`${task.title}: erledigt`);
  check.addEventListener('change',()=>{task.done=check.checked;save();renderTasks();});
  const text=node('div','','task-text'),meta=node('small',`${task.subject} · ${date(task.date)}`);
  if(task.date && task.date<today() && !task.done){meta.textContent+=' · überfällig';meta.className='overdue';}
  text.append(node('strong',task.title),meta);row.append(check,text);
  if(!compact){const remove=node('button','Löschen','quiet danger');remove.setAttribute('aria-label',`Aufgabe löschen: ${task.title}`);remove.addEventListener('click',()=>{state.tasks=state.tasks.filter(t=>t.id!==task.id);save();renderTasks();});row.append(remove);}
  return row;
}
function renderDashboard() {
  const total=allCards().length,known=allCards().filter(c=>state.known.includes(c.id)).length;
  $('metrics').replaceChildren(metric('LERNPLAN',state.tasks.filter(t=>!t.done).length,'offene Aufgaben'),metric('KARTEIKARTEN',`${known} / ${total}`,'als gekonnt markiert'),metric('LERNGEBIETE',subjects.length,'frei ergänzbar'));
  const tasks=tasksSorted().filter(t=>!t.done).slice(0,3);
  $('upcoming').replaceChildren(...(tasks.length?tasks.map(t=>taskRow(t,true)):[node('p','Noch keine Aufgaben. Lege im Lernplan deinen nächsten Schritt an.','empty')]));
}
$('quicklinks').replaceChildren(...links.map(link=>{const a=node('a','','link-card');a.href=link.url;a.target='_blank';a.rel='noopener noreferrer';a.append(node('span',link.tag,'eyebrow'),node('h3',link.name+' ↗'),node('p',link.description));return a;}));
$('today').textContent=new Date().toLocaleDateString('de-DE',{weekday:'short',day:'2-digit',month:'long'});
function route() {
  const knownViews=['dashboard','learn','stats','business','plan','settings'];
  const requested=location.hash.slice(1),view=knownViews.includes(requested)?requested:'dashboard';
  for(const id of knownViews) $(id).hidden=id!==view;
  document.querySelectorAll('nav a').forEach(a=>a.hash==='#'+view?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));
  document.title=`${{dashboard:'Übersicht',learn:'Lernbereich',stats:'Statistik',business:'BWL-Rechner',plan:'Lernplan',settings:'Meine Daten'}[view]} · Study Hub`;
  if(view==='plan')renderTasks();
  if(view==='dashboard')renderDashboard();
}
window.addEventListener('hashchange',()=>{route();$('main').focus({preventScroll:true});window.scrollTo(0,0);});
try{document.body.classList.toggle('dark',localStorage.getItem(key+'-theme')==='dark');}catch{}
function themeLabel(){$('theme').textContent=document.body.classList.contains('dark')?'Hell':'Dunkel';}
$('theme').addEventListener('click',()=>{document.body.classList.toggle('dark');themeLabel();try{localStorage.setItem(key+'-theme',document.body.classList.contains('dark')?'dark':'light');}catch{}});themeLabel();

let cardIndex=0,revealed=false,quizIndex=0,quizScore=0,answered=false;
const deck=()=>allCards().filter(c=>c.subject===$('subject').value);
const quizDeck=()=>questions.filter(q=>q.subject===$('subject').value);
function renderCard(){
  const selected=deck();if(cardIndex>=selected.length)cardIndex=0;
  const card=selected[cardIndex];$('flashcard').replaceChildren();$('card-position').textContent=card?`${cardIndex+1} / ${selected.length}`:'0 Karten';
  ['reveal','again','known','previous-card','next-card'].forEach(id=>$(id).disabled=!card);
  $('delete-card').hidden=!card||!state.cards.some(c=>c.id===card.id);
  if(!card){$('flashcard').append(node('p','Hier ist noch Platz für deine ersten eigenen Karteikarten.','empty'));return;}
  $('flashcard').append(node('div',state.known.includes(card.id)?'ALS GEKONNT MARKIERT':card.subject.toUpperCase(),'eyebrow'),node('h3',card.question));
  if(revealed)$('flashcard').append(node('p',card.answer));
  $('reveal').textContent=revealed?'Antwort verbergen':'Antwort zeigen';
  $('again').disabled=!revealed;$('known').disabled=!revealed;
}
function advanceCard(direction=1){const n=deck().length;if(n)cardIndex=(cardIndex+direction+n)%n;revealed=false;renderCard();}
$('reveal').addEventListener('click',()=>{revealed=!revealed;renderCard();});
$('previous-card').addEventListener('click',()=>advanceCard(-1));$('next-card').addEventListener('click',()=>advanceCard());
$('known').addEventListener('click',()=>{const c=deck()[cardIndex];if(!state.known.includes(c.id))state.known.push(c.id);save();advanceCard();announce('Als gekonnt markiert.');});
$('again').addEventListener('click',()=>{state.known=state.known.filter(id=>id!==deck()[cardIndex].id);save();advanceCard();});
$('delete-card').addEventListener('click',()=>{const c=deck()[cardIndex];if(!confirm('Diese eigene Karte löschen?'))return;state.cards=state.cards.filter(x=>x.id!==c.id);state.known=state.known.filter(id=>id!==c.id);save();revealed=false;renderCard();});
$('card-form').addEventListener('submit',event=>{event.preventDefault();const question=$('question').value.trim(),answer=$('answer').value.trim();if(!question||!answer){announce('Bitte Frage und Antwort ausfüllen.');return;}if(state.cards.length>=500){announce('Maximal 500 eigene Karten sind möglich.');return;}const card={id:'custom-'+crypto.randomUUID(),subject:$('subject').value,question,answer};state.cards.push(card);save();$('card-form').reset();cardIndex=deck().length-1;revealed=false;renderCard();announce('Karte hinzugefügt.');});
$('save-notes').addEventListener('click',()=>{state.notes[$('subject').value]=$('notes').value;save();announce('Notizen gespeichert.');});
$('subject').addEventListener('change',()=>{cardIndex=0;revealed=false;quizIndex=0;quizScore=0;answered=false;$('notes').value=state.notes[$('subject').value]||'';renderCard();renderQuiz();});
function renderQuiz(){
  const quiz=quizDeck(),container=$('quiz');container.replaceChildren();$('quiz-next').hidden=true;
  if(!quiz.length){$('quiz-position').textContent='';container.append(node('p','Für dieses Lerngebiet ist noch kein Quiz hinterlegt. Mit eigenen Karten kannst du trotzdem üben.','empty'));return;}
  if(quizIndex>=quiz.length){$('quiz-position').textContent='Abgeschlossen';container.append(node('h3',`${quizScore} von ${quiz.length} richtig`),node('p','Ein weiterer Durchgang hilft beim Festigen.'));const restart=node('button','Noch einmal starten');restart.addEventListener('click',()=>{quizIndex=0;quizScore=0;answered=false;renderQuiz();});container.append(restart);return;}
  const q=quiz[quizIndex];$('quiz-position').textContent=`${quizIndex+1} / ${quiz.length}`;container.append(node('h3',q.question));
  const options=node('div','','quiz-options'),feedback=node('p','','feedback');feedback.setAttribute('role','status');
  q.options.forEach((text,i)=>{const btn=node('button',text);btn.addEventListener('click',()=>{if(answered)return;answered=true;if(i===q.correct)quizScore++;options.querySelectorAll('button').forEach((b,j)=>{b.disabled=true;if(j===q.correct)b.classList.add('correct');else if(j===i)b.classList.add('wrong');});feedback.textContent=(i===q.correct?'Richtig. ':'Noch nicht ganz. ')+q.explanation;$('quiz-next').hidden=false;$('quiz-next').textContent=quizIndex===quiz.length-1?'Ergebnis ansehen':'Nächste Frage';});options.append(btn);});container.append(options,feedback);
}
$('quiz-next').addEventListener('click',()=>{quizIndex++;answered=false;renderQuiz();});

function resultCard(label,value){const n=node('div','','result-card');n.append(node('span',label),node('strong',value));return n;}
function resultLine(label,value){const n=node('div','','result-line');n.append(node('span',label),node('strong',value));return n;}
function panel(title){const n=node('article','','panel');n.append(node('h2',title));return n;}
function statsPlot(s){
  const buckets=s.frequencies.length<=12?s.frequencies.map(([value,count])=>({label:format(value),count})):Array.from({length:10},(_,i)=>({label:format(s.min+(s.range/10)*i),count:0}));
  if(s.frequencies.length>12)s.sorted.forEach(v=>buckets[Math.min(9,Math.floor((v-s.min)/s.range*10))].count++);
  const namespace='http://www.w3.org/2000/svg';const svg=document.createElementNS(namespace,'svg');svg.setAttribute('viewBox','0 0 640 210');svg.setAttribute('role','img');svg.setAttribute('aria-label',s.frequencies.length<=12?'Balkendiagramm der absoluten Häufigkeiten':'Histogramm mit zehn gleich breiten Klassen. Die Tabelle enthält die exakten Häufigkeiten.');svg.classList.add('plot');
  const max=Math.max(...buckets.map(b=>b.count)),width=580/buckets.length;
  buckets.forEach((b,i)=>{const rect=document.createElementNS(namespace,'rect'),x=38+i*width,y=165-b.count/max*135;rect.setAttribute('x',x);rect.setAttribute('y',y);rect.setAttribute('width',Math.max(2,width-8));rect.setAttribute('height',165-y);rect.setAttribute('rx','4');rect.setAttribute('fill','currentColor');const title=document.createElementNS(namespace,'title');title.textContent=`${b.label}: ${b.count} Beobachtungen`;rect.append(title);svg.append(rect);const text=document.createElementNS(namespace,'text');text.setAttribute('x',x+(width-8)/2);text.setAttribute('y',y-7);text.setAttribute('text-anchor','middle');text.textContent=b.count;svg.append(text);if(i%Math.ceil(buckets.length/6)===0){const label=document.createElementNS(namespace,'text');label.setAttribute('x',x);label.setAttribute('y','190');label.textContent=b.label;svg.append(label);}});
  return svg;
}
function calculateStats(){
  $('stats-error').textContent='';const out=$('stats-result');out.replaceChildren();
  try{
    const s=statistics(parseNumbers($('values').value)),sample=$('variance').value==='sample',v=sample?s.sampleVariance:s.populationVariance;
    const grid=node('div','','result-grid');grid.append(resultCard('Anzahl n',format(s.n)),resultCard('Mittelwert x̄',format(s.mean)),resultCard('Median',format(s.median)),resultCard('Modus',s.modes.length?s.modes.slice(0,5).map(format).join(' / ')+(s.modes.length>5?' …':''):'Kein wiederholter Wert'),resultCard('Varianz',format(v)),resultCard('Standardabweichung',format(v===null?null:Math.sqrt(v))),resultCard('Minimum / Maximum',`${format(s.min)} / ${format(s.max)}`),resultCard('Spannweite',format(s.range)));
    const method=panel('So entsteht das Ergebnis');method.append(node('p',`Sortierte Werte: ${s.sorted.slice(0,60).map(format).join('; ')}${s.n>60?' … (erste 60 Werte)':''}`,'fine'),node('p',`Mittelwert: Σxᵢ / n = ${format(s.sorted.reduce((a,b)=>a+b,0))} / ${s.n} = ${format(s.mean)}`,'formula'),node('p',s.n%2===1?`Median: mittlerer Wert an Position ${(s.n+1)/2} = ${format(s.median)}`:`Median: (${format(s.sorted[s.n/2-1])} + ${format(s.sorted[s.n/2])}) / 2 = ${format(s.median)}`,'formula'),node('p',`Summe der quadrierten Abweichungen Σ(xᵢ − x̄)² = ${format(s.squaredDeviations)}`,'formula'),node('p',v===null?'Für die korrigierte Stichprobenvarianz sind mindestens zwei Werte nötig.':`Varianz: ${format(s.squaredDeviations)} / ${sample?'(n − 1)':'n'} = ${format(s.squaredDeviations)} / ${sample?s.n-1:s.n} = ${format(v)}`,'formula'),node('p',`Q₁ = ${format(s.q1)} · Q₃ = ${format(s.q3)}. Quartile: lineare Interpolation an Position (n − 1) × p in der nullbasierten sortierten Reihe. Dein Skript kann eine andere Quartilsdefinition verwenden.`,'fine'));
    if(s.modes.length>5)method.append(node('p',`${s.modes.length} Werte sind gleich häufig (je ${Math.max(...s.frequencies.map(([,count])=>count))}-mal); im Kennzahlenfeld sind die ersten fünf dargestellt.`,'fine'));
    const frequencies=panel('Häufigkeiten & Verteilung');frequencies.append(statsPlot(s),node('p',s.frequencies.length<=12?'Balken zeigen die Anzahl je Ausprägung.':'Histogramm mit zehn gleich breiten Klassen; die Beschriftung zeigt jeweils die untere Klassengrenze. Die letzte Klasse schließt den Maximalwert ein.','fine'));
    const wrap=node('div','','table-wrap'),table=node('table'),caption=node('caption','Absolute und relative Häufigkeiten');caption.className='fine';const head=node('thead'),row=node('tr');['Wert','Absolut','Relativ','Prozent'].forEach(text=>{const th=node('th',text);th.scope='col';row.append(th);});head.append(row);const body=node('tbody');s.frequencies.slice(0,200).forEach(([value,count])=>{const row=node('tr');[format(value),format(count),format(count/s.n),`${format(count/s.n*100)} %`].forEach(text=>row.append(node('td',text)));body.append(row);});table.append(caption,head,body);wrap.append(table);frequencies.append(wrap);if(s.frequencies.length>200)frequencies.append(node('p',`Tabelle zeigt die ersten 200 von ${s.frequencies.length} unterschiedlichen Werten. Alle Kennzahlen und das Histogramm berücksichtigen sämtliche Daten.`,'fine'));out.append(grid,method,frequencies);
  }catch(error){$('stats-error').textContent=error.message;}
}
$('stats-form').addEventListener('submit',event=>{event.preventDefault();calculateStats();});$('sample-data').addEventListener('click',()=>{$('values').value='2; 4; 4; 4; 5; 5; 7; 9';calculateStats();});
function calculateBusiness(){
  $('business-error').textContent='';const out=$('business-result');out.replaceChildren(node('h2','Dein Ergebnis'));
  try{const inputs=Object.fromEntries(['quantity','price','variable','fixed'].map(id=>[id,Number($(id).value)])),r=business(inputs);out.append(resultLine('Umsatz',money(r.revenue)),resultLine('Gesamtkosten',money(r.costs)),resultLine('Gewinn / Verlust',money(r.profit)),resultLine('Deckungsbeitrag je Stück',money(r.contribution)),resultLine('Break-even-Menge',r.breakEven===null?'Nicht erreichbar':`${format(r.breakEven)} Stück`),node('p',`Umsatz = ${format(inputs.quantity)} × ${money(inputs.price)}. Gesamtkosten = ${money(inputs.fixed)} + ${format(inputs.quantity)} × ${money(inputs.variable)}.`,'fine'));if(r.breakEven!==null)out.append(node('p',`Bei ganzen Stückzahlen: mindestens ${format(Math.ceil(r.breakEven))} Stück, um die Kosten zu decken. Formel: Fixkosten ÷ Stückdeckungsbeitrag.`,'fine'));else out.append(node('p',r.contribution===0&&inputs.fixed===0?'Bei einem Stückdeckungsbeitrag von 0 und Fixkosten von 0 ist der Gewinn bei jeder Menge genau 0; es gibt keinen einzelnen Break-even-Punkt.':'Bei einem nicht positiven Stückdeckungsbeitrag lassen sich positive Fixkosten in diesem Modell durch mehr Absatz nicht decken.','fine'));}
  catch(error){$('business-error').textContent=error.message;}
}
$('business-form').addEventListener('submit',event=>{event.preventDefault();calculateBusiness();});
function renderTasks(){const filter=$('task-filter').value,selected=tasksSorted().filter(t=>filter==='all'||(filter==='done'?t.done:!t.done));$('tasks').replaceChildren(...(selected.length?selected.map(t=>taskRow(t)):[node('p','Hier stehen noch keine passenden Aufgaben. Neue Aufgaben kannst du oben hinzufügen.','empty')]));}
$('task-filter').addEventListener('change',renderTasks);
$('task-form').addEventListener('submit',event=>{event.preventDefault();const title=$('task-title').value.trim();if(!title){announce('Bitte einen Aufgabentitel eingeben.');return;}if(state.tasks.length>=500){announce('Maximal 500 Aufgaben sind möglich.');return;}const task={id:crypto.randomUUID(),title,subject:$('task-subject').value,date:$('task-date').value,done:false};try{validateBackup({...state,tasks:[...state.tasks,task]});}catch{announce('Bitte ein gültiges Datum eingeben.');return;}state.tasks.push(task);save();$('task-form').reset();renderTasks();});
$('export').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=node('a');a.href=url;a.download=`study-hub-backup-${today()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);announce('Backup heruntergeladen.');});
$('import').addEventListener('change',async event=>{const file=event.target.files[0];if(!file)return;try{if(file.size>2000000)throw new Error('Die Datei darf höchstens 2 MB groß sein.');const imported=validateBackup(JSON.parse(await file.text()));if(!confirm('Vorhandene Aufgaben, Karten und Notizen durch dieses Backup ersetzen?'))return;state=imported;save();cardIndex=0;revealed=false;$('notes').value=state.notes[$('subject').value]||'';renderCard();renderTasks();announce('Backup importiert.');}catch(error){announce('Import fehlgeschlagen: '+error.message);}finally{event.target.value='';}});
$('reset').addEventListener('click',()=>{if(!confirm('Alle gespeicherten Aufgaben, eigenen Karten, Notizen und Lernmarkierungen auf diesem Gerät löschen?'))return;state=blank();save();cardIndex=0;revealed=false;$('notes').value='';renderCard();renderTasks();announce('Gespeicherte Daten gelöscht.');});
$('notes').value=state.notes[$('subject').value]||'';renderDashboard();renderCard();renderQuiz();renderTasks();calculateStats();calculateBusiness();route();
if(storageProblem)announce('Gespeicherte Daten konnten nicht geladen werden. Der Hub startet mit leeren persönlichen Daten.');
if('serviceWorker' in navigator && /^https?:$/.test(location.protocol))navigator.serviceWorker.register('./sw.js').catch(()=>announce('Offline-Nutzung ist in diesem Browser derzeit nicht verfügbar.'));
