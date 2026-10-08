/* ===================== TRANSVERSAL ===================== */
const TV={t:7,dR:0.3,dL:4,ep:[],world:0,rev:false};
function tvWorld(){const r=rng(31),n=40,ty=shuffle(Array.from({length:n},(_,i)=>i%2),r);TV.ep=ty.map((t,i)=>({on:(i+0.15+0.7*r())/n*10,ty:t}));}
/* Quem veio primeiro? 12 pessoas; no dia do inquérito: 5 expostas com desfecho, 1 só exposta, 1 só com desfecho, 5 sem nada.
   Em cada mundo a história é outra, mas a foto é idêntica. [início da exposição, início do desfecho, início do terceiro fator] */
const RVW=[
 {n:"A exposição veio antes do desfecho",p:[[1.2,4.6],[2.0,6.1],[2.8,5.2],[3.5,7.8],[4.4,8.3],[6.0,null],[null,5.0]]},
 {n:"O desfecho veio antes da exposição",p:[[4.8,1.4],[6.3,2.2],[5.0,2.9],[7.6,3.6],[8.4,4.3],[7.0,null],[null,4.0]]},
 {n:"Um terceiro fator veio antes dos dois",p:[[4.2,5.6,1.0],[6.4,5.1,1.8],[5.3,6.6,2.4],[7.9,6.8,3.2],[7.2,8.5,4.0],[6.0,null],[null,5.0]]}];
LAB("transv","Observacionais","Transversal",`
<div class="intro"><span class="eyebrow">Observacionais · transversal</span><h2>Uma foto da população: o que ela mostra e o que ela esconde</h2><p>O estudo transversal mede exposição e desfecho no mesmo momento. Encontra casos existentes (prevalência), e não sabe o que veio antes.</p></div>
<div class="grid two">
 <div class="card wide"><div class="card-h"><h3>A foto favorece as doenças longas</h3><button class="more-btn" data-learn="foto">Saiba mais</button></div>
  <p class="lede">Quarenta pessoas adoecem ao longo de dez anos: metade com uma forma rápida (cura ou morte em pouco tempo), metade com uma forma longa. Arraste o dia do inquérito e veja quem aparece na foto.</p>
  <svg class="ch" id="tvS" style="touch-action:pan-y;cursor:ew-resize" role="img" aria-label="Episódios de doença ao longo de dez anos e o dia do inquérito"></svg>
  <div class="legend"><span><i style="background:var(--g4);height:8px"></i>forma rápida</span><span><i style="background:var(--g3);height:8px"></i>forma longa</span><span><i style="background:var(--bad)"></i>dia do inquérito</span></div>
  <div class="cols2" style="margin-top:12px"><div class="stack">
   <div class="range"><label for="tvT">Dia do inquérito</label><output id="tvTo"></output><input type="range" id="tvT" min="0" max="10" step="0.1" value="7"></div>
   <div class="range"><label for="tvR">Duração da forma rápida</label><output id="tvRo"></output><input type="range" id="tvR" min="0.1" max="2" step="0.1" value="0.3"></div>
   <div class="range"><label for="tvL">Duração da forma longa</label><output id="tvLo"></output><input type="range" id="tvL" min="1" max="8" step="0.5" value="4"></div>
  </div><div><div class="tiles" id="tvTiles"></div><div class="insight" id="tvTxt"></div></div></div></div>
 <div class="card wide"><div class="card-h"><h3>Quem veio primeiro?</h3><button class="more-btn" data-learn="reversa">Saiba mais</button></div>
  <p class="lede">Um inquérito encontra o desfecho muito mais frequente entre os expostos. Três histórias diferentes produzem exatamente essa foto. Escolha um mundo, tente adivinhar qual é a história e só então revele o passado.</p>
  <div class="row"><div class="chips" id="rvC"></div><button class="btn small primary" id="rvB"></button></div>
  <svg class="ch" id="rvS" style="margin-top:12px" role="img" aria-label="Linha do tempo de doze pessoas até o dia do inquérito"></svg>
  <div class="legend"><span><i style="background:var(--exp);height:5px"></i>período de exposição</span><span><i style="background:var(--fg);height:5px"></i>período com o desfecho</span><span id="rvLg3"><i style="background:var(--hi);height:5px"></i>terceiro fator</span></div>
  <div class="tiles" id="rvTiles" style="margin-top:12px"></div><div class="insight" id="rvTxt"></div></div>
</div>`,()=>{tvWorld();
  $("tvT").oninput=e=>{TV.t=+e.target.value;renderTV();};$("tvR").oninput=e=>{TV.dR=+e.target.value;renderTV();};$("tvL").oninput=e=>{TV.dL=+e.target.value;renderTV();};
  const sv=$("tvS");let drag=false;const mv=e=>{const p=svgPt(sv,e),W=sv.viewBox.baseVal.width;TV.t=clamp(Math.round((p.x-10)/(W-20)*100)/10,0,10);$("tvT").value=TV.t;renderTV();};
  sv.addEventListener("pointerdown",e=>{drag=true;sv.setPointerCapture(e.pointerId);mv(e);});sv.addEventListener("pointermove",e=>{if(drag)mv(e);});["pointerup","pointercancel"].forEach(t=>sv.addEventListener(t,()=>drag=false));
  chips($("rvC"),["Mundo A","Mundo B","Mundo C"],i=>{TV.world=i;TV.rev=false;renderRV();},0);$("rvB").onclick=()=>{TV.rev=!TV.rev;renderRV();};
},()=>{renderTV();renderRV();});
function renderTV(){const el=$("tvS"),n=TV.ep.length,rh=7,T=16,H=T+n*rh+30,W=box(el,H),X=v=>10+v/10*(W-20);let s="",cR=0,cL=0;
  for(let y=0;y<=10;y+=2)s+=`<line class="gr" x1="${X(y)}" x2="${X(y)}" y1="${T}" y2="${T+n*rh}"/>`;
  TV.ep.forEach((p,i)=>{const dur=p.ty?TV.dL:TV.dR,end=p.on+dur,hit=p.on<=TV.t&&TV.t<end,y=T+i*rh+1.5;if(hit){p.ty?cL++:cR++;}
    s+=`<rect x="${X(p.on)}" y="${y}" width="${Math.max(2.5,X(Math.min(10,end))-X(p.on))}" height="${rh-3}" rx="2" fill="${p.ty?"var(--g3)":"var(--g4)"}" opacity="${hit?1:.28}"/>`;});
  const xt=X(TV.t);s+=`<line x1="${xt}" x2="${xt}" y1="${T-4}" y2="${T+n*rh+2}" stroke="var(--bad)" stroke-width="2.5"/><rect x="${xt-9}" y="${T-14}" width="18" height="11" rx="3" fill="var(--bad)"/>`;
  s+=xAxis(X,[0,2,4,6,8,10],T+n*rh+4,v=>v===0?"início":"ano "+v,10,W-10);el.innerHTML=s;
  $("tvTo").textContent=TV.t===0?"início":"ano "+fmt(TV.t,1);$("tvRo").textContent=TV.dR<1?fmt(TV.dR*12,0)+" meses":fmt(TV.dR,1)+" ano"+(TV.dR>1?"s":"");$("tvLo").textContent=fmt(TV.dL,1)+" anos";
  const tot=cR+cL;$("tvTiles").innerHTML=tile("Casos novos em 10 anos","20 + 20","rápida + longa")+tile("Casos na foto",`${cR} + ${cL}`,"rápida + longa","acc")+tile("Forma longa entre os casos da foto",tot?pct(cL/tot,0):"—","era 50% dos casos novos",tot&&cL/tot>.6?"alt":"");
  $("tvTxt").innerHTML=!tot?"Neste dia, ninguém está doente: a foto sairia vazia.":cL/tot>.6?`As duas formas surgem com a mesma frequência, mas a foto encontra quase só a forma longa. Quem se curou ou morreu depressa não está lá para ser contado. É o <b>viés de prevalência</b>: o que a foto mostra depende de quantos adoecem e de quanto tempo a doença dura.`:"Com durações parecidas, a foto representa bem as duas formas. Aumente a diferença entre as durações e observe.";}
function renderRV(){const Wd=RVW[TV.world],el=$("rvS"),n=12,rh=20,T=18,H=T+n*rh+26,W=box(el,H),L=10,xs=W-34,X=v=>L+v/10*(xs-L),rev=TV.rev;let s="";
  const st=[[1,1],[1,1],[1,1],[1,1],[1,1],[1,0],[0,1],[0,0],[0,0],[0,0],[0,0],[0,0]],ord=[0,7,5,1,8,2,9,6,3,10,4,11];
  ord.forEach((pi,row)=>{const y=T+row*rh+rh/2,p=Wd.p[pi]||[null,null],e=st[pi][0],d=st[pi][1];
    s+=`<line x1="${L}" x2="${xs}" y1="${y}" y2="${y}" stroke="var(--line)" stroke-width="1"/>`;
    if(rev){if(p[2]!=null)s+=`<line x1="${X(p[2])}" x2="${xs}" y1="${y+5}" y2="${y+5}" stroke="var(--hi)" stroke-width="3" stroke-linecap="round" opacity=".8"/><rect x="${X(p[2])-4}" y="${y+1}" width="8" height="8" transform="rotate(45 ${X(p[2])} ${y+5})" fill="var(--hi)"/>`;
      if(p[0]!=null)s+=`<line x1="${X(p[0])}" x2="${xs}" y1="${y-4}" y2="${y-4}" stroke="var(--exp)" stroke-width="4" stroke-linecap="round"/>`;
      if(p[1]!=null)s+=`<line x1="${X(p[1])}" x2="${xs}" y1="${y+.5}" y2="${y+.5}" stroke="var(--fg)" stroke-width="4" stroke-linecap="round"/>`;}
    s+=`<circle class="p e${e} d${d}" cx="${xs+18}" cy="${y}" r="6"/>`;});
  if(!rev)s+=`<rect x="${L}" y="${T}" width="${xs-L-6}" height="${n*rh}" rx="8" fill="var(--sunk)"/><text x="${(L+xs)/2}" y="${T+n*rh/2+4}" text-anchor="middle" style="font-style:italic">o inquérito não vê o passado</text>`;
  s+=`<line x1="${xs}" x2="${xs}" y1="${T-6}" y2="${T+n*rh+2}" stroke="var(--bad)" stroke-width="2"/><text x="${xs}" y="${T-8}" text-anchor="end" style="font-size:11px;fill:var(--bad)">dia do inquérito</text><text x="${L}" y="${H-6}" style="font-size:11px">passado</text><text x="${W}" y="${H-6}" text-anchor="end" style="font-size:11px">a foto</text>`;
  el.innerHTML=s;$("rvB").textContent=rev?"Esconder o passado":"Revelar o passado";$("rvLg3").hidden=!(rev&&TV.world===2);
  $("rvTiles").innerHTML=tile("Prevalência nos expostos","83%","5 de 6")+tile("Prevalência nos não expostos","17%","1 de 6")+tile("Razão de prevalências","5,00","igual nos três mundos","acc");
  $("rvTxt").className="insight"+(rev?"":" warn");
  $("rvTxt").innerHTML=rev?`<b>${Wd.n}.</b> ${["A leitura causal faria sentido, mas a foto sozinha não permitia saber.","É a <b>causalidade reversa</b>: o desfecho levou as pessoas à exposição, e não o contrário.","Nem a exposição causa o desfecho, nem o contrário: um <b>fator de confusão</b> produz os dois."][TV.world]} Troque de mundo: a tabela e a RP não mudam.`:"A foto só mostra a coluna da direita: quem está exposto e quem tem o desfecho hoje. A RP de 5,00 é compatível com mais de uma história.";}
