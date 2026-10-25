'use strict';
(() => {
  const data=window.MAIMAI_ORDERING_DATA;
  const conversation=new window.MaimaiConversation.Conversation(data);
  const dialogue=window.MaimaiDialogue;
  const motion=new window.MaimaiMotion.Controller(window.MaimaiMotion.catalog(window.MAIMAI_COMPANION));
  const $=selector=>document.querySelector(selector);
  const widget=$('#maimai-widget'),panel=$('#conversation'),pet=$('#maimai-pet'),art=$('#pet-art'),messages=$('#messages'),input=$('#chat-input');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const money=value=>Number.isInteger(value)?`¥${(value/100).toFixed(2)}`:'待重新核价';
  let active=null,lastInput=null,toastTimer,requestNumber=0,pressTimer=null,longPressed=false;
  let nearBottom=true;
  $('#motion').checked=reduce.matches;

  function node(tag,className,text){const n=document.createElement(tag);if(className)n.className=className;if(text!==undefined)n.textContent=text;return n;}
  function portrait(item){
    const wrap=node('div','product-portrait'),image=node('img'),label=node('span','image-unavailable','暂无原图');
    image.alt=item.name+'商品原图';image.decoding='async';image.referrerPolicy='no-referrer';
    let source=null;
    try{const url=new URL(item.image||'');if(url.protocol==='https:'&&url.hostname==='menu-img.mcd.cn')source=url.href;}catch{}
    wrap.title=source?`商品原图 · 采集于 ${item.imageRetrievedAt||data.imageSnapshot.retrievedAt}（UTC+8）`:'当前接口未返回此商品原图';
    image.hidden=!source;label.hidden=Boolean(source);
    image.addEventListener('error',()=>{image.hidden=true;label.hidden=false;label.textContent='图片未加载';wrap.title='商品原图暂时加载失败，商品名称和餐单仍可查看';},{once:true});
    if(source)image.src=source;
    wrap.append(image,label);return wrap;
  }
  function actionButton(label,value,primary=false){const button=node('button','chat-action'+(primary?' primary':''),label);button.type='button';button.addEventListener('click',()=>send(value,label));return button;}
  function appendActions(parent,actions){if(!actions?.length)return;const row=node('div','card-actions');for(const a of actions)row.append(actionButton(a.label,a.input,a.primary));parent.append(row);}
  function selections(parent,items){const list=node('ul','selection-list');for(const item of items){const li=node('li');li.append(portrait(item),node('span','',item.name),node('b','',`× ${item.quantity}`));list.append(li);}parent.append(list);}
  function mealCard(card){
    const draft=card.draft,item=data.candidates[card.index??draft.index],large=Boolean(draft?.large);
    const choices=large?data.revision.selections:item.selections;
    const c=node('article','reply-card'),header=node('div','card-header'),copy=node('div');
    if(draft)c.dataset.draftVersion=String(draft.version);
    copy.append(node('h3','',item.name),node('p','card-tag',card.type==='confirmation'?'餐单确认 · 尚未下单':draft?'餐单草稿 · 尚未下单':'历史套餐样例'));
    header.append(portrait(item),copy);c.append(header);
    if(item.image){const source=node('p','card-image-source','商品原图来自麦当劳接口；套餐图展示标准搭配，实际选择以下方文字为准。');c.append(source);}
    else c.append(node('p','card-image-source','历史餐单：当前接口已查不到这款商品及原图，不代表当前可售。'));
    const price=card.type==='composition'?null:(draft?draft.priceCents:item.priceCents);
    if(card.type!=='composition'){
      const amount=node('div','card-price',money(price));
      if(Number.isInteger(price)){
        const budget=conversation.context().budget;
        amount.append(node('small','',budget===null?'历史整单价':`${budget>=price?'预算余':'超预算'} ${money(Math.abs(budget-price))}`));
      }
      c.append(amount);
    }
    if(card.type==='composition'||draft)selections(c,choices);
    else c.append(node('p','card-description',choices.map(s=>s.name+' ×'+s.quantity).join(' / ')));
    const invalid=draft?.status==='needs-quote';
    c.append(node('p','card-description',invalid?'选择已修改；旧报价失效。历史核价完成后才可生成确认单。':`${draft?.quotedAt||item.quotedAt}（UTC+8）历史结果，非当前价格。`));
    const index=card.index??draft.index;
    if(card.type==='meal')appendActions(c,[{label:'选这份',input:{type:'choose',index},primary:true},{label:'看看组成',input:{type:'detail',index}}]);
    else if(card.type==='composition')appendActions(c,[{label:'选这份',input:{type:'choose',index},primary:true}]);
    else if(invalid)appendActions(c,[{label:'重试历史核价',input:{type:'requote'},primary:true}]);
    else if(card.type==='confirmation'){
      c.append(node('p','card-description',`${data.store.name} · 到店自取。未查询 / 使用账户券。`));
      const row=node('div','card-actions'),copyButton=node('button','chat-action primary','复制餐单草稿');copyButton.addEventListener('click',()=>copyDraft(draft));row.append(copyButton);c.append(row);
    }else appendActions(c,[{label:'看看确认单',input:{type:'confirm'},primary:true}]);
    return c;
  }
  function renderCard(card){
    if(['meal','composition','draft','confirmation'].includes(card.type))return mealCard(card);
    const c=node('article','reply-card');
    if(card.type==='store'){
      c.append(node('h3','',data.store.name),node('p','card-description',`历史测试门店 ${data.store.code} · 到店自取\n当前营业状态未查询；不推测您的位置。`));
      appendActions(c,[{label:'就用这间测试门店',input:{type:'choose-store'},primary:true}]);
    }else if(card.type==='single'){
      const header=node('div','card-header'),copy=node('div');copy.append(node('h3','',card.item.name),node('p','card-tag','单品展示 · 独立售价未查询'));header.append(portrait(card.item),copy);c.append(header);
      c.append(node('p','card-description',card.item.image?'麦当劳接口商品原图。只展示历史套餐组成；独立售价与当前可售状态尚未核对。':'这款历史商品当前未返回原图；独立售价与当前可售状态尚未核对。'));
    }else if(card.type==='offer'){
      c.append(node('h3','','优惠查询会出现在这里'),node('p','card-description','活动：时间、参与门店、适用餐品。\n我的券：有效期、使用条件、账户归属。\n这里没有真实活动价格，也没有声称账户已拥有券。'));
    }
    return c;
  }
  function scrollBottom(force=false){if(force||nearBottom)messages.scrollTop=messages.scrollHeight;}
  function appendMessage(record,role='assistant'){
    const m=node('div','message '+(role==='assistant'?'':role)+(record.cards?.length?' has-cards':''));
    if(role!=='system')m.append(node('div','message-author',role==='user'?'你':'麦麦'));
    if(record.text)m.append(node('div','message-body',record.text));
    for(const card of record.cards||[])m.append(renderCard(card));
    appendActions(m,record.actions);messages.append(m);scrollBottom(role==='user');
    if(panel.hidden&&role==='assistant')$('#unread').hidden=false;
  }
  function updateContext(){
    const context=conversation.context(),draft=context.draft;
    $('#context').textContent=[context.store||'还没选门店',context.budget===null?null:`整餐预算 ${money(context.budget)}`,context.people==='1'?null:`${context.people} 人`,'到店自取'].filter(Boolean).join(' · ');
    if(context.store)$('#page-store').textContent=context.store+' · 历史测试门店';
    $('#page-cart-note').textContent=draft?data.candidates[draft.index].name:'还没选，慢慢聊';
    $('#page-cart-total').textContent=draft?(draft.status==='needs-quote'?'待重新核价':`${money(draft.priceCents)} · 历史价`):'尚未下单';
    document.querySelectorAll('[data-draft-version]').forEach(c=>{
      if(c.dataset.draftVersion!==String(draft?.version)){
        c.classList.add('superseded');
        if(!c.querySelector('.superseded-note'))c.append(node('p','card-description superseded-note','这是此前的餐单记录，后续已修改。请以下方最新餐单为准。'));
        c.querySelectorAll('button').forEach(button=>button.disabled=true);
      }
    });
  }
  function paintMotion(){
    const frame=motion.frame(),quiet=$('#motion').checked||document.hidden;
    const src=quiet?frame.posterPath:frame.gif;
    if(art.getAttribute('src')!==src)art.src=src;
    art.alt=frame.title;art.dataset.motion=frame.id;$('#presence').dataset.motion=frame.id;
  }
  function openChat(open){panel.hidden=!open;widget.classList.toggle('is-open',open);motion.setOpen(open);paintMotion();pet.setAttribute('aria-expanded',String(open));pet.setAttribute('aria-label',open?'点击麦麦，收起对话':'点击麦麦，展开对话');if(open){$('#unread').hidden=true;scrollBottom(true);input.focus();}else pet.focus();}
  function wait(ms,signal){return new Promise((resolve,reject)=>{if(signal.aborted){reject(new DOMException('Stopped','AbortError'));return;}const stop=()=>{clearTimeout(timer);reject(new DOMException('Stopped','AbortError'));};const timer=setTimeout(()=>{signal.removeEventListener('abort',stop);resolve();},ms);signal.addEventListener('abort',stop,{once:true});});}
  function status(text,phase='review'){motion.stage(phase);paintMotion();$('#thinking-text').textContent=text;$('#presence').textContent=text;}
  async function present(result,signal){for(const record of result.messages){if(signal.aborted)throw new DOMException('Stopped','AbortError');appendMessage(record);if(result.messages.length>1)await wait(180,signal);}}
  async function send(value,label=null){
    if(active)return;
    if(typeof value==='string'){value=value.trim();if(!value)return;if(value.length>500){toast('消息最多 500 字，可以分两条告诉我。');return;}}
    if(value?.type==='retry'){if(lastInput===null)return;value=lastInput;label='再试一次';}
    lastInput=value;const controller=new AbortController();active=controller;const requestId=++requestNumber;motion.begin();paintMotion();
    appendMessage({text:label||value},'user');input.value='';resizeInput();$('#conversation-starters').hidden=true;$('#send-message').disabled=true;$('#thinking').hidden=false;messages.setAttribute('aria-busy','true');
    let interrupted=false;
    try{
      let request=dialogue.plan(value,conversation.context());
      for(const step of request.steps){status(step.label,step.motion);await wait(step.ms,controller.signal);}
      let result=conversation.respond(value);
      updateContext();
      if(!result.followUp)motion.stage(dialogue.output(result,conversation.context(),request).replyMotion);
      paintMotion();await present(result,controller.signal);
      while(result.followUp){
        const next=result.followUp;request=dialogue.plan(next,conversation.context());
        status('演示：读取修改后整单的历史核价','calculate');await wait(1000,controller.signal);
        result=conversation.respond(next);updateContext();motion.stage('talk');paintMotion();await present(result,controller.signal);
      }
      const effect=dialogue.output(result,conversation.context(),request);
      motion.finish({success:effect.celebrate,waiting:effect.waiting,interaction:result.motion,requestId});paintMotion();
      widget.dataset.output=effect.kind;$('#presence').textContent=effect.presence;
    }catch(error){
      interrupted=true;
      if(error.name==='AbortError'){
        appendMessage({text:'已停止这次演示回复。已有聊天和餐单保留；修改过的餐单仍需重新核价。',actions:[{label:'再试一次',input:{type:'retry'}}]},'system');motion.stop();paintMotion();$('#presence').textContent='已停下来，你可以改改再说。';
      }else{
        appendMessage({text:'这次回复没能完成，聊天和餐单已保留。可以重试，或修改问题。',actions:[{label:'重试回复',input:{type:'retry'}}]},'system');motion.fail();paintMotion();$('#presence').textContent='这次没处理好，餐单还在。';
      }
      updateContext();
    }finally{
      if(active===controller)active=null;$('#send-message').disabled=false;$('#thinking').hidden=true;messages.setAttribute('aria-busy','false');
      if(!panel.hidden&&!interrupted&&document.activeElement===$('#send-message'))input.focus();
    }
  }
  function toast(text){clearTimeout(toastTimer);$('#toast').textContent=text;$('#toast').hidden=false;toastTimer=setTimeout(()=>$('#toast').hidden=true,3500);}
  async function copyDraft(draft){
    if(draft.status==='needs-quote'){toast('这份选择还需要核价。');return;}
    const item=data.candidates[draft.index],choices=draft.large?data.revision.selections:item.selections;
    const text=`餐单草稿，尚未下单\n${data.store.name}，到店自取\n${item.name}\n${choices.map(s=>s.name+' ×'+s.quantity).join('\n')}\n历史整单 ${money(draft.priceCents)}；${draft.quotedAt} UTC+8，非当前价格。未查询 / 使用账户券。`;
    try{if(!navigator.clipboard?.writeText)throw Error('Unavailable');await navigator.clipboard.writeText(text);toast('已复制餐单草稿，尚未下单。');}catch{toast('浏览器未允许复制，可直接查看消息中的餐单。');}
  }
  function resizeInput(){input.style.height='auto';input.style.height=Math.min(88,input.scrollHeight)+'px';}
  function resizeViewport(){const vv=window.visualViewport,height=vv?.height||window.innerHeight;document.documentElement.style.setProperty('--viewport-height',height+'px');widget.classList.toggle('compact',height<510);const overlap=vv?Math.max(0,window.innerHeight-vv.height-vv.offsetTop):0;widget.style.setProperty('--keyboard-offset',overlap+'px');widget.style.bottom=overlap>50?(overlap+12)+'px':'';}
  pet.addEventListener('pointerdown',e=>{if(e.button!==0)return;longPressed=false;pressTimer=setTimeout(()=>{motion.activity();longPressed=motion.play('petting');paintMotion();},550);});
  for(const event of ['pointerup','pointercancel','pointerleave'])pet.addEventListener(event,()=>clearTimeout(pressTimer));
  pet.addEventListener('contextmenu',e=>e.preventDefault());
  pet.addEventListener('click',()=>{if(longPressed){longPressed=false;return;}openChat(panel.hidden);});$('#collapse-chat').addEventListener('click',()=>openChat(false));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){e.preventDefault();openChat(false);}});
  $('#chat-form').addEventListener('submit',e=>{e.preventDefault();send(input.value);});
  input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();send(input.value);}});input.addEventListener('input',()=>{resizeInput();motion.input();paintMotion();});
  $('#stop-reply').addEventListener('click',()=>active?.abort());
  document.querySelectorAll('[data-say]').forEach(button=>button.addEventListener('click',()=>send(button.dataset.say)));
  messages.addEventListener('scroll',()=>{nearBottom=messages.scrollHeight-messages.scrollTop-messages.clientHeight<70;});
  $('#motion').addEventListener('change',()=>{document.body.classList.toggle('reduced-motion',$('#motion').checked);motion.setReduced($('#motion').checked);paintMotion();});reduce.addEventListener('change',e=>{$('#motion').checked=e.matches;document.body.classList.toggle('reduced-motion',e.matches);motion.setReduced(e.matches);paintMotion();});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)motion.activity();paintMotion();});
  window.addEventListener('resize',resizeViewport);window.visualViewport?.addEventListener('resize',resizeViewport);window.visualViewport?.addEventListener('scroll',resizeViewport);
  for(const item of data.candidates.filter(item=>item.image)){const card=node('article','background-product');card.append(portrait(item),node('h3','',item.name),node('p','','商品原图 · 历史餐单'));$('#background-products').append(card);}
  appendMessage({text:'嗨，我是麦麦。想吃什么，直接跟我说就好。\n可以闲聊，也可以让我帮你配餐、查优惠或找门店。',actions:[]});
  appendMessage({text:'当前回复来自演示脚本，报价为历史记录。商品图片已替换为麦当劳接口原图；本页还没有实时 AI / MCP 查询。'},'system');
  document.body.classList.toggle('reduced-motion',reduce.matches);motion.setReduced(reduce.matches);paintMotion();resizeViewport();
  setInterval(()=>{if(!document.hidden)paintMotion();},150);
})();
