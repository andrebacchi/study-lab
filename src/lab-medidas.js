/* ===================== MEDIDAS DE EFEITO: RR, RRR, RAR, NNT e HR ===================== */
const ME={rc:12,ri:8,lock:false,hr:.7,mode:"prop",t:3};
const ME_PRE=[["12% × 8%",12,8],["Mesma redução relativa, risco baixo: 3% × 2%",3,2],["Mesma redução relativa, risco alto: 60% × 40%",60,40]];
const ME_IMP=[["NNT menor que 25","Muito grande","Grande"],["NNT de 25 a 50","Grande","Moderado"],["NNT de 50 a 100","Moderado","Pequeno"]];
const ME_L=.22;
/* ponte para o Nomo LAB (regra da família: números no endereço, tela depois do #, origem em "de") */
const nomoTxUrl=(rc,ri)=>`https://andrebacchi.github.io/nomo-lab/?cer=${+rc.toFixed(4)}&eer=${+ri.toFixed(4)}&de=study-lab#tx`;/* taxa de eventos por ano no controle */
const meSc=t=>Math.exp(-ME_L*t),meSi=t=>ME.mode==="prop"?Math.exp(-ME_L*ME.hr*t):Math.exp(-ME_L*(2.2*Math.min(t,1)+.45*Math.max(0,t-1)));
LAB("medidas","Resultados","Medidas de efeito",`
<div class="intro"><span class="eyebrow">Resultados · RR, RRR, RAR, NNT e HR</span><h2>O mesmo resultado, contado de quatro jeitos</h2><p>O risco relativo diz quanto o risco muda em proporção. A redução absoluta e o NNT dizem quantas pessoas de fato se beneficiam, e dependem do risco de quem é tratado.</p></div>
<div class="grid two">
 <div class="card wide"><div class="card-h"><h3>RRR, RAR e NNT</h3><button class="more-btn" data-learn="medidas">Saiba mais</button></div>
  <div class="chips" id="meP"></div>
  <div class="cols2" style="margin-top:12px">
   <div class="stack">
    <div class="range"><label for="meC">Risco no grupo controle</label><output id="meCo"></output><input type="range" id="meC" min="1" max="60" step="0.5" value="12"></div>
    <div class="range"><label for="meI">Risco no grupo intervenção</label><output id="meIo"></output><input type="range" id="meI" min="0" max="60" step="0.5" value="8"></div>
    <label class="toggle"><input type="checkbox" id="meL"> Manter a redução relativa ao mudar o risco do controle</label>
    <div class="tiles" id="meT"></div>
    <div class="f" id="meF"></div>
    <div id="meNomoW"><a class="btn small" id="meNomo" target="_blank" rel="noopener">Individualizar no Nomo LAB ›</a><p class="note">Lá, o resultado do ensaio vira o NNT de um paciente com o risco que você escolher.</p></div>
   </div>
   <div><div class="grps" id="meG"></div><div class="key" id="meK"></div>
    <div class="sub" style="margin-top:14px">Impacto do tratamento conforme o NNT</div><div class="tw"><table class="imp" id="meImp"></table></div></div>
  </div>
  <div class="cols2" style="margin-top:14px"><div><div class="sub">NNT conforme o risco de quem é tratado</div><svg class="ch" id="meS" role="img" aria-label="NNT conforme o risco basal, para a redução relativa atual"></svg></div><div class="insight" id="meTxt" style="align-self:center"></div></div></div>
 <div class="card wide"><div class="card-h"><h3>Lendo um HR</h3><button class="more-btn" data-learn="hr">Saiba mais</button></div>
  <p class="lede">Quando o ensaio acompanha o tempo até o evento, a medida é o hazard ratio: a razão entre as velocidades com que os eventos acontecem. Mova o HR e o tempo de leitura.</p>
  <div class="seg" id="meM"><button data-v="prop">Riscos proporcionais</button><button data-v="cruz">Curvas que se cruzam</button></div>
  <div class="cols2" style="margin-top:12px">
   <div><svg class="ch" id="meK2" style="touch-action:pan-y;cursor:ew-resize" role="img" aria-label="Curvas de pessoas livres do evento ao longo do tempo"></svg>
    <div class="legend"><span><i style="background:var(--nex)"></i>controle</span><span><i style="background:var(--exp)"></i>intervenção</span><span><i style="background:var(--bad)"></i>momento da leitura</span></div></div>
   <div class="stack">
    <div class="range" id="meHW"><label for="meH">Hazard ratio</label><output id="meHo"></output><input type="range" id="meH" min="0.3" max="1.5" step="0.05" value="0.7"></div>
    <div class="range"><label for="meTm">Ler o resultado em</label><output id="meTo"></output><input type="range" id="meTm" min="0.5" max="6" step="0.5" value="3"></div>
    <div class="tiles" id="meHT"></div>
   </div>
  </div>
  <div class="insight" id="meHI"></div>
  <div class="row" style="margin-top:12px"><a class="btn small" href="https://andrebacchi.github.io/stat-lab/#testes-km" target="_blank" rel="noopener">Montar curvas de Kaplan-Meier no STAT LAB ›</a><span class="note" style="margin:0">Com seus tempos, o log-rank e o HR de Cox.</span></div></div>
</div>`,()=>{
  const sync=()=>{$("meC").value=ME.rc;$("meI").value=ME.ri;};
  chips($("meP"),ME_PRE.map(p=>p[0]),i=>{ME.rc=ME_PRE[i][1];ME.ri=ME_PRE[i][2];sync();renderME();},0);
  $("meC").oninput=e=>{const v=+e.target.value;if(ME.lock&&ME.rc>0){ME.ri=ME.ri/ME.rc*v;}ME.rc=v;sync();chipOn($("meP"),-1);renderME();};
  $("meI").oninput=e=>{ME.ri=+e.target.value;chipOn($("meP"),-1);renderME();};$("meL").onchange=e=>{ME.lock=e.target.checked;};
  segBind($("meM"),ME.mode,v=>{ME.mode=v;renderHR();});$("meH").oninput=e=>{ME.hr=+e.target.value;renderHR();};$("meTm").oninput=e=>{ME.t=+e.target.value;renderHR();};
  const sv=$("meK2");let drag=false;const mv=e=>{const p=svgPt(sv,e),W=sv.viewBox.baseVal.width;ME.t=clamp(Math.round((p.x-40)/(W-52)*12)/2,.5,6);$("meTm").value=ME.t;renderHR();};
  sv.addEventListener("pointerdown",e=>{drag=true;sv.setPointerCapture(e.pointerId);mv(e);});sv.addEventListener("pointermove",e=>{if(drag)mv(e);});["pointerup","pointercancel"].forEach(t=>sv.addEventListener(t,()=>drag=false));
},()=>{renderME();renderHR();});
function renderME(){const rc=ME.rc/100,ri=ME.ri/100,rr=div(ri,rc),rrr=1-rr,rar=rc-ri,nn=rar>1e-9?Math.ceil(1/rar-1e-9):rar<-1e-9?Math.ceil(1/-rar-1e-9):null,harm=rar<-1e-9;
  $("meCo").textContent=fmt(ME.rc,1)+"%";$("meIo").textContent=fmt(ME.ri,1)+"%";
  $("meT").innerHTML=tile("RR",rat(rr),"risco na intervenção ÷ no controle")+tile(harm?"Aumento relativo":"RRR",pct(Math.abs(rrr),0),harm?"RR − 1":"1 − RR")+tile(harm?"Aumento absoluto":"RAR",fmt(Math.abs(rar)*100,1)+" p.p.",harm?"intervenção − controle":"controle − intervenção")+tile(harm?"NNH":"NNT",nn==null?"—":fmt(nn,0),nn==null?"sem diferença de risco":harm?"tratados para causar 1 desfecho":"tratados para evitar 1 desfecho",harm?"bad":"acc");
  $("meNomoW").hidden=!(rar>1e-9);if(rar>1e-9)$("meNomo").href=nomoTxUrl(rc,ri);
  $("meF").innerHTML=nn==null?"Sem diferença entre os grupos, não há NNT.":`${harm?"NNH":"NNT"} = 1 ÷ ${harm?"aumento absoluto":"RAR"} = 1 ÷ ${fmt(Math.abs(rar),3)} = <b>${fmt(nn,0)}</b>`;
  const kc=Math.round(rc*200),ki=Math.round(ri*200),av=Math.max(0,kc-ki),C=[],I=[];for(let j=0;j<200;j++){C.push({e:0,d:j<kc?1:0});I.push(j<ki?{e:1,d:1}:j<ki+av?{e:1,d:0,cl:"av"}:{e:1,d:0});}
  $("meG").innerHTML=grp("Controle",`${n1(kc,"evento","eventos")} em 200 pessoas`,dotSVG(C,20,{pitch:11,r:3.8,scale:1}))+grp("Intervenção",`${n1(ki,"evento","eventos")} em 200 pessoas${av?` · ${n1(av,"evitado","evitados")}`:""}`,dotSVG(I,20,{pitch:11,r:3.8,scale:1}));
  $("meK").innerHTML=keyDot({e:0,d:1},"evento no controle")+keyDot({e:1,d:1},"evento na intervenção")+keyDot({e:1,d:0,cl:"av"},"evento evitado");
  const row=nn==null||harm?-1:nn<25?0:nn<=50?1:nn<=100?2:-1;
  $("meImp").innerHTML=`<tr><th></th><th>Óbito</th><th>Eventos não fatais</th></tr>`+ME_IMP.map((r,i)=>`<tr class="${i===row?"now":""}"><td style="text-align:left">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("");
  const el=$("meS"),H=190,W=box(el,H),L=40,Rm=12,T=10,ih=H-T-32,iw=W-L-Rm,X=v=>L+v/60*iw,Y=v=>T+ih-Math.log10(clamp(v,1,1000))/3*ih;let s=yGrid(Y,[1,10,100,1000],L,W-Rm,v=>fmt(v,0))+xAxis(X,[0,10,20,30,40,50,60],T+ih,v=>v+"%",L,W-Rm);
  if(rrr>0.005){let d="";for(let x=.5;x<=60;x+=.5)d+=(d?"L":"M")+X(x).toFixed(1)+","+Y(1/(x/100*rrr)).toFixed(1);s+=`<path d="${d}" fill="none" stroke="var(--accent)" stroke-width="2.2"/><circle cx="${X(ME.rc)}" cy="${Y(1/rar)}" r="6" fill="var(--accent)"/><text x="${clamp(X(ME.rc)+10,L+50,W-Rm-70)}" y="${Y(1/rar)-9}" class="lbl" style="fill:var(--accent);font-size:12px">NNT ${fmt(nn,0)}</text>`;}
  else s+=`<text x="${(L+W-Rm)/2}" y="${T+ih/2}" text-anchor="middle" style="font-style:italic">sem redução de risco, não há curva</text>`;
  s+=`<text x="${W-Rm}" y="${H-1}" text-anchor="end" style="font-size:11px">risco no grupo controle</text><text x="${W-Rm}" y="${T+2}" text-anchor="end" style="font-size:11px">NNT (escala logarítmica)</text>`;el.innerHTML=s;
  $("meTxt").className="insight"+(harm?" warn":"");
  $("meTxt").innerHTML=nn==null?"Os dois grupos têm o mesmo risco: RR 1, RAR zero.":harm?`A intervenção aumentou o risco. A cada ${fmt(nn,0)} pessoas tratadas, uma tem o desfecho por causa do tratamento (NNH, número necessário para causar dano).`
   :`A intervenção remove ${pct(rrr,0)} do risco de quem é tratado. Em quem tem risco de ${fmt(ME.rc,1)}%, isso são ${fmt(rar*100,1)} pontos percentuais: é preciso tratar ${fmt(nn,0)} pessoas para evitar um desfecho. A mesma redução relativa em gente de risco menor evita menos eventos e pede um NNT maior. Marque “manter a redução relativa” e arraste o risco do controle. O NNT vale sempre para um tempo definido de tratamento.`;}
function renderHR(){const t=ME.t,ta=fmt(t,t%1?1:0)+(t===1?" ano":" anos"),sc=meSc(t),si=meSi(t),prop=ME.mode==="prop",rr=div(1-si,1-sc);$("meHW").hidden=!prop;$("meHo").textContent=fmt(ME.hr,2);$("meTo").textContent=ta;
  const el=$("meK2"),H=260,W=box(el,H),L=40,Rm=12,T=10,ih=H-T-78,iw=W-L-Rm,X=v=>L+v/6*iw,Y=v=>T+ih-v*ih;let s=yGrid(Y,[0,.25,.5,.75,1],L,W-Rm,v=>pct(v,0))+xAxis(X,[0,1,2,3,4,5,6],T+ih,v=>v,L,W-Rm);
  const path=f=>{let d="";for(let x=0;x<=6.001;x+=.1)d+=(d?"L":"M")+X(x).toFixed(1)+","+Y(f(x)).toFixed(1);return d;};
  s+=`<path d="${path(meSc)}" fill="none" stroke="var(--nex)" stroke-width="2.4"/><path d="${path(meSi)}" fill="none" stroke="var(--exp)" stroke-width="2.4"/>`;
  s+=`<line x1="${X(t)}" x2="${X(t)}" y1="${T}" y2="${T+ih}" stroke="var(--bad)" stroke-width="2"/><circle cx="${X(t)}" cy="${Y(sc)}" r="4.500" fill="var(--nex)"/><circle cx="${X(t)}" cy="${Y(si)}" r="4.500" fill="var(--exp)"/>`;
  s+=`<text x="${W-Rm}" y="${T+ih+32}" text-anchor="end" style="font-size:11px">anos desde o sorteio</text><text x="${L}" y="${T+ih+50}" style="font-size:11px;fill:var(--fg)">Pessoas em risco (de 1.000 no início)</text>`;
  [0,1,2,3,4,5,6].forEach(x=>{s+=`<text x="${X(x)}" y="${T+ih+64}" text-anchor="middle" style="font-size:10.5px;fill:var(--nex)">${Math.round(1000*meSc(x))}</text><text x="${X(x)}" y="${T+ih+77}" text-anchor="middle" style="font-size:10.5px;fill:var(--exp)">${Math.round(1000*meSi(x))}</text>`;});
  s+=`<text x="${W-Rm}" y="${T+2}" text-anchor="end" style="font-size:11px">pessoas livres do evento</text>`;el.innerHTML=s;
  $("meHT").innerHTML=tile("Livres do evento: controle",pct(sc,0),"em "+ta)+tile("Livres do evento: intervenção",pct(si,0),"em "+ta)+tile("RR do evento até aqui",rat(rr),"risco acumulado",rr>1.02?"bad":"")+tile("HR",prop?fmt(ME.hr,2):t<=1?"2,20":"0,45",prop?"igual em todo o seguimento":t<=1?"no 1º ano":"depois do 1º ano",prop?"acc":"alt");
  const rr1=div(1-meSi(1),1-meSc(1)),rr6=div(1-meSi(6),1-meSc(6));
  $("meHI").className="insight"+(prop?"":" warn");
  $("meHI").innerHTML=prop?(Math.abs(ME.hr-1)<.001?"Com HR igual a 1, as duas curvas coincidem: os eventos acontecem na mesma velocidade.":`O HR de ${fmt(ME.hr,2)} vale para todo o seguimento: os eventos acontecem a ${pct(ME.hr,0)} da velocidade do controle. Isso não é uma probabilidade. Em ${ta}, ${pct(1-sc,0)} do controle e ${pct(1-si,0)} da intervenção tiveram o evento, um RR de ${rat(rr)}, que vai de ${rat(rr1)} no primeiro ano a ${rat(rr6)} aos seis: com tempo suficiente, quase todos têm o evento nos dois grupos. Por isso se olham as curvas e os números em risco, e não só o HR.`)
   :"Aqui a intervenção faz mal no começo e bem depois, como uma cirurgia com risco operatório. As curvas se cruzam perto do terceiro ano. Um HR único para todo o seguimento ficaria perto de 1 e esconderia as duas coisas: o HR supõe que a razão entre as velocidades é constante no tempo, e aqui não é.";}
