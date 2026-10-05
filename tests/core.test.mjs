import test from 'node:test';
import assert from 'node:assert/strict';
import {parseNumbers,statistics,business,validateBackup} from '../core.js';

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
