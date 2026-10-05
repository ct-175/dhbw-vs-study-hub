import {subjects} from './content.js';
export function parseNumbers(text) {
  const tokens = text.trim().split(/[;\s]+/).filter(Boolean);
  if (!tokens.length) throw new Error('Bitte mindestens einen Wert eingeben.');
  if (tokens.length > 10000) throw new Error('Bitte höchstens 10.000 Werte verwenden.');
  return tokens.map(token => {
    if (!/^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(token)) throw new Error(`Ungültiger Wert: ${token.slice(0,30)}. Werte mit Semikolon oder Leerzeichen trennen.`);
    const value = Number(token.replace(',', '.'));
    if (!Number.isFinite(value) || Math.abs(value) > 1e12) throw new Error('Werte müssen endlich sein und zwischen −1 Billion und 1 Billion liegen.');
    return value;
  });
}

export function statistics(values) {
  if (!values.length || values.some(v => !Number.isFinite(v) || Math.abs(v) > 1e12)) throw new Error('Ungültige Daten.');
  const sorted = [...values].sort((a,b) => a-b);
  let mean = 0, m2 = 0;
  values.forEach((v,i) => { const delta = v - mean; mean += delta / (i+1); m2 += delta * (v-mean); });
  const quantile = p => { const h = (sorted.length-1)*p, i = Math.floor(h); return sorted[i] + (sorted[Math.min(i+1, sorted.length-1)]-sorted[i])*(h-i); };
  const counts = new Map();
  values.forEach(v => counts.set(v, (counts.get(v)||0)+1));
  const frequencies = [...counts].sort((a,b) => a[0]-b[0]);
  const highest = Math.max(...counts.values());
  const modes = highest > 1 ? frequencies.filter(([,count]) => count===highest).map(([v])=>v) : [];
  return { n: values.length, sorted, mean, median: quantile(.5), q1: quantile(.25), q3: quantile(.75), min: sorted[0], max: sorted.at(-1), range: sorted.at(-1)-sorted[0], populationVariance: Math.max(0,m2)/values.length, sampleVariance: values.length>1 ? Math.max(0,m2)/(values.length-1) : null, modes, frequencies, squaredDeviations: Math.max(0,m2) };
}

export function business({quantity,price,variable,fixed}) {
  if ([quantity,price,variable,fixed].some(v=>!Number.isFinite(v)||v<0||v>1e12)) throw new Error('Bitte gültige, nicht negative Werte eingeben (höchstens 1 Billion).');
  const revenue=quantity*price, costs=fixed+quantity*variable, contribution=price-variable;
  return {revenue, costs, profit: revenue-costs, contribution, breakEven: contribution>0 ? fixed/contribution : null};
}

const dateValid = value => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value;
const string = (value,max) => typeof value==='string' && value.length<=max;
export function validateBackup(input) {
  if (!input || typeof input!=='object' || input.version!==1 || !Array.isArray(input.tasks) || !Array.isArray(input.cards) || !Array.isArray(input.known) || !input.notes || typeof input.notes!=='object' || Array.isArray(input.notes)) throw new Error('Diese Datei ist kein gültiges Study-Hub-Backup.');
  if (input.tasks.length>500 || input.cards.length>500 || input.known.length>1000 || Object.keys(input.notes).length>subjects.length) throw new Error('Das Backup ist zu groß.');
  if (input.tasks.some(t=>!t || !string(t.id,100) || !string(t.title,200) || !t.title.trim() || ![...subjects,'Allgemein'].includes(t.subject) || !(t.date===''||dateValid(t.date)) || typeof t.done!=='boolean')) throw new Error('Ungültige Aufgaben im Backup.');
  if (input.cards.some(c=>!c || !string(c.id,100) || !subjects.includes(c.subject) || !string(c.question,300) || !c.question.trim() || !string(c.answer,2000) || !c.answer.trim())) throw new Error('Ungültige Karteikarten im Backup.');
  if (new Set(input.tasks.map(t=>t.id)).size!==input.tasks.length || new Set(input.cards.map(c=>c.id)).size!==input.cards.length) throw new Error('Doppelte Kennungen im Backup.');
  if (input.known.some(k=>!string(k,100)) || Object.entries(input.notes).some(([k,v])=>!subjects.includes(k)||!string(v,20000))) throw new Error('Ungültiger Lernfortschritt oder Notizen.');
  return {version:1,tasks:input.tasks.map(({id,title,subject,date,done})=>({id,title,subject,date,done})),cards:input.cards.map(({id,subject,question,answer})=>({id,subject,question,answer})),known:[...new Set(input.known)],notes:{...input.notes}};
}

export function validateCalendarUrl(value) {
  if (typeof value!=='string' || value.length>4096) throw new Error('Ungültiger Kalenderlink.');
  const url=new URL(value.trim());
  if (url.protocol!=='https:' || url.hostname!=='rapla.dhbw.de' || url.pathname!=='/rapla/calendar' || url.username || url.password || url.port) throw new Error('Bitte einen HTTPS-Kalenderlink von rapla.dhbw.de verwenden.');
  return url.href;
}
