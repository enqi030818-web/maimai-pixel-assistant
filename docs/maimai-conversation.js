/* Design-demo conversation state. This is deliberately not an AI or a live MCP client. */
(function(root) {
  'use strict';
  const model=typeof module!=='undefined'&&module.exports?require('./mobile-ordering-model.js'):root.MaimaiOrderingModel;
  const reply=(text,cards=[],actions=[])=>({text,cards,actions});
  class Conversation {
    constructor(data){this.data=data;this.state={store:false,budget:null,people:'1',preference:'',pending:null,offeredStore:false,indices:[],draft:null,version:0};}
    storePrompt(intent){
      this.state.pending=intent;
      return {messages:[reply('在哪家店取餐？告诉我城市或地标，我再帮你挑。原型只收录了北京崇外新世界这间历史测试门店。',[],[{label:'看看测试门店',input:{type:'find-store'}}])]};
    }
    showStore(){this.state.offeredStore=true;return {messages:[reply('这里有一间历史测试门店。需要你确认一下；它不代表你的位置，当前营业状态也还没查询。',[{type:'store'}])]};}
    budget(){
      const s=this.state;
      if(s.budget===null){s.pending='budget';return {messages:[reply('这顿整餐预算是多少元？也可以一起告诉我人数和不想吃的东西。')]};}
      if(!s.store)return this.storePrompt('budget');
      s.pending=null;
      try{
        const indices=model.selectWithinBudget(this.data,s.budget,s.people,s.preference);s.indices=indices;
        if(!indices.length)return {messages:[reply('这三份历史餐单都超出预算。你可以告诉我新的预算；实时版本接入后，才能查更多搭配。')]};
        return {messages:[reply(`整餐 ${(s.budget/100).toFixed(2)} 元以内，历史记录里有 ${indices.length} 份可比较。含汉堡、中薯和中杯无糖可乐；以下为历史报价。`,indices.map(index=>({type:'meal',index}))),reply('可以说“选第二份”，也可以先看组成。其他偏好还需实时核对。海鸥已经盯上薯条了。')]};
      }catch(error){s.indices=[];return {messages:[reply(error.message)]};}
    }
    menu(single=false){
      if(!this.state.store)return this.storePrompt(single?'single':'menu');
      if(single){const seen=new Set(),cards=[];for(const item of this.data.candidates)for(const selection of item.selections)if(!seen.has(selection.code)){seen.add(selection.code);cards.push({type:'single',item:selection});}
        return {messages:[reply('这些是历史套餐里的单品。已取得的商品原图放在圆形卡片中；独立单点价格还没有核对。',cards)]};}
      this.state.indices=[0,1,2];return {messages:[reply('先看这家店的三份历史套餐样例。可以点卡片，也可以直接告诉我选哪份。',[0,1,2].map(index=>({type:'meal',index})))]};
    }
    choose(index){
      if(!this.data.candidates[index])return {messages:[reply('这份餐单没找到。告诉我是刚才哪一份，我再帮你看。')]};
      if(!this.state.store)return this.storePrompt({type:'choose',index});
      this.state.draft={...model.makeDraft(this.data,index),version:++this.state.version};
      return {messages:[reply('已经记进餐单草稿，尚未下单。你可以说“饮料换大杯”“看看确认单”，或继续问我。',[{type:'draft',draft:{...this.state.draft}}])]};
    }
    modify(large){
      const draft=this.state.draft;
      if(!draft)return {messages:[reply('先告诉我想修改哪份套餐，例如“第二份换大杯”。')]};
      try{
        const changed=model.changeDrink(draft,large);changed.version=++this.state.version;this.state.draft=changed;
        if(changed.status!=='needs-quote')return {messages:[reply('这份餐单已经是这个杯型。',[{type:'draft',draft:{...changed}}])]};
        return {messages:[reply(`饮料已改为${large?'大':'中'}杯无糖可乐。旧总价已失效，我再核对修改后的整份餐单。`,[{type:'draft',draft:{...changed}}])],followUp:{type:'requote'}};
      }catch(error){return {messages:[reply(error.message+' 你可以选择第二份吉士汉堡包中套餐演示换杯。')]};}
    }
    respond(input){
      const s=this.state;
      if(typeof input==='object'){
        switch(input.type){
          case 'find-store':return this.showStore();
          case 'choose-store':{
            if(!s.offeredStore)return this.showStore();
            s.store=true;const pending=s.pending;s.pending=null;
            const next=pending==='budget'?this.budget():pending==='menu'?this.menu():pending==='single'?this.menu(true):pending?.type==='choose'?this.choose(pending.index):{messages:[reply('接下来想让我按预算配餐，还是查查菜单？')]};
            return {messages:[reply('好，就用这间历史测试门店，到店自取。'),...next.messages],followUp:next.followUp};
          }
          case 'choose':return this.choose(input.index);
          case 'detail':return this.data.candidates[input.index]?{messages:[reply('这份的完整组成在这里。原型中只有第二份套餐收录了已验证的中杯 / 大杯饮料替换。',[{type:'composition',index:input.index}])]}:{messages:[reply('这份套餐没找到，试试刚才的三份样例。')]};
          case 'requote':{
            if(!s.draft)return {messages:[reply('还没有要核价的餐单。先选一份吧。')]};
            s.draft={...model.historicalQuote(this.data,s.draft),version:++s.version};
            return {messages:[reply('已读取对应选择的历史整单核价。当前价格仍需实时查询。',[{type:'draft',draft:{...s.draft}}])]};
          }
          case 'confirm':return s.draft?{messages:[reply('这是你的餐单草稿，尚未创建订单，也没有付款。',[{type:'confirmation',draft:{...s.draft}}])]}:{messages:[reply('餐单还是空的。告诉我预算，或先选一份套餐。')]};
          case 'retry':throw Error('Retry is handled by the conversation host.');
          default:return {messages:[reply('这个演示动作暂不支持，可以继续发消息给我。')]};
        }
      }
      const text=String(input).trim();
      if(!text)return {messages:[]};
      if(/摸摸|摸头|拍拍头/.test(text))return {messages:[reply('嘿嘿，收到摸摸。我的薯条可以分你一根，海鸥得排队。')],motion:'petting'};
      if(/休息一下|打瞌睡|睡一会|睡觉/.test(text))return {messages:[reply('那我坐着眯一小会儿。你一叫我，我就继续帮你看餐单。')],motion:'sleep'};
      if(/分.*海鸥|一起吃薯条|分享薯条/.test(text))return {messages:[reply('这根给它，不用偷。我们并排吃一会儿。')],motion:'share'};
      if(/炸薯条|准备薯条/.test(text))return {messages:[reply('给你表演一下准备薯条！这是我的小动作，没有实际制作餐品或创建订单。')],motion:'fry'};
      if(/偷.*薯条|海鸥又偷|抓包/.test(text))return {messages:[reply('又被我看见了……算啦，这根给它。你的餐单数量和金额都没变。')],motion:'caught'};
      if(/吃根薯条|吃一根薯条|你吃薯条/.test(text))return {messages:[reply('那我先尝一根。你想吃什么也继续告诉我。')],motion:'eat'};
      const amount=text.match(/(-?\d+(?:\.\d+)?)\s*元/);
      if(amount){try{s.budget=model.toCents(amount[1]);}catch(error){return {messages:[reply(error.message)]};}}
      if(/三人|三个人|3\s*人/.test(text))s.people='3';
      else if(/两人|两个人|二人|2\s*人/.test(text))s.people='2';
      else if(/一人|一个人|单人|1\s*人/.test(text))s.people='1';
      if(/汉堡|薯条|饮料|无糖/.test(text))s.preference+=' '+text;
      if(/不要.*(薯条|汉堡)|不吃.*(薯条|汉堡)|无薯条|无汉堡/.test(s.preference)&&/还是要|可以吃|不排除/.test(text)){
        s.preference=text;
      }
      if(/优惠|活动|券/.test(text))return {messages:[reply('活动日历和我的优惠券，正式版都可以直接问我查。当前没有实时连接，也未查询你的账户，不能把示例说成可用优惠。',[{type:'offer'}])]};
      if(/换店|重新选店/.test(text))return {messages:[reply('原型目前只有一间历史测试门店，没法真正换店。正式版本换店后会保留餐单，重新查菜单与整单价格。')]};
      if(s.offeredStore&&!s.store&&/就这家|用这家|这间|这家吧|确认门店|用测试门店/.test(text))return this.respond({type:'choose-store'});
      if(/门店|附近|北京站|崇外|新世界/.test(text)){
        if(/北京|崇外|新世界|测试门店/.test(text))return this.showStore();
        return {messages:[reply('这个地点在原型里没有样例。可以试试“北京站附近”，查看历史测试门店；实时版本会查询你指定的城市和地标。')]};
      }
      const ordinal=text.match(/第?([一二三123])份/);
      const order=ordinal?({'一':0,'二':1,'三':2,'1':0,'2':1,'3':2}[ordinal[1]]):null;
      const index=order===null?null:s.indices[order];
      if(/换|改|大杯|中杯/.test(text)&&/饮料|可乐|大杯|中杯/.test(text)){
        if(/有糖|普通可乐|雪碧|去冰|少冰|咖啡/.test(text))return {messages:[reply('这项替换没有收录在原型里，不能猜测可选项或价格。当前只演示吉士汉堡包中套餐的中 / 大杯无糖可乐替换。')]};
        if(ordinal&&index===undefined)return {messages:[reply('刚才的候选里没有这一份。请告诉我是已展示的哪份餐单。')]};
        if(index!==null&&index!==undefined){
          if(!s.store)return this.storePrompt({type:'choose',index});
          if(index!==1)return {messages:[reply('这份套餐没有已验证的换杯历史记录，暂时不能演示替换。原餐单仍然保留。')]};
          s.draft=model.makeDraft(this.data,index);
        }
        return this.modify(/大杯/.test(text));
      }
      if(/核价|算.*价|多少钱|重新.*价格/.test(text)&&s.draft)return this.respond({type:'requote'});
      if(/组成|里面|包含/.test(text)&&index!==null&&index!==undefined)return this.respond({type:'detail',index});
      if((/选|要|就|来/.test(text))&&index!==null&&index!==undefined)return this.choose(index);
      if(/确认单|餐单|就这个|下单|付款/.test(text))return this.respond({type:'confirm'});
      if(/单点|单品/.test(text))return this.menu(true);
      if(/菜单|套餐|有什么吃/.test(text)&&!amount)return this.menu();
      if(amount||/预算|配餐|便宜|汉堡|薯条/.test(text)||s.pending==='budget')return this.budget();
      if(/你好|嗨|在吗|哈喽/.test(text))return {messages:[reply('在呢！今天想吃什么？也可以先聊两句。海鸥正在假装没看见我的薯条。')]};
      if(/谢谢|辛苦/.test(text))return {messages:[reply('不客气。餐单记着呢，想改什么继续跟我说。')]};
      return {messages:[reply('我听到啦。这版还在演示对话流程，不能真正理解所有闲聊。你可以试试“30元配一餐”“看看单点”或“查查优惠”；之后会接入真正的多轮对话。')]};
    }
    context(){const s=this.state;return {store:s.store?this.data.store.name:null,budget:s.budget,people:s.people,draft:s.draft?{...s.draft}:null,awaitingInput:s.pending!==null||(s.offeredStore&&!s.store)};}
  }
  const api={Conversation};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else root.MaimaiConversation=api;
})(typeof window!=='undefined'?window:{});
