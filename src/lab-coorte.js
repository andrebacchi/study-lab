/* ===================== COORTE ===================== */
/* 100 expostos (32 adoecerão em 10 anos) e 100 não expostos (16 adoecerão): RR verdadeiro = 2,0 */
const CO={T:10,L:0,mode:"acaso",P:[],timer:null,h:20,i0:4,rr:5,pe:30};
function coWorld(){const r=rng(52);CO.P=[];[[1,32],[0,16]].forEach(([e,nc])=>{const a=[];for(let i=0;i<100;i++)a.push({e,ev:null,lu:r(),lt:r()});shuffle(a.slice(),r).slice(0,nc).forEach(p=>p.ev=0.4+r()*9.6);CO.P.push(...a);});}
/* marca quem se perde: ao acaso (na mesma proporção entre futuros casos e os demais) ou, entre os expostos, metade das perdas é de quem iria adoecer */
function coLoss(){[1,0].forEach(e=>{const g=CO.P.filter(p=>p.e===e),cs=g.filter(p=>p.ev!=null).sort((x,y)=>x.lu-y.lu),nc=g.filter(p=>p.ev==null).sort((x,y)=>x.lu-y.lu),n=Math.round(100*CO.L);
  const k=Math.min(cs.length,Math.round(n*(CO.mode==="dif"&&e===1?0.5:cs.length/100)));g.forEach(p=>p.lost=null);
  cs.slice(0,k).forEach(p=>p.lost=p.lt*p.ev);nc.slice(0,n-k).forEach(p=>p.lost=p.lt*10);});}
function coAt(T){const o={};[1,0].forEach(e=>{const g=CO.P.filter(p=>p.e===e),lost=g.filter(p=>p.lost!=null&&p.lost<=T).length,obs=g.filter(p=>p.ev!=null&&p.ev<=T&&p.lost==null).length,tru=g.filter(p=>p.ev!=null&&p.ev<=T).length;o[e]={lost,obs,tru,inc:div(obs,100-lost),incT:tru/100};});return o;}
LAB("coorte","Observacionais","Coorte",`
<div class="intro"><span class="eyebrow">Observacionais · coorte</span><h2>Da exposição ao desfecho, contando casos novos</h2><p>Pessoas livres do desfecho são classificadas pela exposição e acompanhadas no tempo. Só assim se mede incidência, e só com incidência se calcula o risco relativo.</p></div>
<div class="grid two">
 <div class="card wide"><div class="card-h"><h3>Dez anos de seguimento</h3><button class="more-btn" data-learn="seguimento">Saiba mais</button></div>
  <div class="playrow"><button class="btn small primary" id="coPlay">▶ Acompanhar</button><div class="range"><label for="coT">Tempo de seguimento</label><output id="coTo"></output><input type="range" id="coT" min="0" max="10" step="0.1" value="10"></div></div>
  <div class="cols2" style="margin-top:12px">
   <div><div class="grps" id="coG"></div><div class="key" id="coK"></div></div>
   <div><svg class="ch" id="coS" role="img" aria-label="Incidência acumulada em expostos e não expostos"></svg><div class="tiles" id="coTiles" style="margin-top:8px"></div></div>
  </div>
  <div class="sub" style="margin-top:16px">E se parte das pessoas sumir do estudo?</div>
  <div class="cols2"><div class="range"><label for="coL">Perdas de seguimento</label><output id="coLo"></output><input type="range" id="coL" min="0" max="40" step="5" value="0"></div>
   <div><div class="seg" id="coM"><button data-v="acaso">Perdas ao acaso</button><button data-v="dif">Expostos que iriam adoecer saem mais</button></div></div></div>
  <div class="insight" id="coTxt"></div></div>
 <div class="card wide"><div class="card-h"><h3>Risco atribuível: nos expostos e na população</h3><button class="more-btn" data-learn="ra">Saiba mais</button></div>
  <p class="lede">O risco relativo mede a força da associação. O risco atribuível mede quantos casos se devem à exposição: entre os expostos (RA) e na população inteira (RAP). Uma população de 400 pessoas.</p>
  <div class="cols2"><div class="stack">
   <div class="range"><label for="raI">Incidência nos não expostos</label><output id="raIo"></output><input type="range" id="raI" min="1" max="20" step="1" value="4"></div>
   <div class="range"><label for="raR">Risco relativo</label><output id="raRo"></output><input type="range" id="raR" min="1" max="8" step="0.5" value="5"></div>
   <div class="range"><label for="raP">Expostos na população</label><output id="raPo"></output><input type="range" id="raP" min="5" max="90" step="5" value="30"></div>
   <div class="tiles" id="raT"></div>
  </div><div><div id="raG"></div><div class="key" id="raK"></div><div class="f" id="raF"></div></div></div>
  <div class="insight" id="raTxt"></div></div>
 <div class="card wide"><div class="card-h"><h3>Prospectiva, retrospectiva ou ambidirecional?</h3><button class="more-btn" data-learn="prosp">Saiba mais</button></div>
  <p class="lede">O desenho é o mesmo: da exposição para o desfecho. O que muda é onde está o “hoje” em relação ao seguimento. Arraste e veja.</p>
  <div class="seg" id="prSeg"><button data-v="20">Prospectiva</button><button data-v="50">Ambidirecional</button><button data-v="80">Retrospectiva</button></div>
  <svg class="ch" id="prS" style="margin-top:12px;max-width:720px" role="img" aria-label="Posição do hoje em relação ao seguimento da coorte"></svg>
  <div class="range" style="max-width:720px"><label for="prH">Onde está o hoje?</label><output id="prHo"></output><input type="range" id="prH" min="5" max="95" step="1" value="20"></div>
  <div class="insight" id="prTxt"></div></div>
</div>`,()=>{coWorld();
  $("coT").oninput=e=>{coStop();CO.T=+e.target.value;renderCO();};$("coL").oninput=e=>{CO.L=+e.target.value/100;renderCO();};
  segBind($("coM"),CO.mode,v=>{CO.mode=v;if(!CO.L){CO.L=.2;$("coL").value=20;}renderCO();});
  $("coPlay").onclick=()=>{if(CO.timer){coStop();return;}if(CO.T>=10)CO.T=0;$("coPlay").textContent="❚❚ Pausar";CO.timer=setInterval(()=>{CO.T=Math.min(10,+(CO.T+.1).toFixed(1));$("coT").value=CO.T;renderCO();if(CO.T>=10)coStop();},70);};
  segBind($("prSeg"),"20",v=>{CO.h=+v;$("prH").value=v;renderPR();});$("prH").oninput=e=>{CO.h=+e.target.value;renderPR();};
  [["raI","i0"],["raR","rr"],["raP","pe"]].forEach(([id,k])=>$(id).oninput=e=>{CO[k]=+e.target.value;renderRA();});
},()=>{renderCO();renderRA();renderPR();});
function renderRA(){if(CO.i0*CO.rr>90){CO.rr=Math.floor(90/CO.i0*2)/2;$("raR").value=CO.rr;}
  const i0=CO.i0/100,i1=i0*CO.rr,pe=CO.pe/100,E=Math.round(400*pe),U=400-E,cE=Math.round(E*i1),bg=Math.min(cE,Math.round(E*i0)),at=cE-bg,cU=Math.round(U*i0),ra=i1-i0,ip=pe*i1+(1-pe)*i0,rap=ip-i0,fap=div(rap,ip),P=[];
  $("raIo").textContent=CO.i0+" por 100";$("raRo").textContent=fmt(CO.rr,1);$("raPo").textContent=CO.pe+"%";
  for(let j=0;j<E;j++)P.push(j<at?{e:1,d:1}:j<cE?{e:1,d:null}:{e:1,d:0});for(let j=0;j<U;j++)P.push({e:0,d:j<cU?1:0});
  $("raG").innerHTML=dotSVG(P,25,{pitch:10,r:3.5,scale:1.1});
  $("raK").innerHTML=keyDot({e:1,d:1},"caso atribuível à exposição")+keyDot({e:1,d:null},"caso em exposto que ocorreria de qualquer modo")+keyDot({e:0,d:1},"caso em não exposto")+keyDot({e:1,d:0},"exposto sem a doença")+keyDot({e:0,d:0},"não exposto sem a doença");
  $("raT").innerHTML=tile("RR",fmt(CO.rr,1),`${fmt(i1*100,1)} ÷ ${fmt(i0*100,1)} por 100`)+tile("RA",fmt(ra*100,1),"casos em excesso por 100 expostos","alt")+tile("RAP",fmt(rap*100,1),"casos em excesso por 100 habitantes","acc")+tile("Fração atribuível na população",has(fap)?pct(fap,0):"—","dos casos da população");
  $("raF").innerHTML=`RA = ${fmt(i1*100,1)} − ${fmt(i0*100,1)} = <b>${fmt(ra*100,1)}</b> por 100 expostos<br>RAP = ${fmt(ip*100,1)} − ${fmt(i0*100,1)} = <b>${fmt(rap*100,1)}</b> por 100 habitantes`;
  $("raTxt").innerHTML=CO.rr===1?"Com RR igual a 1, expostos e não expostos adoecem na mesma proporção: nenhum caso é atribuível à exposição.":`O RA olha só para os expostos: dos ${fmt(i1*100,1)} casos por 100 expostos, ${fmt(ra*100,1)} se devem à exposição e ${fmt(i0*100,1)} ocorreriam mesmo sem ela. O RAP olha para toda a população: ${fmt(rap*100,1)} casos por 100 habitantes, ou ${pct(fap,0)} de todos os casos, seriam evitados se ninguém se expusesse. Mude a proporção de expostos: o RR e o RA ficam iguais, e o RAP muda. Uma exposição de risco modesto, mas muito comum, pode pesar mais na população do que uma exposição forte e rara.`;}

function coStop(){clearInterval(CO.timer);CO.timer=null;const b=$("coPlay");if(b)b.textContent="▶ Acompanhar";}
function renderCO(){coLoss();const T=CO.T,A=coAt(T),rr=div(A[1].inc,A[0].inc),rrT=div(A[1].incT,A[0].incT);
  $("coTo").textContent=fmt(T,1)+" anos";$("coLo").textContent=pct(CO.L,0);
  const look=p=>p.lost!=null&&p.lost<=T?{e:p.e,d:0,lost:true}:{e:p.e,d:p.ev!=null&&p.ev<=T?1:0};
  $("coG").innerHTML=[1,0].map(e=>grp(e?"Expostos":"Não expostos",`${n1(A[e].obs,"caso novo","casos novos")}${A[e].lost?` · ${n1(A[e].lost,"perda","perdas")}`:""}`,dotSVG(CO.P.filter(p=>p.e===e).map(look),10))).join("");
  $("coK").innerHTML=keyDot({e:1,d:1},"caso novo")+keyDot({e:1,d:0},"segue em risco")+(CO.L?keyDot({e:1,d:0,lost:true},"perdido"):"");
  const el=$("coS"),H=210,W=box(el,H),L=40,Rm=12,Tp=22,ih=H-Tp-32,iw=W-L-Rm,X=v=>L+v/10*iw,Y=v=>Tp+ih-v/.5*ih;let s=yGrid(Y,[0,.1,.2,.3,.4,.5],L,W-Rm,v=>pct(v,0))+xAxis(X,[0,2,4,6,8,10],Tp+ih,v=>v,L,W-Rm);
  const path=(e,k,to)=>{let d="";for(let t=0;t<=to+1e-9;t+=.1){const v=coAt(t)[e][k];d+=(d?"L":"M")+X(t).toFixed(1)+","+Y(clamp(has(v)?v:0,0,.5)).toFixed(1);}return d;};
  if(CO.L)[1,0].forEach(e=>s+=`<path d="${path(e,"incT",10)}" fill="none" stroke="${e?"var(--exp)":"var(--nex)"}" stroke-width="1.5" stroke-dasharray="3 4" opacity=".7"/>`);
  [1,0].forEach(e=>{s+=`<path d="${path(e,"inc",T)}" fill="none" stroke="${e?"var(--exp)":"var(--nex)"}" stroke-width="2.4"/><circle cx="${X(T)}" cy="${Y(clamp(has(A[e].inc)?A[e].inc:0,0,.5))}" r="4.5" fill="${e?"var(--exp)":"var(--nex)"}"/>`;});
  s+=`<text x="${W-Rm}" y="${H-1}" text-anchor="end" style="font-size:11px">anos de seguimento</text><text x="${L}" y="10" style="font-size:11px">incidência acumulada${CO.L?" (tracejado: sem perdas)":""}</text>`;el.innerHTML=s;
  $("coTiles").innerHTML=tile("Incidência nos expostos",has(A[1].inc)?pct(A[1].inc,1):"—",`${A[1].obs} de ${100-A[1].lost}`)+tile("Incidência nos não expostos",has(A[0].inc)?pct(A[0].inc,1):"—",`${A[0].obs} de ${100-A[0].lost}`)+tile("RR observado",rat(rr),"","acc")+(CO.L?tile("RR sem perdas",rat(rrT),"o que deveria ser visto"):tile("Risco atribuível",has(A[1].inc-A[0].inc)?fmt((A[1].inc-A[0].inc)*100,1)+" p.p.":"—","diferença entre as incidências"));
  $("coTxt").className="insight"+(CO.L&&CO.mode==="dif"?" warn":"");
  $("coTxt").innerHTML=T<1?"No início ninguém tem o desfecho. É essa a condição que permite contar casos novos.":!CO.L?`Em ${fmt(T,1)} anos, a incidência entre expostos é ${rat(rr)} vezes a dos não expostos. A exposição foi registrada antes do desfecho: a relação temporal é clara.`:CO.mode==="acaso"?"Com perdas ao acaso, o estudo perde gente e precisão, mas o RR oscila em torno do valor verdadeiro: expostos e não expostos encolhem do mesmo jeito.":"Quando quem some é justamente o exposto que iria adoecer, os casos desaparecem do grupo exposto e o RR observado cai em direção a 1. É um <b>viés de seleção por perda diferencial</b>: os que ficaram já não representam os que entraram.";}
function renderPR(){const el=$("prS"),H=128,W=box(el,H),L=14,Rm=14,iw=W-L-Rm,X=v=>L+v/100*iw,h=CO.h,y=62,a=20,b=80,kind=h<=22?0:h>=78?2:1;let s="";
  s+=`<line class="ax" x1="${L}" x2="${W-Rm}" y1="${y+34}" y2="${y+34}"/><text x="${L}" y="${H-2}" style="font-size:11px">passado</text><text x="${W-Rm}" y="${H-2}" text-anchor="end" style="font-size:11px">futuro</text>`;
  const cut=clamp(h,a,b);
  if(cut>a)s+=`<rect x="${X(a)}" y="${y-9}" width="${X(cut)-X(a)}" height="18" rx="4" fill="var(--tick)" opacity=".55"/><text x="${(X(a)+X(cut))/2}" y="${y+24}" text-anchor="middle" style="font-size:11px">${X(cut)-X(a)>70?"em registros":""}</text>`;
  if(cut<b)s+=`<rect x="${X(cut)}" y="${y-9}" width="${X(b)-X(cut)}" height="18" rx="4" fill="var(--accent)"/><text x="${(X(cut)+X(b))/2}" y="${y+24}" text-anchor="middle" style="font-size:11px">${X(b)-X(cut)>90?"a acompanhar":""}</text>`;
  s+=`<circle cx="${X(a)}" cy="${y}" r="6" fill="var(--fg)"/><path d="M${X(b)+10} ${y}l-10 -6v12z" fill="var(--fg)"/>`;
  s+=`<text x="${X(a)}" y="${y-16}" text-anchor="start" style="font-size:11.5px;fill:var(--fg)">exposição</text><text x="${X(b)+10}" y="${y-16}" text-anchor="end" style="font-size:11.5px;fill:var(--fg)">desfecho</text>`;
  s+=`<line x1="${X(h)}" x2="${X(h)}" y1="14" y2="${y+34}" stroke="var(--bad)" stroke-width="2" stroke-dasharray="5 4"/><text x="${clamp(X(h),20,W-20)}" y="11" text-anchor="middle" class="lbl" style="fill:var(--bad);font-size:12.5px">hoje</text>`;el.innerHTML=s;
  $("prHo").textContent=["Prospectiva","Ambidirecional","Retrospectiva"][kind];$("prSeg").querySelectorAll("button").forEach((x,i)=>x.classList.toggle("on",i===kind));
  $("prTxt").innerHTML=["<b>Prospectiva:</b> a coorte é montada hoje e acompanhada adiante. A coleta é padronizada e controlada, mas custa caro e demora.","<b>Ambidirecional:</b> parte do seguimento já aconteceu e está em registros; o restante ainda será acompanhado.","<b>Retrospectiva:</b> exposição e desfecho já aconteceram. A coorte é reconstruída com registros do passado até hoje: rápida e barata, mas os dados podem ser incompletos ou não padronizados. Continua sendo coorte porque a seleção é pela exposição."][kind];}
