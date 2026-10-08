/* ===================== ECOLÓGICO ===================== */
/* cinco municípios de 40 pessoas: expostos e casos de cada um. As taxas nunca mudam; o que muda é QUEM adoece dentro do município. */
const EC={th:1,open:false,E:[4,10,16,22,28],C:[4,6,8,10,12]};
function ecK(g){const c=EC.C[g],k0=c*EC.E[g]/40;return Math.round(EC.th>=0?k0+EC.th*(c-k0):k0*(1+EC.th));}
const RT={oa:"84",pa:"350.000",ob:"45",pb:"250.000",per:100000};
LAB("eco","Observacionais","Ecológico",`
<div class="intro"><span class="eyebrow">Observacionais · ecológico</span><h2>O que vale para o grupo pode não valer para as pessoas</h2><p>No estudo ecológico, a unidade de análise é o grupo. As medidas de exposição e de desfecho chegam agregadas por município, estado ou país.</p></div>
<div class="grid two">
 <div class="card wide"><div class="card-h"><h3>A falácia ecológica</h3><button class="more-btn" data-learn="falacia">Saiba mais</button></div>
  <p class="lede">Cinco municípios: quanto maior a proporção de expostos, maior a taxa do desfecho. Isso é tudo o que o estudo enxerga. Agora abra os municípios e decida quem adoece dentro de cada um.</p>
  <div class="cols2">
   <div><div class="sub">O que o estudo ecológico vê</div><svg class="ch" id="ecS" role="img" aria-label="Taxa do desfecho por proporção de expostos em cinco municípios"></svg></div>
   <div class="stack"><div class="sub">Dentro de cada município, quem adoece?</div>
    <div class="chips" id="ecC"></div>
    <div class="range"><label for="ecT">Só não expostos ‹ › só expostos</label><output id="ecTo"></output><input type="range" id="ecT" min="-100" max="100" step="5" value="100"></div>
    <label class="toggle"><input type="checkbox" id="ecO"> Abrir os municípios (o estudo não vê isto)</label>
    <div class="tiles" id="ecTiles"></div></div>
  </div>
  <div class="grps" id="ecG" style="margin-top:14px"></div>
  <div class="key" id="ecK"></div>
  <div class="insight" id="ecTxt"></div></div>
 <div class="card wide"><div class="card-h"><h3>Comparar taxas de dois lugares</h3><button class="more-btn" data-learn="taxas">Saiba mais</button></div>
  <p class="lede">A comparação mais simples entre grupos é a razão de taxas. Use o exemplo ou digite os seus números.</p>
  <div class="cols2"><div class="stack">
   <div class="fields tight"><div class="inp"><label for="rtOa">Óbitos em A</label><div class="box"><input id="rtOa" inputmode="numeric"></div></div><div class="inp"><label for="rtPa">População de A</label><div class="box"><input id="rtPa" inputmode="numeric"></div></div></div>
   <div class="fields tight"><div class="inp"><label for="rtOb">Óbitos em B</label><div class="box"><input id="rtOb" inputmode="numeric"></div></div><div class="inp"><label for="rtPb">População de B</label><div class="box"><input id="rtPb" inputmode="numeric"></div></div></div>
   <div><div class="sub">Taxa por</div><div class="seg" id="rtPer"><button data-v="1000">1.000</button><button data-v="10000">10.000</button><button data-v="100000">100.000</button></div></div>
  </div><div><div class="tiles" id="rtTiles"></div><div class="cmp" id="rtBars"></div><div class="f" id="rtF"></div></div></div>
  <div class="insight warn">A razão de taxas não controla fatores de confusão. Se um município tem população mais idosa, mais poluição ou menos acesso a serviços, a diferença pode vir daí.</div></div>
</div>`,()=>{
  chips($("ecC"),["Só os expostos","Mesmo risco para todos","Só os não expostos"],i=>{EC.th=[1,0,-1][i];$("ecT").value=EC.th*100;if(!EC.open){EC.open=true;$("ecO").checked=true;}renderEC();},0);
  $("ecT").oninput=e=>{EC.th=+e.target.value/100;chipOn($("ecC"),[1,0,-1].indexOf(EC.th));renderEC();};$("ecO").onchange=e=>{EC.open=e.target.checked;renderEC();};
  [["rtOa","oa"],["rtPa","pa"],["rtOb","ob"],["rtPb","pb"]].forEach(([id,k])=>{$(id).value=RT[k];$(id).oninput=e=>{RT[k]=e.target.value;renderRT();};});
  segBind($("rtPer"),String(RT.per),v=>{RT.per=+v;renderRT();});
},()=>{renderEC();renderRT();});
function renderEC(){const el=$("ecS"),H=208,W=box(el,H),L=40,Rm=14,T=24,ih=H-T-34,iw=W-L-Rm,X=v=>L+v*iw,Y=v=>T+ih-v/.4*ih,nm="ABCDE";
  let s=yGrid(Y,[0,.1,.2,.3,.4],L,W-Rm,v=>fmt(v*100,0))+xAxis(X,[0,.25,.5,.75,1],T+ih,v=>pct(v,0),L,W-Rm);
  s+=`<line x1="${X(.02)}" y1="${Y(.02/3+.0667)}" x2="${X(.8)}" y2="${Y(.8/3+.0667)}" stroke="var(--alt)" stroke-width="2" stroke-dasharray="6 4"/>`;
  EC.E.forEach((e,g)=>s+=`<circle cx="${X(e/40)}" cy="${Y(EC.C[g]/40)}" r="10" fill="var(--accent)"/><text x="${X(e/40)}" y="${Y(EC.C[g]/40)+4}" text-anchor="middle" style="fill:var(--on-accent);font-size:11.5px;font-weight:600">${nm[g]}</text>`);
  s+=`<text x="${W-Rm}" y="${H-1}" text-anchor="end" style="font-size:11px">expostos no município</text><text x="${L}" y="10" style="font-size:11px">casos por 100 pessoas</text>`;el.innerHTML=s;
  $("ecTo").textContent=EC.th===0?"mesmo risco":EC.th>0?`${fmt(EC.th*100,0)}% rumo aos expostos`:`${fmt(-EC.th*100,0)}% rumo aos não expostos`;
  let num=0,den=0,h="";
  EC.E.forEach((E,g)=>{const c=EC.C[g],a=ecK(g),cu=c-a,U=40-E;num+=a*U/40;den+=cu*E/40;const P=[];
    for(let i=0;i<E;i++)P.push(EC.open?{e:1,d:i<a?1:0}:{e:null,d:null});for(let i=0;i<U;i++)P.push(EC.open?{e:0,d:i<cu?1:0}:{e:null,d:null});
    h+=grp("Município "+nm[g],EC.open?`risco: ${pct(a/E,0)} expostos · ${pct(cu/U,0)} não`:`${pct(E/40,0)} expostos · ${fmt(c/40*100,0)} casos por 100`,dotSVG(P,8,{scale:1}));});
  $("ecG").innerHTML=h;const mh=den?num/den:Infinity;
  $("ecK").innerHTML=EC.open?keyDot({e:1,d:1},"exposto, com desfecho")+keyDot({e:1,d:0},"exposto, sem")+keyDot({e:0,d:1},"não exposto, com desfecho")+keyDot({e:0,d:0},"não exposto, sem"):keyDot({e:null,d:null},"pessoa do município: o estudo só tem os totais");
  $("ecTiles").innerHTML=tile("Entre municípios","mais expostos, mais casos","não muda","acc")+tile("RR entre pessoas do mesmo município",EC.open?(mh===Infinity?"∞":rat(mh)):"?",EC.open?(mh===Infinity?"todos os casos são expostos":"combinando os cinco municípios"):"abra os municípios",EC.open&&mh<.8?"bad":"");
  $("ecTxt").className="insight"+(EC.open&&EC.th<=.3?" warn":"");
  $("ecTxt").innerHTML=!EC.open?"O gráfico sugere que a exposição aumenta o risco. Mas ele é feito de municípios, não de pessoas: qualquer distribuição dos casos dentro de cada município produz o mesmo gráfico.":EC.th>.3?"Neste cenário, os casos estão mesmo entre os expostos, e a leitura individual coincidiria com a ecológica. O estudo ecológico, porém, não tem como saber disso.":EC.th>=-.3?"Dentro de cada município, expostos e não expostos adoecem quase na mesma proporção. O que muda é o município: algo do lugar, e não a exposição da pessoa, acompanha as taxas. O gráfico de cima continua igual.":"Dentro de cada município, quem adoece são os não expostos. Concluir que “quem se expõe adoece mais” seria exatamente o contrário da verdade. É a <b>falácia ecológica</b>, e o gráfico de cima continua igual.";}
function renderRT(){const oa=parse(RT.oa),pa=parse(RT.pa),ob=parse(RT.ob),pb=parse(RT.pb),ok=[oa,pa,ob,pb].every(has)&&pa>0&&pb>0&&oa>=0&&ob>=0,per=RT.per,pt=fmt(per,0);
  if(!ok){$("rtTiles").innerHTML=tile("Razão de taxas","—","preencha os quatro campos");$("rtBars").innerHTML="";$("rtF").textContent="";return;}
  const ta=oa/pa*per,tb=ob/pb*per,rt=div(ta,tb),mx=Math.max(ta,tb,1e-9);
  $("rtTiles").innerHTML=tile("Taxa em A",fmt(ta,1),"por "+pt)+tile("Taxa em B",fmt(tb,1),"por "+pt)+tile("Razão de taxas (A ÷ B)",rat(rt),"","acc");
  $("rtBars").innerHTML=[["Município A",ta,"var(--accent)"],["Município B",tb,"var(--tick)"]].map(([n,v,c])=>`<div class="rowb"><span>${n}</span><div class="bar"><i style="width:${v/mx*100}%;background:${c}"></i></div><b>${fmt(v,1)}</b></div>`).join("");
  $("rtF").innerHTML=`RT = ${fmt(ta,1)} ÷ ${fmt(tb,1)} = <b>${rat(rt)}</b>${has(rt)&&rt>0?`: a taxa em A é ${rt>=1?fmt((rt-1)*100,0)+"% maior":fmt((1-rt)*100,0)+"% menor"} que em B.`:""}`;}
