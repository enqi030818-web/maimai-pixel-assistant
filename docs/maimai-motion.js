/* Original event-driven motion controller. Sprite assets belong to this project. */
(function(root){
  'use strict';
  const native=[['idle','安静陪伴'],['running-right','向右小跑'],['running-left','向左小跑'],['waving','见面挥手'],['jumping','开心蹦跳'],['failed','遇到困难'],['waiting','等你补充'],['running','忙着处理'],['review','想一想']];
  function catalog(companion){
    const result={};
    for(const [id,title] of native)result[id]={id,title,gif:`media/previews/${id}.gif`,posterPath:`media/previews/${id}-poster.png`,duration:1800,origin:'原有九状态'};
    for(const [id,title,duration] of [['peek','海鸥偷偷靠近',3000],['celebrate','完成后偷薯条',3000],['caught','抓包一脸无奈',3250],['share','并排分薯条',3300]])result[id]={id,title,gif:`media/seagull/${id}.gif`,posterPath:`media/seagull/${id}-poster.png`,duration,origin:'海鸥小剧场'};
    for(const c of companion?.clips||[])result[c.id]={...c,origin:'新增陪伴动作'};
    return result;
  }
  class Controller {
    constructor(clips,now=()=>Date.now()){
      this.clips=clips;this.now=now;this.open=false;this.busy=false;this.waiting=false;this.phase='review';this.sequence=[];this.lastActivity=now();this.ambientStage=0;this.reduced=false;this.completed=new Set();
    }
    activity(){this.lastActivity=this.now();this.ambientStage=0;}
    setOpen(open){const changed=this.open!==open;this.open=open;this.activity();if(changed&&open&&!this.busy)this.play('waving',1200);}
    setReduced(value){this.reduced=value;}
    input(){this.activity();if(!this.busy)this.play('listen',850);}
    begin(){this.activity();this.busy=true;this.phase='review';this.sequence=[];}
    stage(phase){if(this.busy&&this.clips[phase])this.phase=phase;}
    play(id,duration=null){
      if(this.busy||!this.clips[id])return false;
      this.sequence=[{id,until:this.now()+(duration??this.clips[id].duration)}];return true;
    }
    finish({success=false,waiting=false,interaction=null,requestId=null}={}){
      this.busy=false;this.waiting=waiting;this.activity();this.sequence=[];
      const ids=interaction&&this.clips[interaction]?[interaction]:['talk'];
      if(!interaction&&success&&(!requestId||!this.completed.has(requestId)))ids.push('celebrate');
      if(requestId&&success){this.completed.add(requestId);if(this.completed.size>100)this.completed.delete(this.completed.values().next().value);}
      let deadline=this.now();
      for(const id of ids)if(this.clips[id]){deadline+=id==='talk'?1500:id==='sleep'?6000:this.clips[id].duration;this.sequence.push({id,until:deadline});}
    }
    stop(){this.busy=false;this.sequence=[];this.activity();}
    fail(){this.busy=false;this.activity();this.play('failed',2600);}
    current(){
      const time=this.now();
      if(this.busy)return this.clips[this.phase]?this.phase:'review';
      while(this.sequence.length&&this.sequence[0].until<=time)this.sequence.shift();
      if(this.sequence.length)return this.sequence[0].id;
      if(this.waiting)return 'waiting';
      if(this.open)return this.clips.listen?'listen':'idle';
      const inactive=time-this.lastActivity;
      if(!this.reduced&&inactive>=90000&&this.clips.sleep)return 'sleep';
      if(!this.reduced&&inactive>=45000&&this.ambientStage<2){this.ambientStage=2;this.play('share');return 'share';}
      if(!this.reduced&&inactive>=20000&&this.ambientStage<1){this.ambientStage=1;this.play('peek');return 'peek';}
      return 'idle';
    }
    frame(){const id=this.current(),c=this.clips[id]||this.clips.idle;return {...c,src:this.reduced?c.posterPath:c.gif};}
  }
  const api={catalog,Controller};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MaimaiMotion=api;
})(typeof window!=='undefined'?window:{});
