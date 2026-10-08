/* ===================== SORTEIO: quem decide a exposição? ===================== */
/* 40% dos pacientes são graves (risco do desfecho 50%); os demais, leves (risco 10%). O tratamento não muda nada ou corta o risco pela metade. */
const SO={n:100,mode:"vida",bias:-0.75,ef:0,seed:1,hist:[],P:[]};
const SO_M=[["vida","A vida escolhe"],["simples","O sorteio escolhe"]];
function soAlloc(seed){const n=SO.n,nG=Math.round(n*.4),r=rng(seed*101+n*7+3),P=[];for(let i=0;i<n;i++)P.push({g:i<nG?1:0});shuffle(P,r);
  if(SO.mode==="vida"){const pg=.5-.4*SO.bias,pl=.5+.4*SO.bias,G=P.filter(p=>p.g),Lv=P.filter(p=>!p.g);G.forEach((p,i)=>p.t=i<Math.round(G.length*pg)?1:0);Lv.forEach((p,i)=>p.t=i<Math.round(Lv.length*pl)?1:0);}
  else P.forEach(p=>p.t=r()<.5?1:0);
  const rrT=SO.ef?.5:1;[[1,1],[1,0],[0,1],[0,0]].forEach(([t,g])=>{const c=P.filter(p=>p.t===t&&p.g===g),k=Math.round(c.length*(g?.5:.1)*(t?rrT:1));c.forEach((p,i)=>p.d=i<k?1:0);});
  return P;}
function soStats(P){const o={};[1,0].forEach(t=>{const c=P.filter(p=>p.t===t);o[t]={n:c.length,g:div(c.filter(p=>p.g).length,c.length),r:div(c.filter(p=>p.d).length,c.length),ev:c.filter(p=>p.d).length};});o.rr=div(o[1].r,o[0].r);o.dg=(o[1].g-o[0].g)*100;return o;}
function soDraw(k){for(let i=0;i<k;i++){SO.seed++;SO.P=soAlloc(SO.seed);if(SO.mode!=="vida"){const s=soStats(SO.P);if(has(s.dg))SO.hist.push(s.dg);}}}
LAB("sorteio","Experimentais","Por que sortear",`
<div class="intro"><span class="eyebrow">Experimentais · randomização</span><h2>Na coorte, quem escolhe a exposição é a vida. No ensaio, é o sorteio</h2><p>Coortes e ensaios clínicos são longitudinais e medem incidência. A diferença está em quem decide quem recebe o tratamento, e é ela que permite concluir sobre causa.</p></div>
<div class="grid"><div class="card"><div class="card-h"><h3>Os grupos eram comparáveis antes do tratamento?</h3><button class="more-btn" data-learn="sorteio">Saiba mais</button></div>
 <p class="lede">Entre os pacientes, 40% são graves e têm risco bem maior do desfecho, com ou sem tratamento. Veja em que grupo eles vão parar.</p>
 <div class="seg" id="soM">${SO_M.map(m=>`<button data-v="${m[0]}">${m[1]}</button>`).join("")}</div>
 <div class="cols2" style="margin-top:12px">
  <div class="stack">
   <div id="soBW"><div class="range"><label for="soB">Quem recebe o tratamento?</label><output id="soBo"></output><input type="range" id="soB" min="-100" max="100" step="5" value="-75"></div><p class="mini" style="margin:2px 0 0;display:flex;justify-content:space-between;gap:12px"><span>‹ os mais graves</span><span>os mais saudáveis ›</span></p></div>
   <div class="row" id="soRW"><button class="btn small primary" id="so1">Sortear de novo</button><button class="btn small" id="so50">Sortear 50 vezes</button><button class="btn small" data-go-lab="rand">As formas de sortear ›</button></div>
   <div class="range"><label for="soN">Participantes</label><output id="soNo"></output><input type="range" id="soN" min="20" max="200" step="20" value="100"></div>
   <div><div class="sub">Efeito verdadeiro do tratamento</div><div class="chips" id="soE"></div></div>
  </div>
  <div><div class="grps" id="soG"></div><div class="key" id="soK"></div></div>
 </div>
 <div class="cmp" id="soBars"></div>
 <div class="tiles" id="soTiles" style="margin-top:12px"></div>
 <div id="soHW"><div class="sub" style="margin-top:14px">Diferença na proporção de graves, sorteio após sorteio</div><svg class="ch" id="soH" role="img" aria-label="Histórico da diferença de graves entre os grupos em cada sorteio"></svg></div>
 <div class="insight" id="soTxt"></div>
</div></div>`,()=>{SO.P=soAlloc(SO.seed);
  segBind($("soM"),SO.mode,v=>{SO.mode=v;SO.hist=[];soDraw(1);renderSO();});
  $("soB").oninput=e=>{SO.bias=+e.target.value/100;SO.P=soAlloc(SO.seed);renderSO();};$("soN").oninput=e=>{SO.n=+e.target.value;SO.hist=[];soDraw(1);renderSO();};
  chips($("soE"),["Nenhum (RR 1,0)","Reduz o risco pela metade (RR 0,5)"],i=>{SO.ef=i;SO.P=soAlloc(SO.seed);renderSO();},0);
  $("so1").onclick=()=>{soDraw(1);renderSO();};$("so50").onclick=()=>{soDraw(50);renderSO();};
},()=>renderSO());
function renderSO(){const P=SO.P,S=soStats(P),life=SO.mode==="vida",rrT=SO.ef?.5:1;
  $("soBW").hidden=!life;$("soRW").hidden=life;$("soHW").hidden=life;$("soNo").textContent=SO.n;
  $("soBo").textContent=Math.abs(SO.bias)<.05?"indiferente":SO.bias<0?"os mais graves":"os mais saudáveis";
  const ppl=t=>P.filter(p=>p.t===t).sort((a,b)=>b.g-a.g||b.d-a.d).map(p=>({e:t,d:p.d,sq:!!p.g}));
  $("soG").innerHTML=grp("Tratados",`${S[1].n} pessoas · ${has(S[1].g)?pct(S[1].g,0):"—"} graves`,dotSVG(ppl(1),10))+grp("Não tratados",`${S[0].n} pessoas · ${has(S[0].g)?pct(S[0].g,0):"—"} graves`,dotSVG(ppl(0),10));
  $("soK").innerHTML=keyDot({e:1,d:0,sq:true},"grave")+keyDot({e:1,d:0},"leve")+keyDot({e:1,d:1},"teve o desfecho")+keyDot({e:0,d:0},"não tratado");
  $("soBars").innerHTML=`<div class="sub" style="margin:14px 0 0">Graves em cada grupo, antes de qualquer tratamento</div>`+[["Tratados",S[1].g,"var(--exp)"],["Não tratados",S[0].g,"var(--nex)"]].map(([n,v,c])=>`<div class="rowb"><span>${n}</span><div class="bar"><i style="width:${has(v)?v*100:0}%;background:${c}"></i></div><b>${has(v)?pct(v,0):"—"}</b></div>`).join("");
  const off=has(S.rr)?S.rr/rrT:NaN,bad=has(off)&&(off>1.25||off<.8);
  $("soTiles").innerHTML=tile("Risco nos tratados",has(S[1].r)?pct(S[1].r,0):"—",`${S[1].ev} de ${S[1].n}`)+tile("Risco nos não tratados",has(S[0].r)?pct(S[0].r,0):"—",`${S[0].ev} de ${S[0].n}`)+tile("RR observado",rat(S.rr),"",bad?"bad":"acc")+tile("RR verdadeiro",fmt(rrT,2),"o efeito real do tratamento");
  if(!life){const el=$("soH"),H=92,W=box(el,H),L=14,Rm=14,X=v=>L+(clamp(v,-60,60)+60)/120*(W-L-Rm),yb=H-30,bins=new Map();let s=`<line x1="${X(0)}" x2="${X(0)}" y1="4" y2="${yb+2}" stroke="var(--tick)" stroke-dasharray="4 3"/>`;
    SO.hist.forEach((v,i)=>{const k=Math.round(v/4),c=bins.get(k)||0;bins.set(k,c+1);const cy=yb-5-c*5.2;if(cy<5)return;s+=`<circle cx="${X(k*4)}" cy="${cy}" r="${i===SO.hist.length-1?4.6:2.6}" fill="${i===SO.hist.length-1?"var(--exp)":"var(--accent)"}" opacity="${i===SO.hist.length-1?1:.6}"/>`;});
    s+=xAxis(X,[-60,-40,-20,0,20,40,60],yb,v=>(v>0?"+":"")+v,L,W-Rm)+`<text x="${W-Rm}" y="${H}" text-anchor="end" style="font-size:11px">mais graves entre os tratados › (pontos percentuais)</text>`;el.innerHTML=s;}
  const m=SO.hist.length?SO.hist.reduce((a,b)=>a+b,0)/SO.hist.length:0,dg=S.dg;
  $("soTxt").className="insight"+(life&&Math.abs(SO.bias)>=.2?" warn":"");
  $("soTxt").innerHTML=life?(Math.abs(SO.bias)<.2?"Quando a gravidade não influencia quem é tratado, os grupos ficam parecidos. Na vida real isso é raro: o prognóstico costuma decidir a exposição."
    :SO.bias<0?`Os mais graves recebem mais tratamento: ${pct(S[1].g,0)} dos tratados são graves, contra ${pct(S[0].g,0)} dos não tratados. O tratamento parece ${S.rr>1?"aumentar o risco":"pior do que é"} (RR observado ${rat(S.rr)}, verdadeiro ${fmt(rrT,2)}). É o <b>confundimento por indicação</b>.`
    :`Quem adere ao tratamento já era mais saudável: só ${pct(S[1].g,0)} dos tratados são graves, contra ${pct(S[0].g,0)} dos não tratados. O tratamento parece proteger mais do que protege (RR observado ${rat(S.rr)}, verdadeiro ${fmt(rrT,2)}). É o <b>efeito do usuário saudável</b>.`)
   :`O sorteio não conhece o prognóstico de ninguém. Neste sorteio, a diferença de graves foi de ${fmt(Math.abs(dg),0)} pontos percentuais. ${SO.hist.length>=20?`Em ${SO.hist.length} sorteios, a diferença média foi de ${fmt(m,1)}: o sorteio equilibra <b>em média</b>, inclusive o que ninguém mediu, e melhor quanto maior o estudo.`:"Sorteie várias vezes e diminua o número de participantes para ver."} Há formas de sortear que garantem mais equilíbrio: veja em Randomização.`;}
