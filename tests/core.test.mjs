import test from 'node:test';
import assert from 'node:assert/strict';
import {parseNumbers,statistics,business,validateBackup,validateCalendarUrl} from '../core.js';

test('Dezimalzeichen, Leerzeichen und Zeilenumbrüche werden korrekt gelesen',()=>{
  assert.deepEqual(parseNumbers('1,5; -2.25\n3  +4'),[1.5,-2.25,3,4]);
  for(const value of ['', '1abc', 'Infinity', '1,2,3', '2; NaN', '1000000000001'])assert.throws(()=>parseNumbers(value));
});
test('Referenzdaten: Mittelwert, Median, beide Varianzen, Quartile und Häufigkeiten',()=>{
  const r=statistics([2,4,4,4,5,5,7,9]);
  assert.equal(r.mean,5);assert.equal(r.median,4.5);assert.equal(r.populationVariance,4);assert.equal(r.sampleVariance,32/7);
  assert.equal(r.q1,4);assert.equal(r.q3,5.5);assert.deepEqual(r.modes,[4]);assert.deepEqual(r.frequencies,[[2,1],[4,3],[5,2],[7,1],[9,1]]);
});
test('Einzelwert, konstante Werte, negative Werte und mehrere Modi',()=>{
  const r=statistics([7]);assert.equal(r.mean,7);assert.equal(r.populationVariance,0);assert.equal(r.sampleVariance,null);
  assert.equal(statistics([5,5,5]).populationVariance,0);assert.equal(statistics([-5,-3,-1]).median,-3);
  assert.deepEqual(statistics([1,1,2,2,3]).modes,[1,2]);assert.deepEqual(statistics([1,2,3]).modes,[]);
});
test('Varianz bleibt bei großen, eng beieinanderliegenden Werten stabil',()=>{
  const r=statistics([1e12-2,1e12-1,1e12]);assert.equal(r.mean,1e12-1);assert.equal(r.populationVariance,2/3);
});
test('BWL-Referenzbeispiel und nicht erreichbarer Break-even',()=>{
  assert.deepEqual(business({quantity:100,price:25,variable:10,fixed:1000}),{revenue:2500,costs:2000,profit:500,contribution:15,breakEven:1000/15});
  assert.equal(business({quantity:10,price:5,variable:5,fixed:100}).breakEven,null);
  assert.equal(business({quantity:10,price:4,variable:5,fixed:100}).profit,-110);
  assert.throws(()=>business({quantity:-1,price:5,variable:1,fixed:1}));
});
test('Backups werden vollständig validiert und unbekannte Felder verworfen',()=>{
  const backup={version:1,tasks:[{id:'t',title:'Üben',subject:'BWL',date:'2026-10-06',done:false}],cards:[{id:'c',subject:'BWL',question:'Frage?',answer:'Antwort'}],known:['c'],notes:{BWL:'Notiz'},extra:'ignored'};
  assert.equal(validateBackup(backup).tasks[0].date,'2026-10-06');assert.equal(validateBackup(backup).extra,undefined);
  assert.throws(()=>validateBackup({...backup,tasks:[{...backup.tasks[0],date:'2026-02-30'}]}));
  assert.throws(()=>validateBackup({...backup,tasks:[backup.tasks[0],backup.tasks[0]]}));
  assert.throws(()=>validateBackup({...backup,notes:{BWL:42}}));assert.throws(()=>validateBackup({version:2}));
});

test('Kalender akzeptiert nur den vorgesehenen HTTPS-Rapla-Dienst',()=>{
 assert.equal(validateCalendarUrl('https://rapla.dhbw.de/rapla/calendar?key=example'), 'https://rapla.dhbw.de/rapla/calendar?key=example');
 for(const url of ['javascript:alert(1)','http://rapla.dhbw.de/rapla/calendar','https://rapla.dhbw.de.evil.test/rapla/calendar','https://user:password@rapla.dhbw.de/rapla/calendar'])assert.throws(()=>validateCalendarUrl(url));
 const backup={version:1,tasks:[{id:'m',title:'Lernen',subject:'Marketing',date:'',done:false}],cards:[],known:[],notes:{'Konstruktion & Werkstoffe':'Werkstoffe lernen'}};
 assert.equal(validateBackup(backup).tasks[0].subject,'Marketing');
});

test('Kursquartile berücksichtigen ganzzahlige und aufzurundende Positionen',()=>{
 const course=statistics([2,4,7,13],'course');assert.equal(course.q1,3);assert.equal(course.q3,10);
 assert.equal(statistics([2,4,7,13],'linear').q1,3.5);
 assert.equal(statistics([1,3,8],'course').q1,1);assert.equal(statistics([7],'course').q3,7);
 assert.equal(statistics([2,4,4,4,5,5,7,9],'course').q3,6);
});

test('Skriptmaterial besitzt eindeutige Kennungen, gültige Seiten und eindeutige Antwortoptionen',async()=>{
 const {scriptCards,scriptQuiz}=await import('../study-material.js');
 assert.equal(scriptCards.length,86);assert.equal(scriptQuiz.length,40);
 assert.equal(new Set(scriptCards.map(c=>c.id)).size,scriptCards.length);
 for(const item of [...scriptCards,...scriptQuiz]){
  assert.ok(item.page>=1&&item.page<=(item.subject==='BWL'?413:295));assert.ok(item.topic&&item.question);
  if(item.options){assert.equal(item.options.length,4);assert.equal(new Set(item.options).size,4);assert.ok(item.correct>=0&&item.correct<4);assert.ok(item.explanation);}
 }
 const backup={version:1,tasks:[],cards:[{id:'own',subject:'Statistik',topic:'Lagemaße',question:'Frage',answer:'Antwort'}],known:[],notes:{}};
 assert.equal(validateBackup(backup).cards[0].topic,'Lagemaße');assert.throws(()=>validateBackup({...backup,cards:[{...backup.cards[0],topic:42}]}));
});
