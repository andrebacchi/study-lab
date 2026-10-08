/* ===================== TIPOS DE ENSAIO: hipótese, desenho e fases ===================== */
const TI={d:-4,w:2.5,m:3,des:0,fq:5};
const TI_PRE=[["Superior",-4,2.5],["Não inferior",-1,3],["Equivalente",0,2],["Inconclusivo",1,4.5],["Inferior",6,2]];
const TI_DES=[["Paralelo",["Cada participante recebe um único tratamento, do começo ao fim.","É o desenho mais comum e serve para qualquer condição.","Como as pessoas diferem entre si, precisa de mais participantes que o cruzado."]],
 ["Cruzado (crossover)",["Cada participante recebe os dois tratamentos, em ordem sorteada, e é o seu próprio controle.","Precisa de menos gente, mas só serve para condições crônicas e estáveis, com tratamentos de efeito reversível.","Exige uma pausa entre os períodos, para o efeito do primeiro tratamento não invadir o segundo."]],
 ["Fatorial",["Testa dois tratamentos no mesmo ensaio: metade recebe A, metade recebe B.","Responde a duas perguntas com quase a mesma amostra.","Funciona quando um tratamento não muda o efeito do outro (sem interação)."]],
 ["Por conglomerados",["O sorteio é de grupos inteiros: escolas, UBS, hospitais.","Usado quando a intervenção é coletiva ou quando vizinhos “contaminariam” uns aos outros.","Pessoas da mesma unidade se parecem: a amostra precisa ser maior e a análise deve considerar o agrupamento."]]];
const TI_PH=[["Fase I","Segurança",60,"20 a 100 participantes, em geral voluntários saudáveis. Tolerabilidade, farmacocinética e dose máxima tolerada."],["Fase II","Prova de conceito",300,"Dezenas a algumas centenas de pacientes. Eficácia preliminar e relação dose-resposta."],["Fase III","Confirmação",3000,"Centenas a milhares de pacientes, em geral multicêntrica. Eficácia e segurança contra placebo ou padrão: é o ensaio que embasa o registro."],["Fase IV","Pós-comercialização",300000,"População real, muito ampla. Eventos adversos raros e de longo prazo, efetividade e farmacovigilância."]];
const TI_FQ=[10,30,100,300,1000,3000,10000,30000,100000];
const tiPpl=(n,cl)=>dotSVG(Array.from({length:n},()=>({e:null,d:0,cl})),6,{scale:1});
LAB("tipos","Experimentais","Tipos de ensaio",`
<div class="intro"><span class="eyebrow">Experimentais · como classificar um ensaio clínico</span><h2>Que pergunta o ensaio faz, e como ele foi montado para responder</h2><p>Um ensaio se classifica pela hipótese (o novo é melhor, não é pior, é igual?), pelo desenho (quem recebe o quê, e quando) e pela fase do desenvolvimento em que está.</p></div>
<div class="grid two">
 <div class="card wide"><div class="card-h"><h3>Superioridade, não inferioridade ou equivalência?</h3><button class="more-btn" data-learn="hipotese">Saiba mais</button></div>
  <p class="lede">O resultado é a diferença de risco entre o tratamento novo e o padrão, com o seu intervalo de confiança. A conclusão depende de onde o intervalo inteiro cai em relação ao zero e à margem. A faixa sombreada, entre as margens, é a zona de equivalência. Arraste o intervalo.</p>
  <div class="chips" id="tiP"></div>
  <svg class="ch" id="tiS" style="margin-top:12px;touch-action:pan-y;cursor:ew-resize" role="img" aria-label="Intervalo de confiança da diferença de risco em relação ao zero e às margens"></svg>
  <div class="cols2" style="margin-top:6px"><div class="stack">
   <div class="range"><label for="tiD">Diferença estimada (novo − padrão)</label><output id="tiDo"></output><input type="range" id="tiD" min="-10" max="10" step="0.5" value="-4"></div>
   <div class="range"><label for="tiW">Precisão: meia-largura do IC 95%</label><output id="tiWo"></output><input type="range" id="tiW" min="0.5" max="8" step="0.5" value="2.5"></div>
   <div class="range"><label for="tiM">Margem definida antes do estudo</label><output id="tiMo"></output><input type="range" id="tiM" min="1" max="6" step="0.5" value="3"></div>
  </div><div><div class="verd" id="tiV" style="margin-top:0"></div><div class="insight" id="tiI"></div></div></div></div>
 <div class="card"><div class="card-h"><h3>Quem recebe o quê, e quando</h3><button class="more-btn" data-learn="desenhos">Saiba mais</button></div>
  <div class="chips" id="tiDs"></div>
  <div class="dsg" id="tiDg" style="margin-top:12px"></div>
  <div class="key" id="tiK"></div>
  <ul class="facts" id="tiF"></ul></div>
 <div class="card"><div class="card-h"><h3>As fases e os eventos raros</h3><button class="more-btn" data-learn="fases">Saiba mais</button></div>
  <p class="lede">Um evento adverso só aparece se houver gente suficiente para ele acontecer. Escolha a frequência do evento e veja em que fase ele seria visto ao menos uma vez.</p>
  <div class="range"><label for="tiQ">O evento adverso acontece em</label><output id="tiQo"></output><input type="range" id="tiQ" min="0" max="8" step="1" value="5"></div>
  <div class="phs" id="tiPh" style="margin-top:12px"></div>
  <div class="insight" id="tiPI"></div></div>
</div>`,()=>{
  const sync=()=>{$("tiD").value=TI.d;$("tiW").value=TI.w;};
  chips($("tiP"),TI_PRE.map(p=>p[0]),i=>{TI.d=TI_PRE[i][1];TI.w=TI_PRE[i][2];TI.m=3;$("tiM").value=3;sync();renderTI();},0);
  [["tiD","d"],["tiW","w"],["tiM","m"]].forEach(([id,k])=>$(id).oninput=e=>{TI[k]=+e.target.value;chipOn($("tiP"),-1);renderTI();});
  const sv=$("tiS");let drag=false;const mv=e=>{const p=svgPt(sv,e),W=sv.viewBox.baseVal.width;TI.d=clamp(Math.round(((p.x-12)/(W-24)*26-13)*2)/2,-10,10);sync();chipOn($("tiP"),-1);renderTI();};
  sv.addEventListener("pointerdown",e=>{drag=true;sv.setPointerCapture(e.pointerId);mv(e);});sv.addEventListener("pointermove",e=>{if(drag)mv(e);});["pointerup","pointercancel"].forEach(t=>sv.addEventListener(t,()=>drag=false));
  chips($("tiDs"),TI_DES.map(d=>d[0]),i=>{TI.des=i;renderTID();},0);
  $("tiQ").oninput=e=>{TI.fq=+e.target.value;renderTIP();};
},()=>{renderTI();renderTID();renderTIP();});
function renderTI(){const {d,w,m}=TI,lo=d-w,hi=d+w,sup=hi<0,ni=hi<m,eq=lo>-m&&hi<m,inf=lo>0,pp=v=>(v>0?"+":"")+fmt(v,1);
  $("tiDo").textContent=pp(d)+" p.p.";$("tiWo").textContent="± "+fmt(w,1)+" p.p.";$("tiMo").textContent=fmt(m,1)+" p.p.";
  const el=$("tiS"),H=132,W=box(el,H),L=12,X=v=>L+(clamp(v,-13,13)+13)/26*(W-24),y=62;let s="";
  s+=`<rect x="${X(-m)}" y="22" width="${X(m)-X(-m)}" height="74" fill="var(--good)" opacity=".1"/><text x="${X(0)}" y="110" text-anchor="middle" style="font-size:11px;fill:var(--good)"></text>`;
  s+=`<line x1="${X(0)}" x2="${X(0)}" y1="22" y2="96" stroke="var(--fg)" stroke-width="1.5"/><line x1="${X(m)}" x2="${X(m)}" y1="22" y2="96" stroke="var(--bad)" stroke-width="1.5" stroke-dasharray="5 4"/><line x1="${X(-m)}" x2="${X(-m)}" y1="22" y2="96" stroke="var(--tick)" stroke-width="1.2" stroke-dasharray="5 4"/>`;
  s+=`<line x1="${X(lo)}" x2="${X(hi)}" y1="${y}" y2="${y}" stroke="var(--accent)" stroke-width="5" stroke-linecap="round"/><line x1="${X(lo)}" x2="${X(lo)}" y1="${y-9}" y2="${y+9}" stroke="var(--accent)" stroke-width="3"/><line x1="${X(hi)}" x2="${X(hi)}" y1="${y-9}" y2="${y+9}" stroke="var(--accent)" stroke-width="3"/><circle cx="${X(d)}" cy="${y}" r="8" fill="var(--accent)" stroke="var(--surface)" stroke-width="2"/>`;
  s+=`<text x="${clamp(X(d),60,W-60)}" y="${y-18}" text-anchor="middle" class="lbl" style="font-size:12px;fill:var(--accent)">${pp(d)} (${pp(lo)} a ${pp(hi)})</text>`;
  s+=xAxis(X,[-12,-8,-4,0,4,8,12].concat([]),98,v=>(v>0?"+":"")+v,L,W-12)+`<text x="${L}" y="${H-2}" style="font-size:11px">‹ menos eventos com o novo</text><text x="${W-12}" y="${H-2}" text-anchor="end" style="font-size:11px">mais eventos com o novo ›</text><text x="${clamp(X(m),40,W-40)}" y="16" text-anchor="middle" style="font-size:11px;fill:var(--bad)">margem +${fmt(m,1)}</text><text x="${clamp(X(-m),40,W-40)}" y="16" text-anchor="middle" style="font-size:11px">−${fmt(m,1)}</text>`;el.innerHTML=s;
  const vd=(ok,t,r)=>`<div class="vd ${ok?"yes":"no"}"><b>${t}: ${ok?"demonstrada":"não demonstrada"}</b><span>${r}</span></div>`;
  $("tiV").innerHTML=vd(sup,"Superioridade","o IC inteiro fica abaixo de zero")+vd(ni,"Não inferioridade",`o limite superior do IC fica abaixo de +${fmt(m,1)}`)+vd(eq,"Equivalência",`o IC inteiro fica entre −${fmt(m,1)} e +${fmt(m,1)}`);
  $("tiI").className="insight"+(inf||(!sup&&!ni)?" warn":"");
  $("tiI").innerHTML=sup&&eq?"O novo é estatisticamente melhor, mas a diferença inteira cabe na zona de equivalência: superior no teste, equivalente na prática. Significância estatística não é relevância clínica.":sup?"O intervalo inteiro está do lado do tratamento novo: superioridade demonstrada.":inf&&lo>m?"O intervalo inteiro passou da margem: o novo é pior do que o padrão, além do que se aceitaria.":inf?"O novo teve mais eventos, e o intervalo inteiro está acima de zero: ele é pior que o padrão.":eq?"O intervalo inteiro cabe entre as margens: as diferenças compatíveis com os dados são pequenas demais para importar. Isso é equivalência, e exige um estudo preciso.":ni?"Não dá para dizer que o novo é melhor, mas os dados excluem que ele seja pior além da margem. Vale quando o novo tem outra vantagem: é mais barato, mais seguro ou mais fácil de usar.":"O intervalo é largo demais: os dados são compatíveis com o novo ser melhor, igual ou pior além da margem. “Não houve diferença significativa” não quer dizer que são equivalentes.";}
function renderTID(){const D=TI_DES[TI.des],g=(l,sv2)=>`<div class="grp"><div class="grp-h"><b>${l}</b></div>${sv2}</div>`;let h="";
  if(TI.des===0)h=`<div class="grps">${g("Grupo 1: tratamento novo",tiPpl(12,"fa"))}${g("Grupo 2: controle",tiPpl(12,"fb"))}</div>`;
  else if(TI.des===1)h=`<div class="xo"><span></span><span class="h">Período 1</span><span></span><span class="h">Período 2</span>
   <b>Sequência 1</b>${tiPpl(6,"fa")}<span class="ps">pausa</span>${tiPpl(6,"fb")}<b>Sequência 2</b>${tiPpl(6,"fb")}<span class="ps">pausa</span>${tiPpl(6,"fa")}</div>`;
  else if(TI.des===2)h=`<div class="fx"><span></span><span class="h">Recebe B</span><span class="h">Não recebe B</span>
   <span class="h">Recebe A</span><div class="c"><b>A + B</b>${tiPpl(6,"fab")}</div><div class="c"><b>Só A</b>${tiPpl(6,"fa")}</div>
   <span class="h">Não recebe A</span><div class="c"><b>Só B</b>${tiPpl(6,"fb")}</div><div class="c"><b>Nenhum</b>${tiPpl(6,"f0")}</div></div>`;
  else h=`<div class="cls">${["fa","fb","fb","fa","fa","fb"].map((c,i)=>`<div class="cl">UBS ${i+1}${dotSVG(Array.from({length:4},()=>({e:null,d:0,cl:c})),2,{scale:1})}</div>`).join("")}</div>`;
  $("tiDg").innerHTML=h;const kd=(cl,t)=>`<span><svg viewBox="0 0 13 13"><circle class="p eu d0 ${cl}" cx="6.5" cy="6.5" r="5"/></svg>${t}</span>`;
  $("tiK").innerHTML=TI.des===2?kd("fab","A + B")+kd("fa","só A")+kd("fb","só B")+kd("f0","nenhum"):kd("fa","tratamento novo")+kd("fb","controle");
  $("tiF").innerHTML=D[1].map(t=>`<li>${t}</li>`).join("");}
function renderTIP(){const n=TI_FQ[TI.fq],p=1/n;$("tiQo").textContent="1 em cada "+fmt(n,0)+" pessoas";
  $("tiPh").innerHTML=TI_PH.map(f=>{const pr=1-Math.pow(1-p,f[2]);return `<div class="ph"><b>${f[0]}<small>${fmt(f[2],0)} pessoas</small></b><div class="bar"><i style="width:${pr*100}%"></i></div><span>${pr>.995?"> 99%":pr<.005?"< 1%":pct(pr,0)}</span></div>`;}).join("");
  const first=TI_PH.find(f=>1-Math.pow(1-p,f[2])>=.95);
  $("tiPI").innerHTML=`As barras mostram a probabilidade de observar o evento pelo menos uma vez. Para ter 95% de probabilidade de ver um evento que ocorre em 1 a cada ${fmt(n,0)}, é preciso acompanhar cerca de ${fmt(3*n,0)} pessoas (a “regra de três”). ${first?`Aqui isso só acontece a partir da <b>${first[0]}</b>${first[0]==="Fase IV"?": um evento assim passa despercebido pelos ensaios de registro e só aparece na farmacovigilância":""}.`:"Nem a pós-comercialização deste exemplo o garantiria."} Os tamanhos de cada fase são exemplos.`;}
