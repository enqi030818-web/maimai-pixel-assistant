const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {Conversation}=require('../docs/maimai-conversation.js');
const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../docs/mobile-ordering-data.js'),'utf8'),sandbox);
const data=JSON.parse(JSON.stringify(sandbox.window.MAIMAI_ORDERING_DATA));
function ready(){const c=new Conversation(data);c.respond('30元帮我配餐');c.respond({type:'find-store'});c.respond({type:'choose-store'});return c;}
function allText(result){return result.messages.map(m=>m.text).join('\n');}

test('budget request survives the store clarification and requires explicit store choice',()=>{
  const c=new Conversation(data);
  c.respond('30元帮我配餐');
  assert.equal(c.context().store,null);
  c.respond('北京站附近');
  assert.equal(c.context().store,null);
  const result=c.respond('就这家吧');
  assert.equal(c.context().store,data.store.name);
  assert.equal(c.context().budget,3000);
  assert.equal(result.messages.flatMap(m=>m.cards).filter(c=>c.type==='meal').length,3);
});
test('selection and conversational modification invalidate the old quote before the follow-up',()=>{
  const c=ready();
  c.respond('选第二份');
  const old=c.context().draft;
  const change=c.respond('饮料换大杯');
  assert.equal(c.context().draft.priceCents,null);
  assert.equal(c.context().draft.status,'needs-quote');
  assert.equal(old.priceCents,2650);
  assert.ok(c.context().draft.version>old.version);
  assert.equal(change.followUp.type,'requote');
  c.respond(change.followUp);
  assert.equal(c.context().draft.priceCents,2850);
  assert.equal(c.context().draft.large,true);
  assert.equal(c.context().draft.status,'historical');
});
test('interrupted follow-up leaves a recoverable unquoted draft and confirmation cannot invent a price',()=>{
  const c=ready();c.respond('选第二份');c.respond('换大杯无糖可乐');
  const confirmation=c.respond('看看确认单');
  const draft=confirmation.messages.flatMap(m=>m.cards).find(c=>c.type==='confirmation').draft;
  assert.equal(draft.priceCents,null);
  assert.equal(draft.status,'needs-quote');
  c.respond('重新核价');
  assert.equal(c.context().draft.priceCents,2850);
});
test('unsupported replacements and missing ordinal candidates preserve the selected draft',()=>{
  const c=ready();c.respond('选第二份');const before=c.context().draft;
  c.respond('第一份换大杯');assert.deepEqual(c.context().draft,before);
  c.respond('第二份饮料换雪碧');assert.deepEqual(c.context().draft,before);
  c.respond('27元配餐');c.respond('第三份换大杯');assert.deepEqual(c.context().draft,before);
});
test('budget exclusions, invalid decimals and multiple-person requests never yield false matching meals',()=>{
  const c=ready();
  for(const input of ['30元，不要薯条','30元，两人吃','-1元配餐','30.123元配餐']){
    const r=c.respond(input);
    assert.equal(r.messages.flatMap(m=>m.cards).filter(c=>c.type==='meal').length,0,input);
  }
});
test('single items have no invented standalone price and offer replies do not claim owned coupons',()=>{
  const c=ready(),single=c.respond('看看单点');
  const cards=single.messages.flatMap(m=>m.cards);
  assert.ok(cards.length>=3);assert.ok(cards.every(c=>c.type==='single'&&c.item.priceCents===undefined));
  assert.match(allText(c.respond('我的优惠券')),/未查询你的账户/);
  assert.match(allText(c.respond('现在下单')),/还是空的/);
});
test('context is retained across unrelated conversation and unknown messages are explicitly bounded',()=>{
  const c=ready();c.respond('选第二份');const before=c.context();
  c.respond('谢谢');assert.deepEqual(c.context(),before);
  assert.match(allText(c.respond('讲一个十分钟的故事')),/演示对话流程/);
  assert.deepEqual(c.context(),before);
});
test('revisions and final confirmation remain historical and never represent an order',()=>{
  const c=ready();c.respond('第二份换大杯');c.respond({type:'requote'});
  const result=c.respond('就这个，下单');
  assert.match(allText(result),/尚未创建订单/);
  const card=result.messages.flatMap(m=>m.cards)[0];
  assert.equal(card.type,'confirmation');assert.equal(card.draft.status,'historical');assert.equal(card.draft.priceCents,2850);
  assert.equal(c.context().budget,3000);
});
test('small companion requests choose an animation without altering the meal or its quantity',()=>{
  const c=ready();c.respond('选第二份');const before=c.context();
  for(const [text,motion] of [['摸摸你','petting'],['休息一下','sleep'],['一起吃薯条','share'],['表演炸薯条','fry'],['海鸥又偷薯条','caught'],['吃根薯条','eat']]){
    const result=c.respond(text);assert.equal(result.motion,motion);assert.deepEqual(c.context(),before);
  }
});
