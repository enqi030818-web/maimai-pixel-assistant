const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const {plan,output}=require('../docs/maimai-dialogue.js');
const {Conversation}=require('../docs/maimai-conversation.js');
const sandbox={window:{}};vm.runInNewContext(fs.readFileSync('docs/mobile-ordering-data.js','utf8'),sandbox);
const data=JSON.parse(JSON.stringify(sandbox.window.MAIMAI_ORDERING_DATA));
function ready(){const c=new Conversation(data);c.respond('30元配餐');c.respond({type:'find-store'});c.respond({type:'choose-store'});return c;}
test('small talk and interactions do not pretend to search a menu, even during clarification',()=>{
 for(const text of ['你好','谢谢','摸摸你','休息一下'])assert.deepEqual(plan(text,{awaitingInput:true}).steps.map(s=>s.motion),['listen']);
});
test('missing conditions ask first, while store, menu and quote use their respective actions',()=>{
 assert.deepEqual(plan('30元配餐',{store:null}).steps.map(s=>s.motion),['review']);
 assert.equal(plan('找北京站附近的门店',{}).steps.at(-1).motion,'search');
 assert.equal(plan('看看单点',{}).steps.at(-1).motion,'search');
 assert.equal(plan({type:'requote'},{draft:{}}).steps.at(-1).motion,'calculate');
});
test('choosing, browsing and confirmation do not falsely trigger a completed price celebration',()=>{
 const c=ready();
 for(const value of ['看看菜单','选第二份','看看确认单']){
  const request=plan(value,c.context()),r=c.respond(value),effect=output(r,c.context(),request);
  assert.equal(effect.celebrate,false,value);assert.equal(effect.replyMotion,'talk');
 }
});
test('modification invalidates the quote before calculation and only the returned quote celebrates',()=>{
 const c=ready();c.respond('选第二份');
 const request=plan('饮料换大杯',c.context()),r=c.respond('饮料换大杯');
 assert.equal(output(r,c.context(),request).kind,'quote-pending');assert.equal(output(r,c.context(),request).celebrate,false);
 const follow=plan(r.followUp,c.context()),quoted=c.respond(r.followUp),effect=output(quoted,c.context(),follow);
 assert.equal(effect.kind,'quoted');assert.equal(effect.celebrate,true);assert.equal(c.context().draft.priceCents,2850);
});
test('unavailable coupons, missing quote and companion gestures preserve their meaning',()=>{
 const c=ready();let r=c.respond('我的优惠券');assert.equal(output(r,c.context(),plan('我的优惠券',c.context())).kind,'unavailable-offers');
 c.respond('选第二份');c.respond('饮料换大杯');r=c.respond('看看确认单');assert.equal(output(r,c.context(),plan('看看确认单',c.context())).kind,'quote-needed');
 r=c.respond('摸摸你');assert.equal(output(r,c.context(),plan('摸摸你',c.context())).replyMotion,'petting');
});
test('every assigned photo matches its exact MCP product code; missing historical products stay without a photo',()=>{
 const snap=JSON.parse(fs.readFileSync('docs/product-images.snapshot.json','utf8'));
 for(const meal of [...data.candidates,data.revision])for(const item of [meal,...meal.selections]){
  const source=snap.products[item.code];
  if(source){assert.equal(item.image,source.image);assert.equal(new URL(item.image).hostname,'menu-img.mcd.cn');}
  else assert.equal(item.image,null);
 }
 assert.equal(data.candidates[0].image,null);assert.equal(data.candidates[0].selections[0].image,null);
 assert.notEqual(data.revision.selections[2].image,data.candidates[1].selections[2].image);
});
