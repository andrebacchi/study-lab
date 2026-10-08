/* ===================== O QUE PARECE EFEITO ===================== */
const EF_C=[["hn","História natural da doença","var(--g3)"],["rm","Regressão à média","var(--g1)"],["eh","Efeito Hawthorne","var(--g5)"],["ep","Efeito placebo","var(--g4)"],["et","Efeito do tratamento","var(--exp)"]];
const EF_D=[["Antes e depois, sem controle",null,"Sem grupo de comparação, toda a melhora vai para a conta do tratamento: a doença que melhoraria sozinha, a regressão à média, o fato de estar sendo observado e a expectativa do paciente."],
 ["Controle sem tratamento, estudo aberto",["hn","rm","eh"],"O grupo controle desconta o que aconteceria de qualquer modo. Mas só os tratados sabem que receberam algo: o efeito placebo continua somado ao do tratamento."],
 ["Sorteio, placebo e mascaramento",["hn","rm","eh","ep"],"Os dois grupos passam por tudo, menos pelo princípio ativo. A diferença entre eles é o efeito do tratamento, e é para isso que o ensaio randomizado e mascarado existe."]];
const EF={des:0,hn:15,rm:10,eh:8,ep:12,et:10};
const RM={thr:155,noise:8,seed:4,P:[]};
function rmWorld(){const r=rng(RM.seed*17+5);RM.P=[];for(let i=0;i<300;i++)RM.P.push({v:135+12*gauss(r),z1:gauss(r),z2:gauss(r)});}
LAB("efeito","Experimentais","O que parece efeito",`
<div class="intro"><span class="eyebrow">Experimentais · por que controlar, sortear e mascarar</span><h2>Nem toda melhora depois do tratamento é efeito do tratamento</h2><p>Pacientes melhoram por vários motivos ao mesmo tempo. Cada elemento do ensaio clínico existe para descontar um deles.</p></div>
<div class="grid two">
 <div class="card wide"><div class="card-h"><h3>As camadas da melhora</h3><button class="more-btn" data-learn="efeito">Saiba mais</button></div>
  <p class="lede">A melhora é medida em pontos de uma escala de sintomas. Escolha o desenho do estudo e veja quanto dela é atribuído ao tratamento.</p>
  <div class="chips" id="efD"></div>
  <svg class="ch" id="efS" style="margin-top:14px" role="img" aria-label="Componentes da melhora no grupo tratado e no grupo de comparação"></svg>
  <div class="legend" id="efLg"></div>
  <div class="tiles" id="efTiles" style="margin-top:12px"></div><div class="insight" id="efTxt"></div>
  <details class="fold"><summary>Mudar o tamanho de cada camada</summary><div class="fields" style="margin-top:10px;grid-template-columns:repeat(auto-fit,minmax(200px,1fr))" id="efR"></div></details></div>
 <div class="card wide"><div class="card-h"><h3>Regressão à média</h3><button class="more-btn" data-learn="rm">Saiba mais</button></div>
  <p class="lede">Trezentas pessoas têm a pressão sistólica medida. Quem passa do corte entra no estudo e é medido de novo, sem receber tratamento algum.</p>
  <svg class="ch" id="rmS" role="img" aria-label="Primeira e segunda medida de pressão dos selecionados"></svg>
  <div class="cols2" style="margin-top:10px"><div class="stack">
   <div class="range"><label for="rmT">Corte para entrar no estudo</label><output id="rmTo"></output><input type="range" id="rmT" min="135" max="170" step="1" value="155"></div>
   <div class="range"><label for="rmN">Variação entre uma medida e outra</label><output id="rmNo"></output><input type="range" id="rmN" min="0" max="15" step="1" value="8"></div>
   <div class="row"><button class="btn small" id="rmNew">Nova amostra</button></div></div>
   <div><div class="tiles" id="rmTiles"></div></div></div>
  <div class="insight" id="rmTxt"></div></div>
</div>`,()=>{rmWorld();
  chips($("efD"),EF_D.map(d=>d[0]),i=>{EF.des=i;renderEF();},0);
  $("efR").innerHTML=EF_C.map(c=>`<div class="range"><label for="ef_${c[0]}">${c[1]}</label><output id="ef_${c[0]}o"></output><input type="range" id="ef_${c[0]}" min="0" max="30" step="1" value="${EF[c[0]]}" data-k="${c[0]}"></div>`).join("");
  $("efR").addEventListener("input",e=>{const k=e.target.dataset.k;if(k){EF[k]=+e.target.value;renderEF();}});
  $("rmT").oninput=e=>{RM.thr=+e.target.value;renderRM();};$("rmN").oninput=e=>{RM.noise=+e.target.value;renderRM();};$("rmNew").onclick=()=>{RM.seed++;rmWorld();renderRM();};
},()=>{renderEF();renderRM();});
function renderEF(){const D=EF_D[EF.des],all=EF_C.map(c=>c[0]),rows=[["Tratados",all]].concat(D[1]?[["Controle",D[1]]]:[]),sum=ks=>ks.reduce((a,k)=>a+EF[k],0),tot=sum(all),cmp=D[1]?sum(D[1]):0,att=tot-cmp;
  EF_C.forEach(c=>$("ef_"+c[0]+"o").textContent=EF[c[0]]+" pontos");
  const el=$("efS"),rh=46,T=6,H=T+rows.length*rh+62,W=box(el,H),L=74,Rm=14,iw=W-L-Rm,mx=Math.max(40,tot),X=v=>L+v/mx*iw;let s="";
  rows.forEach((r,i)=>{const y=T+i*rh;let x=0;s+=`<text x="0" y="${y+21}" class="lbl" style="font-size:13px">${r[0]}</text>`;
    EF_C.forEach(c=>{if(!r[1].includes(c[0])||!EF[c[0]])return;const w=X(x+EF[c[0]])-X(x);s+=`<rect x="${X(x)+.5}" y="${y}" width="${Math.max(0,w-1)}" height="32" rx="3" fill="${c[2]}"/>${w>24?`<text x="${X(x)+w/2}" y="${y+20.5}" text-anchor="middle" style="fill:var(--surface);font-size:12px;font-weight:600">${EF[c[0]]}</text>`:""}`;x+=EF[c[0]];});});
  const yb=T+rows.length*rh+2;if(att>0)s+=`<path d="M${X(cmp)} ${yb}v8H${X(tot)}v-8" fill="none" stroke="var(--fg)" stroke-width="1.6"/><text x="${clamp((X(cmp)+X(tot))/2,L+112,W-Rm-112)}" y="${yb+24}" text-anchor="middle" class="lbl" style="font-size:12.5px">atribuído ao tratamento: ${att} pontos</text>`;
  s+=xAxis(X,[0,10,20,30,40,50,60,70,80,90,100,120,150].filter(t=>t<=mx),yb+34,v=>v,L,W-Rm);el.innerHTML=s;
  $("efLg").innerHTML=EF_C.map(c=>`<span><i style="background:${c[2]};height:10px;width:10px;border-radius:2px"></i>${c[1]}</span>`).join("");
  $("efTiles").innerHTML=tile("Melhora nos tratados",tot+" pontos")+tile("Melhora na comparação",D[1]?cmp+" pontos":"—",D[1]?"grupo controle":"não há grupo controle")+tile("Atribuído ao tratamento",att+" pontos","",att===EF.et?"acc":"bad")+tile("Efeito verdadeiro",EF.et+" pontos",att>EF.et?`exagero de ${att-EF.et} pontos`:"medido sem exagero");
  $("efTxt").className="insight"+(att===EF.et?"":" warn");$("efTxt").innerHTML=D[2];}
function renderRM(){const P=RM.P.map(p=>({m1:p.v+RM.noise*p.z1,m2:p.v+RM.noise*p.z2})),sel=P.filter(p=>p.m1>=RM.thr),mean=a=>a.reduce((x,y)=>x+y,0)/a.length,n=sel.length,a1=n?mean(sel.map(p=>p.m1)):NaN,a2=n?mean(sel.map(p=>p.m2)):NaN;
  $("rmTo").textContent=RM.thr+" mmHg ou mais";$("rmNo").textContent=RM.noise===0?"nenhuma":"± "+RM.noise+" mmHg";
  const el=$("rmS"),ph=92,T=32,H=T+ph*2+66,W=box(el,H),L=10,Rm=10,lo=90,hi=190,bw=4,nb=(hi-lo)/bw,X=v=>L+(clamp(v,lo,hi)-lo)/(hi-lo)*(W-L-Rm);
  const hist=(vals)=>{const c=new Array(nb).fill(0);vals.forEach(v=>{const i=clamp(Math.floor((v-lo)/bw),0,nb-1);c[i]++;});return c;},h1=hist(P.map(p=>p.m1)),hs=hist(sel.map(p=>p.m1)),h2=hist(sel.map(p=>p.m2)),ym=Math.max(...h1,1),bwp=(W-L-Rm)/nb;let s="";
  const y1=T+ph,y2=T+ph*2+26,sc=ph/ym,sc2=(ph-34)/Math.max(...h2,1);
  h1.forEach((c,i)=>{if(c)s+=`<rect x="${L+i*bwp+.5}" y="${y1-c*sc}" width="${Math.max(1,bwp-1)}" height="${c*sc}" fill="var(--dot)"/>`;if(hs[i])s+=`<rect x="${L+i*bwp+.5}" y="${y1-hs[i]*sc}" width="${Math.max(1,bwp-1)}" height="${hs[i]*sc}" fill="var(--exp)"/>`;});
  h2.forEach((c,i)=>{if(c)s+=`<rect x="${L+i*bwp+.5}" y="${y2-c*sc2}" width="${Math.max(1,bwp-1)}" height="${c*sc2}" fill="var(--nex)"/>`;});
  s+=`<line x1="${X(RM.thr)}" x2="${X(RM.thr)}" y1="${T-6}" y2="${y2}" stroke="var(--bad)" stroke-width="1.6" stroke-dasharray="5 4"/><text x="${clamp(X(RM.thr),40,W-40)}" y="${T-8}" text-anchor="middle" style="font-size:11px;fill:var(--bad)">corte</text>`;
  s+=`<text x="${L}" y="11" class="lbl" style="font-size:12px">1ª medida: todos (selecionados em laranja)</text><text x="${L}" y="${y1+22}" class="lbl" style="font-size:12px">2ª medida: só os selecionados</text>`;
  if(n){s+=`<line x1="${X(a1)}" x2="${X(a1)}" y1="${y1-ph+10}" y2="${y1}" stroke="var(--fg)" stroke-width="2.5"/><line x1="${X(a2)}" x2="${X(a2)}" y1="${y2-ph+30}" y2="${y2}" stroke="var(--fg)" stroke-width="2.5"/><line x1="${X(a1)}" x2="${X(a1)}" y1="${y1}" y2="${y2}" stroke="var(--fg)" stroke-width="1" stroke-dasharray="2 3"/>`;}
  s+=`<line class="ax" x1="${L}" x2="${W-Rm}" y1="${y1}" y2="${y1}"/>`+xAxis(X,[100,120,140,160,180],y2,v=>v,L,W-Rm)+`<text x="${W-Rm}" y="${H-1}" text-anchor="end" style="font-size:11px">pressão sistólica (mmHg)</text>`;el.innerHTML=s;
  $("rmTiles").innerHTML=tile("Selecionados",n,"de 300 pessoas")+tile("Média na 1ª medida",n?fmt(a1,1):"—","mmHg","alt")+tile("Média na 2ª medida",n?fmt(a2,1):"—","mmHg")+tile("Queda sem tratamento",n?fmt(a1-a2,1):"—","mmHg",n&&a1-a2>2?"bad":"");
  $("rmTxt").className="insight"+(n&&a1-a2>2?" warn":"");
  $("rmTxt").innerHTML=!n?"Ninguém passou do corte. Diminua o corte.":RM.noise===0?"Sem variação entre as medidas, cada pessoa repete o mesmo valor e não há regressão à média.":`Ninguém foi tratado e a pressão “caiu” ${fmt(a1-a2,1)} mmHg. Quem foi selecionado por um valor extremo estava, em parte, em um dia ruim; na medida seguinte, tende a ficar mais perto da própria média. Um estudo antes e depois chamaria essa queda de efeito do tratamento.`;}
