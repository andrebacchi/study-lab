/* ===================== CASO-CONTROLE ===================== */
/* 40 casos (24 expostos) e, para cada 40 controles, 12 expostos: OR = (24×28)/(12×16) = 3,5 com qualquer número de controles */
const CC={k:1,rr:2,r0:5,mc:100,mk:100,src:0};
const CC_SRC=[["Populacionais",20,"Amostra aleatória da população que originou os casos. É o ideal, porém mais caro e difícil. Os controles mostram a exposição como ela é nessa população."],
 ["Hospitalares",28,"Acessíveis e cooperativos. Mas, se as doenças que levaram os controles ao hospital também estão ligadas à exposição, há expostos demais entre eles e a OR encolhe (viés de Berkson)."],
 ["Vizinhos e amigos",26,"Parecidos com os casos em condição socioeconômica, o que ajuda. O risco é que também tenham hábitos parecidos: um pareamento excessivo na própria exposição, que esconde a associação."]];
LAB("cc","Observacionais","Caso-controle",`
<div class="intro"><span class="eyebrow">Observacionais · caso-controle</span><h2>Do desfecho para a exposição: a lógica invertida</h2><p>O estudo seleciona pessoas com o desfecho (casos) e sem ele (controles) e compara a exposição passada. É rápido e serve para doenças raras, mas exige cuidado com a medida e com os vieses.</p></div>
<div class="grid two">
 <div class="card wide"><div class="card-h"><h3>Por que a OR, e não o RR?</h3><button class="more-btn" data-learn="orrr">Saiba mais</button></div>
  <p class="lede">Os 40 casos são sempre os mesmos. Quem decide quantos controles entram é você. Mude esse número e veja qual medida resiste.</p>
  <div class="range" style="max-width:520px"><label for="ccK">Controles para cada caso</label><output id="ccKo"></output><input type="range" id="ccK" min="1" max="5" step="1" value="1"></div>
  <div class="cols2" style="margin-top:12px"><div><div class="grps" id="ccG"></div><div class="key" id="ccKey"></div></div>
   <div class="stack"><div id="ccT"></div><svg class="ch" id="ccS" role="img" aria-label="Comparação entre o falso risco relativo e a razão de chances"></svg></div></div>
  <div class="tiles" id="ccTiles" style="margin-top:12px"></div><div class="insight" id="ccTxt"></div></div>
 <div class="card wide"><div class="card-h"><h3>Quando a OR se parece com o RR</h3><button class="more-btn" data-learn="orrr">Saiba mais</button></div>
  <p class="lede">A OR só se aproxima do RR quando a doença é rara. Fixe o RR verdadeiro e aumente a frequência da doença.</p>
  <div class="cols2"><div class="stack">
   <div class="range"><label for="ccRR">RR verdadeiro</label><output id="ccRRo"></output><input type="range" id="ccRR" min="1.5" max="5" step="0.5" value="2"></div>
   <div class="range"><label for="ccR0">Incidência nos não expostos</label><output id="ccR0o"></output><input type="range" id="ccR0" min="1" max="18" step="1" value="5"></div>
   <div class="tiles" id="ccTiles2"></div></div>
   <svg class="ch" id="ccS2" role="img" aria-label="Razão de chances conforme a incidência da doença"></svg></div>
  <div class="insight" id="ccTxt2"></div></div>
 <div class="card"><div class="card-h"><h3>Viés de memória</h3><button class="more-btn" data-learn="memoria">Saiba mais</button></div>
  <p class="lede">A exposição vem da lembrança. Entre 50 casos, 30 estiveram expostos; entre 50 controles, 20. E se nem todos lembrarem?</p>
  <div class="chips" id="mmC"></div>
  <div class="stack" style="margin-top:10px"><div class="range"><label for="mmA">Casos expostos que lembram</label><output id="mmAo"></output><input type="range" id="mmA" min="50" max="100" step="5" value="100"></div>
  <div class="range"><label for="mmB">Controles expostos que lembram</label><output id="mmBo"></output><input type="range" id="mmB" min="50" max="100" step="5" value="100"></div></div>
  <div class="grps" id="mmG" style="margin-top:12px"></div><div class="key" id="mmK"></div>
  <div class="tiles" id="mmTiles" style="margin-top:12px"></div><div class="insight" id="mmTxt"></div></div>
 <div class="card"><div class="card-h"><h3>De onde vêm os controles?</h3><button class="more-btn" data-learn="controles">Saiba mais</button></div>
  <p class="lede">Os controles devem representar a exposição na população que originou os casos. Os mesmos 50 casos (30 expostos), com três fontes de controles.</p>
  <div class="chips" id="scC"></div>
  <div class="grps" id="scG" style="margin-top:12px"></div>
  <div class="tiles" id="scTiles" style="margin-top:12px"></div><div class="insight" id="scTxt"></div></div>
</div>`,()=>{
  $("ccK").oninput=e=>{CC.k=+e.target.value;renderCC1();};
  $("ccRR").oninput=e=>{CC.rr=+e.target.value;renderCC2();};$("ccR0").oninput=e=>{CC.r0=+e.target.value;renderCC2();};
  const MP=[[100,100],[100,70],[70,70]];chips($("mmC"),["Todos lembram","Casos lembram melhor","Todos esquecem igual"],i=>{CC.mc=MP[i][0];CC.mk=MP[i][1];$("mmA").value=CC.mc;$("mmB").value=CC.mk;renderMM();},0);
  const un=()=>chipOn($("mmC"),MP.findIndex(m=>m[0]===CC.mc&&m[1]===CC.mk));$("mmA").oninput=e=>{CC.mc=+e.target.value;un();renderMM();};$("mmB").oninput=e=>{CC.mk=+e.target.value;un();renderMM();};
  chips($("scC"),CC_SRC.map(s=>s[0]),i=>{CC.src=i;renderSC();},0);
},()=>{renderCC1();renderCC2();renderMM();renderSC();});
function renderCC1(){const k=CC.k,v={a:24,b:12*k,c:16,d:28*k},m=t22(v.a,v.b,v.c,v.d);$("ccKo").textContent=k+" : 1";
  const cs=[],ct=[];for(let i=0;i<24;i++)cs.push({e:1,d:1});for(let i=0;i<16;i++)cs.push({e:0,d:1});for(let i=0;i<v.b;i++)ct.push({e:1,d:0});for(let i=0;i<v.d;i++)ct.push({e:0,d:0});
  $("ccG").innerHTML=grp("Casos","40 pessoas: 24 expostas, 16 não",dotSVG(cs,20))+grp("Controles",`${40*k} pessoas: ${v.b} expostas, ${v.d} não`,dotSVG(ct,20));
  $("ccKey").innerHTML=keyDot({e:1,d:1},"caso exposto")+keyDot({e:0,d:1},"caso não exposto")+keyDot({e:1,d:0},"controle exposto")+keyDot({e:0,d:0},"controle não exposto");
  $("ccT").innerHTML=table22(v,{c1:"Casos",c0:"Controles",fixCols:true});
  logAxis($("ccS"),[{v:m.rr,c:"var(--bad)",t:`“RR” ${rat(m.rr)}`},{v:m.or,c:"var(--accent)",t:`OR ${rat(m.or)}`,dia:true}],{lo:1,hi:6,ticks:[1,1.5,2,3,4,6]});
  $("ccTiles").innerHTML=tile("“Risco” nos expostos",pct(m.r1,0),`a ÷ (a + b) = ${v.a} ÷ ${v.a+v.b}`,"bad")+tile("“Risco” nos não expostos",pct(m.r0,0),`c ÷ (c + d) = ${v.c} ÷ ${v.c+v.d}`,"bad")+tile("“RR” calculado",rat(m.rr),"muda com o número de controles","bad")+tile("Razão de chances (OR)",rat(m.or),`(${v.a} × ${v.d}) ÷ (${v.b} × ${v.c})`,"acc");
  $("ccTxt").innerHTML=`Os totais das colunas (destacados na tabela) foram fixados por você. Por isso a ÷ (a + b) não é um risco: com ${k===1?"um controle":k+" controles"} por caso, “${pct(m.r1,0)} dos expostos adoecem”; basta mudar o número de controles para esse valor mudar. A OR compara a chance de exposição nos casos com a dos controles e não depende de quantos controles você escolheu.`;}
function renderCC2(){const RRv=CC.rr,max=Math.floor(90/RRv);$("ccR0").max=Math.min(40,max);if(CC.r0>+$("ccR0").max){CC.r0=+$("ccR0").max;$("ccR0").value=CC.r0;}
  const r0=CC.r0/100,r1=r0*RRv,or=v=>{const a=v*RRv;return(a/(1-a))/(v/(1-v));},o=or(r0),x1=+$("ccR0").max/100;$("ccRRo").textContent=fmt(RRv,1);$("ccR0o").textContent=pct(r0,0);
  const el=$("ccS2"),H=220,W=box(el,H),L=38,Rm=14,T=14,ih=H-T-34,iw=W-L-Rm,ym=Math.max(or(x1)*1.05,RRv*1.6),X=v=>L+v/x1*iw,Y=v=>T+ih-(Math.log(v)-Math.log(1))/(Math.log(ym)-Math.log(1))*ih;
  const yt=[1,1.5,2,3,5,8,12,20,40].filter(t=>t<=ym),xt=[0,.05,.1,.2,.3,.4].filter(t=>t<=x1+1e-9);let s=yGrid(Y,yt,L,W-Rm,numTxt)+xAxis(X,xt,T+ih,v=>pct(v,0),L,W-Rm);
  if(x1>.1)s+=`<rect x="${X(0)}" y="${T}" width="${X(.1)-X(0)}" height="${ih}" fill="var(--good)" opacity=".1"/><text x="${X(.05)}" y="${T+12}" text-anchor="middle" style="font-size:11px;fill:var(--good)">doença rara</text>`;
  s+=`<line x1="${L}" x2="${W-Rm}" y1="${Y(RRv)}" y2="${Y(RRv)}" stroke="var(--nex)" stroke-width="2"/><text x="${W-Rm}" y="${Y(RRv)+15}" text-anchor="end" class="lbl" style="fill:var(--nex);font-size:12px">RR = ${fmt(RRv,1)}</text>`;
  let d="";for(let i=0;i<=80;i++){const v=.005+(x1-.005)*i/80;d+=(i?"L":"M")+X(v).toFixed(1)+","+Y(or(v)).toFixed(1);}
  s+=`<path d="${d}" fill="none" stroke="var(--accent)" stroke-width="2.4"/><circle cx="${X(r0)}" cy="${Y(o)}" r="6" fill="var(--accent)"/><text x="${clamp(X(r0),L+34,W-Rm-34)}" y="${Y(o)-11}" text-anchor="middle" class="lbl" style="fill:var(--accent);font-size:12px">OR ${rat(o)}</text>`;
  s+=`<text x="${W-Rm}" y="${H-1}" text-anchor="end" style="font-size:11px">incidência nos não expostos</text>`;el.innerHTML=s;
  $("ccTiles2").innerHTML=tile("Incidência nos expostos",pct(r1,0),`${pct(r0,0)} × ${fmt(RRv,1)}`)+tile("RR",fmt(RRv,2))+tile("OR",rat(o),`${fmt((o/RRv-1)*100,0)}% acima do RR`,o/RRv>1.15?"bad":"acc");
  $("ccTxt2").className="insight"+(o/RRv>1.15?" warn":"");
  $("ccTxt2").innerHTML=o/RRv<=1.15?`Com a doença rara, a OR (${rat(o)}) é uma boa aproximação do RR (${fmt(RRv,1)}). Regra prática: incidência abaixo de 10%.`:`Com a doença frequente, a OR (${rat(o)}) se afasta do RR (${fmt(RRv,1)}) e sempre exagera para longe de 1. Ler essa OR como “risco ${rat(o)} vezes maior” seria um erro: chance não é risco.`;}
function renderMM(){const a=Math.round(30*CC.mc/100),b=Math.round(20*CC.mk/100),v={a,b,c:50-a,d:50-b},m=t22(v.a,v.b,v.c,v.d),tr=2.25;$("mmAo").textContent=CC.mc+"%";$("mmBo").textContent=CC.mk+"%";
  const mk=(real,rec,dd)=>{const P=[];for(let i=0;i<rec;i++)P.push({e:1,d:dd});for(let i=rec;i<real;i++)P.push({e:0,d:dd,mis:true});for(let i=real;i<50;i++)P.push({e:0,d:dd});return P;};
  $("mmG").innerHTML=grp("Casos",`${a} relatam exposição${a<30?` · ${30-a} esqueceram`:""}`,dotSVG(mk(30,a,1),10))+grp("Controles",`${b} relatam exposição${b<20?` · ${20-b} esqueceram`:""}`,dotSVG(mk(20,b,0),10));
  $("mmK").innerHTML=keyDot({e:1,d:1},"relata exposição")+keyDot({e:0,d:1},"não exposto")+(a<30||b<20?keyDot({e:0,d:1,mis:true},"exposto que não lembrou"):"");
  $("mmTiles").innerHTML=tile("OR verdadeira",fmt(tr,2),"(30 × 30) ÷ (20 × 20)")+tile("OR observada",rat(m.or),`(${v.a} × ${v.d}) ÷ (${v.b} × ${v.c})`,Math.abs(m.or-tr)<.01?"acc":"bad");
  const dif=CC.mc-CC.mk;$("mmTxt").className="insight"+(Math.abs(m.or-tr)<.01?"":" warn");
  $("mmTxt").innerHTML=CC.mc===100&&CC.mk===100?"Com lembrança perfeita, a OR observada é a verdadeira.":dif>0?"Quem adoeceu já revirou o passado procurando uma causa e lembra melhor. Os controles esquecem mais, parecem menos expostos e a OR fica <b>inflada</b>. É o viés de memória, um erro diferencial.":dif<0?"Aqui os controles lembram melhor que os casos, e a OR fica <b>subestimada</b>. Sempre que casos e controles lembram de forma diferente, o erro é diferencial e pode ir para qualquer lado.":"Casos e controles esquecem na mesma proporção. O erro não é diferencial e puxa a OR <b>em direção a 1</b>: a associação parece mais fraca do que é.";}
function renderSC(){const S=CC_SRC[CC.src],b=S[1],v={a:30,b,c:20,d:50-b},m=t22(v.a,v.b,v.c,v.d);
  const mk=(n,dd)=>{const P=[];for(let i=0;i<n;i++)P.push({e:1,d:dd});for(let i=n;i<50;i++)P.push({e:0,d:dd});return P;};
  $("scG").innerHTML=grp("Casos","60% expostos",dotSVG(mk(30,1),10))+grp("Controles: "+S[0].toLowerCase(),`${pct(b/50,0)} expostos`,dotSVG(mk(b,0),10));
  $("scTiles").innerHTML=tile("Exposição na população de origem","40%","o que os controles deveriam mostrar")+tile("OR observada",rat(m.or),`(30 × ${v.d}) ÷ (${v.b} × 20)`,CC.src?"bad":"acc");
  $("scTxt").className="insight"+(CC.src?" warn":"");$("scTxt").innerHTML=`<b>${S[0]}.</b> ${S[2]}`;}
