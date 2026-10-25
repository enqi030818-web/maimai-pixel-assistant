const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {resolve}=require('node:path');
const model=require('../docs/mobile-ordering-model.js');
const data=JSON.parse(readFileSync(resolve(__dirname,'../docs/live-verification.snapshot.json'),'utf8'));

test('budget uses integer fen and rejects precision loss or invalid input',()=>{
  assert.equal(model.toCents('0.29'),29);
  assert.equal(model.toCents('30.5'),3050);
  for(const value of ['0','-1','1.001','NaN','1e2','10001'])assert.throws(()=>model.toCents(value));
});
test('a drink replacement invalidates the old quote before a matching historical quote can be applied',()=>{
  const initial=model.makeDraft(data,1);
  const changed=model.changeDrink(initial,true);
  assert.equal(initial.priceCents,2650);
  assert.equal(changed.priceCents,null);
  assert.equal(changed.quotedAt,null);
  assert.equal(changed.status,'needs-quote');
  const quoted=model.historicalQuote(data,changed);
  assert.equal(quoted.priceCents,2850);
  assert.equal(quoted.quotedAt,data.revision.quotedAt);
  assert.equal(quoted.status,'historical');
});
test('a quote cannot be reused for a different store or an unsupported replacement',()=>{
  assert.throws(()=>model.historicalQuote(data,{...model.makeDraft(data,1),storeCode:'9999999'}));
  assert.throws(()=>model.changeDrink(model.makeDraft(data,0),true));
  assert.throws(()=>model.historicalQuote(data,{...model.makeDraft(data,0),large:true}));
});
test('historical candidates are budget-bounded and never claim unsupported exclusions or multiple-person meals',()=>{
  assert.deepEqual(model.selectWithinBudget(data,2700,1,'汉堡、薯条'),[0,1]);
  assert.deepEqual(model.selectWithinBudget(data,2000,1,'汉堡'),[]);
  assert.throws(()=>model.selectWithinBudget(data,3000,1,'不要薯条'));
  assert.throws(()=>model.selectWithinBudget(data,6000,2,'汉堡'));
});
