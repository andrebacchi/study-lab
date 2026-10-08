/* ===================== utilidades de interface (padrão da série LAB) ===================== */
const $=id=>document.getElementById(id);
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
const has=v=>v!=null&&isFinite(v);
const fmt=(x,d=1)=>!isFinite(x)?(x>0?"∞":"—"):(Math.abs(x)<0.5*10**-d?0:x).toLocaleString("pt-BR",{minimumFractionDigits:d,maximumFractionDigits:d}).replace("-","−");
const pct=(x,d=1)=>fmt(x*100,d)+"%";
const parse=s=>{s=String(s).trim().replace(/\s/g,"").replace(/[−–]/g,"-");if(s==="")return null;if(s.includes(","))s=s.replace(/\./g,"").replace(",",".");else if(/^\d{1,3}(\.\d{3})+$/.test(s))s=s.replace(/\./g,"");const v=parseFloat(s);return isFinite(v)?v:null;};
const esc=t=>String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");
function toast(m){const t=document.createElement("div");t.className="toast";t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),1600);}

/* ---------- SVG ---------- */
function box(el,h){const W=Math.max(280,Math.round(el.clientWidth||el.parentElement.clientWidth||600));el.setAttribute("viewBox",`0 0 ${W} ${h}`);return W;}
function xAxis(X,ticks,y,f,x0,x1){const a=x0??X(ticks[0]),b=x1??X(ticks[ticks.length-1]);return `<line class="ax" x1="${a}" x2="${b}" y1="${y}" y2="${y}"/>`+ticks.map(t=>`<line class="ax" x1="${X(t)}" x2="${X(t)}" y1="${y}" y2="${y+4}"/><text x="${X(t)}" y="${y+17}" text-anchor="middle">${f(t)}</text>`).join("");}
function yGrid(Y,ticks,x0,x1,f){return ticks.map(t=>`<line class="gr" x1="${x0}" x2="${x1}" y1="${Y(t)}" y2="${Y(t)}"/><text x="${x0-6}" y="${Y(t)+4}" text-anchor="end">${f(t)}</text>`).join("");}
const svgPt=(el,e)=>{const p=el.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(el.getScreenCTM().inverse());};
const numTxt=v=>String(+(+v).toFixed(6)).replace("-","−").replace(".",",");

/* ---------- sheet, chips, tiles ---------- */
function openSheet(t,h){const r=$("sheetRoot"),last=document.activeElement;r.innerHTML=`<div class="scrim" id="scrim"><div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(t)}"><div class="sheet-h"><h3>${t}</h3><button class="x" id="sx" aria-label="Fechar">×</button></div><div class="learn">${h}</div></div></div>`;document.body.style.overflow="hidden";
  const close=()=>{r.innerHTML="";document.body.style.overflow="";document.removeEventListener("keydown",k);last&&last.focus&&last.focus();},k=e=>{if(e.key==="Escape")close();};document.addEventListener("keydown",k);$("sx").onclick=close;$("scrim").addEventListener("click",e=>{if(e.target.id==="scrim")close();});$("sx").focus();}
function chips(el,items,onPick,active){el.innerHTML=items.map((it,i)=>`<button class="chip ${i===active?"on":""}" data-i="${i}">${it}</button>`).join("");el.onclick=e=>{const b=e.target.closest(".chip");if(!b)return;el.querySelectorAll(".chip").forEach(c=>c.classList.toggle("on",c===b));onPick(+b.dataset.i);};}
const chipOn=(el,i)=>el.querySelectorAll(".chip").forEach((c,j)=>c.classList.toggle("on",j===i));
function segBind(el,val,on){el.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b.dataset.v===val));el.onclick=e=>{const b=e.target.closest("button");if(!b)return;el.querySelectorAll("button").forEach(x=>x.classList.toggle("on",x===b));on(b.dataset.v);};}
const tile=(l,v,sub,c="")=>`<div class="tile ${c}"><span>${l}</span><b>${v}</b>${sub?`<small>${sub}</small>`:""}</div>`;

/* ---------- registro dos laboratórios ---------- */
const R={};let cur="tres";
const LABS=[];
function LAB(id,grp,name,html,init,render){const s=document.createElement("section");s.className="lab";s.id="lab-"+id;s.hidden=true;s.innerHTML=html;$("labs").appendChild(s);LABS.push({id,grp,name,init,render,ready:false});R[id]=()=>{const L=LABS.find(l=>l.id===id);if(!L.ready){L.ready=true;init&&init();}render&&render();};}

/* ===================== simulação e pessoas ===================== */
function rng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function shuffle(a,r){for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function gauss(r){let u=0,v=0;while(u===0)u=r();while(v===0)v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
const div=(a,b)=>b?a/b:NaN;
/* medidas da tabela 2×2: a = exposto com desfecho, b = exposto sem, c = não exposto com, d = não exposto sem */
function t22(a,b,c,d){const r1=div(a,a+b),r0=div(c,c+d);return{a,b,c,d,r1,r0,rr:div(r1,r0),or:div(a*d,b*c),rd:r1-r0};}
function ciRR(a,b,c,d){if(!a||!c)return null;const l=Math.log((a/(a+b))/(c/(c+d))),se=Math.sqrt(1/a-1/(a+b)+1/c-1/(c+d));return[Math.exp(l-1.96*se),Math.exp(l+1.96*se)];}
function ciOR(a,b,c,d){if(!a||!b||!c||!d)return null;const l=Math.log(a*d/(b*c)),se=Math.sqrt(1/a+1/b+1/c+1/d);return[Math.exp(l-1.96*se),Math.exp(l+1.96*se)];}
const ciTxt=ci=>ci?`IC 95%: ${fmt(ci[0],2)} a ${fmt(ci[1],2)}`:"";
const rat=x=>!isFinite(x)?(x>0?"∞":"—"):fmt(x,2);

/* grade de pessoas em SVG. Cada pessoa: {e:0|1|null, d:0|1|null, sq, off, lost, mis, nad} */
function dotSVG(people,cols,o={}){const p=o.pitch||13,r=o.r||4.4,n=people.length,rows=Math.max(1,Math.ceil(n/cols)),W=cols*p,H=rows*p;let s="";
  people.forEach((q,i)=>{const cx=(i%cols)*p+p/2,cy=Math.floor(i/cols)*p+p/2,cl=`p e${q.e==null?"u":q.e} d${q.d==null?"u":q.d}${q.off?" off":""}${q.lost?" lost":""}${q.mis?" mis":""}${q.nad?" nad":""}${q.cl?" "+q.cl:""}`;
    s+=q.sq?`<rect class="${cl}" x="${cx-r+.3}" y="${cy-r+.3}" width="${2*r-.6}" height="${2*r-.6}" rx="1.2"/>`:`<circle class="${cl}" cx="${cx}" cy="${cy}" r="${r}"/>`;
    if(q.lost)s+=`<path class="xm" d="M${cx-2.6} ${cy-2.6}l5.2 5.2M${cx+2.6} ${cy-2.6}l-5.2 5.2"/>`;});
  return `<svg class="ppl" viewBox="0 0 ${W} ${H}" width="${Math.round(W*(o.scale||1.15))}" style="max-width:100%" aria-hidden="true">${s}</svg>`;}
const grp=(label,sub,svg)=>`<div class="grp"><div class="grp-h"><b>${label}</b><span>${sub||""}</span></div>${svg}</div>`;
/* item de legenda com o mesmo desenho das pessoas */
const keyDot=(q,t)=>`<span><svg viewBox="0 0 13 13">${q.sq?`<rect class="p e${q.e==null?"u":q.e} d${q.d==null?"u":q.d}${q.mis?" mis":""}${q.nad?" nad":""}${q.cl?" "+q.cl:""}" x="1.5" y="1.5" width="10" height="10" rx="1.2"/>`:`<circle class="p e${q.e==null?"u":q.e} d${q.d==null?"u":q.d}${q.lost?" lost":""}${q.mis?" mis":""}${q.nad?" nad":""}${q.cl?" "+q.cl:""}" cx="6.5" cy="6.5" r="5"/>`}</svg>${t}</span>`;
function table22(v,o={}){const L=Object.assign({r1:"Expostos",r0:"Não expostos",c1:"Com desfecho",c0:"Sem desfecho"},o),fx=o.fixCols?" fix":"";
  return `<div class="tw"><table class="t22"><tr><th></th><th>${L.c1}</th><th>${L.c0}</th><th>Total</th></tr>
  <tr><th class="rh">${L.r1}</th><td><small>a</small>${fmt(v.a,0)}</td><td><small>b</small>${fmt(v.b,0)}</td><td class="tot">${fmt(v.a+v.b,0)}</td></tr>
  <tr><th class="rh">${L.r0}</th><td><small>c</small>${fmt(v.c,0)}</td><td><small>d</small>${fmt(v.d,0)}</td><td class="tot">${fmt(v.c+v.d,0)}</td></tr>
  <tr><th class="rh">Total</th><td class="tot${fx}">${fmt(v.a+v.c,0)}</td><td class="tot${fx}">${fmt(v.b+v.d,0)}</td><td class="tot">${fmt(v.a+v.b+v.c+v.d,0)}</td></tr></table></div>`;}
/* ponte para o 2×2 LAB: abre a mesma tabela lá, já com o desenho escolhido */
const LAB22="https://andrebacchi.github.io/2-2-lab/";
const lab22=(v,tipo)=>`<a class="btn small" target="_blank" rel="noopener" href="${LAB22}?a=${v.a}&amp;b=${v.b}&amp;c=${v.c}&amp;d=${v.d}&amp;tipo=${tipo}">Abrir esta tabela no 2×2 LAB ›</a>`;
/* eixo logarítmico com marcadores (comparar RR, OR etc.) */
function logAxis(el,marks,o={}){const H=o.h||(40+marks.length*26),W=box(el,H),L=o.L??12,Rm=12,iw=W-L-Rm,lo=o.lo||0.25,hi=o.hi||8,X=v=>L+(Math.log(clamp(v,lo,hi))-Math.log(lo))/(Math.log(hi)-Math.log(lo))*iw,yA=H-24;let s="";
  s+=`<line x1="${X(1)}" x2="${X(1)}" y1="2" y2="${yA}" stroke="var(--tick)" stroke-dasharray="4 3"/>`;
  marks.forEach((m,i)=>{const y=14+i*26;if(!has(m.v)&&m.v!==Infinity)return;const x=X(m.v===Infinity?hi:m.v),right=x<W*0.55;
    if(m.ci)s+=`<line x1="${X(m.ci[0])}" x2="${X(m.ci[1])}" y1="${y}" y2="${y}" stroke="${m.c}" stroke-width="3" stroke-linecap="round" opacity=".5"/>`;
    s+=m.dia?`<rect x="${x-6}" y="${y-6}" width="12" height="12" transform="rotate(45 ${x} ${y})" fill="${m.c}"/>`:`<circle cx="${x}" cy="${y}" r="6.5" fill="${m.c}"/>`;
    s+=`<text x="${right?x+12:x-12}" y="${y+4}" text-anchor="${right?"start":"end"}" class="lbl" style="font-size:12.5px;fill:${m.c}">${m.t}</text>`;});
  const tk=(o.ticks||[0.25,0.5,1,2,4,8]).filter(t=>t>=lo&&t<=hi);s+=xAxis(X,tk,yA,numTxt,L,W-Rm);el.innerHTML=s;}
/* jogo de classificar: um item por vez, botões com as categorias. items: [texto, categoria certa, comentário]; cats: [chave, rótulo]; S guarda o andamento */
function sorter(el,S,items,cats){
  if(!S.order){S.order=shuffle(items.map((_,i)=>i),rng(Date.now()%1e9));S.i=0;S.ans=null;S.ok=0;S.done=0;}
  const n=items.length;
  if(S.i>=n)el.innerHTML=`<p class="q" style="font-size:19px">Você acertou ${S.ok} de ${n}.</p><button class="btn small primary" data-sr="again">Jogar de novo</button>`;
  else{const it=items[S.order[S.i]],a=S.ans;
    el.innerHTML=`<div class="row" style="justify-content:space-between"><span class="eyebrow">${S.i+1} de ${n}</span><span class="score">${S.done?`${S.ok} de ${S.done} certas`:""}</span></div><p class="vig" style="margin:8px 0 0">${it[0]}</p><div class="quizopts">${cats.map(c=>`<button class="opt ${a==null?"":c[0]===it[1]?"right":c[0]===a?"wrong":""}" data-sr="${c[0]}" ${a==null?"":"disabled"}>${c[1]}</button>`).join("")}</div>${a!=null?`<div class="fb"><b class="${a===it[1]?"ok":"no"}">${a===it[1]?"Isso mesmo.":"Não é esse."}</b> ${it[2]}</div><div class="row" style="margin-top:10px"><button class="btn small primary" data-sr="next">${S.i===n-1?"Ver resultado":"Próximo ›"}</button></div>`:""}`;}
  el.onclick=e=>{const b=e.target.closest("[data-sr]");if(!b)return;const k=b.dataset.sr;if(k==="again")S.order=null;else if(k==="next"){S.i++;S.ans=null;}else if(S.ans==null){S.ans=k;S.done++;if(k===items[S.order[S.i]][1])S.ok++;}else return;sorter(el,S,items,cats);};}
/* barras empilhadas horizontais: rows = [rótulo, [[valor, cor], ...]] */
const pairBar=(v,c)=>`<div class="bar"><i style="width:${clamp(has(v)?v*100:0,0,100)}%;background:${c}"></i></div>`;
