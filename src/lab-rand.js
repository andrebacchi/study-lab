/* ===================== RANDOMIZAÇÃO: as formas de sortear, paciente a paciente ===================== */
const RD={m:"simples",blk:"4",n:60,k:24,seed:3,P:[],arm:[],bid:[],bet:{ok:0,n:0},simN:60,sim:null,q:30,dir:"bem",acc:{}};
const RD_M=[["simples","Simples"],["blocos","Em blocos"],["estrat","Estratificada"],["minim","Minimização"],["congl","Por conglomerados"]];
const RD_F=[["g","Graves"],["i","65 anos ou mais"],["d","Com diabetes"]];
const RD_TXT={simples:"Como jogar uma moeda a cada paciente. Imprevisível, mas pode desbalancear estudos pequenos, no tamanho dos grupos e nos fatores prognósticos.",
 blocos:"Dentro de cada bloco, metade vai para cada grupo: os tamanhos ficam semelhantes durante todo o recrutamento. Com bloco de tamanho fixo e conhecido, o fim de cada bloco fica previsível. Por isso se usam blocos de tamanho variável e oculto.",
 estrat:"Um sorteio separado, em blocos, dentro de cada estrato prognóstico. Aqui os estratos combinam gravidade e idade; o diabetes continua por conta do acaso.",
 minim:"Cada paciente vai para o grupo que deixa os fatores mais equilibrados, com um componente aleatório (aqui, em 80% das vezes). Equilibra vários fatores ao mesmo tempo, mesmo em estudos pequenos.",
 congl:"O sorteio é de grupos inteiros: aqui, UBS com 10 pacientes cada. Serve quando a intervenção é coletiva. Com poucas unidades sorteadas, os grupos podem sair bem diferentes, e na unidade todos sabem o que ela recebeu."};
/* pacientes chegam em sequência; cada UBS (10 pacientes seguidos) tem a sua própria proporção de graves */
function rdPatients(n,r){const P=[];let pg=.3;for(let k=0;k<n;k++){if(k%10===0)pg=.08+.44*r();P.push({g:r()<pg?1:0,i:r()<.4?1:0,d:r()<.25?1:0});}return P;}
function rdAlloc(m,P,r,blk){const n=P.length,arm=new Array(n),bid=new Array(n).fill(0);
  const block=sz=>{const b=sz==="var"?[2,4,6][Math.floor(r()*3)]:+sz,a=[];for(let i=0;i<b;i++)a.push(i<b/2?1:0);return shuffle(a,r);};
  if(m==="simples")for(let k=0;k<n;k++)arm[k]=r()<.5?1:0;
  else if(m==="blocos"){let cur=[],b=0;for(let k=0;k<n;k++){if(!cur.length){cur=block(blk);b++;}arm[k]=cur.pop();bid[k]=b;}}
  else if(m==="estrat"){const S={};for(let k=0;k<n;k++){const key=P[k].g*2+P[k].i;if(!S[key]||!S[key].length)S[key]=block(4);arm[k]=S[key].pop();}}
  else if(m==="minim"){const c=[{g:[0,0],i:[0,0],d:[0,0]},{g:[0,0],i:[0,0],d:[0,0]}];
    for(let k=0;k<n;k++){const p=P[k],sc=a=>["g","i","d"].reduce((t,f)=>t+Math.abs(c[a][f][p[f]]+1-c[1-a][f][p[f]]),0),s1=sc(1),s0=sc(0);
      const best=s1<s0?1:s0<s1?0:(r()<.5?1:0),a=s1===s0?best:(r()<.8?best:1-best);arm[k]=a;["g","i","d"].forEach(f=>c[a][f][p[f]]++);}}
  else{const nc=Math.ceil(n/10),ca=[];for(let j=0;j<nc;j++)ca.push(j<Math.floor(nc/2)?1:0);if(nc%2)ca[nc-1]=r()<.5?1:0;shuffle(ca,r);for(let k=0;k<n;k++){arm[k]=ca[Math.floor(k/10)];bid[k]=Math.floor(k/10)+1;}}
  return{arm,bid};}
function rdStats(P,arm,k){const o={n:[0,0],g:[0,0],i:[0,0],d:[0,0]};for(let j=0;j<k;j++){const a=arm[j];o.n[a]++;o.g[a]+=P[j].g;o.i[a]+=P[j].i;o.d[a]+=P[j].d;}return o;}
/* Para quem vê a sequência (estudo aberto): [acerto de quem aposta sempre no grupo que está atrás, proporção de alocações que eram uma certeza] */
function rdAcc(m,blk){const key=m+blk;if(RD.acc[key])return RD.acc[key];if(m==="simples")return RD.acc[key]=[.5,0];
  const r=rng(991),n=6000,P=rdPatients(n,r),{arm,bid}=rdAlloc(m,P,r,blk);let ok=0,sure=0;const T={},fix=m==="blocos"&&blk!=="var";
  for(let k=0;k<n;k++){const key2=fix?"b"+bid[k]:m==="estrat"?"s"+(P[k].g*2+P[k].i):m==="congl"?"c"+bid[k]:"t",t=T[key2]||(T[key2]=[0,0]);
    if(m==="congl"){const seen=t[0]+t[1]>0;ok+=seen?1:.5;if(seen)sure++;}
    else{ok+=t[1]===t[0]?.5:(t[1]<t[0]?1:0)===arm[k]?1:0;
      /* certeza: no bloco de tamanho conhecido, quando um grupo já completou a sua metade; com tamanho oculto (2, 4 ou 6), só depois de três seguidas para o mesmo lado */
      const d=Math.abs(t[1]-t[0]),half=fix?+blk/2:2,inb=fix?Math.max(t[0],t[1]):0;
      if(fix?inb===half:m==="estrat"?((t[0]+t[1])%4>=2&&d===(4-(t[0]+t[1])%4)):m==="blocos"?d===3:false)sure++;}
    t[arm[k]]++;}
  return RD.acc[key]=[ok/n,sure/n];}
function rdMake(){RD.P=rdPatients(200,rng(RD.seed*7717+11));const a=rdAlloc(RD.m,RD.P.slice(0,RD.n),rng(RD.seed*31+7),RD.blk);RD.arm=a.arm;RD.bid=a.bid;RD.k=Math.min(RD.k,RD.n);}
function rdSim(){const N=RD.simN,T=1000,out=[];RD_M.forEach(([m,name],mi)=>{const r=rng(4242+mi*17+N),h=new Array(21).fill(0);let sa=0,big=0,sz=0;
    for(let t=0;t<T;t++){const P=rdPatients(N,r),{arm}=rdAlloc(m,P,r,"4"),s=rdStats(P,arm,N),d=s.n[1]&&s.n[0]?(s.g[1]/s.n[1]-s.g[0]/s.n[0])*100:100;
      sa+=Math.abs(d);if(Math.abs(d)>10)big++;sz+=Math.abs(s.n[1]-s.n[0]);h[clamp(Math.round(d/5)+10,0,20)]++;}
    out.push({name,h,mean:sa/T,big:big/T,sz:sz/T});});RD.sim={N,out};}
LAB("rand","Experimentais","Randomização",`
<div class="intro"><span class="eyebrow">Experimentais · formas de randomizar</span><h2>Sortear bem é mais do que jogar uma moeda</h2><p>O sorteio precisa ser imprevisível e deixar os grupos comparáveis. Recrute os pacientes um a um, troque o método e veja o que cada um garante.</p></div>
<div class="grid two">
 <div class="card wide"><div class="card-h"><h3>Recrute paciente por paciente</h3><button class="more-btn" data-learn="rand">Saiba mais</button></div>
  <div class="chips" id="rdM"></div>
  <div id="rdBW" style="margin-top:8px"><div class="seg" id="rdB"><button data-v="4">Blocos de 4</button><button data-v="6">Blocos de 6</button><button data-v="var">Tamanho variável e oculto</button></div></div>
  <p class="lede" id="rdTxt" style="margin-top:10px"></p>
  <div class="row"><button class="btn small primary" id="rd1">+1 paciente</button><button class="btn small" id="rd10">+10</button><button class="btn small" id="rdAll">Completar</button><button class="btn small" id="rd0">Recomeçar</button><button class="btn small" id="rdNew">Outros pacientes</button></div>
  <div class="range" style="max-width:420px;margin-top:8px"><label for="rdN">Tamanho do ensaio</label><output id="rdNo"></output><input type="range" id="rdN" min="20" max="200" step="20" value="60"></div>
  <div class="sub">Sequência de alocação</div>
  <div class="seqs" id="rdSeq" aria-live="polite"></div>
  <div class="key" id="rdKey"></div>
  <div class="cols2" style="margin-top:14px">
   <div><div class="sub">Quem está na frente durante o recrutamento</div><svg class="ch" id="rdRun" role="img" aria-label="Diferença de tamanho entre os grupos ao longo do recrutamento"></svg></div>
   <div><div class="sub">Os grupos ficaram parecidos?</div><div class="bal" id="rdBal"></div></div>
  </div>
  <div class="sub" style="margin-top:16px">Dá para adivinhar a próxima alocação?</div>
  <p class="lede">Em um estudo aberto, quem recruta vê para onde foi cada paciente. Tente adivinhar para onde vai o próximo.</p>
  <div class="row"><button class="btn small" id="rdG1">Aposto em Intervenção</button><button class="btn small" id="rdG0">Aposto em Controle</button><span class="score" id="rdGs"></span></div>
  <div class="tiles" id="rdTiles" style="margin-top:12px"></div><div class="insight" id="rdIns"></div></div>
 <div class="card wide"><div class="card-h"><h3>E se quem recruta souber a próxima alocação?</h3><button class="more-btn" data-learn="sigilo">Saiba mais</button></div>
  <p class="lede">O sorteio pode ser perfeito e o ensaio sair enviesado, se a sequência não estiver escondida. Aqui o tratamento não tem efeito algum, e 40% dos pacientes são graves.</p>
  <div class="cols2"><div class="stack">
   <div class="range"><label for="rdQ">Alocações que o recrutador consegue prever</label><output id="rdQo"></output><input type="range" id="rdQ" min="0" max="100" step="5" value="30"></div>
   <div><div class="sub">Quando ele sabe a próxima, o que faz?</div><div class="seg" id="rdDir"><button data-v="bem">Guarda a vaga do tratamento novo para os leves</button><button data-v="grave">Guarda para os mais graves</button></div></div>
   <div class="tiles" id="rdQT"></div>
  </div><div><div class="grps" id="rdQG"></div><div class="key" id="rdQK"></div></div></div>
  <div class="insight" id="rdQI"></div></div>
 <div class="card wide"><div class="card-h"><h3>Mil ensaios com cada método</h3><button class="more-btn" data-learn="rand">Saiba mais</button></div>
  <p class="lede">Um sorteio só não mostra o que o método garante. Aqui cada método sorteia mil ensaios do mesmo tamanho. O gráfico mostra a diferença na proporção de graves entre os grupos.</p>
  <div class="playrow"><div class="range" style="max-width:420px"><label for="rdSN">Participantes em cada ensaio</label><output id="rdSNo"></output><input type="range" id="rdSN" min="20" max="400" step="20" value="60"></div><button class="btn small primary" id="rdSGo">Simular de novo</button></div>
  <svg class="ch" id="rdSim" style="margin-top:10px" role="img" aria-label="Distribuição da diferença de graves entre os grupos em mil ensaios, por método"></svg>
  <div class="insight" id="rdSI"></div></div>
</div>`,()=>{rdMake();
  chips($("rdM"),RD_M.map(m=>m[1]),i=>{RD.m=RD_M[i][0];RD.bet={ok:0,n:0};rdMake();renderRD();},0);
  segBind($("rdB"),RD.blk,v=>{RD.blk=v;RD.bet={ok:0,n:0};rdMake();renderRD();});
  const add=k=>{RD.k=Math.min(RD.n,RD.k+k);renderRD();};$("rd1").onclick=()=>add(1);$("rd10").onclick=()=>add(10);$("rdAll").onclick=()=>add(RD.n);
  $("rd0").onclick=()=>{RD.k=0;RD.bet={ok:0,n:0};renderRD();};$("rdNew").onclick=()=>{RD.seed++;RD.bet={ok:0,n:0};rdMake();renderRD();};
  $("rdN").oninput=e=>{RD.n=+e.target.value;rdMake();renderRD();};
  const bet=a=>{if(RD.k>=RD.n)return;RD.bet.n++;if(RD.arm[RD.k]===a)RD.bet.ok++;RD.k++;renderRD();};$("rdG1").onclick=()=>bet(1);$("rdG0").onclick=()=>bet(0);
  $("rdQ").oninput=e=>{RD.q=+e.target.value;renderRDQ();};segBind($("rdDir"),RD.dir,v=>{RD.dir=v;renderRDQ();});
  $("rdSN").oninput=e=>{RD.simN=+e.target.value;$("rdSNo").textContent=RD.simN;};$("rdSN").onchange=()=>{rdSim();renderRDS();};$("rdSGo").onclick=()=>{rdSim();renderRDS();};
  rdSim();
},()=>{renderRD();renderRDQ();renderRDS();});
function renderRD(){const {P,arm,bid,k,n,m}=RD,s=rdStats(P,arm,k),clu=m==="congl",blo=m==="blocos";
  $("rdBW").hidden=!blo;$("rdTxt").textContent=RD_TXT[m];$("rdNo").textContent=n+" pacientes";
  let h="";for(let j=0;j<k;j++)h+=`<i class="a${arm[j]}${P[j].g?" sq":""}${j&&(blo||clu)&&bid[j]!==bid[j-1]&&!(blo&&RD.blk==="var")?" brk":""}${j===k-1?" new":""}">${arm[j]?"I":"C"}</i>`;
  if(k<n)h+=`<span class="q">?</span>`;$("rdSeq").innerHTML=h||`<span class="mini">Nenhum paciente ainda.</span>`;
  const sk=(cls,t)=>`<span><span class="seqs" style="display:inline-flex;min-height:0"><i class="${cls}" style="width:14px;height:14px"></i></span>${t}</span>`;
  $("rdKey").innerHTML=sk("a1","intervenção")+sk("","controle")+sk("sq","paciente grave")+(blo&&RD.blk!=="var"?"<span>espaço: novo bloco</span>":clu?"<span>espaço: outra UBS</span>":"");
  // quem está na frente
  const el=$("rdRun"),H=130,W=box(el,H),L=30,Rm=10,T=10,ih=H-T-28,iw=W-L-Rm;let run=[0],mx=4;for(let j=0;j<k;j++){run.push(run[j]+(arm[j]?1:-1));mx=Math.max(mx,Math.abs(run[j+1]));}
  const X=v=>L+v/n*iw,Y=v=>T+ih/2-v/mx*(ih/2);let sv=yGrid(Y,[-mx,0,mx],L,W-Rm,v=>(v>0?"+":"")+v)+`<line x1="${L}" x2="${W-Rm}" y1="${Y(0)}" y2="${Y(0)}" stroke="var(--tick)"/>`;
  if(k)sv+=`<path d="${run.map((v,j)=>(j?"L":"M")+X(j).toFixed(1)+","+Y(v).toFixed(1)).join("")}" fill="none" stroke="var(--accent)" stroke-width="2"/><circle cx="${X(k)}" cy="${Y(run[k])}" r="4" fill="var(--accent)"/>`;
  sv+=xAxis(X,[0,n/2,n],T+ih,v=>v,L,W-Rm)+`<text x="${L+4}" y="${T+9}" style="font-size:10.5px">intervenção à frente</text><text x="${L+4}" y="${T+ih-4}" style="font-size:10.5px">controle à frente</text>`;el.innerHTML=sv;
  // equilíbrio
  const pr=(a,f)=>s.n[a]?s[f][a]/s.n[a]:NaN,tot=Math.max(1,s.n[0],s.n[1]);
  $("rdBal").innerHTML=`<div class="r"><span>Tamanho</span><div class="pair">${pairBar(s.n[1]/tot,"var(--exp)")}${pairBar(s.n[0]/tot,"var(--nex)")}</div><b>${s.n[1]} × ${s.n[0]}</b></div>`+RD_F.map(([f,name])=>{const a=pr(1,f),b=pr(0,f);return `<div class="r"><span>${name}</span><div class="pair">${pairBar(a,"var(--exp)")}${pairBar(b,"var(--nex)")}</div><b>${has(a)?pct(a,0):"—"} × ${has(b)?pct(b,0):"—"}<small>${has(a)&&has(b)?fmt(Math.abs(a-b)*100,0)+" p.p. de diferença":""}</small></b></div>`;}).join("");
  const worst=Math.max(...RD_F.map(([f])=>{const a=pr(1,f),b=pr(0,f);return has(a)&&has(b)?Math.abs(a-b)*100:0;})),[acc,sure]=rdAcc(m,RD.blk);
  $("rdGs").textContent=RD.bet.n?`Seus palpites: ${RD.bet.ok} de ${RD.bet.n} certos`:"";$("rdG1").disabled=$("rdG0").disabled=k>=n;
  $("rdTiles").innerHTML=tile("Intervenção × controle",`${s.n[1]} × ${s.n[0]}`,`${k} de ${n} recrutados`)+tile("Maior diferença entre os grupos",k?fmt(worst,0)+" p.p.":"—","entre os três fatores",worst>15?"bad":"")+tile("Alocações que eram uma certeza",pct(sure,0),"para quem vê a sequência",sure>.1?"bad":"good")+tile("Quem aposta no grupo que está atrás acerta",pct(acc,0),"em uma sequência longa",acc>.6?"alt":"good");
  $("rdIns").className="insight"+(sure>.1?" warn":"");
  $("rdIns").innerHTML=m==="simples"?"No sorteio simples, nenhuma estratégia de palpite passa de 50%: é o método mais imprevisível. O preço é o risco de grupos desiguais, que você vê nas barras, sobretudo com poucos pacientes."
   :blo?(RD.blk==="var"?`Com blocos de tamanho variável e oculto, os grupos seguem equilibrados no tamanho e quase nenhuma alocação é uma certeza (${pct(sure,0)}, contra um terço nos blocos fixos de 4). Quem observa a contagem ainda acerta mais que a moeda: por isso, além de variar o bloco, a sequência precisa ficar escondida de quem recruta.`:`Com blocos de ${RD.blk} conhecidos, a última alocação de cada bloco é uma certeza, e às vezes as anteriores também: ${pct(sure,0)} das alocações podem ser deduzidas por quem vê a sequência. Experimente o tamanho variável e oculto.`)
   :m==="estrat"?"Graves e idosos ficam divididos quase meio a meio em qualquer tamanho de ensaio. O diabetes, que não entrou nos estratos, continua oscilando. Dentro de cada estrato o sorteio é em blocos, com a mesma previsibilidade."
   :m==="minim"?"Os três fatores ficam equilibrados ao mesmo tempo, o que a estratificação não consegue com muitos fatores. O componente aleatório existe para que a próxima alocação não seja uma certeza."
   :"Depois do primeiro paciente de cada UBS, todos os outros são previsíveis: a unidade inteira recebe a mesma coisa. E como cada UBS tem um perfil próprio, sortear poucas unidades pode deixar os grupos bem diferentes.";}
function renderRDQ(){const q=RD.q/100,base=40*(1-q),gI=Math.round(RD.dir==="bem"?base:base+100*q),gC=Math.round(RD.dir==="bem"?base+100*q:base),ev=g=>Math.round(g*.5+(100-g)*.1),eI=ev(gI),eC=ev(gC),rr=eI/eC;
  $("rdQo").textContent=RD.q+"%";
  const mk=(g,e,a)=>{const eg=Math.round(g*.5),P=[];for(let j=0;j<g;j++)P.push({e:a,d:j<eg?1:0,sq:true});for(let j=0;j<100-g;j++)P.push({e:a,d:j<e-eg?1:0});return P;};
  $("rdQG").innerHTML=grp("Intervenção",`${gI}% graves · ${eI} desfechos`,dotSVG(mk(gI,eI,1),10))+grp("Controle",`${gC}% graves · ${eC} desfechos`,dotSVG(mk(gC,eC,0),10));
  $("rdQK").innerHTML=keyDot({e:1,d:0,sq:true},"grave")+keyDot({e:1,d:0},"leve")+keyDot({e:1,d:1},"teve o desfecho");
  $("rdQT").innerHTML=tile("Graves na intervenção",gI+"%")+tile("Graves no controle",gC+"%")+tile("RR observado",rat(rr),"",Math.abs(rr-1)>.12?"bad":"acc")+tile("RR verdadeiro","1,00","o tratamento não faz nada");
  $("rdQI").className="insight"+(Math.abs(rr-1)>.12?" warn":"");
  $("rdQI").innerHTML=!RD.q?"Com a sequência escondida, quem recruta não tem como escolher o paciente de cada vaga. Os grupos saem comparáveis e o RR fica em 1,00. O sigilo de alocação é sempre possível: central telefônica, sistema web ou envelopes opacos, selados e numerados."
   :RD.dir==="bem"?`Sabendo que a próxima vaga é do tratamento novo, o recrutador chama um paciente leve; se é do controle, um grave. Com ${RD.q}% das alocações previstas, um tratamento inútil parece reduzir o risco em ${fmt((1-rr)*100,0)}%. É <b>viés de seleção</b>, e nenhum mascaramento posterior conserta. Para comparar: em estudo aberto, blocos fixos de 4 deixam cerca de um terço das alocações previsíveis.`
   :`Por compaixão, o recrutador guarda as vagas do tratamento novo para os mais graves. O grupo intervenção fica com pior prognóstico e um tratamento inútil parece <b>aumentar</b> o risco em ${fmt((rr-1)*100,0)}%. O viés de seleção pode ir para qualquer lado.`;}
function renderRDS(){const S=RD.sim;if(!S)return;$("rdSNo").textContent=RD.simN;const el=$("rdSim"),rh=64,T=4,H=T+S.out.length*rh+30,W=box(el,H),L=10,Rm=10,iw=W-L-Rm,X=v=>L+(v+52.5)/105*iw,bw=iw/21,mxh=Math.max(...S.out.flatMap(o=>o.h));let s="";
  s+=`<line x1="${X(0)}" x2="${X(0)}" y1="${T+16}" y2="${T+S.out.length*rh}" stroke="var(--tick)" stroke-dasharray="4 3"/>`;
  S.out.forEach((o,i)=>{const y0=T+i*rh,yb=y0+rh-6;s+=`<text x="${L}" y="${y0+12}" class="lbl" style="font-size:12.5px">${o.name}</text><text x="${W-Rm}" y="${y0+12}" text-anchor="end" style="font-size:11.5px">média ${fmt(o.mean,1)} p.p. · acima de 10: ${pct(o.big,0)}</text><line class="gr" x1="${L}" x2="${W-Rm}" y1="${yb}" y2="${yb}"/>`;
    o.h.forEach((c,b)=>{if(!c)return;const hh=c/mxh*(rh-26);s+=`<rect x="${L+b*bw+.5}" y="${yb-hh}" width="${Math.max(1,bw-1)}" height="${hh}" fill="${Math.abs(b-10)>2?"var(--alt)":"var(--accent)"}"/>`;});});
  s+=xAxis(X,[-50,-25,0,25,50],T+S.out.length*rh,v=>(v>0?"+":"")+v,L,W-Rm)+`<text x="${W-Rm}" y="${H-1}" text-anchor="end" style="font-size:11px">diferença de graves: intervenção − controle (p.p.)</text>`;el.innerHTML=s;
  const sp=S.out[0],st=S.out[2],cl=S.out[4];
  $("rdSI").innerHTML=`Todos os métodos acertam <b>em média</b>: as distribuições ficam centradas no zero. O que muda é a largura. Com ${S.N} participantes, o sorteio simples erra em média ${fmt(sp.mean,1)} p.p. na proporção de graves; os blocos igualam o tamanho dos grupos, mas não a gravidade (${fmt(S.out[1].mean,1)}); a estratificação por gravidade erra ${fmt(st.mean,1)}; o sorteio por conglomerados, ${fmt(cl.mean,1)}, porque são só ${Math.ceil(S.N/10)} unidades sorteadas. Aumente o tamanho do ensaio e veja o sorteio simples se resolver sozinho.`;}
