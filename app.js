"use strict";
/* GRC Ranked — lógica do jogo. Depende de content.js (DOM, M, SA, PROJ) e sync.js (Sync). */

/* ---------- utilidades ---------- */
const $=s=>document.querySelector(s);
const app=$("#app");
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function todayStr(d){d=d||new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
function dayDiff(a,b){return Math.round((new Date(b+"T12:00:00")-new Date(a+"T12:00:00"))/864e5);}
function toast(msg){const t=$("#toast");t.textContent=msg;t.hidden=false;clearTimeout(toast._t);toast._t=setTimeout(()=>t.hidden=true,3200);}

/* ---------- estado ---------- */
const KEY="grc-ranked-v1";
function fresh(){return {v:1,updated:0,name:"",agent:null,rr:0,credits:800,inv:{shield:1,recon:1,heal:0,freeze:1},
  done:{},spikes:{},wrong:{},cards:{},days:{},streak:{count:0,last:null},daily:{},sa:{},proj:{},notes:{},sims:{},
  stats:{answered:0,correct:0,aces:0,clutches:0,headshots:0,wins:0},sfx:true,tut:{match:false,lobby:false,tips:{}}};}
let S=fresh();
function loadState(o){if(typeof cleanState==="function")o=cleanState(o);const f=fresh();const r=Object.assign(f,o||{});r.inv=Object.assign(fresh().inv,r.inv);r.stats=Object.assign(fresh().stats,r.stats);
  r.tut=Object.assign(fresh().tut,r.tut);r.tut.tips=Object.assign({},r.tut.tips);return r;}
try{const raw=localStorage.getItem(KEY);if(raw)S=loadState(JSON.parse(raw));}catch(e){}
function saveLocal(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
function save(){S.updated=Date.now();saveLocal();if(window.Sync)Sync.schedule();}

/* ---------- som e vibração ---------- */
let AC=null;
function ac(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();}catch(e){return null;}}if(AC.state==="suspended")AC.resume();return AC;}
function tone(f,t0,dur,type,vol){const c=ac();if(!c)return;const o=c.createOscillator(),g=c.createGain();o.type=type||"square";
  const t=c.currentTime+t0;o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(vol||.07,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+dur+.02);}
const SFX={
  hit(){tone(880,0,.07);tone(1320,.06,.12);},
  head(){tone(1568,0,.06,"triangle",.12);tone(2349,.05,.25,"triangle",.1);},
  miss(){tone(150,0,.28,"sawtooth",.07);},
  win(){[523,659,784,1047].forEach((f,i)=>tone(f,i*.1,.2,"triangle",.11));},
  lose(){[392,311,233].forEach((f,i)=>tone(f,i*.16,.28,"sawtooth",.06));},
  buy(){tone(660,0,.05,"square",.05);tone(990,.05,.09,"square",.05);},
  rank(){[523,784,1047,1568,2093].forEach((f,i)=>tone(f,i*.11,.35,"triangle",.12));},
  tap(){tone(520,0,.03,"sine",.04);}
};
function sfx(n){if(S.sfx){try{SFX[n]();}catch(e){}}}
function buzz(p){try{if(navigator.vibrate)navigator.vibrate(p);}catch(e){}}

/* ---------- mundo do jogo ---------- */
const MAPS={
  1:{name:"Base Fundação",code:"FND",c:"#3E6FE0"},2:{name:"Torre do Conselho",code:"GOV",c:"#8A56D6"},
  3:{name:"Zona de Risco",code:"RSK",c:"#FF4655"},4:{name:"Fortaleza Compliance",code:"CMP",c:"#1FA97A"},
  5:{name:"Cofre Cyber",code:"SEC",c:"#1A9CC4"},6:{name:"Arquivo de Auditoria",code:"AUD",c:"#D28A1B"},
  7:{name:"Laboratório Tech",code:"TEC",c:"#C2417F"},8:{name:"Competitivo Final",code:"FNL",c:"#8E9BA6"}};
const AGENTS={
  vigil:{name:"VIGIL",role:"Sentinela",c:"#2EC4B6",perk:"Começa toda partida com um escudo grátis contra o primeiro erro."},
  nyx:{name:"NYX",role:"Iniciadora",c:"#B57CF0",perk:"Um Recon grátis por partida: elimina duas opções erradas."},
  blaze:{name:"BLAZE",role:"Duelista",c:"#FF4655",perk:"A partir de 3 acertos seguidos, cada abate vale o dobro de créditos."},
  haze:{name:"HAZE",role:"Controladora",c:"#5B8CFF",perk:"Uma Smoke por partida: pula uma questão sem levar dano."}};
const SHOP={
  shield:{name:"Escudo",cost:400,desc:"Absorve o dano de um erro. Usado automaticamente."},
  recon:{name:"Recon",cost:300,desc:"Elimina duas opções erradas de uma questão."},
  heal:{name:"Cura",cost:200,desc:"Recupera 50 HP durante a partida."}};
const RANKS=["Ferro","Bronze","Prata","Ouro","Platina","Diamante","Ascendente","Imortal","Radiante"];
const RANK_C=["#7B8088","#B07A47","#BFC9CF","#E9C46A","#3FC1C9","#C08CF5","#2FBF71","#FF4655","#FFE9A8"];
const RR_DIV=50;
function rankOf(rr){const i=Math.min(24,Math.floor(rr/RR_DIV));if(i>=24)return{i:24,tier:8,name:"Radiante",into:RR_DIV,need:RR_DIV};
  const tier=Math.floor(i/3),div=i%3+1;return{i,tier,div,name:RANKS[tier]+" "+div,into:rr%RR_DIV,need:RR_DIV};}
function rankName(i){if(i>=24)return"Radiante";return RANKS[Math.floor(i/3)]+" "+(i%3+1);}

/* ---------- ícones ---------- */
const IC={
  shield:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 20 5v6c0 5-3.5 9.3-8 11-4.5-1.7-8-6-8-11V5z"/></svg>',
  recon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>',
  heal:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/></svg>',
  smoke:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="14" r="5"/><circle cx="15" cy="11" r="6"/><circle cx="17" cy="16" r="4"/></svg>',
  fire:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-6 1-9.5z"/></svg>',
  cred:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 2 21 7v10l-9 5-9-5V7z"/><path d="M15 9.5a3.5 3.5 0 1 0 0 5" /></svg>',
  play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 3l15 9-15 9z"/></svg>',
  range:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 1v5M12 18v5M1 12h5M18 12h5"/></svg>',
  spike:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1 16 8h-2v6l3 3v2H7v-2l3-3V8H8z"/><rect x="6" y="20" width="12" height="3"/></svg>',
  intel:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="18"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
  user:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="4.5"/><path d="M3 22c0-5 4-8 9-8s9 3 9 8z"/></svg>',
  star:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4.5 2 7.5-6.5-4.5L5.5 21l2-7.5L2 9h7z"/></svg>',
  starE:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3 7h7l-5.5 4.5 2 7.5-6.5-4.5L5.5 21l2-7.5L2 9h7z"/></svg>'
};
function emblem(rr,size,cls){const r=rankOf(rr),c=RANK_C[r.tier],s=size||48;
  if(r.tier===8)return `<svg class="${cls||""}" width="${s}" height="${s}" viewBox="0 0 64 64" aria-label="Radiante"><g fill="${c}"><polygon points="32,4 38,24 58,24 42,36 48,56 32,44 16,56 22,36 6,24 26,24"/></g><circle cx="32" cy="32" r="8" fill="#fff"/></svg>`;
  let ch="";for(let k=0;k<r.div;k++){const y=44-k*9;ch+=`<polyline points="18,${y} 32,${y-8} 46,${y}" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="square"/>`;}
  const fill=r.tier>=5?c+"55":c+"26";
  return `<svg class="${cls||""}" width="${s}" height="${s}" viewBox="0 0 64 64" aria-label="${esc(r.name)}"><polygon points="32,3 58,17 58,47 32,61 6,47 6,17" fill="${fill}" stroke="${c}" stroke-width="3"/>${ch}</svg>`;}
function agentArt(k,size){const a=AGENTS[k],s=size||64;const g={
  vigil:'<path d="M32 12 48 18v12c0 10-7 17-16 21-9-4-16-11-16-21V18z" fill="#0F1923"/><path d="M32 20v24" stroke="'+a.c+'" stroke-width="4"/>',
  nyx:'<path d="M10 32s9-14 22-14 22 14 22 14-9 14-22 14S10 32 10 32z" fill="#0F1923"/><circle cx="32" cy="32" r="6" fill="'+a.c+'"/>',
  blaze:'<polygon points="36,8 16,36 30,36 26,56 48,26 34,26" fill="#0F1923"/>',
  haze:'<circle cx="24" cy="36" r="10" fill="#0F1923"/><circle cx="36" cy="30" r="12" fill="#0F1923"/><circle cx="42" cy="40" r="8" fill="#0F1923"/>'}[k];
  return `<svg width="${s}" height="${s}" viewBox="0 0 64 64"><polygon points="32,2 60,17 60,47 32,62 4,47 4,17" fill="${a.c}"/>${g}</svg>`;}

/* ---------- perguntas ---------- */
const QUIZ=M.filter(m=>m.quiz).flatMap(m=>m.quiz.map((q,i)=>({id:m.id+"#q"+i,mid:m.id,d:m.d,q:q[0],o:q[1],a:q[2],e:q[3]})));
const TERMS=M.filter(m=>m.terms).flatMap(m=>m.terms.map((t,i)=>({id:m.id+"#t"+i,mid:m.id,d:m.d,en:t[0],pt:t[1]})));
function termQ(t,rev){
  let others=shuffle(TERMS.filter(x=>x.id!==t.id&&x.d===t.d)).slice(0,3);
  if(others.length<3)others=others.concat(shuffle(TERMS.filter(x=>x.id!==t.id&&others.indexOf(x)<0)).slice(0,3-others.length));
  const opts=[t].concat(others);
  return rev?{id:t.id+"b",mid:t.mid,d:t.d,q:"Qual termo corresponde a: “"+t.pt+"”",o:opts.map(x=>x.en),a:0,e:t.en+": "+t.pt}
            :{id:t.id+"a",mid:t.mid,d:t.d,q:"O que significa “"+t.en+"”?",o:opts.map(x=>x.pt),a:0,e:t.en+": "+t.pt};}
function getQ(id){if(id.indexOf("#q")>=0)return QUIZ.find(q=>q.id===id)||null;const t=TERMS.find(x=>x.id===id.slice(0,-1));return t?termQ(t,id.slice(-1)==="b"):null;}
function missionQs(m){const qs=QUIZ.filter(q=>q.mid===m.id);const ts=TERMS.filter(t=>t.mid===m.id).map((t,i)=>termQ(t,i%2===1));return shuffle(qs.concat(ts)).slice(0,7);}
function poolFor(ds){return QUIZ.filter(q=>ds.indexOf(q.d)>=0).concat(TERMS.filter(t=>ds.indexOf(t.d)>=0).map(t=>termQ(t,Math.random()<.5)));}

/* ---------- progresso ---------- */
const CORE=M.filter(m=>m.d<8);
function mapMissions(d){return M.filter(m=>m.d===d);}
function mapDone(d){return mapMissions(d).every(m=>S.done[m.id]);}
function nextTarget(){
  for(let d=1;d<=7;d++){const m=mapMissions(d).find(x=>!S.done[x.id]);if(m)return{m};if(!S.spikes[d])return{spike:d};}
  const f=mapMissions(8).find(x=>!S.done[x.id]);return f?{m:f}:null;}
function coverage(){let c=0;DOM.filter(d=>d.n<8).forEach(d=>{const ms=mapMissions(d.n);c+=d.w*ms.filter(m=>S.done[m.id]).length/ms.length;});return Math.round(c);}
let pendingRank=null;
function addRR(n){if(n<=0)return;const b=rankOf(S.rr).i;S.rr+=n;const a=rankOf(S.rr).i;if(a>b)pendingRank=a;}
const CONTRACTS=[{k:"win",label:"Vença 1 partida",goal:1},{k:"cards",label:"Treine 10 cartões na Range",goal:10},{k:"hits",label:"Acerte 8 rounds",goal:8}];
function daily(){const t=todayStr();if(!S.daily||S.daily.date!==t)S.daily={date:t,win:0,cards:0,hits:0,claimed:{}};return S.daily;}
function bump(k,n){const d=daily();d[k]=(d[k]||0)+(n||1);}
function touchDay(){const t=todayStr();if(S.days[t])return;const st=S.streak||{count:0,last:null};
  if(st.last){const g=dayDiff(st.last,t);if(g===1)st.count++;else if(g===2&&S.inv.freeze>0){S.inv.freeze--;st.count++;setTimeout(()=>toast("Congelamento usado: sua sequência foi salva."),400);}else st.count=1;}else st.count=1;
  st.last=t;S.streak=st;S.days[t]=1;}
function streakNow(){const st=S.streak;if(!st||!st.last)return 0;const g=dayDiff(st.last,todayStr());if(g<=1)return st.count;if(g===2&&S.inv.freeze>0)return st.count;return 0;}
function addWrong(id){S.wrong[id]={hits:0};}
function defuseHit(id){const w=S.wrong[id];if(!w)return false;w.hits++;if(w.hits>=2){delete S.wrong[id];return true;}return false;}

/* ---------- navegação ---------- */
let TAB="play";
const TABS=[["play","Jogar","play"],["range","Range","range"],["defuse","Defuse","spike"],["intel","Intel","intel"],["me","Perfil","user"]];
function drawTabs(){$("#tabs").innerHTML='<div class="in">'+TABS.map(t=>{const n=t[0]==="defuse"?Object.keys(S.wrong).length:0;
  return `<button type="button" data-t="${t[0]}" ${TAB===t[0]?'aria-current="page"':""}>${IC[t[2]]}${t[1]}${n?`<span class="badge">${n>99?"99+":n}</span>`:""}</button>`;}).join("")+"</div>";
  document.querySelectorAll("#tabs button").forEach(b=>b.onclick=()=>{sfx("tap");go(b.dataset.t);});}
function go(t){if(G&&G.type==="training"&&!S.tut.match){S.tut.match=true;save();}if(window.Coach)Coach.close();TAB=t;G=null;document.body.classList.remove("inmatch");drawTabs();window.scrollTo(0,0);
  ({play:vPlay,range:vRange,defuse:vDefuse,intel:vIntel,me:vMe})[t]();showRankUp();}
function enterMatchMode(){document.body.classList.add("inmatch");window.scrollTo(0,0);}

function topbar(){const r=rankOf(S.rr);
  return `<header class="topbar"><div class="rk">${emblem(S.rr,44)}<div style="min-width:0;flex:1"><b>${esc(r.name)}</b><div class="rrbar"><i style="width:${r.into/r.need*100}%"></i></div><span class="small muted">${r.tier===8?"Topo alcançado":r.into+"/"+r.need+" RR"}</span></div></div>
  <span class="chip" style="color:var(--gold)" title="Dias seguidos">${IC.fire}${streakNow()}</span><span class="chip" title="Créditos">${IC.cred}${S.credits}</span></header>`;}

/* ---------- onboarding ---------- */
function vOnboard(step){document.body.classList.add("inmatch");
  if(!step){app.innerHTML=`<div class="stack" style="padding-top:8vh;gap:22px">
    <span class="label">Protocolo de treinamento · CGRCP</span><h1 style="font-size:2.6rem">GRC <span style="color:var(--red)">Ranked</span></h1>
    <p class="muted" style="font-size:1.05rem">Cada missão é uma partida curta. Acerte rounds, ganhe créditos, suba de rank até Radiante. Radiante = pronta para a prova.</p>
    <label class="stack" style="gap:6px"><span class="label">Seu codinome</span><input id="nm" type="text" maxlength="16" placeholder="Ex.: Phoenixa" value="${esc(S.name)}"></label>
    <button class="btn red big full" id="nx" type="button">Escolher agente</button>
    ${window.Sync&&Sync.configured()?`<div class="panel" style="gap:10px"><span class="label">Já joga em outro aparelho?</span><p class="small muted">Digite o código de sincronização que aparece no Perfil do outro aparelho.</p>
     <div class="row" style="gap:8px"><input id="ci" type="text" maxlength="9" autocapitalize="characters" autocomplete="off" spellcheck="false" placeholder="Ex.: K7PX-4QMA" style="flex:1;min-width:160px;text-transform:uppercase"><button class="btn" id="cu" type="button">Continuar</button></div><span id="sm" class="small muted"></span></div>`:""}</div>`;
    $("#nx").onclick=()=>{S.name=($("#nm").value||"").trim()||"Agente";save();sfx("tap");vOnboard(2);};
    const cu=$("#cu");if(cu)cu.onclick=async()=>{$("#sm").textContent="Procurando código…";try{await Sync.join($("#ci").value);toast("Bem-vinda de volta, "+(S.name||"agente")+"!");if(S.agent)go("play");else vOnboard(2);}catch(e){$("#sm").textContent=Sync.nice(e);}};
    return;}
  vAgentPick(true);}
function vAgentPick(first){document.body.classList.add("inmatch");
  app.innerHTML=`<div class="stack" style="padding-top:20px"><span class="label">${first?"Passo 2 de 2":"Trocar agente"}</span><h1>Escolha seu agente</h1>
   <p class="muted">Cada agente tem uma habilidade passiva. Você pode trocar quando quiser no Perfil.</p>
   <div class="agents">${Object.keys(AGENTS).map(k=>{const a=AGENTS[k];return `<button type="button" class="agent ${S.agent===k?"sel":""}" style="--ac:${a.c}" data-a="${k}">${agentArt(k,72)}<span class="nm">${a.name}</span><span class="role">${a.role}</span><span class="perk">${a.perk}</span></button>`;}).join("")}</div>
   <button class="btn red big full" id="lock" type="button" ${S.agent?"":"disabled"}>Travar agente</button></div>`;
  document.querySelectorAll(".agent").forEach(b=>b.onclick=()=>{S.agent=b.dataset.a;sfx("tap");document.querySelectorAll(".agent").forEach(x=>x.classList.toggle("sel",x===b));$("#lock").disabled=false;});
  $("#lock").onclick=()=>{save();sfx("buy");buzz(40);go(first?"play":"me");};}

/* ---------- JOGAR ---------- */
function vPlay(){
  if(S.agent&&!S.tut.match)return Tut.startTraining();
  const nt=nextTarget(),d=daily();let nextHtml="";
  if(nt&&nt.m){const m=nt.m;nextHtml=`<section class="next"><div><span class="label">Próxima partida · ${MAPS[m.d].name}</span><h2>${m.id} · ${esc(m.t)}</h2><p>${esc(m.goal)}</p></div><button class="btn big" id="gonext" type="button">${IC.play} Jogar</button></section>`;}
  else if(nt&&nt.spike){nextHtml=`<section class="next"><div><span class="label">Mapa ${nt.spike} completo</span><h2>Plante a Spike: ${MAPS[nt.spike].name}</h2><p>Partida de 10 rounds misturando todo o mapa. Vencer domina o mapa.</p></div><button class="btn big" id="gonext" type="button">${IC.spike} Plantar</button></section>`;}
  else nextHtml=`<section class="next"><div><span class="label">Rota completa</span><h2>Você zerou o GRC Ranked</h2><p>Repita os simulados até passar de 80% com folga e marque a prova.</p></div></section>`;
  const contracts=CONTRACTS.map(c=>{const v=Math.min(c.goal,d[c.k]||0),ok=v>=c.goal,cl=d.claimed[c.k];
    return `<div class="contract"><span>${esc(c.label)} <span class="muted small num">${v}/${c.goal}</span></span>${cl?'<span class="small" style="color:var(--teal)">Resgatado</span>':`<button class="btn ${ok?"red":"ghost"}" type="button" data-claim="${c.k}" ${ok?"":"disabled"}>+300</button>`}<div class="cbar"><i style="width:${v/c.goal*100}%"></i></div></div>`;}).join("");
  let map="";
  for(let n=1;n<=8;n++){const mp=MAPS[n],ms=mapMissions(n),dn=ms.filter(m=>S.done[m.id]).length,dm=DOM.find(x=>x.n===n);
    map+=`<section class="mapsec"><div class="mapbanner" style="--mc:${mp.c}"><span class="code">${mp.code}</span><span class="label">${n<8?"Mapa 0"+n+" · "+dm.w+"% da prova":"Mapa final"} · ${dn}/${ms.length}</span><h2>${mp.name}</h2><span class="small" style="color:rgba(255,255,255,.75)">${esc(dm.name)}</span></div><div class="path" style="--mc:${mp.c}">`;
    const offs=[0,56,84,56,0,-56,-84,-56];
    ms.forEach((m,i)=>{const isN=nt&&nt.m&&nt.m.id===m.id,dd=S.done[m.id],st=dd?dd.best||1:0;
      map+=`<button type="button" class="node ${dd?"done":""} ${isN?"cur":""}" style="transform:translateX(${offs[i%8]}px)" data-m="${m.id}"><span class="hex">${m.kind?m.id:m.id}</span><span class="stars" style="color:var(--gold)">${m.kind?"":[1,2,3].map(k=>k<=st?IC.star:IC.starE).join("")}</span><span class="nm">${esc(m.t)}</span></button>`;});
    if(n<8){const un=mapDone(n),dn2=S.spikes[n],isN=nt&&nt.spike===n;
      map+=`<button type="button" class="node spike ${dn2?"done":""} ${un?"":"locked"} ${isN?"cur":""}" data-spike="${n}"><span class="hex" style="width:84px;height:84px">${IC.spike.replace("<svg",'<svg width="34" height="34"')}</span><span class="nm">${dn2?"Mapa dominado":un?"Plante a Spike":"Termine o mapa"}</span></button>`;}
    map+=`</div></section>`;}
  app.innerHTML=topbar()+nextHtml+`<section class="panel contracts"><div class="row" style="justify-content:space-between"><span class="label">Contratos diários</span><span class="small muted">renovam à meia-noite</span></div>${contracts}</section><div class="map">${map}</div>`;
  const g=$("#gonext");if(g)g.onclick=()=>{sfx("tap");nt.m?openMission(nt.m.id):startBuy("spike",nt.spike);};
  document.querySelectorAll("[data-m]").forEach(b=>b.onclick=()=>{sfx("tap");openMission(b.dataset.m);});
  document.querySelectorAll("[data-spike]").forEach(b=>b.onclick=()=>{const n=+b.dataset.spike;if(!mapDone(n)){toast("Conclua todas as missões do mapa para plantar a Spike.");return;}sfx("tap");startBuy("spike",n);});
  document.querySelectorAll("[data-claim]").forEach(b=>b.onclick=()=>{const d2=daily();d2.claimed[b.dataset.claim]=1;S.credits+=300;addRR(10);touchDay();
    if(CONTRACTS.every(c=>d2.claimed[c.k])){S.inv.freeze++;toast("Todos os contratos feitos! +1 congelamento de sequência.");}else toast("+300 créditos e +10 RR");save();sfx("buy");vPlay();showRankUp();});
  if(!S.tut.lobby){setTimeout(()=>{if(TAB==="play"&&!G)Tut.lobby();},400);return;}
  const sc=document.querySelector(".node.cur");if(sc&&!vPlay._scrolled){vPlay._scrolled=1;setTimeout(()=>sc.scrollIntoView({block:"center",behavior:"smooth"}),300);}
}

function openMission(id){const m=M.find(x=>x.id===id);if(!m)return;
  if(m.kind==="quiz")return startBuy("sim",m);
  if(m.kind==="sa")return vComms(m);
  if(m.kind==="proj")return vProj(m);
  vBrief(m,0);}

/* ---------- briefing ---------- */
function vBrief(m,i){enterMatchMode();
  const cards=m.learn.concat(["__do__"]);const n=cards.length;
  if(i>=n)return vTerms(m);
  const c=cards[i];
  const body=c==="__do__"?`<span class="label" style="color:var(--gold)">Desafio de campo</span><p>${esc(m.do)}</p><textarea id="dn" placeholder="Escreva aqui (opcional). Isso vira a sua experiência prática.">${esc(S.notes[m.id]||"")}</textarea>`
    :`<span class="label">Intel ${i+1} de ${n-1}</span><div>${c}</div>`;
  app.innerHTML=`<div class="brief"><div class="bar3"><button class="btn ghost" id="q" type="button">✕ Sair</button><span class="label">${m.id} · ${esc(MAPS[m.d].name)}</span><button class="btn ghost" id="sk" type="button">Pular</button></div>
   <div class="dots">${cards.map((_,k)=>`<i class="${k<=i?"on":""}"></i>`).join("")}</div>
   <h2>${esc(m.t)}</h2>
   <div class="bcard">${body}</div>
   <div class="bnav"><button class="btn" id="pv" type="button" ${i?"":"disabled"}>Voltar</button><button class="btn red big" id="nx" type="button">${i<n-1?"Próximo":"Revisar termos"}</button></div></div>`;
  $("#q").onclick=()=>go("play");$("#sk").onclick=()=>vTerms(m);
  $("#pv").onclick=()=>vBrief(m,i-1);$("#nx").onclick=()=>{sfx("tap");vBrief(m,i+1);};
  const dn=$("#dn");if(dn)dn.oninput=e=>{S.notes[m.id]=e.target.value;save();};}
function vTerms(m){enterMatchMode();
  app.innerHTML=`<div class="stack"><div class="row" style="justify-content:space-between"><button class="btn ghost" id="bk" type="button">Voltar</button><span class="label">Termos da prova (em inglês)</span></div>
   <h2>Tente lembrar antes de tocar</h2>
   <div class="terms">${m.terms.map(t=>`<button type="button" class="term"><span class="en">${esc(t[0])}</span><span class="pt">${esc(t[1])}</span></button>`).join("")}</div>
   <button class="btn red big full" id="buy" type="button">Fase de compra</button></div>`;
  document.querySelectorAll(".term").forEach(t=>t.onclick=()=>{t.classList.toggle("open");sfx("tap");});
  $("#bk").onclick=()=>vBrief(m,m.learn.length);$("#buy").onclick=()=>startBuy("mission",m);}

/* ---------- fase de compra ---------- */
function startBuy(type,ctx){enterMatchMode();
  const title=type==="mission"?ctx.id+" · "+ctx.t:type==="spike"?"Plantar a Spike · "+MAPS[ctx].name:type==="sim"?ctx.t:"Desarmar erros";
  const a=AGENTS[S.agent]||AGENTS.vigil;
  const draw=()=>{app.innerHTML=`<div class="stack"><div class="row" style="justify-content:space-between"><button class="btn ghost" id="q" type="button">✕ Sair</button><span class="chip">${IC.cred}${S.credits}</span></div>
   <span class="label" style="color:var(--red)">Fase de compra</span><h1>${esc(title)}</h1>
   <p class="muted">${type==="sim"?"Simulado sem HP: como na prova, conta a porcentagem de acertos. Meta: 70%.":type==="spike"?"10 rounds do mapa inteiro. Cada erro tira 25 HP.":"Cada erro tira 25 HP. Chegou a zero, a partida acaba, mas você ainda ganha créditos."}</p>
   <div class="panel" style="flex-direction:row;align-items:center;gap:14px">${agentArt(S.agent||"vigil",56)}<div><b class="hud-t">${a.name} · ${a.role}</b><p class="small muted">${a.perk}</p></div></div>
   <div class="shop">${Object.keys(SHOP).map(k=>{const it=SHOP[k];return `<div class="item"><div class="top"><span style="color:var(--teal)">${IC[k]}</span><span class="own">x${S.inv[k]||0}</span></div><b class="hud-t">${it.name}</b><span class="small muted">${it.desc}</span><button class="btn ${S.credits>=it.cost?"":"ghost"}" type="button" data-buy="${k}" ${S.credits>=it.cost?"":"disabled"}>${IC.cred.replace("<svg",'<svg width="14" height="14"')} ${it.cost}</button></div>`;}).join("")}</div>
   <button class="btn red big full" id="start" type="button">Iniciar partida</button></div>`;
   $("#q").onclick=()=>go("play");
   document.querySelectorAll("[data-buy]").forEach(b=>b.onclick=()=>{const it=SHOP[b.dataset.buy];if(S.credits<it.cost)return;S.credits-=it.cost;S.inv[b.dataset.buy]=(S.inv[b.dataset.buy]||0)+1;save();sfx("buy");buzz(20);draw();});
   $("#start").onclick=()=>startMatch(type,ctx);};
  draw();
  Tut.tip("buy","Fase de compra","Antes de cada partida você pode gastar créditos em itens. O <b>Escudo</b> segura um erro sozinho, o <b>Recon</b> elimina duas opções e a <b>Cura</b> devolve 50 HP. Os itens ficam guardados até você usar.");}

/* ---------- partida ---------- */
let G=null;
function startMatch(type,ctx){let qs;
  if(type==="mission")qs=missionQs(ctx);
  else if(type==="spike")qs=shuffle(poolFor([ctx])).slice(0,10);
  else if(type==="sim"){qs=shuffle(QUIZ.filter(q=>ctx.preset.indexOf(q.d)>=0)).slice(0,ctx.n);}
  else if(type==="training")qs=TUT_QS.slice();
  else qs=shuffle(Object.keys(S.wrong)).slice(0,5).map(getQ).filter(Boolean);
  if(!qs.length){toast("Nada para jogar aqui ainda.");return go("play");}
  const tr=type==="training";
  G={type,ctx,qs,i:0,hp:100,hpOn:type==="mission"||type==="spike"||tr,freeShield:!tr&&S.agent==="vigil",freeRecon:tr||S.agent==="nyx",smoke:!tr&&S.agent==="haze"?1:0,
     streak:0,ok:0,bad:0,cred:0,heads:0,defused:0,lastOk:false};
  enterMatchMode();sfx("buy");vRound();}
function vRound(){const q=G.qs[G.i];G.answered=false;G.t0=Date.now();G.order=shuffle(q.o.map((_,k)=>k));
  const shield=G.freeShield||(S.inv.shield>0&&G.type!=="training");const recon=G.freeRecon||S.inv.recon>0;
  app.innerHTML=`<div class="hud"><button class="x" id="quit" type="button" aria-label="Sair da partida">✕</button>
    ${G.hpOn?`<div class="hp ${G.hp<=25?"low":""}"><span class="n">${G.hp}</span><span class="bar"><i style="width:${G.hp}%"></i></span>${shield?`<span class="sh" title="Escudo ativo">${IC.shield}</span>`:""}</div>`:`<div class="hp"><span class="n" style="font-size:1.2rem">${G.ok}<span class="muted">/${G.i}</span></span><span class="small muted">acertos</span></div>`}
    <span class="chip">${IC.cred}${G.cred}</span>
    <div class="round">Round<br><b>${G.i+1}</b>/${G.qs.length}</div></div>
   <div class="feed" id="feed"></div>
   <div class="qcard"><span class="tag">D${q.d} · missão ${q.mid}${G.streak>=3?` · <span style="color:var(--gold)">sequência ${G.streak}</span>`:""}</span><p>${esc(q.q)}</p></div>
   <div class="opts">${G.order.map((k,i)=>`<button type="button" class="opt" data-k="${k}"><span class="k">${"ABCD"[i]}</span><span>${esc(q.o[k])}</span></button>`).join("")}</div>
   <div class="abil">
    <button type="button" class="ab" id="aRecon" ${recon?"":"disabled"}>${IC.recon} Recon <b>${G.freeRecon?"grátis":"x"+S.inv.recon}</b></button>
    ${G.hpOn?`<button type="button" class="ab" id="aHeal" ${S.inv.heal>0&&G.hp<100?"":"disabled"}>${IC.heal} Cura <b>x${S.inv.heal}</b></button>`:""}
    ${S.agent==="haze"&&G.hpOn?`<button type="button" class="ab" id="aSmoke" ${G.smoke?"":"disabled"}>${IC.smoke} Smoke <b>x${G.smoke}</b></button>`:""}
   </div><div id="after"></div>`;
  $("#quit").onclick=()=>{if(G.i===0&&!G.answered)return go("play");confirmQuit();};
  document.querySelectorAll(".opt").forEach(b=>b.onclick=()=>answer(+b.dataset.k));
  $("#aRecon").onclick=()=>{if(G.answered)return;const wrong=G.order.filter(k=>k!==q.a);const rm=shuffle(wrong).slice(0,2);
    if(G.freeRecon)G.freeRecon=false;else S.inv.recon--;save();rm.forEach(k=>{const b=document.querySelector(`.opt[data-k="${k}"]`);b.classList.add("gone");b.disabled=true;});$("#aRecon").disabled=true;feed("RECON: 2 opções eliminadas");sfx("buy");};
  const h=$("#aHeal");if(h)h.onclick=()=>{S.inv.heal--;G.hp=Math.min(100,G.hp+50);save();sfx("buy");feed("CURA +50 HP");vRoundHud();h.disabled=true;};
  const sm=$("#aSmoke");if(sm)sm.onclick=()=>{if(G.answered)return;G.smoke--;addWrong(q.id);save();feed("SMOKE: questão foi para o Defuse");next();};
  if(G.type==="training")Tut.onRound(G.i);}
function vRoundHud(){const hp=document.querySelector(".hp");if(!hp||!G.hpOn)return;hp.classList.toggle("low",G.hp<=25);hp.querySelector(".n").textContent=G.hp;hp.querySelector(".bar i").style.width=G.hp+"%";
  const sh=hp.querySelector(".sh");if(sh&&!(G.freeShield||S.inv.shield>0))sh.remove();}
function feed(txt,cls){const f=$("#feed");if(!f)return;const d=document.createElement("div");d.className=cls||"";d.textContent=txt;f.prepend(d);while(f.children.length>3)f.lastChild.remove();}
function answer(k){if(G.answered)return;G.answered=true;const q=G.qs[G.i],right=k===q.a,fast=Date.now()-G.t0<8000;S.stats.answered++;
  document.querySelectorAll(".opt").forEach(b=>{b.disabled=true;if(+b.dataset.k===q.a)b.classList.add("right");});
  if(right){G.ok++;G.streak++;S.stats.correct++;bump("hits");let c=200;if(fast){c+=50;G.heads++;S.stats.headshots++;}if(S.agent==="blaze"&&G.streak>=3)c*=2;G.cred+=c;G.lastOk=true;
    if(defuseHit(q.id)){G.defused++;feed("SPIKE DESARMADA","hs");}
    feed(fast?"HEADSHOT +"+c:"ABATE +"+c,fast?"hs":"");sfx(fast?"head":"hit");buzz(25);}
  else{G.bad++;G.streak=0;G.lastOk=false;document.querySelector(`.opt[data-k="${k}"]`).classList.add("wrong");
    if(G.type==="defuse")S.wrong[q.id]={hits:0};else if(G.type!=="training")addWrong(q.id);
    if(G.hpOn){if(G.freeShield){G.freeShield=false;feed("ESCUDO ABSORVEU O DANO");}else if(S.inv.shield>0&&G.type!=="training"){S.inv.shield--;feed("ESCUDO ABSORVEU O DANO");}else{G.hp=Math.max(0,G.hp-25);feed("−25 HP","bad");}vRoundHud();}
    else feed("ERROU","bad");sfx("miss");buzz([50,40,50]);}
  save();
  const dead=G.hpOn&&G.hp<=0,last=G.i>=G.qs.length-1;
  const af=$("#after");af.innerHTML=`<div class="after ${right?"ok":"no"}"><span class="res">${right?(fast?"Headshot":"Abate confirmado"):"Errou"}</span><p>${esc(q.e||"")}</p><button class="btn red full" id="nx" type="button">${dead?"Ver resultado":last?"Ver resultado":"Próximo round"}</button></div>`;
  $("#nx").onclick=()=>{dead?endMatch():next();};
  setTimeout(()=>af.scrollIntoView({block:"nearest",behavior:"smooth"}),50);
  if(G.type==="training")Tut.onAnswer(G.i,right);}
function next(){G.i++;if(G.i>=G.qs.length)return endMatch();vRound();}
function confirmQuit(){const af=$("#after");af.innerHTML=`<div class="after no"><span class="res">Abandonar a partida?</span><p>O que você já acertou fica salvo, mas a missão não conta como vencida.</p><div class="row"><button class="btn red" id="yq" type="button">Abandonar</button><button class="btn" id="nq" type="button">Continuar jogando</button></div></div>`;
  $("#yq").onclick=()=>go("play");$("#nq").onclick=()=>{af.innerHTML="";};af.scrollIntoView({block:"nearest"});}

function endTraining(){S.tut.match=true;S.credits+=G.cred+500;addRR(15);touchDay();save();sfx("win");buzz([30,60,30,60,80]);
  app.innerHTML=`<div class="result"><span class="label">Partida de treino</span><div class="rtitle win">Treino feito</div>
   <p class="muted">${G.ok}/${G.qs.length} acertos. Você ganhou ${G.cred+500} créditos e seus primeiros 15 RR.</p>
   <div class="panel" style="text-align:left;width:100%"><span class="label">Resumo rápido</span><ul class="list">
    <li><b>Errou?</b> A questão vira spike no Defuse. Acerte 2 vezes para desarmar.</li>
    <li><b>Venceu?</b> Ganha RR e estrelas. Sem erros é <b>ACE</b>.</li>
    <li><b>Perdeu?</b> Ainda ganha créditos. Derrota aqui é treino.</li></ul></div>
   <button class="btn red big" id="ct" type="button">Ir para o lobby</button></div>`;
  $("#ct").onclick=()=>go("play");}
function endMatch(){if(G.type==="training")return endTraining();const t=G.type,total=G.qs.length,pct=Math.round(G.ok/total*100);let win,rr=0,title,sub="";
  if(t==="mission"){win=G.hp>0;const m=G.ctx;if(win){const stars=G.bad===0?3:G.bad<=1?2:1,prev=S.done[m.id];S.done[m.id]={best:Math.max(prev?prev.best:0,stars),wins:(prev?prev.wins:0)+1};rr=prev?8:20+stars*5;sub=stars+(stars>1?" estrelas":" estrela");}else rr=3;}
  else if(t==="spike"){win=G.hp>0;if(win){rr=S.spikes[G.ctx]?10:60;S.spikes[G.ctx]=true;sub="Mapa "+MAPS[G.ctx].name+" dominado";}else rr=3;}
  else if(t==="sim"){win=pct>=70;const id=G.ctx.id;S.sims[id]=Math.max(S.sims[id]||0,pct);if(win){rr=S.done[id]?15:100;S.done[id]={best:3,wins:((S.done[id]||{}).wins||0)+1};}else rr=5;sub=pct+"% de acertos · melhor: "+S.sims[id]+"%";}
  else{win=true;rr=G.defused*5+G.ok*2;sub=G.defused+" "+(G.defused===1?"erro desarmado":"erros desarmados")+" · restam "+Object.keys(S.wrong).length;}
  const ace=G.bad===0&&total>=5,clutch=win&&G.hpOn&&G.hp<=25&&G.lastOk;
  if(win&&t!=="defuse"){bump("win");S.stats.wins++;}
  if(ace)S.stats.aces++;if(clutch)S.stats.clutches++;
  const bonus=t==="defuse"?0:win?500:250;S.credits+=G.cred+bonus;
  touchDay();addRR(rr);save();
  title=t==="sim"?(win?"Aprovada":"Ainda não"):t==="defuse"?"Defuse feito":t==="spike"&&win?"Spike plantada":win?"Vitória":"Derrota";
  sfx(win?"win":"lose");buzz(win?[30,60,30,60,80]:[120]);
  app.innerHTML=`<div class="result"><span class="label">${esc(t==="mission"?G.ctx.id+" · "+G.ctx.t:t==="spike"?MAPS[G.ctx].name:t==="sim"?G.ctx.t:"Defuse")}</span>
   <div class="rtitle ${win?"win":"lose"}">${title}</div><p class="muted">${esc(sub)}</p>
   <div class="badges">${ace?'<span class="badge2">ACE</span>':""}${clutch?'<span class="badge2 clutch">CLUTCH</span>':""}${G.heads>=3?'<span class="badge2" style="background:var(--off)">'+G.heads+' HEADSHOTS</span>':""}</div>
   <div class="grid4"><div class="stat"><span class="num">${G.ok}/${total}</span><span class="label">Acertos</span></div><div class="stat"><span class="num">${G.heads}</span><span class="label">Headshots</span></div><div class="stat"><span class="num" style="color:var(--gold)">+${G.cred+bonus}</span><span class="label">Créditos</span></div><div class="stat"><span class="num" style="color:var(--teal)">+${rr}</span><span class="label">RR</span></div></div>
   ${!win&&t!=="defuse"?'<p class="small muted">Os erros foram para o Defuse. Revise e tente de novo: derrota aqui é treino.</p>':""}
   <div class="row" style="justify-content:center;width:100%"><button class="btn red big" id="ct" type="button">Continuar</button>${!win&&t==="mission"?'<button class="btn big" id="rt" type="button">Revanche</button>':""}</div></div>`;
  const ctx=G.ctx;$("#ct").onclick=()=>go(t==="defuse"?"defuse":"play");const rt=$("#rt");if(rt)rt.onclick=()=>startBuy("mission",ctx);
  showRankUp();}
function showRankUp(){if(pendingRank==null)return;const i=pendingRank;pendingRank=null;const o=$("#overlay");
  o.innerHTML=`<span class="label">Promoção</span>${emblem(i*RR_DIV,150,"em")}<div class="rtitle" style="color:${RANK_C[Math.min(8,Math.floor(i/3))]}">Rank up</div><h2>${esc(rankName(i))}</h2><button class="btn red big" id="ok" type="button">Bora</button>`;
  o.hidden=false;sfx("rank");buzz([40,40,40,40,160]);$("#ok").onclick=()=>{o.hidden=true;};}

/* ---------- RANGE (flashcards) ---------- */
let FC=null;
function vRange(){const counts=[0,0,0,0,0];TERMS.forEach(c=>counts[S.cards[c.id]||0]++);
  app.innerHTML=topbar()+`<section class="stack"><span class="label">The Range · repetição espaçada</span><h1>Treino de mira</h1>
   <p class="muted">Cada cartão sobe de nível quando você acerta e volta ao nível 0 quando erra. Os de nível baixo aparecem primeiro. +20 créditos por acerto.</p>
   <div class="boxes">${counts.map((c,i)=>`<div><b>${c}</b><span>nível ${i}</span></div>`).join("")}</div>
   <label class="stack" style="gap:6px"><span class="label">Mapa</span><select id="fd"><option value="all">Todos os mapas</option><option value="done">Só missões que venci</option>${[1,2,3,4,5,6,7].map(n=>`<option value="${n}">${n} · ${MAPS[n].name}</option>`).join("")}</select></label>
   <div class="row"><button class="btn red big" id="f10" type="button">Sessão de 10</button><button class="btn big" id="f5" type="button">Dia difícil: 5</button></div>
   <div id="fc" class="stack"></div></section>`;
  $("#f10").onclick=()=>startCards(10);$("#f5").onclick=()=>startCards(5);
  Tut.tip("range","The Range","Aqui você treina os termos da prova em inglês. Leia o termo, <b>diga o significado em voz alta</b> e só então toque no cartão. Seja honesta no Acertei/Errei: é isso que decide quando o cartão volta.");}
function startCards(n){const v=$("#fd").value;let pool=TERMS;if(v==="done")pool=TERMS.filter(c=>S.done[c.mid]);else if(v!=="all")pool=TERMS.filter(c=>c.d===+v);if(!pool.length)pool=TERMS;
  FC={q:shuffle(pool).sort((a,b)=>(S.cards[a.id]||0)-(S.cards[b.id]||0)).slice(0,n),i:0,ok:0};sfx("tap");drawCard();}
function drawCard(){const el=$("#fc");if(!el||!FC)return;
  if(FC.i>=FC.q.length){touchDay();save();el.innerHTML=`<div class="panel" style="align-items:center;text-align:center"><span class="label">Sessão concluída</span><span class="num" style="font-size:2.6rem">${FC.ok}/${FC.q.length}</span><p class="muted">Já conta como dia de estudo. +${FC.ok*20} créditos.</p></div>`;
    const c=[0,0,0,0,0];TERMS.forEach(x=>c[S.cards[x.id]||0]++);document.querySelectorAll(".boxes b").forEach((b,i)=>b.textContent=c[i]);drawTabs();return;}
  const c=FC.q[FC.i];
  el.innerHTML=`<p class="small muted" style="text-align:center">Alvo ${FC.i+1} de ${FC.q.length} · ${esc(MAPS[c.d].name)} · nível ${S.cards[c.id]||0}</p>
   <button type="button" class="fcard" id="card" aria-label="Virar cartão"><div class="inner"><div class="face front">${IC.range.replace("<svg",'<svg class="target"')}<span class="w">${esc(c.en)}</span><span class="small muted">Diga a resposta em voz alta. Depois toque.</span></div><div class="face back"><span>${esc(c.pt)}</span></div></div></button>
   <div class="bnav" style="grid-template-columns:1fr 1fr"><button class="btn big" id="no" type="button">Errei</button><button class="btn red big" id="yes" type="button">Acertei</button></div>`;
  $("#card").onclick=e=>{e.currentTarget.classList.toggle("flip");sfx("tap");};
  $("#no").onclick=()=>{S.cards[c.id]=0;bump("cards");save();sfx("miss");FC.i++;drawCard();};
  $("#yes").onclick=()=>{S.cards[c.id]=Math.min(4,(S.cards[c.id]||0)+1);S.credits+=20;bump("cards");FC.ok++;save();sfx("hit");buzz(20);FC.i++;drawCard();};}

/* ---------- DEFUSE ---------- */
function vDefuse(){const ids=Object.keys(S.wrong).filter(id=>id.indexOf("tut#")<0);
  app.innerHTML=topbar()+`<section class="stack"><span class="label" style="color:var(--red)">Defuse</span><h1>Desarme seus erros</h1>
   <p class="muted">Toda questão que você erra vira uma spike aqui. Acerte a mesma questão 2 vezes para desarmá-la. Isso é o que mais faz a matéria grudar.</p>
   <div class="panel edge" style="flex-direction:row;align-items:center;justify-content:space-between"><div><span class="num" style="font-size:2.4rem">${ids.length}</span><p class="small muted">${ids.length===1?"spike ativa":"spikes ativas"}</p></div>
   <button class="btn red big" id="df" type="button" ${ids.length?"":"disabled"}>${IC.spike} Desarmar 5</button></div>
   ${ids.length?`<div class="stack">${ids.slice(0,12).map(id=>{const q=getQ(id);return q?`<div class="panel" style="padding:12px 14px;gap:4px"><span class="tag">${esc(MAPS[q.d].name)} · ${q.mid} · ${S.wrong[id].hits}/2</span><span>${esc(q.q)}</span></div>`:"";}).join("")}${ids.length>12?`<p class="small muted">e mais ${ids.length-12}.</p>`:""}</div>`
     :`<p class="muted">Nenhuma spike ativa. Quando errar uma questão numa partida, ela aparece aqui.</p>`}</section>`;
  const b=$("#df");if(b)b.onclick=()=>startMatch("defuse",null);
  Tut.tip("defuse","Defuse","Cada questão que você erra vira uma <b>spike</b> aqui. Acerte a mesma questão <b>2 vezes</b> para desarmar. Um Defuse por dia é o treino que mais rende.");}

/* ---------- COMMS (respostas curtas) ---------- */
function vComms(m){enterMatchMode();const okN=SA.filter((_,i)=>S.sa[i]&&S.sa[i].ok).length;
  app.innerHTML=`<div class="stack"><div class="row" style="justify-content:space-between"><button class="btn ghost" id="q" type="button">✕ Sair</button><span class="label">${okN}/${SA.length} confirmadas</span></div>
   <span class="label" style="color:var(--red)">${m.id} · Comms</span><h1>${esc(m.t)}</h1>
   <div class="panel edge"><p><b>Fórmula:</b> defina → explique → dê um exemplo. De 2 a 4 frases em inglês, com o termo técnico exato.</p><p class="small muted">Escreva, abra a resposta modelo e seja honesta: os termos-chave estão lá?</p></div>
   ${SA.map((s,i)=>{const st=S.sa[i]||{};return `<div class="panel" style="gap:10px"><span class="tag">Call ${i+1}${st.ok?' · <span style="color:var(--teal)">confirmada</span>':""}</span><p><b>${esc(s[0])}</b></p>
     <textarea data-sa="${i}" placeholder="Your answer in English">${esc(st.text||"")}</textarea>
     <div class="row"><button class="btn" type="button" data-show="${i}">Ver resposta modelo</button></div>
     <div class="model" id="m${i}" hidden>${esc(s[1])}<div class="row" style="margin-top:10px"><button class="btn red" type="button" data-ok="${i}">Acertei o essencial</button><button class="btn ghost" type="button" data-no="${i}">Faltou coisa</button></div></div></div>`;}).join("")}</div>`;
  $("#q").onclick=()=>go("play");
  document.querySelectorAll("[data-sa]").forEach(t=>t.oninput=()=>{const i=t.dataset.sa;S.sa[i]=Object.assign(S.sa[i]||{},{text:t.value});save();});
  document.querySelectorAll("[data-show]").forEach(b=>b.onclick=()=>{const el=$("#m"+b.dataset.show);el.hidden=!el.hidden;});
  document.querySelectorAll("[data-ok]").forEach(b=>b.onclick=()=>{const i=b.dataset.ok;const was=S.sa[i]&&S.sa[i].ok;S.sa[i]=Object.assign(S.sa[i]||{},{ok:true});if(!was){S.credits+=150;bump("hits");}
    if(SA.every((_,k)=>S.sa[k]&&S.sa[k].ok)&&!S.done[m.id]){S.done[m.id]={best:3,wins:1};addRR(60);toast("Comms completo! +60 RR");}else toast("+150 créditos");touchDay();save();sfx("hit");vComms(m);showRankUp();});
  document.querySelectorAll("[data-no]").forEach(b=>b.onclick=()=>{const i=b.dataset.no;S.sa[i]=Object.assign(S.sa[i]||{},{ok:false});save();toast("Reescreva incluindo os termos que faltaram.");vComms(m);});}

/* ---------- PROJETO ---------- */
function vProj(m){enterMatchMode();
  app.innerHTML=`<div class="stack"><div class="row" style="justify-content:space-between"><button class="btn ghost" id="q" type="button">✕ Sair</button><span class="label">${PROJ.filter((_,i)=>S.proj[i]).length}/${PROJ.length}</span></div>
   <span class="label" style="color:var(--red)">${m.id} · Operação final</span><h1>${esc(m.t)}</h1>
   <div class="panel edge"><p>A prova recomenda 1 a 2 anos de experiência, mas não exige. Esta operação te dá vivência prática: você monta um programa GRC do zero para um estúdio de jogos fictício, usando o que escreveu nos desafios de campo.</p><p class="small muted">Faça uma peça por sessão de 25 minutos. Dá para mostrar em entrevista como estudo de caso, deixando claro que a empresa é fictícia.</p></div>
   ${PROJ.map((p,i)=>`<button type="button" class="check ${S.proj[i]?"on":""}" data-p="${i}"><span class="bx"></span><span>${esc(p)}</span></button>`).join("")}
   <label class="stack" style="gap:6px"><span class="label">Rascunho</span><textarea id="pn" style="min-height:200px">${esc(S.notes[m.id]||"")}</textarea></label></div>`;
  $("#q").onclick=()=>go("play");$("#pn").oninput=e=>{S.notes[m.id]=e.target.value;save();};
  document.querySelectorAll("[data-p]").forEach(b=>b.onclick=()=>{const i=b.dataset.p;S.proj[i]=!S.proj[i];if(S.proj[i]){S.credits+=200;sfx("hit");}
    if(PROJ.every((_,k)=>S.proj[k])&&!S.done[m.id]){S.done[m.id]={best:3,wins:1};addRR(80);toast("Operação concluída! +80 RR");}touchDay();save();vProj(m);showRankUp();});}

/* ---------- INTEL ---------- */
function vIntel(){
  app.innerHTML=topbar()+`<section class="stack"><span class="label">Intel</span><h1>A prova</h1>
   <div class="panel edge"><p><b>Você não precisa dos 2 anos para fazer a prova.</b> O edital diz: pré-requisitos nenhum; 1 a 2 anos de experiência são só recomendados.</p>
   <p class="small muted">A experiência pesa nas questões de cenário e nas 25 respostas escritas. O app compensa isso com os desafios de campo, o Comms (R3) e a Operação final (R4).</p></div>
   <div class="panel"><span class="label">Formato</span><div class="tw"><table><tbody>
    <tr><th>Questões</th><td>100: 75 de múltipla escolha + 25 de resposta curta escrita</td></tr><tr><th>Tempo</th><td>4 horas (cerca de 2,4 min por questão)</td></tr>
    <tr><th>Aprovação</th><td>70%</td></tr><tr><th>Idioma</th><td>Inglês</td></tr><tr><th>Aplicação</th><td>Online supervisionada ou centro autorizado</td></tr><tr><th>Resultado</th><td>Na hora</td></tr></tbody></table></div></div>
   <div class="panel"><span class="label">Peso de cada mapa na prova</span>${DOM.filter(d=>d.n<8).map(d=>`<div class="wbar"><span>${esc(MAPS[d.n].name)} <span class="muted small">· ${esc(d.name)}</span></span><span class="tr"><i style="width:${d.w/18*100}%;background:${MAPS[d.n].c}"></i></span><span class="p">${d.w}%</span></div>`).join("")}
    <p class="small muted">Barras relativas ao maior domínio (Risk Management, 18%). Cada ponto vale cerca de uma questão.</p></div>
   <div class="panel"><span class="label">Como jogar com TDAH</span><ul class="list">
    <li><b>Não decida o que estudar.</b> Aperte Jogar: o app já escolhe a próxima missão.</li>
    <li><b>Uma partida por vez.</b> Cada missão leva uns 15 a 20 minutos. Duas por dia já é um ótimo dia.</li>
    <li><b>Dia difícil?</b> 5 cartões na Range contam como dia de estudo e mantêm a sequência.</li>
    <li><b>O congelamento</b> salva a sequência se você perder um dia. Contratos diários completos dão mais um.</li>
    <li><b>Fale em voz alta</b> antes de virar o cartão. Lembrar sem olhar fixa mais do que reler.</li>
    <li><b>Defuse todo dia</b>: desarmar os próprios erros é o treino que mais rende.</li>
    <li><b>Celular no Não Perturbe</b> e trilha sem letra no fone durante a partida.</li></ul></div>
   <div class="panel"><span class="label">No dia da prova</span><ul class="list">
    <li>Faça primeiro as de múltipla escolha que você sabe; marque as dúvidas e volte.</li>
    <li>Nas escritas: defina, explique, dê um exemplo. 2 a 4 frases.</li>
    <li>Pegadinhas: dono do risco (1ª linha), quem aprova exceções (gestão), o que é certificável, RTO × RPO, SOC 2 Type I × II.</li>
    <li>Pausa curta a cada hora. São 4 horas.</li></ul></div>
   <div class="panel"><span class="label">Fontes oficiais</span><ul class="list">
    <li>COSO ERM 2017: <a href="https://www.coso.org" target="_blank" rel="noopener" style="color:var(--teal)">coso.org</a></li>
    <li>ISO 31000:2018: <a href="https://www.iso.org/obp" target="_blank" rel="noopener" style="color:var(--teal)">iso.org/obp</a></li>
    <li>NIST CSF 2.0: <a href="https://www.nist.gov/cyberframework" target="_blank" rel="noopener" style="color:var(--teal)">nist.gov/cyberframework</a></li>
    <li>IIA Global Internal Audit Standards: <a href="https://www.theiia.org" target="_blank" rel="noopener" style="color:var(--teal)">theiia.org</a></li>
    <li>OCEG Red Book: <a href="https://www.oceg.org" target="_blank" rel="noopener" style="color:var(--teal)">oceg.org</a></li>
    <li>GDPR: <a href="https://gdpr-info.eu" target="_blank" rel="noopener" style="color:var(--teal)">gdpr-info.eu</a> · HIPAA: <a href="https://www.hhs.gov/hipaa" target="_blank" rel="noopener" style="color:var(--teal)">hhs.gov/hipaa</a></li></ul></div>
  </section>`;}

/* ---------- PERFIL ---------- */
function vMe(){const r=rankOf(S.rr),a=AGENTS[S.agent]||AGENTS.vigil,acc=S.stats.answered?Math.round(S.stats.correct/S.stats.answered*100):0;
  app.innerHTML=`<section class="stack" style="align-items:center;text-align:center;padding-top:10px">${emblem(S.rr,120)}<span class="label">${esc(S.name||"Agente")}</span><h1>${esc(r.name)}</h1>
    <div class="rrbar" style="max-width:260px;height:8px"><i style="width:${r.into/r.need*100}%"></i></div><span class="small muted">${r.tier===8?"Você está pronta para a prova.":(r.need-r.into)+" RR para "+rankName(r.i+1)}</span></section>
   <div class="ranks">${Array.from({length:9},(_,t)=>`<div class="${r.tier===t?"cur":""}">${emblem(Math.min(24,t*3)*RR_DIV+(t<8?2*RR_DIV:0),34)}${RANKS[t]}</div>`).join("")}</div>
   <div class="grid4"><div class="stat"><span class="num">${coverage()}%</span><span class="label">Cobertura</span></div><div class="stat"><span class="num">${acc}%</span><span class="label">Precisão</span></div><div class="stat"><span class="num">${S.stats.aces}</span><span class="label">Aces</span></div><div class="stat"><span class="num">${Object.keys(S.days).length}</span><span class="label">Dias</span></div></div>
   <div class="panel" style="flex-direction:row;align-items:center;gap:14px">${agentArt(S.agent||"vigil",60)}<div style="flex:1;min-width:0"><b class="hud-t">${a.name} · ${a.role}</b><p class="small muted">${a.perk}</p></div><button class="btn" id="chg" type="button">Trocar</button></div>
   <div class="panel"><span class="label">Loja</span><div class="row" style="justify-content:space-between"><div><b>Congelamento de sequência</b> <span class="muted small">x${S.inv.freeze}</span><p class="small muted">Salva a sequência se você perder um dia.</p></div><button class="btn ${S.credits>=600?"red":"ghost"}" id="bf" type="button" ${S.credits>=600?"":"disabled"}>600</button></div></div>
   <div class="panel" id="syncbox"></div>
   <div class="panel"><span class="label">Tutorial</span><div class="row" style="justify-content:space-between"><p class="small muted" style="flex:1;min-width:180px">Refaça a partida de treino e o tour do lobby.</p><button class="btn" id="tut" type="button">Rever tutorial</button></div></div>
   <div class="panel"><span class="label">Ajustes</span>
    <button type="button" class="check ${S.sfx?"on":""}" id="snd"><span class="bx"></span><span>Sons do jogo</span></button>
    <label class="stack" style="gap:6px"><span class="label">Codinome</span><input id="nm" type="text" maxlength="16" value="${esc(S.name)}"></label>
    <details><summary class="small muted" style="cursor:pointer">Backup manual e reset</summary><div class="stack" style="margin-top:10px">
     <textarea id="exp" style="font-family:monospace;font-size:12px"></textarea>
     <div class="row"><button class="btn" id="cp" type="button">Copiar</button><button class="btn" id="rs" type="button">Restaurar</button><button class="btn ghost" id="rst" type="button" style="color:var(--red)">Zerar progresso</button></div><span id="msg" class="small muted"></span></div></details></div>`;
  $("#chg").onclick=()=>vAgentPick(false);
  $("#tut").onclick=()=>{S.tut={match:false,lobby:false,tips:{}};save();go("play");};
  $("#bf").onclick=()=>{if(S.credits<600)return;S.credits-=600;S.inv.freeze++;save();sfx("buy");vMe();};
  $("#snd").onclick=()=>{S.sfx=!S.sfx;save();vMe();};
  $("#nm").oninput=e=>{S.name=e.target.value;save();};
  $("#exp").value=JSON.stringify(S);
  $("#cp").onclick=()=>{const t=$("#exp");t.select();try{navigator.clipboard.writeText(t.value).then(()=>$("#msg").textContent="Copiado.",()=>{document.execCommand("copy");$("#msg").textContent="Copiado.";});}catch(e){document.execCommand("copy");}};
  $("#rs").onclick=()=>{try{const v=JSON.parse($("#exp").value);if(!v||!v.done)throw 0;S=loadState(v);save();$("#msg").textContent="Progresso restaurado.";}catch(e){$("#msg").textContent="Esse texto não é um backup válido.";}};
  let armed=false;$("#rst").onclick=e=>{if(!armed){armed=true;e.target.textContent="Toque de novo para zerar";return;}const keep={name:S.name,agent:S.agent};S=Object.assign(fresh(),keep);save();go("me");};
  drawSync();}

function drawSync(){const box=$("#syncbox");if(!box||!window.Sync)return;const st=Sync.status;
  if(st==="unconfigured"){box.innerHTML=`<span class="label">Sincronização</span><p class="small muted">Desligada. O progresso fica só neste aparelho. Para sincronizar iPhone e tablet, preencha o config.js (veja o LEIA-ME).</p>`;return;}
  if(Sync.code){const when=Sync.last?new Date(Sync.last).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}):"";
    box.innerHTML=`<span class="label">Sincronização · ligada</span>
     <p class="small muted">Digite este código no outro aparelho (Perfil → Sincronização → Usar código).</p>
     <div class="synccode">${esc(Sync.fmt(Sync.code))}</div>
     <p class="small ${st==="error"?"":"muted"}" ${st==="error"?'style="color:var(--red)"':""}>${st==="error"?esc(Sync.err):when?"Sincronizado às "+when:"Sincronizando…"}</p>
     <div class="row"><button class="btn" id="sc" type="button">Copiar código</button><button class="btn" id="sn" type="button">Sincronizar agora</button><button class="btn ghost" id="so" type="button">Desligar aqui</button></div><span id="sm" class="small muted"></span>`;
    $("#sc").onclick=()=>{const t=Sync.fmt(Sync.code);try{navigator.clipboard.writeText(t).then(()=>$("#sm").textContent="Código copiado.",()=>$("#sm").textContent=t);}catch(e){$("#sm").textContent=t;}};
    $("#sn").onclick=()=>{$("#sm").textContent="Sincronizando…";Sync.pull();};
    let armed=false;$("#so").onclick=e=>{if(!armed){armed=true;e.target.textContent="Toque de novo para desligar";$("#sm").textContent="O progresso continua salvo neste aparelho e no código.";return;}Sync.forget();};
    return;}
  box.innerHTML=`<span class="label">Sincronização</span><p class="small muted">Para continuar de onde parou em outro aparelho: gere um código aqui e digite-o no outro. Sem e-mail e sem senha.</p>
   <button class="btn red" id="sg" type="button">Gerar código</button>
   <div class="row" style="gap:8px"><input id="ci" type="text" maxlength="9" autocapitalize="characters" autocomplete="off" spellcheck="false" placeholder="Já tem um código? Ex.: K7PX-4QMA" style="flex:1;min-width:180px;text-transform:uppercase"><button class="btn" id="cu" type="button">Usar código</button></div>
   <span id="sm" class="small muted"></span>`;
  const msg=t=>$("#sm").textContent=t;
  $("#sg").onclick=async()=>{msg("Gerando…");try{await Sync.create();}catch(e){msg(Sync.nice(e));}};
  $("#cu").onclick=async()=>{msg("Procurando código…");try{await Sync.join($("#ci").value);toast("Aparelho sincronizado!");}catch(e){msg(Sync.nice(e));}};}
function onSyncChange(merged){if(TAB==="me"&&!document.body.classList.contains("inmatch"))drawSync();
  if(merged&&!G&&!document.body.classList.contains("inmatch")){drawTabs();if(TAB!=="me")go(TAB);}}

/* ---------- início ---------- */
document.addEventListener("touchstart",()=>ac(),{once:true,passive:true});
document.addEventListener("click",()=>ac(),{once:true});
if(window.Sync)Sync.init();
drawTabs();
if(!S.agent)vOnboard();else go("play");
if("serviceWorker" in navigator&&location.protocol!=="file:"){window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));}
