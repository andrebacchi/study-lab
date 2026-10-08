/* ===================== DESFECHOS: substituto × clinicamente relevante ===================== */
/* risco do desfecho clínico no controle: 20%. RR = (1 − melhora do marcador × validade × 0,75) × (1 + outros efeitos) */
const DF={m:40,v:90,h:0,srt:{},open:{}};
const DF_PRE=[["Marcador confiável",40,90,0],["Marcador melhora, desfecho não muda",40,0,0],["Marcador melhora, desfecho piora",40,20,60]];
const dfRR=()=>(1-DF.m/100*DF.v/100*.75)*(1+DF.h/100);
/* pares do quadro da aula: [desfecho, tipo, condição, o par correspondente] */
const DF_IT=[
 ["Pressão arterial","sub","Na hipertensão, a pressão é o marcador. O que importa ao paciente: infarto, AVC, morte."],
 ["LDL-colesterol","sub","Na dislipidemia, o perfil lipídico é o marcador. O que importa: infarto, AVC, morte."],
 ["Hemoglobina glicada","sub","No diabetes tipo 2, glicemia e hemoglobina glicada são marcadores. O que importa: infarto, AVC, amputação, morte."],
 ["Amputação","cli","É um desfecho que o paciente sente. No diabetes tipo 2, o marcador correspondente é a hemoglobina glicada."],
 ["Resposta tumoral","sub","No câncer, a redução do tumor é um marcador. O que importa: sobrevida global e qualidade de vida."],
 ["Sobrevida livre de progressão","sub","Parece clínico, mas é substituto: mede o tempo até o tumor crescer no exame, não quanto nem como a pessoa vive."],
 ["Sobrevida global","cli","Viver mais é o desfecho que importa em oncologia, junto com a qualidade de vida."],
 ["Placa amiloide no PET","sub","Na doença de Alzheimer, a placa no exame é um marcador. O que importa: cognição, funcionalidade, institucionalização."],
 ["Institucionalização","cli","Precisar ou não de uma instituição de longa permanência é algo que a pessoa e a família vivem diretamente."],
 ["Resposta de anticorpos","sub","Em vacinas, os anticorpos são o marcador. O que importa: doença, hospitalização, morte."],
 ["Hospitalização","cli","É um evento na vida do paciente, não um resultado de exame."],
 ["Albuminúria","sub","Na doença renal crônica, creatinina, TFG e albuminúria são marcadores. O que importa: diálise, transplante, morte."],
 ["Diálise","cli","Entrar em diálise muda a vida do paciente. Os marcadores correspondentes são creatinina, TFG e albuminúria."],
 ["Densidade mineral óssea","sub","Na osteoporose, a densitometria é o marcador. O que importa é a fratura."],
 ["Fratura","cli","É o desfecho que a densidade mineral óssea tenta prever."],
 ["Qualidade de vida","cli","É um desfecho relatado pelo próprio paciente, e clinicamente relevante por definição."]];
const DF_CASE=[["Clofibrato","Pacientes com hipercolesterolemia","Redução de colesterol","Aumento de mortalidade"],["Flecainida","Extrassístoles ventriculares após infarto","Redução de extrassístoles","Aumento de mortalidade"],["Rosiglitazona","Pacientes com diabetes tipo 2","Redução de hemoglobina glicada","Aumento de infarto"]];
LAB("desfecho","Resultados","Desfechos",`
<div class="intro"><span class="eyebrow">Resultados · o que o ensaio mediu</span><h2>Melhorar o exame não é o mesmo que melhorar a vida do paciente</h2><p>Desfecho substituto é um marcador que se espera que preveja o evento clínico. Ele aparece mais cedo e exige ensaios menores, mas só vale o quanto consegue prever.</p></div>
<div class="grid two">
 <div class="card wide"><div class="card-h"><h3>Do marcador ao desfecho clínico</h3><button class="more-btn" data-learn="desfecho">Saiba mais</button></div>
  <p class="lede">Um tratamento melhora o marcador. Se isso chega ou não ao paciente depende de quanto da doença passa pelo marcador e do que mais o tratamento faz.</p>
  <div class="chips" id="dfP"></div>
  <div class="cols2" style="margin-top:12px">
   <div><svg class="ch" id="dfD" role="img" aria-label="Caminho causal da doença, do marcador e do desfecho clínico"></svg>
    <div class="stack" style="margin-top:8px">
     <div class="range"><label for="dfM">O tratamento melhora o marcador em</label><output id="dfMo"></output><input type="range" id="dfM" min="0" max="60" step="5" value="40"></div>
     <div class="range"><label for="dfV">Quanto do caminho até o desfecho passa pelo marcador</label><output id="dfVo"></output><input type="range" id="dfV" min="0" max="100" step="5" value="90"></div>
     <div class="range"><label for="dfH">Outros efeitos do tratamento sobre o desfecho</label><output id="dfHo"></output><input type="range" id="dfH" min="-20" max="100" step="5" value="0"></div>
    </div></div>
   <div><div class="sub">No marcador</div><div class="cmp" id="dfB" style="margin-top:0"></div>
    <div class="sub" style="margin-top:14px">No desfecho clínico, em 100 pacientes de cada grupo</div><div class="grps" id="dfG"></div>
    <div class="tiles" id="dfT" style="margin-top:12px"></div></div>
  </div>
  <div class="insight" id="dfI"></div></div>
 <div class="card"><div class="card-h"><h3>Substituto ou clinicamente relevante?</h3><button class="more-btn" data-learn="desfecho">Saiba mais</button></div>
  <p class="lede">A pergunta que separa os dois: o paciente sente ou vive isso, ou é um número de exame?</p>
  <div id="dfS"></div></div>
 <div class="card"><div class="card-h"><h3>Quando o marcador enganou</h3><button class="more-btn" data-learn="desfecho">Saiba mais</button></div>
  <p class="lede">Três tratamentos que melhoraram o marcador. Abra cada um para ver o que o ensaio clínico encontrou no desfecho que importa.</p>
  <div class="cases" id="dfC"></div>
  <div class="insight warn">Regra prática: desconfie de benefícios demonstrados apenas em marcadores.</div></div>
</div>`,()=>{
  chips($("dfP"),DF_PRE.map(p=>p[0]),i=>{DF.m=DF_PRE[i][1];DF.v=DF_PRE[i][2];DF.h=DF_PRE[i][3];$("dfM").value=DF.m;$("dfV").value=DF.v;$("dfH").value=DF.h;renderDF();},0);
  [["dfM","m"],["dfV","v"],["dfH","h"]].forEach(([id,k])=>$(id).oninput=e=>{DF[k]=+e.target.value;chipOn($("dfP"),DF_PRE.findIndex(p=>p[1]===DF.m&&p[2]===DF.v&&p[3]===DF.h));renderDF();});
  $("dfC").addEventListener("click",e=>{const b=e.target.closest("[data-c]");if(b){DF.open[b.dataset.c]=true;renderDFC();}});
},()=>{renderDF();renderDFC();sorter($("dfS"),DF.srt,DF_IT,[["sub","Substituto"],["cli","Clinicamente relevante"]]);});
function renderDF(){const rr=dfRR(),ev=Math.round(20*rr),v=DF.v/100,h=DF.h/100;
  $("dfMo").textContent=DF.m+"%";$("dfVo").textContent=DF.v===0?"nada":DF.v===100?"tudo":DF.v+"%";$("dfHo").textContent=DF.h===0?"nenhum":DF.h>0?`aumentam o risco em ${DF.h}%`:`reduzem o risco em ${-DF.h}%`;
  // diagrama: Doença → Via causal → Progressão → Desfecho clínico; o tratamento age na via causal; o marcador sai dela
  const el=$("dfD"),H=232,W=box(el,H),bw=Math.min(96,(W-36)/4),gap=(W-4*bw)/3,bh=38,y=84,xs=[0,1,2,3].map(i=>i*(bw+gap)),cx=i=>xs[i]+bw/2;let s="";
  const bx=(x,yy,t1,t2,fill,fg,st)=>`<rect x="${x}" y="${yy}" width="${bw}" height="${bh}" rx="8" fill="${fill}" stroke="${st||fill}" stroke-width="1.5"/><text x="${x+bw/2}" y="${yy+(t2?16:23)}" text-anchor="middle" style="font-size:11.5px;font-weight:600;fill:${fg}">${t1}</text>${t2?`<text x="${x+bw/2}" y="${yy+29}" text-anchor="middle" style="font-size:11.5px;font-weight:600;fill:${fg}">${t2}</text>`:""}`;
  const ar=(x1,x2,yy,c="var(--fg)",w=2)=>`<path d="M${x1} ${yy}H${x2-6}" stroke="${c}" stroke-width="${w}" fill="none"/><path d="M${x2} ${yy}l-8 -4.500v9z" fill="${c}"/>`;
  [0,1,2].forEach(i=>s+=ar(xs[i]+bw+2,xs[i+1]-2,y+bh/2));
  s+=bx(xs[0],y,"Doença",null,"var(--ink)","var(--on-ink)")+bx(xs[1],y,"Via causal","da doença","var(--ink)","var(--on-ink)")+bx(xs[2],y,"Progressão",null,"var(--ink)","var(--on-ink)")+bx(xs[3],y,"Desfecho","clínico","var(--accent)","var(--on-accent)");
  s+=bx(xs[1],8,"Tratamento",null,"var(--surface)","var(--fg)","var(--fg)")+`<path d="M${cx(1)} ${8+bh+2}V${y-8}" stroke="var(--fg)" stroke-width="2"/><path d="M${cx(1)} ${y-2}l-4.500 -8h9z" fill="var(--fg)"/>`;
  s+=bx(xs[1],y+bh+34,"Marcador","(substituto)","var(--nex)","var(--surface)")+`<path d="M${cx(1)} ${y+bh+2}v24" stroke="var(--nex)" stroke-width="2"/><path d="M${cx(1)} ${y+bh+32}l-4.500 -8h9z" fill="var(--nex)"/>`;
  // validade: o quanto o marcador prevê o desfecho
  const my=y+bh+34+bh/2;s+=`<path d="M${xs[1]+bw+3} ${my}H${cx(3)}V${y+bh+10}" fill="none" stroke="var(--nex)" stroke-width="${1+v*4}" stroke-dasharray="${v<.05?"2 5":"6 4"}" opacity="${.25+v*.75}"/><path d="M${cx(3)} ${y+bh+3}l-5 9h10z" fill="var(--nex)" opacity="${.25+v*.75}"/><text x="${W-2}" y="${y+bh+34+bh+16}" text-anchor="end" style="font-size:11px;fill:var(--nex)">validade: o marcador prevê o evento clínico?</text>`;
  // outros efeitos do tratamento
  if(DF.h){const c=DF.h>0?"var(--bad)":"var(--good)";s+=`<path d="M${xs[1]+bw+3} ${8+bh/2}H${cx(3)}V${y-10}" fill="none" stroke="${c}" stroke-width="${1.5+Math.abs(h)*4}"/><path d="M${cx(3)} ${y-3}l-5 -9h10z" fill="${c}"/><text x="${(xs[1]+bw+cx(3))/2}" y="${8+bh/2-7}" text-anchor="middle" style="font-size:11px;fill:${c}">outros efeitos</text>`;}
  el.innerHTML=s;
  $("dfB").innerHTML=[["Controle",100,"var(--tick)"],["Tratados",100-DF.m,"var(--nex)"]].map(([n,x,c])=>`<div class="rowb"><span>${n}</span><div class="bar"><i style="width:${x}%;background:${c}"></i></div><b>${x}</b></div>`).join("");
  const mk=(k,a)=>{const P=[];for(let i=0;i<100;i++)P.push({e:a,d:i<k?1:0});return P;};
  $("dfG").innerHTML=grp("Controle","20 eventos",dotSVG(mk(20,0),10))+grp("Tratados",n1(ev,"evento","eventos"),dotSVG(mk(ev,1),10));
  $("dfT").innerHTML=tile("Marcador",DF.m?"−"+DF.m+"%":"igual","melhora com o tratamento",DF.m?"good":"")+tile("RR do desfecho clínico",fmt(ev/20,2),`${ev} × 20 eventos`,ev>20?"bad":ev<20?"good":"");
  $("dfI").className="insight"+(ev>=20&&DF.m?" warn":"");
  $("dfI").innerHTML=!DF.m?"Sem efeito no marcador, o que sobra são os outros efeitos do tratamento.":ev<18?"O marcador está no caminho entre a doença e o evento, e o tratamento não faz mais nada de relevante: a melhora do exame se traduz em menos eventos. É o que se espera de um desfecho substituto <b>validado</b>."
   :ev<=20?"O exame melhorou e os pacientes continuam tendo eventos quase na mesma proporção. O marcador acompanha a doença, mas não está no caminho que leva ao desfecho: tratá-lo é tratar o número.":"O exame melhorou e os pacientes pioraram. O tratamento age no marcador, mas também faz outras coisas, e são elas que chegam ao paciente. Um ensaio que só medisse o marcador teria aprovado este tratamento.";}
function renderDFC(){$("dfC").innerHTML=DF_CASE.map((c,i)=>`<div class="case"><h4>${c[0]}</h4><p>${c[1]}</p><div class="ln"><b>Marcador</b><span class="good">${c[2]}</span></div>${DF.open[i]?`<div class="ln"><b>No ensaio</b><span class="badt">${c[3]}</span></div>`:`<button class="btn small" data-c="${i}">Ver o desfecho clínico</button>`}</div>`).join("");}
