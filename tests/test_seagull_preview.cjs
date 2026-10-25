// Lifecycle tests without a browser: interrupted clips, event deduplication,
// visibility and reduced motion. Rendering and identity require separate visual QA.
const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {resolve} = require('node:path');
const vm = require('node:vm');

async function setup() {
  class Element {
    constructor() { this.listeners = {}; this.dataset = {}; this.attributes = {}; this.checked = false; this.disabled = false; this.textContent = ''; this.classList = {toggle() {}}; }
    addEventListener(name, handler) { (this.listeners[name] ||= []).push(handler); }
    dispatchEvent(event) { for (const handler of this.listeners[event.type] || []) handler({...event, target:this}); }
    setAttribute(key, value) { this.attributes[key] = value; }
    click() { if (!this.disabled) this.dispatchEvent({type:'click'}); }
  }
  const names = ['pet','stage','caption','scene-label','load-message','pause','reduced-motion','auto-peek','replay','small-size','task-complete'];
  const elements = Object.fromEntries(names.map(name => ['#'+name, new Element()]));
  const calls = [];
  elements['#pet'].getContext = () => ({clearRect(){}, drawImage(...args){calls.push(args);}});
  const buttons = ['peek','celebrate','caught','share'].map(id => { const e = new Element(); e.dataset.clip = id; return e; });
  const document = new Element();
  document.hidden = false;
  document.querySelector = selector => elements[selector];
  document.querySelectorAll = selector => selector === 'button' ? [...buttons, elements['#pause'], elements['#replay'], elements['#task-complete']] : buttons;
  const images = [];
  const raf = new Map(), timers = new Map();
  let counter = 0, now = 0;
  const media = new Element(); media.matches = false;
  const config = {clips:buttons.map((button, row) => ({id:button.dataset.clip, title:button.dataset.clip, row, frames:8, durations:Array(8).fill(100), poster:5}))};
  const window = {MAIMAI_SEAGULL:config};
  const context = vm.createContext({window,document,matchMedia:()=>media,Event:class {constructor(type){this.type=type;}},Image:class {constructor(){images.push(this);} set src(path){this.path=path;this.onload();}},requestAnimationFrame:handler=>{const id=++counter;raf.set(id,handler);return id;},cancelAnimationFrame:id=>raf.delete(id),setTimeout:(handler,delay)=>{const id=++counter;timers.set(id,{handler,delay});return id;},clearTimeout:id=>timers.delete(id)});
  vm.runInContext(readFileSync(resolve(__dirname,'../docs/seagull-preview.js'),'utf8'), context);
  await Promise.resolve(); await Promise.resolve();
  function step(count=1) { for(let i=0;i<count;i++){now+=100;const pending=[...raf.values()];raf.clear();for(const fn of pending)fn(now);} }
  function change(name, value) {elements['#'+name].checked=value;elements['#'+name].dispatchEvent({type:'change'});}
  function visibility(hidden) {document.hidden=hidden;document.dispatchEvent({type:'visibilitychange'});}
  return {window,document,elements,buttons,raf,timers,calls,step,change,visibility};
}

test('a new clip cancels the prior animation and completes only the new clip', async () => {
  const page = await setup();
  page.buttons[0].click(); page.step(3);
  page.buttons[2].click();
  assert.equal(page.elements['#pet'].dataset.clip,'caught');
  assert.equal(page.elements['#pet'].dataset.frame,'0');
  assert.equal(page.raf.size,1);
  page.step(10);
  assert.equal(page.elements['#pet'].dataset.completed,'true');
  assert.equal(page.elements['#pet'].dataset.frame,'7');
  assert.equal(page.raf.size,0);
});
test('a repeated task completion does not restart or replay the theft', async () => {
  const page = await setup();
  assert.equal(page.window.maimaiSeagull.taskComplete('task-one'),true);
  page.step(4);
  const frame = page.elements['#pet'].dataset.frame;
  assert.equal(page.window.maimaiSeagull.taskComplete('task-one'),false);
  assert.equal(page.elements['#pet'].dataset.frame,frame);
  assert.equal(page.window.maimaiSeagull.taskComplete(''),false);
  assert.equal(page.window.maimaiSeagull.taskComplete('task-two'),true);
  assert.equal(page.elements['#pet'].dataset.frame,'0');
});
test('reduced motion holds an informative poster and creates no animation or automatic event', async () => {
  const page = await setup();
  page.change('auto-peek',true);
  page.change('reduced-motion',true);
  page.window.maimaiSeagull.rest();
  assert.equal(page.elements['#pet'].dataset.clip,'share');
  assert.equal(page.elements['#pet'].dataset.frame,'5');
  assert.equal(page.raf.size,0);
  assert.equal(page.timers.size,0);
  assert.equal(page.elements['#pause'].disabled,true);
});
test('a hidden page stops animation and timers; returning resumes the same clip', async () => {
  const page = await setup();
  page.window.maimaiSeagull.play('peek');page.step(3);
  const frame=page.elements['#pet'].dataset.frame;
  page.visibility(true);
  assert.equal(page.raf.size,0);assert.equal(page.timers.size,0);
  page.step(20);
  assert.equal(page.elements['#pet'].dataset.frame,frame);
  page.visibility(false);
  assert.equal(page.raf.size,1);
  page.step(2);
  assert.notEqual(page.elements['#pet'].dataset.frame,frame);
});
test('automatic easter egg waits at least 45 seconds and returns to calm idle after one play', async () => {
  const page = await setup();
  assert.equal(page.timers.size,0);
  page.change('auto-peek',true);
  const waiting=[...page.timers.values()][0];
  assert.ok(waiting.delay>=45000 && waiting.delay<=60000);
  page.timers.clear();waiting.handler();
  assert.equal(page.elements['#pet'].dataset.clip,'peek');
  page.step(10);
  assert.equal(page.elements['#pet'].dataset.completed,'true');
  const returnTimer=[...page.timers.values()][0];
  assert.equal(returnTimer.delay,1800);
  page.timers.clear();returnTimer.handler();
  assert.equal(page.elements['#pet'].dataset.clip,'idle');
  assert.equal(page.timers.size,1);
});
