"use strict";
/* Tutorial: partida de treino guiada, tour do lobby e dicas na primeira visita.
   Depende de app.js (S, G, save, startMatch, go...). */

const TUT_QS=[
  {id:"tut#1",mid:"treino",d:1,q:"GRC é a sigla de:",o:["Governance, Risk and Compliance","Gestão de Recursos Corporativos","Grupo de Revisão de Contratos","General Risk Control"],a:0,e:"GRC = Governance, Risk and Compliance: governança, risco e conformidade."},
  {id:"tut#2",mid:"treino",d:3,q:"Um risco é algo que...",o:["Pode afetar os seus objetivos","Já aconteceu, com certeza","Só existe em bancos","É sempre positivo"],a:0,e:"Risco é o efeito da incerteza nos objetivos. Pode ser negativo ou positivo."},
  {id:"tut#3",mid:"treino",d:4,q:"Compliance significa:",o:["Cumprir leis, regras e políticas","Vender mais produtos","Contratar pessoas","Criar logotipos"],a:0,e:"Compliance é cumprir obrigações: leis, regulamentos, contratos e políticas internas."}
];

/* ---------- balões (coach marks) ---------- */
const Coach={
  root:null,steps:null,i:0,done:null,onSkip:null,_re:null,
  show(steps,done,onSkip){this.close();this.steps=steps;this.i=0;this.done=done;this.onSkip=onSkip;
    const r=document.createElement("div");r.id="coach";r.innerHTML='<div class="blk"></div><div class="hole" hidden></div><div class="tip" role="dialog" aria-live="polite"></div>';
    document.body.appendChild(r);this.root=r;
    r.querySelector(".blk").addEventListener("click",e=>this.tapThrough(e));
    this._re=()=>this.place();window.addEventListener("resize",this._re);window.addEventListener("scroll",this._re,{passive:true});
    this.step();},
  close(){if(this.root){this.root.remove();this.root=null;}if(this._re){window.removeEventListener("resize",this._re);window.removeEventListener("scroll",this._re);this._re=null;}},
  target(){const s=this.steps[this.i];return s&&s.sel?document.querySelector(s.sel):null;},
  step(){if(!this.root)return;if(this.i>=this.steps.length){const d=this.done;this.close();if(d)d();return;}
    const s=this.steps[this.i],t=this.target(),tip=this.root.querySelector(".tip");
    tip.innerHTML=`${s.title?`<span class="ttl">${esc(s.title)}</span>`:""}<p>${s.text}</p>
      <div class="row" style="justify-content:space-between">${s.noSkip?"<span></span>":`<button type="button" class="skip">${esc(s.skipLabel||"Pular tutorial")}</button>`}
      ${s.tap?'<span class="hint">Toque no destaque</span>':`<button type="button" class="btn red nxt">${esc(s.btn||(this.i<this.steps.length-1?"Próximo":"Entendi"))}</button>`}</div>`;
    const sk=tip.querySelector(".skip");if(sk)sk.onclick=()=>{const k=this.onSkip;this.close();if(k)k();};
    const n=tip.querySelector(".nxt");if(n)n.onclick=()=>{sfx("tap");this.i++;this.step();};
    this.root.classList.toggle("dim",!t);
    if(t){t.scrollIntoView({block:"center",behavior:"smooth"});setTimeout(()=>this.place(),380);}
    this.place();if(n)setTimeout(()=>n.focus({preventScroll:true}),50);},
  place(){if(!this.root)return;const t=this.target(),hole=this.root.querySelector(".hole"),tip=this.root.querySelector(".tip");
    if(!t){hole.hidden=true;tip.style.top="50%";tip.style.transform="translateY(-50%)";return;}
    const r=t.getBoundingClientRect(),p=6;hole.hidden=false;
    Object.assign(hole.style,{left:(r.left-p)+"px",top:(r.top-p)+"px",width:(r.width+2*p)+"px",height:(r.height+2*p)+"px"});
    hole.classList.toggle("tap",!!this.steps[this.i].tap);
    tip.style.transform="none";const th=tip.offsetHeight,vh=window.innerHeight;
    let top=r.bottom+p+12;if(top+th>vh-12)top=r.top-p-12-th;if(top<12)top=Math.max(12,Math.min(vh-th-12,r.bottom+p+12));
    tip.style.top=top+"px";},
  tapThrough(e){const s=this.steps[this.i];if(!s||!s.tap)return;const t=this.target();if(!t)return;
    const blk=this.root.querySelector(".blk");blk.style.pointerEvents="none";const el=document.elementFromPoint(e.clientX,e.clientY);blk.style.pointerEvents="";
    if(el&&t.contains(el)){const btn=el.closest("button")||el;this.i++;const keep=this.i<this.steps.length;
      if(!keep){const d=this.done;this.close();btn.click();if(d)d();}else{btn.click();setTimeout(()=>this.step(),60);}}}
};

/* ---------- tutorial ---------- */
const Tut={
  skipAll(){S.tut.match=true;S.tut.lobby=true;save();Coach.close();go("play");},
  startTraining(){startMatch("training",null);},
  onRound(i){
    const resetClock=()=>{if(G)G.t0=Date.now();};
    if(i===0)Coach.show([
      {title:"Partida de treino",text:"Antes de valer pontos, uma partida de 3 rounds para você aprender os controles. Leva uns 2 minutos."},
      {sel:".hp",text:"Este é o seu <b>HP</b>. Cada erro tira 25. Se chegar a zero a partida acaba, mas você ainda ganha créditos."},
      {sel:".round",text:"Aqui você vê em qual <b>round</b> está. Cada pergunta é um round."},
      {sel:".qcard",text:"A pergunta aparece aqui. Leia com calma."},
      {sel:".opts",text:"Toque na resposta certa. Responder em menos de 8 segundos vale <b>headshot</b>: mais créditos.",tap:true}
    ],resetClock,()=>Tut.skipAll());
    else if(i===1)Coach.show([
      {sel:"#aRecon",text:"Agora as <b>habilidades</b>. O Recon elimina duas opções erradas. Neste treino ele é grátis: toque nele.",tap:true},
      {sel:".opts",text:"Sobraram duas opções. Escolha a certa.",tap:true}
    ],resetClock,()=>Tut.skipAll());
    else if(i===2)Coach.show([
      {sel:".abil",text:"Também existem a <b>Cura</b> (+50 HP) e a habilidade do seu agente. Os itens são comprados na <b>fase de compra</b>, antes de cada partida."},
      {sel:".opts",text:"Último round. Manda ver!",tap:true}
    ],resetClock,()=>Tut.skipAll());
  },
  onAnswer(i,right){
    if(i===0)setTimeout(()=>Coach.show([
      {sel:"#feed",text:right?"<b>Abate!</b> O registro no canto mostra o que você ganhou em cada round.":"Errou, e tudo bem. Nas partidas de verdade, a questão errada vira uma <b>spike no Defuse</b> para você revisar depois."},
      {sel:".after",text:"Depois de cada resposta aparece a <b>explicação</b>. Ler isso é metade do aprendizado."},
      {sel:"#nx",text:"Toque para ir ao próximo round.",tap:true}
    ],null,()=>Tut.skipAll()),120);
  },
  lobby(){
    Coach.show([
      {sel:".topbar .rk",text:"Seu <b>rank</b>. Cada vitória dá RR. A cada 50 RR você sobe uma divisão, de Ferro até <b>Radiante</b>. Radiante = pronta para a prova."},
      {sel:".topbar .chip",text:"Sua <b>sequência</b> de dias estudados. Do lado ficam os <b>créditos</b>, que compram itens."},
      {sel:".next",text:"Este card sempre leva à <b>próxima missão</b>. Não precisa decidir nada: é só apertar Jogar."},
      {sel:".contracts",text:"<b>Contratos diários</b>: três metas pequenas por dia. Completou, resgate créditos e RR."},
      {sel:".mapbanner",text:"A trilha. Cada <b>mapa</b> é um domínio da prova. No fim de cada mapa você <b>planta a Spike</b> para dominá-lo."},
      {sel:"#tabs",text:"<b>Range</b> treina os termos. <b>Defuse</b> revisa seus erros. <b>Intel</b> tem as dicas da prova. <b>Perfil</b> guarda rank, agente e ajustes."},
      {title:"Tudo pronto",text:"Uma missão por dia já é ótimo. Num dia difícil, 5 cartões na Range contam como dia de estudo.",btn:"Bora"}
    ],()=>{S.tut.lobby=true;save();window.scrollTo({top:0,behavior:"smooth"});},()=>{S.tut.lobby=true;save();});
  },
  tip(key,title,text){if(!S.tut.match||S.tut.tips[key])return;
    setTimeout(()=>Coach.show([{title,text,btn:"Entendi",noSkip:true}],()=>{S.tut.tips[key]=1;save();},()=>{S.tut.tips[key]=1;save();}),250);}
};
