/* ===================== QUASE-EXPERIMENTOS: intervenção sem sorteio ===================== */
/* Internações por 10 mil habitantes, mês a mês. A intervenção começa no mês 0. Há uma tendência que já existia,
   um possível evento concomitante no mesmo mês (que atinge todo mundo) e o efeito verdadeiro da intervenção. */
const QE={des:0,tr:-.5,ef:-5,sh:0,seed:2,T:[],C:[],Hh:[]};
const QE_D=[["Antes e depois","Mede o desfecho uma vez antes e uma vez depois da intervenção, no mesmo grupo. Não há comparação."],
 ["Série temporal interrompida","Muitas medidas antes e muitas depois, no mesmo grupo. Avalia a mudança de nível e de tendência."],
 ["Controle não equivalente","Um grupo recebe a intervenção e outro não, sem sorteio. Os dois são comparados antes e depois."],
 ["Controles históricos","Compara quem recebeu a intervenção com pacientes de outra época, que não a receberam."]];
function qeData(){const r=rng(QE.seed*53+9),nz=()=>1.2*gauss(r);QE.T=[];QE.C=[];QE.Hh=[];
  for(let t=-12;t<12;t++){QE.T.push({t,y:60+QE.tr*t+(t>=0?QE.ef+QE.sh:0)+nz()});QE.C.push({t,y:47+QE.tr*t+(t>=0?QE.sh:0)+nz()});}
  for(let t=-36;t<-24;t++)QE.Hh.push({t,y:60+QE.tr*t+nz()});}
const qeMean=a=>a.reduce((s,p)=>s+p.y,0)/a.length;
function qeEst(){const T=QE.T,pre=T.filter(p=>p.t<0),post=T.filter(p=>p.t>=0),C=QE.C;
  if(QE.des===0)return{est:T[23].y-T[11].y};
  if(QE.des===1){const n=pre.length,mx=pre.reduce((s,p)=>s+p.t,0)/n,my=qeMean(pre),b=pre.reduce((s,p)=>s+(p.t-mx)*(p.y-my),0)/pre.reduce((s,p)=>s+(p.t-mx)**2,0),a=my-b*mx;return{est:post.reduce((s,p)=>s+p.y-(a+b*p.t),0)/post.length,a,b};}
  if(QE.des===2){const dT=qeMean(post)-qeMean(pre),dC=qeMean(C.filter(p=>p.t>=0))-qeMean(C.filter(p=>p.t<0));return{est:dT-dC,dT,dC};}
  return{est:qeMean(post)-qeMean(QE.Hh)};}
LAB("quase","Experimentais","Quase-experimentos",`
<div class="intro"><span class="eyebrow">Experimentais · intervenção sem sorteio</span><h2>Quando não dá para sortear, o que cada desenho consegue separar?</h2><p>No estudo quase-experimental o pesquisador controla a intervenção, mas a alocação não é aleatória. O desafio é separar o efeito da intervenção do que teria acontecido de qualquer modo.</p></div>
<div class="grid"><div class="card"><div class="card-h"><h3>Uma intervenção, quatro desenhos</h3><button class="more-btn" data-learn="quase">Saiba mais</button></div>
 <p class="lede">Um município implanta um programa no mês 0. O desfecho são as internações por 10 mil habitantes. Os mesmos dados, lidos por quatro desenhos.</p>
 <div class="chips" id="qeD"></div>
 <p class="lede" id="qeDt" style="margin-top:10px"></p>
 <svg class="ch" id="qeS" role="img" aria-label="Internações por mês antes e depois da intervenção"></svg>
 <div class="legend" id="qeLg"></div>
 <div class="cols2" style="margin-top:12px"><div class="stack">
  <div class="range"><label for="qeTr">Tendência que já existia</label><output id="qeTro"></output><input type="range" id="qeTr" min="-1" max="1" step="0.1" value="-0.5"></div>
  <div class="range"><label for="qeEf">Efeito verdadeiro da intervenção</label><output id="qeEfo"></output><input type="range" id="qeEf" min="-15" max="0" step="1" value="-5"></div>
  <div class="range"><label for="qeSh">Outro evento no mesmo mês, que atinge toda a região</label><output id="qeSho"></output><input type="range" id="qeSh" min="-10" max="10" step="1" value="0"></div>
  <div class="row"><button class="btn small" id="qeNew">Outros dados</button></div>
 </div><div><div class="tiles" id="qeT"></div><div class="insight" id="qeI"></div></div></div>
</div></div>`,()=>{qeData();
  chips($("qeD"),QE_D.map(d=>d[0]),i=>{QE.des=i;renderQE();},0);
  [["qeTr","tr"],["qeEf","ef"],["qeSh","sh"]].forEach(([id,k])=>$(id).oninput=e=>{QE[k]=+e.target.value;qeData();renderQE();});
  $("qeNew").onclick=()=>{QE.seed++;qeData();renderQE();};
},()=>renderQE());
function renderQE(){const d=QE.des,E=qeEst(),T=QE.T,C=QE.C,Hh=QE.Hh,pre=T.filter(p=>p.t<0),post=T.filter(p=>p.t>=0);
  $("qeDt").textContent=QE_D[d][1];$("qeTro").textContent=QE.tr===0?"estável":`${QE.tr<0?"cai":"sobe"} ${fmt(Math.abs(QE.tr),1)} por mês`;$("qeEfo").textContent=QE.ef===0?"nenhum":`${fmt(QE.ef,0)} internações`;$("qeSho").textContent=QE.sh===0?"nenhum":`${QE.sh>0?"+":""}${fmt(QE.sh,0)} internações`;
  const all=T.concat(d===2?C:[],d===3?Hh:[]),x0=d===3?-37:-13,x1=12,ylo=Math.min(...all.map(p=>p.y))-4,yhi=Math.max(...all.map(p=>p.y))+5;
  const el=$("qeS"),H=270,W=box(el,H),L=36,Rm=12,Tp=14,ih=H-Tp-34,iw=W-L-Rm,X=t=>L+(t-x0)/(x1-x0)*iw,Y=v=>Tp+ih-(v-ylo)/(yhi-ylo)*ih;let s="";
  const yt=[];for(let v=Math.ceil(ylo/10)*10;v<=yhi;v+=10)yt.push(v);s+=yGrid(Y,yt,L,W-Rm,v=>v)+xAxis(X,(d===3?[-36,-24,-12,0,11]:[-12,-6,0,6,11]),Tp+ih,v=>v,L,W-Rm);
  s+=`<line x1="${X(-.5)}" x2="${X(-.5)}" y1="${Tp-6}" y2="${Tp+ih}" stroke="var(--bad)" stroke-width="1.6" stroke-dasharray="5 4"/><text x="${X(-.5)+5}" y="${Tp+4}" style="font-size:11px;fill:var(--bad)">intervenção</text>`;
  const dots=(a,c,on,hollow)=>a.map(p=>`<circle cx="${X(p.t)}" cy="${Y(p.y)}" r="${on(p)?4.4:3}" fill="${hollow?"var(--surface)":c}" stroke="${c}" stroke-width="1.6" opacity="${on(p)?1:.22}"/>`).join("");
  const seg=(t0,t1,y0,y1,c,dash)=>`<line x1="${X(t0)}" y1="${Y(y0)}" x2="${X(t1)}" y2="${Y(y1)}" stroke="${c}" stroke-width="2" ${dash?'stroke-dasharray="6 4"':""}/>`;
  if(d===0){s+=dots(T,"var(--exp)",p=>p.t===-1||p.t===11)+seg(-1,11,T[11].y,T[23].y,"var(--exp)");}
  else if(d===1){s+=dots(T,"var(--exp)",()=>true)+seg(-12,-1,E.a+E.b*-12,E.a-E.b,"var(--exp)")+seg(-1,11,E.a-E.b,E.a+E.b*11,"var(--exp)",true)+seg(0,11,qeMean(post)+E.b*-5.5,qeMean(post)+E.b*5.5,"var(--exp)");}
  else if(d===2){const cp=C.filter(p=>p.t<0),cq=C.filter(p=>p.t>=0);s+=dots(T,"var(--exp)",()=>true)+dots(C,"var(--nex)",()=>true)+seg(-12,-1,qeMean(pre),qeMean(pre),"var(--exp)")+seg(0,11,qeMean(post),qeMean(post),"var(--exp)")+seg(-12,-1,qeMean(cp),qeMean(cp),"var(--nex)")+seg(0,11,qeMean(cq),qeMean(cq),"var(--nex)");}
  else{s+=dots(T,"var(--exp)",p=>p.t>=0)+dots(Hh,"var(--fg)",()=>true,true)+seg(-36,-25,qeMean(Hh),qeMean(Hh),"var(--fg)")+seg(0,11,qeMean(post),qeMean(post),"var(--exp)")+`<text x="${X(-30.5)}" y="${Y(qeMean(Hh))-12}" text-anchor="middle" style="font-size:11px;fill:var(--fg)">pacientes de três anos antes</text>`;}
  s+=`<text x="${W-Rm}" y="${H-1}" text-anchor="end" style="font-size:11px">meses (a intervenção começa no mês 0)</text><text x="${L}" y="${Tp-3}" style="font-size:11px">internações por 10 mil</text>`;el.innerHTML=s;
  const lg=(c,t,dash)=>`<span><i style="background:${dash?"none":c};${dash?`border-top:2px dashed ${c};height:0`:""}"></i>${t}</span>`;
  $("qeLg").innerHTML=lg("var(--exp)","município com o programa")+(d===2?lg("var(--nex)","município vizinho, sem o programa"):"")+(d===1?lg("var(--exp)","para onde a tendência levaria",true):"")+(d===0?"<span>apagado: o que o estudo não mediu</span>":"");
  const err=E.est-QE.ef,ok=Math.abs(err)<1.5;
  $("qeT").innerHTML=tile("Efeito estimado",fmt(E.est,1),"internações por 10 mil",ok?"acc":"bad")+tile("Efeito verdadeiro",fmt(QE.ef,1),"")+tile("Erro da estimativa",(err>0?"+":"")+fmt(err,1),ok?"dentro do ruído dos dados":err<0?"benefício exagerado":"benefício subestimado",ok?"":"bad");
  const trTxt=QE.tr?`a tendência que já existia (${fmt(QE.tr*12,0)} em um ano)`:"",shTxt=QE.sh?`o outro evento do mesmo mês (${QE.sh>0?"+":""}${QE.sh})`:"",both=[trTxt,shTxt].filter(Boolean).join(" e ");
  $("qeI").className="insight"+(ok?"":" warn");
  $("qeI").innerHTML=d===0?(both?`Com duas medidas e nenhuma comparação, tudo o que mudou no período entra na conta do programa: ${both}. O efeito parece ${Math.abs(E.est)>Math.abs(QE.ef)?"maior":"diferente"} do que é.`:"Sem tendência e sem outros eventos, antes e depois até acerta. O problema é que o estudo não tem como saber se esse era o caso. Mexa na tendência.")
   :d===1?(QE.sh?`A série desconta a tendência: compara o que aconteceu com o que a linha tracejada previa. Mas ${shTxt} aconteceu junto com o programa, e sem grupo de comparação os dois não se separam.`:"Com muitas medidas antes, dá para ver a tendência e projetá-la (linha tracejada). O efeito é a distância entre o que se esperava e o que aconteceu. A tendência secular deixa de enganar. Experimente agora um outro evento no mesmo mês.")
   :d===2?"O município vizinho passa pela mesma tendência e pelo mesmo evento. Subtraindo a mudança dele da mudança do município com o programa, sobra o efeito. Funciona enquanto os dois evoluiriam do mesmo jeito sem o programa; como não houve sorteio, isso é uma suposição, e os grupos já partem de níveis diferentes."
   :(QE.tr?`Entre os pacientes antigos e os atuais passaram-se três anos da tendência que já existia. Toda essa mudança (${fmt(QE.tr*36,0)}) é atribuída ao programa. Controles históricos costumam ${QE.tr<0?"favorecer":"prejudicar"} o tratamento novo.`:"Sem nenhuma mudança ao longo dos anos, o controle histórico acertaria. Na prática, diagnóstico, cuidados e registros mudam com o tempo. Mexa na tendência.");}
