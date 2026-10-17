import {test} from 'node:test';
import assert from 'node:assert/strict';
import {TypingTest} from '../public/engine.js';
import {resultSummary} from '../public/results.js';
test('results show remaining errors, correct characters and elapsed time',()=>{
  const t=new TypingTest('hello world',15);
  t.input('hello x',0);
  assert.equal(resultSummary(t.snapshot(15000)), '5 WPM · 86% accuracy · 1 error · 6 correct characters · 15.0 seconds');
});
test('corrected mistakes do not count as errors and empty text has zero errors',()=>{
  const t=new TypingTest('hello world',15);
  t.input('hexxo',0);
  assert.equal(t.snapshot(1000).errors,2);
  t.input('hello',2000);
  assert.match(resultSummary(t.snapshot(15000)), /100% accuracy · 0 errors/);
  const empty=new TypingTest('hello',15);
  assert.match(resultSummary(empty.snapshot(0)), /0 WPM · 100% accuracy · 0 errors/);
});
test('timer includes time away and late edits cannot change results',()=>{
  const t=new TypingTest('hello world',30);
  t.input('hello x',1000);
  const before=t.snapshot(61000);
  t.input('hello w',61001);
  assert.deepEqual(t.snapshot(61002),before);
  assert.equal(before.elapsed,30);
  assert.equal(before.errors,1);
});
test('waits for first character and uses selected duration',()=>{for(const d of [15,30,60]){const t=new TypingTest('hello world',d);assert.equal(t.snapshot(9000).remaining,d);t.input('',9000);assert.equal(t.started,null);t.input('h',10000);assert.equal(t.snapshot(11000).remaining,d-1);}});
test('scores correct characters, spaces, errors and corrections',()=>{const t=new TypingTest('hello world',60);t.input('hello x',0);let s=t.snapshot(6000);assert.equal(s.wpm,12);assert.equal(s.accuracy,86);t.input('hello w',6000);assert.equal(t.snapshot(6000).accuracy,100);assert.equal(t.snapshot(6000).wpm,14);});
test('expires exactly at deadline and rejects late input',()=>{const t=new TypingTest('hello world',15);t.input('hello',0);assert.equal(t.snapshot(14999).done,false);t.input('hello world',15000);const s=t.snapshot(20000);assert.equal(s.done,true);assert.equal(s.text,'hello');assert.equal(s.wpm,4);assert.equal(s.remaining,0);});
test('finishes passage, clamps time, supports backspacing',()=>{const t=new TypingTest('hello',30);t.input('he',0);t.input('',1000);assert.equal(t.started,0);t.input('hello',5000);assert.equal(t.snapshot(60000).wpm,12);assert.equal(t.snapshot(60000).done,true);});
test('rejects invalid durations and is safe before elapsed time',()=>{assert.throws(()=>new TypingTest('hi',10));const t=new TypingTest('hi',15);t.input('h',0);assert.equal(t.snapshot(0).wpm,0);assert.equal(new TypingTest('hi',15).snapshot(0).accuracy,100);});
