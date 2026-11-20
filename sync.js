"use strict";
/* Sincronização por código (ex.: K7PX-4QMA), sem login.
   O código é a chave de uma linha no Supabase, acessada só pelas funções sync_get/sync_put.
   Sem config.js preenchido, o app funciona só local. */
/* Segurança: todo progresso que vem de fora (nuvem ou backup colado) é reconstruído
   campo a campo, com tipos e tamanhos conferidos. Nada desconhecido passa, nenhum texto
   vira HTML e chaves como __proto__ são descartadas. */
const SAFE_KEY=/^[A-Za-z0-9_.#:-]{1,40}$/;
function cleanState(o){
  o=(o&&typeof o==="object"&&!Array.isArray(o))?o:{};
  const num=(v,max)=>{v=Number(v);return Number.isFinite(v)?Math.max(0,Math.min(max||1e9,Math.floor(v))):0;};
  const str=(v,max)=>typeof v==="string"?v.slice(0,max):"";
  const day=v=>typeof v==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(v)?v:null;
  const map=(v,fn,lim)=>{const r={};if(v&&typeof v==="object"&&!Array.isArray(v)){let n=0;for(const k of Object.keys(v)){if(!SAFE_KEY.test(k)||k==="__proto__"||k==="constructor"||k==="prototype")continue;if(++n>(lim||500))break;const x=fn(v[k]);if(x!==undefined)r[k]=x;}}return r;};
  const flag=v=>v?true:undefined;
  const st=o.stats||{},inv=o.inv||{},tut=o.tut||{},sk=o.streak||{},dl=o.daily||{};
  return {v:1,updated:num(o.updated,9e15),name:str(o.name,16),
    agent:["vigil","nyx","blaze","haze"].includes(o.agent)?o.agent:null,
    rr:num(o.rr,100000),credits:num(o.credits,1e7),
    inv:map(inv,v=>num(v,999),10),
    done:map(o.done,d=>d&&typeof d==="object"?{best:num(d.best,3),wins:num(d.wins,1e6)}:undefined),
    spikes:map(o.spikes,flag),
    wrong:map(o.wrong,w=>w&&typeof w==="object"?{hits:num(w.hits,1)}:undefined,2000),
    cards:map(o.cards,c=>num(c,4),2000),
    days:map(o.days,v=>v?1:undefined,5000),
    streak:{count:num(sk.count,100000),last:day(sk.last)},
    daily:{date:day(dl.date),win:num(dl.win,1000),cards:num(dl.cards,10000),hits:num(dl.hits,10000),claimed:map(dl.claimed,v=>v?1:undefined,10)},
    sa:map(o.sa,s=>s&&typeof s==="object"?Object.assign({text:str(s.text,4000)},typeof s.ok==="boolean"?{ok:s.ok}:{}):undefined,50),
    proj:map(o.proj,flag,50),
    notes:map(o.notes,n=>typeof n==="string"?n.slice(0,8000):undefined),
    sims:map(o.sims,v=>num(v,100),50),
    stats:{answered:num(st.answered),correct:num(st.correct),aces:num(st.aces),clutches:num(st.clutches),headshots:num(st.headshots),wins:num(st.wins)},
    sfx:o.sfx!==false,
    tut:{match:!!tut.match,lobby:!!tut.lobby,tips:map(tut.tips,flag,50)}};
}

function mergeState(a,b){
  const newer=(a.updated||0)>=(b.updated||0)?a:b, older=newer===a?b:a;
  const r=JSON.parse(JSON.stringify(newer));
  r.rr=Math.max(a.rr||0,b.rr||0);
  r.done=Object.assign({},older.done,newer.done);
  for(const k in older.done){if(newer.done&&newer.done[k]){r.done[k]={best:Math.max(older.done[k].best||0,newer.done[k].best||0),wins:Math.max(older.done[k].wins||0,newer.done[k].wins||0)};}}
  r.spikes=Object.assign({},older.spikes,newer.spikes);
  r.days=Object.assign({},older.days,newer.days);
  r.sims={};new Set(Object.keys(older.sims||{}).concat(Object.keys(newer.sims||{}))).forEach(k=>r.sims[k]=Math.max((older.sims||{})[k]||0,(newer.sims||{})[k]||0));
  r.stats={};new Set(Object.keys(older.stats||{}).concat(Object.keys(newer.stats||{}))).forEach(k=>r.stats[k]=Math.max((older.stats||{})[k]||0,(newer.stats||{})[k]||0));
  r.notes=Object.assign({},older.notes,newer.notes);
  r.sa=Object.assign({},older.sa,newer.sa);
  r.proj=Object.assign({},older.proj,newer.proj);
  if(older.tut&&newer.tut){r.tut={match:older.tut.match||newer.tut.match,lobby:older.tut.lobby||newer.tut.lobby,tips:Object.assign({},older.tut.tips,newer.tut.tips)};}
  if(!r.agent&&older.agent)r.agent=older.agent;
  if(!r.name&&older.name)r.name=older.name;
  r.updated=Math.max(a.updated||0,b.updated||0);
  return r;
}

const SYNC_KEY="grc-ranked-sync";
const CODE_ABC="ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // sem 0/O, 1/I/L para não confundir

const Sync={code:null,status:"unconfigured",err:"",last:0,_t:null,_busy:false,cfg:null,
  configured(){return this.status!=="unconfigured";},
  init(){
    const c=window.CGRC_CONFIG||{};
    if(!c.supabaseUrl||!c.supabaseAnonKey){this.status="unconfigured";return;}
    this.cfg={url:c.supabaseUrl.replace(/\/+$/,""),key:c.supabaseAnonKey};
    try{this.code=localStorage.getItem(SYNC_KEY)||null;}catch(e){}
    this.status=this.code?"syncing":"off";
    if(this.code)this.pull();
    document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"&&this.code)this.pull();});
    window.addEventListener("online",()=>{if(this.code)this.pull();});
  },
  fmt(code){return code?code.slice(0,4)+"-"+code.slice(4):"";},
  clean(input){return String(input||"").toUpperCase().replace(/[^A-Z0-9]/g,"");},
  newCode(){const a=new Uint32Array(8);crypto.getRandomValues(a);let s="";for(const n of a)s+=CODE_ABC[n%CODE_ABC.length];return s;},
  async rpc(fn,body){
    const res=await fetch(this.cfg.url+"/rest/v1/rpc/"+fn,{method:"POST",
      headers:Object.assign({"apikey":this.cfg.key,"Content-Type":"application/json"},
        /^eyJ/.test(this.cfg.key)?{"Authorization":"Bearer "+this.cfg.key}:{}),body:JSON.stringify(body)});
    const txt=await res.text();
    if(!res.ok){let m=txt;try{m=JSON.parse(txt).message||txt;}catch(e){}throw new Error(m||("Erro "+res.status));}
    return txt?JSON.parse(txt):null;
  },
  setCode(c){this.code=c;try{if(c)localStorage.setItem(SYNC_KEY,c);else localStorage.removeItem(SYNC_KEY);}catch(e){}},
  /* Cria um código novo e envia o progresso deste aparelho. */
  async create(){
    let code=this.newCode();
    for(let k=0;k<3;k++){if(await this.rpc("sync_get",{p_code:code})==null)break;code=this.newCode();}
    this.setCode(code);this.status="syncing";onSyncChange();
    await this.pushNow();return code;
  },
  /* Liga este aparelho a um código que já existe e junta os progressos. */
  async join(input){
    const code=this.clean(input);
    if(code.length!==8)throw new Error("O código tem 8 letras e números, como K7PX-4QMA.");
    const data=await this.rpc("sync_get",{p_code:code});
    if(data==null)throw new Error("Código não encontrado. Confira as letras e tente de novo.");
    this.setCode(code);
    S=loadState(mergeState(S,cleanState(data)));saveLocal();
    await this.pushNow();onSyncChange(true);
  },
  forget(){this.setCode(null);this.status="off";onSyncChange();},
  async pull(){
    if(!this.code||this._busy)return;this._busy=true;
    try{
      const data=await this.rpc("sync_get",{p_code:this.code});
      let merged=false;
      if(data){const before=JSON.stringify(S);S=loadState(mergeState(S,cleanState(data)));saveLocal();merged=JSON.stringify(S)!==before;}
      this._busy=false;await this.pushNow();
      onSyncChange(merged);
    }catch(e){this._busy=false;this.status="error";this.err=this.nice(e);onSyncChange();}
  },
  schedule(){if(!this.code)return;clearTimeout(this._t);this._t=setTimeout(()=>this.pushNow(),2500);},
  async pushNow(){
    if(!this.code||this._busy)return;this._busy=true;
    try{await this.rpc("sync_put",{p_code:this.code,p_data:S});this.status="on";this.last=Date.now();this.err="";}
    catch(e){this.status="error";this.err=this.nice(e);}
    this._busy=false;onSyncChange();
  },
  nice(e){const m=(e&&e.message)||String(e);return /fetch|network|Failed/i.test(m)?"Sem internet agora. Seu progresso está salvo e sincroniza quando a conexão voltar.":m;}
};
window.Sync=Sync;
