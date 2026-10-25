/* Conversation presentation contract. No model calls, prices or order effects. */
(function(root){
  'use strict';
  function plan(input,context){
    const text=typeof input==='string'?input:'';
    const type=input&&typeof input==='object'?input.type:null;
    let kind='chat';
    if(/摸摸|摸头|拍拍头|休息一下|打瞌睡|睡一会|睡觉|一起吃薯条|分享薯条|分.*海鸥|炸薯条|准备薯条|偷.*薯条|海鸥又偷|抓包|吃根薯条|吃一根薯条|你吃薯条/.test(text))kind='interaction';
    else if(/^(你好|嗨|在吗|哈喽|谢谢|辛苦)/.test(text))kind='chat';
    else if(type==='requote'||(/核价|算.*价|多少钱|重新.*价格/.test(text)&&context.draft))kind='quote';
    else if(/换|改|大杯|中杯/.test(text)&&/饮料|可乐|大杯|中杯/.test(text))kind='modify';
    else if(type==='choose'||(/选|要|就|来/.test(text)&&/第?[一二三123]份/.test(text)))kind='choose';
    else if(type==='detail')kind='detail';
    else if(type==='confirm'||/确认单|餐单|就这个|下单|付款/.test(text))kind='confirm';
    else if(type==='find-store'||/门店|附近|北京站|崇外|新世界/.test(text))kind='store';
    else if(type==='choose-store')kind='resume';
    else if(/优惠|活动|券/.test(text))kind='offer';
    else if(/单点|单品|菜单|套餐|有什么吃|组成|里面|包含/.test(text)&&!/\d+\s*元/.test(text))kind='menu';
    else if(/元|预算|配餐|便宜|汉堡|薯条/.test(text)||context.awaitingInput)kind='budget';
    const steps=[];
    if(kind==='interaction'||kind==='chat')steps.push({motion:'listen',label:'演示：听你说，准备回应',ms:350});
    else{
      steps.push({motion:'review',label:kind==='modify'?'演示：核对你要修改的选择':'演示：整理你的需求',ms:450});
      if(kind==='quote')steps.push({motion:'calculate',label:'演示：核对已保存的整单报价',ms:650});
      else if(kind==='store')steps.push({motion:'search',label:'演示：查阅测试门店记录',ms:650});
      else if(['menu','detail','offer'].includes(kind)||(kind==='budget'&&context.store)||kind==='resume')steps.push({motion:'search',label:kind==='offer'?'演示：检查优惠数据是否可用':'演示：查阅已保存的餐品资料',ms:650});
    }
    return {kind,steps};
  }
  function output(result,context,request){
    const cards=result.messages.flatMap(m=>m.cards||[]);
    let kind='chat';
    if(result.motion)kind='interaction';
    else if(result.followUp)kind='quote-pending';
    else if(cards.some(c=>c.type==='confirmation'))kind=context.draft?.status==='needs-quote'?'quote-needed':'confirmation';
    else if(cards.some(c=>c.type==='draft'))kind=context.draft?.status==='needs-quote'?'quote-needed':request.kind==='quote'?'quoted':'draft';
    else if(cards.some(c=>c.type==='meal'))kind='candidates';
    else if(cards.some(c=>c.type==='composition'))kind='composition';
    else if(cards.some(c=>c.type==='store'))kind='store-choice';
    else if(cards.some(c=>c.type==='single'))kind='single-products';
    else if(cards.some(c=>c.type==='offer'))kind='unavailable-offers';
    else if(context.awaitingInput)kind='clarification';
    else if(!['chat','interaction'].includes(request.kind))kind='unavailable';
    const labels={chat:'我在，接着说就好。',interaction:'餐单还记着，随时可以继续。','quote-pending':'修改已记下，旧报价已失效。','quote-needed':'先核价，再整理确认单。',confirmation:'餐单已整理，尚未下单。',quoted:'历史核价已展示，尚未下单。',draft:'选择已记进草稿，还可以继续修改。',candidates:'可以选一份，也可以继续说偏好。',composition:'组成在这里，想改什么告诉我。','store-choice':'等你确认取餐门店。','single-products':'看中哪款，可以继续问我。','unavailable-offers':'优惠尚未实时查询，餐单已保留。',clarification:'我在，等你补充一下。',unavailable:'这项暂时没有可用结果，可以换个条件。'};
    return {kind,presence:labels[kind],replyMotion:result.motion||'talk',celebrate:kind==='quoted'&&context.draft?.status==='historical',waiting:context.awaitingInput};
  }
  const api={plan,output};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MaimaiDialogue=api;
})(typeof window!=='undefined'?window:{});
