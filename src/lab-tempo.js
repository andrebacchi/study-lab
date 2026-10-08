/* ===================== LINHA DO TEMPO: a mesma população vista por cada desenho ===================== */
const TP={des:"coorte",ef:1,step:0,seed:11,reveal:false,el:[],P:[],rank:[]};
const TP_DES=[["serie","Série de casos"],["transversal","Transversal"],["ecologico","Ecológico"],["cc","Caso-controle"],["coorte","Coorte"],["ecr","Ensaio clínico"]];
const TP_EF=["Sem efeito","Efeito moderado","Efeito forte"];
/* 120 pessoas em 6 municípios de 20. Expostos por município e casos (entre expostos e entre não expostos) para cada força de efeito.
   Somam 48 expostos; casos entre expostos: 6, 12 ou 24 (risco de 12,5%, 25% ou 50%); entre não expostos: 9 de 72 (12,5%). */
const EG=[2,4,6,8,12,16],CE=[[0,1,1,1,1,2],[0,1,1,2,3,5],[1,2,3,4,6,8]],CU=[[2,2,2,2,1,0],[2,2,2,1,1,1],[2,2,2,2,1,0]],TRIAL=[12,6,3];
function tpWorld(){const r=rng(TP.seed*7919+TP.ef*13+1),P=[];
  for(let g=0;g<6;g++){const st=P.length;for(let j=0;j<20;j++)P.push({id:st+j,g,e:j<EG[g]?1:0,d:0,t:r()});
    shuffle(P.slice(st).filter(p=>p.e===1),r).slice(0,CE[TP.ef][g]).forEach(p=>p.d=1);
    shuffle(P.slice(st).filter(p=>p.e===0),r).slice(0,CU[TP.ef][g]).forEach(p=>p.d=1);}
  const ord=shuffle(P.map(p=>p.id),r);TP.rank=[];ord.forEach((id,k)=>TP.rank[id]=k);
  // ensaio: sorteio de 60 para cada braço; 12 eventos no controle e 12, 6 ou 3 na intervenção
  const sh=shuffle(P.map(p=>p.id),r);sh.forEach((id,k)=>{P[id].arm=k<60?1:0;P[id].dT=0;});
  shuffle(P.filter(p=>p.arm===1),r).slice(0,TRIAL[TP.ef]).forEach(p=>p.dT=1);shuffle(P.filter(p=>p.arm===0),r).slice(0,12).forEach(p=>p.dT=1);
  // caso-controle: todos os casos e o mesmo número de controles, que representam a exposição de quem não adoeceu
  const cases=P.filter(p=>p.d),nE=P.filter(p=>!p.d&&p.e),nU=P.filter(p=>!p.d&&!p.e),nC=cases.length,bE=Math.round(nC*nE.length/(nE.length+nU.length));
  P.forEach(p=>p.cc=p.d?"caso":null);shuffle(nE,r).slice(0,bE).forEach(p=>p.cc="ctrl");shuffle(nU,r).slice(0,nC-bE).forEach(p=>p.cc="ctrl");
  // transversal: amostra de dois terços de cada combinação; série: 8 dos casos
  [[1,1],[1,0],[0,1],[0,0]].forEach(([e,d])=>{const c=P.filter(p=>p.e===e&&p.d===d);shuffle(c,r).slice(0,Math.round(c.length*2/3)).forEach(p=>p.tv=true);});
  shuffle(cases.slice(),r).slice(0,8).forEach(p=>p.sr=true);
  TP.P=P;}
const tpIds=f=>TP.P.filter(f).map(p=>p.id).sort((x,y)=>TP.rank[x]-TP.rank[y]);
const n1=(n,s,p)=>`${n} ${n===1?s:p}`;
function tpSteps(){const P=TP.P,all=tpIds(()=>true),G=(label,sub,ids)=>({label,sub,ids}),cnt=f=>P.filter(f).length;
  if(TP.des==="coorte"||TP.des==="ecr"){const tr=TP.des==="ecr",e=p=>tr?p.arm:p.e,d=p=>tr?p.dT:p.d,L1=tr?"Intervenção":"Expostos",L0=tr?"Controle":"Não expostos";
    const E=tpIds(p=>e(p)===1),U=tpIds(p=>e(p)===0),v={a:cnt(p=>e(p)&&d(p)),b:cnt(p=>e(p)&&!d(p)),c:cnt(p=>!e(p)&&d(p)),d:cnt(p=>!e(p)&&!d(p))},m=t22(v.a,v.b,v.c,v.d);
    return[
     {tab:"População em risco",title:tr?"Reúne participantes livres do desfecho":"Começa com pessoas livres do desfecho",text:tr?"Os participantes elegíveis ainda não tiveram o desfecho e ninguém recebeu a intervenção.":"Ninguém tem o desfecho ainda. Só assim dá para contar casos novos, isto é, a incidência.",rows:[[G(tr?"Participantes elegíveis":"População em risco","120 pessoas, nenhuma com o desfecho",all)]],look:()=>({e:null,d:0})},
     tr?{tab:"Sorteio",title:"O sorteio decide quem recebe a intervenção",text:"Quem define a exposição é o acaso, não o paciente nem o médico. Os dois grupos ficam comparáveis em média, inclusive no que ninguém mediu.",rows:[[G(L1,"60 sorteados",E),G(L0,"60 sorteados",U)]],look:p=>({e:p.arm,d:0})}
       :{tab:"Exposição",title:"Classifica pela exposição",text:"O pesquisador não escolhe quem se expõe: apenas observa e registra. Formam-se dois grupos.",rows:[[G(L1,fmt(E.length,0)+" pessoas",E),G(L0,fmt(U.length,0)+" pessoas",U)]],look:p=>({e:p.e,d:0})},
     {tab:"Seguimento",title:"Acompanha os dois grupos no tempo",text:"Os casos novos vão aparecendo. Como todos começaram livres do desfecho, a exposição veio antes.",rows:[[G(L1,n1(v.a,"caso novo","casos novos"),E),G(L0,n1(v.c,"caso novo","casos novos"),U)]],look:p=>({e:e(p),d:d(p)}),delay:true},
     {tab:"Tabela 2×2",title:"Conta os casos novos de cada grupo",text:tr?"Com a incidência nos dois braços, compara-se o risco de quem recebeu a intervenção com o do controle.":"Com a incidência em cada grupo, calcula-se o risco relativo.",
      rows:[[G(L1+", com desfecho","a = "+v.a,tpIds(p=>e(p)&&d(p))),G(L1+", sem desfecho","b = "+v.b,tpIds(p=>e(p)&&!d(p)))],[G(L0+", com desfecho","c = "+v.c,tpIds(p=>!e(p)&&d(p))),G(L0+", sem desfecho","d = "+v.d,tpIds(p=>!e(p)&&!d(p)))]],look:p=>({e:e(p),d:d(p)}),
      result:()=>{const rar=m.r0-m.r1;return `<div class="tiles">${tile(tr?"Risco na intervenção":"Incidência nos expostos",pct(m.r1,1),`${v.a} de ${v.a+v.b}`)}${tile(tr?"Risco no controle":"Incidência nos não expostos",pct(m.r0,1),`${v.c} de ${v.c+v.d}`)}${tile("Risco relativo (RR)",rat(m.rr),ciTxt(ciRR(v.a,v.b,v.c,v.d)),"acc")}${tr?tile("Redução absoluta (RAR)",fmt(rar*100,1)+" p.p.","risco no controle − na intervenção")+tile("NNT",rar>0?fmt(Math.ceil(1/rar-1e-9),0):"—",rar>0?"tratar para evitar 1 desfecho":"sem redução de risco"):tile("Risco atribuível (RA)",fmt(m.rd*100,1)+" p.p.","diferença entre as incidências")}</div>
       <div class="insight">${tr?"Mesma direção da coorte: da exposição para o desfecho. A diferença é quem definiu a exposição.":"A coorte parte da exposição e chega ao desfecho. Por isso mede incidência e calcula o RR diretamente."}</div><div class="row" style="margin-top:10px">${lab22(v,tr?"ensaio":"coorte")}</div>`;}}];}
  if(TP.des==="cc"){const cs=tpIds(p=>p.cc==="caso"),ct=tpIds(p=>p.cc==="ctrl"),out=tpIds(p=>!p.cc),v={a:cnt(p=>p.cc==="caso"&&p.e),b:cnt(p=>p.cc==="ctrl"&&p.e),c:cnt(p=>p.cc==="caso"&&!p.e),d:cnt(p=>p.cc==="ctrl"&&!p.e)},m=t22(v.a,v.b,v.c,v.d),O=G("Fora do estudo",out.length+" pessoas",out),lk=(p,ex)=>({e:ex&&p.cc?p.e:null,d:p.d,off:!p.cc});
    return[
     {tab:"Desfecho",title:"O desfecho já aconteceu",text:"O estudo começa depois dos fatos. Na população de origem, algumas pessoas já adoeceram.",rows:[[G("População de origem",`${cs.length} pessoas com o desfecho`,all)]],look:p=>({e:null,d:p.d})},
     {tab:"Casos e controles",title:"Seleciona as pessoas pelo desfecho",text:`Entram todos os casos e ${ct.length} controles, que não tiveram o desfecho. Quem decide quantos controles entram é o pesquisador.`,rows:[[G("Casos",cs.length+" pessoas",cs),G("Controles",ct.length+" pessoas",ct)],[O]],look:p=>lk(p,false)},
     {tab:"Exposição passada",title:"Olha para trás: quem estava exposto?",text:"Entrevistas ou prontuários reconstroem a exposição passada de casos e controles.",rows:[[G("Casos",`${v.a} expostos, ${v.c} não`,cs),G("Controles",`${v.b} expostos, ${v.d} não`,ct)],[O]],look:p=>lk(p,true)},
     {tab:"Tabela 2×2",title:"Compara a exposição de casos e controles",text:"As colunas da tabela foram fixadas pelo pesquisador. Por isso não há incidência nem RR: a medida é a razão de chances.",
      rows:[[G("Casos expostos","a = "+v.a,tpIds(p=>p.cc==="caso"&&p.e)),G("Controles expostos","b = "+v.b,tpIds(p=>p.cc==="ctrl"&&p.e))],[G("Casos não expostos","c = "+v.c,tpIds(p=>p.cc==="caso"&&!p.e)),G("Controles não expostos","d = "+v.d,tpIds(p=>p.cc==="ctrl"&&!p.e))],[O]],look:p=>lk(p,true),
      result:()=>`<div class="tiles">${tile("Chance de exposição nos casos",rat(v.a/v.c),`${v.a} ÷ ${v.c}`)}${tile("Chance de exposição nos controles",rat(v.b/v.d),`${v.b} ÷ ${v.d}`)}${tile("Razão de chances (OR)",rat(m.or),ciTxt(ciOR(v.a,v.b,v.c,v.d)),"acc")}${tile("Risco relativo",`<span class="strike">RR</span>`,"não se calcula aqui","muted")}</div>
       <div class="insight">O caso-controle inverte a direção: parte do desfecho e investiga a exposição. Veja em <button class="lnk" data-nav="cc" style="border:0;background:none;padding:0">Caso-controle</button> por que o RR não funciona.</div><div class="row" style="margin-top:10px">${lab22(v,"caso_controle")}</div>`}];}
  if(TP.des==="transversal"){const S=tpIds(p=>p.tv),out=tpIds(p=>!p.tv),O=G("Fora da amostra",out.length+" pessoas",out),f=(e,d)=>p=>p.tv&&p.e===e&&p.d===d,v={a:cnt(f(1,1)),b:cnt(f(1,0)),c:cnt(f(0,1)),d:cnt(f(0,0))},m=t22(v.a,v.b,v.c,v.d);
    return[
     {tab:"População",title:"Define a população",text:"Uma população delimitada: os moradores de um bairro, os alunos de uma escola.",rows:[[G("População definida","120 pessoas",all)]],look:()=>({e:null,d:null})},
     {tab:"Amostra",title:"Sorteia uma amostra",text:"Uma amostra representativa é sorteada. Ainda não se sabe nada sobre exposição ou desfecho.",rows:[[G("Amostra",S.length+" pessoas",S)],[O]],look:p=>({e:null,d:null,off:!p.tv})},
     {tab:"Uma visita",title:"Mede exposição e desfecho na mesma visita",text:"As duas informações chegam juntas, como numa foto. O estudo encontra casos existentes (prevalência), não casos novos.",rows:[[G("Amostra",`${v.a+v.c} com o desfecho`,S)],[O]],look:p=>p.tv?{e:p.e,d:p.d}:{e:null,d:null,off:true}},
     {tab:"Tabela 2×2",title:"Compara as prevalências",text:"A conta é a mesma do RR, mas com casos existentes: o resultado é a razão de prevalências.",
      rows:[[G("Expostos, com desfecho","a = "+v.a,tpIds(f(1,1))),G("Expostos, sem desfecho","b = "+v.b,tpIds(f(1,0)))],[G("Não expostos, com desfecho","c = "+v.c,tpIds(f(0,1))),G("Não expostos, sem desfecho","d = "+v.d,tpIds(f(0,0)))],[O]],look:p=>p.tv?{e:p.e,d:p.d}:{e:null,d:null,off:true},
      result:()=>`<div class="tiles">${tile("Prevalência nos expostos",pct(m.r1,1),`${v.a} de ${v.a+v.b}`)}${tile("Prevalência nos não expostos",pct(m.r0,1),`${v.c} de ${v.c+v.d}`)}${tile("Razão de prevalências (RP)",rat(m.rr),ciTxt(ciRR(v.a,v.b,v.c,v.d)),"acc")}</div>
       <div class="insight warn">A foto não mostra o que veio antes. Com exposição e desfecho medidos juntos, não há como garantir que a exposição precedeu o desfecho.</div><div class="row" style="margin-top:10px">${lab22(v,"transversal")}</div>`}];}
  if(TP.des==="ecologico"){const nm="ABCDEF",gs=[0,1,2,3,4,5].map(g=>({g,ids:tpIds(p=>p.g===g),pe:EG[g]/20,rate:cnt(p=>p.g===g&&p.d)/20})),rows=s=>[0,2,4].map(i=>[gs[i],gs[i+1]].map(x=>G("Município "+nm[x.g],s?`${pct(x.pe,0)} expostos · ${fmt(x.rate*100,0)} casos por 100`:"20 pessoas",x.ids)));
    return[
     {tab:"Grupos",title:"A unidade de análise é o grupo",text:"As mesmas 120 pessoas, agora vistas como seis municípios. O estudo não vai olhar para nenhuma delas individualmente.",rows:rows(false),look:()=>({e:null,d:null})},
     {tab:"Medidas do grupo",title:"Mede exposição e desfecho de cada grupo",text:"De cada município chegam dois números, em geral de bases de dados já existentes: a proporção de expostos e a taxa do desfecho.",rows:rows(true),look:()=>({e:null,d:null})},
     {tab:"Comparação",title:"Compara os grupos entre si",text:"Cada município vira um ponto. Não há tabela 2×2: ninguém sabe se os casos de um município estavam entre os expostos.",rows:rows(true),look:p=>TP.reveal?{e:p.e,d:p.d}:{e:null,d:null},
      result:()=>`<svg class="ch" id="tpEco" style="max-width:640px" role="img" aria-label="Taxa do desfecho por proporção de expostos em cada município"></svg>
       <div class="insight warn">O gráfico diz o que acontece com os municípios, não com as pessoas. Concluir sobre indivíduos a partir dele é a falácia ecológica.</div>
       <div class="row" style="margin-top:10px"><button class="btn small" id="tpRev">${TP.reveal?"Esconder as pessoas":"Revelar as pessoas (o estudo não vê isto)"}</button><button class="btn small" data-nav="eco">Ir para Ecológico ›</button></div>`,
      after:()=>{const el=$("tpEco");if(!el)return;const H=200,W=box(el,H),L=40,Rm=14,T=24,ih=H-T-34,iw=W-L-Rm,X=v=>L+v*iw,ym=Math.max(.2,...gs.map(x=>x.rate))*1.25,Y=v=>T+ih-v/ym*ih;
        let s=yGrid(Y,[0,.1,.2,.3,.4,.5].filter(t=>t<=ym),L,W-Rm,v=>fmt(v*100,0))+xAxis(X,[0,.25,.5,.75,1],T+ih,v=>pct(v,0),L,W-Rm);
        gs.forEach(x=>s+=`<circle cx="${X(x.pe)}" cy="${Y(x.rate)}" r="9" fill="var(--accent)"/><text x="${X(x.pe)}" y="${Y(x.rate)+4}" text-anchor="middle" style="fill:var(--on-accent);font-size:11px;font-weight:600">${nm[x.g]}</text>`);
        s+=`<text x="${W-Rm}" y="${H-1}" text-anchor="end" style="font-size:11px">expostos no município</text><text x="${L}" y="10" style="font-size:11px">casos por 100 pessoas</text>`;el.innerHTML=s;}}];}
  /* série de casos */
  const S=tpIds(p=>p.sr),out=tpIds(p=>!p.sr),k=cnt(p=>p.sr&&p.e),O=G("Resto da população","não foi observado",out);
  return[
   {tab:"Casos",title:"Pacientes com o desfecho chegam ao serviço",text:"Oito pacientes com a mesma condição incomum chamam a atenção da equipe. O estudo é feito só com eles.",rows:[[G("Casos atendidos","8 pacientes",S)],[O]],look:p=>p.sr?{e:null,d:1}:{e:null,d:null,off:true}},
   {tab:"Descrição",title:"Descreve cada caso em detalhe",text:`História, achados, tratamento, evolução. Na descrição aparece que ${k} dos 8 tinham a mesma exposição.`,rows:[[G("Casos atendidos",`${k} expostos, ${8-k} não`,S)],[O]],look:p=>p.sr?{e:p.e,d:1}:(TP.reveal?{e:p.e,d:p.d}:{e:null,d:null,off:true}),
    result:()=>`<div class="tiles">${tile("Expostos entre os casos",pct(k/8,0),`${k} de 8`,"acc")}${tile("Expostos na população",TP.reveal?"40%":"?",TP.reveal?"48 de 120":"ninguém mediu",TP.reveal?"":"muted")}</div>
     <div class="insight warn">${k} em 8 é muito? Sem grupo de comparação, não dá para saber. O relato levanta a hipótese; são os outros desenhos que a testam. Aqui não há tabela 2×2 nem medida de associação.</div>
     <div class="row" style="margin-top:10px"><button class="btn small" id="tpRev">${TP.reveal?"Esconder a população":"Revelar a população (o estudo não vê isto)"}</button></div>`}];}
/* esquema Exposição → Desfecho: onde o estudo começa e para onde olha */
function tpDiagram(){const el=$("tpDia"),H=92,W=box(el,H),bw=Math.min(118,(W-70)/2),bh=32,x1=W/2-bw-28,x2=W/2+28,y=8,cy=y+bh/2,d=TP.des,grp=d==="ecologico";let s="";
  const bx=(x,t,on,dash)=>`<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="7" fill="${on?"var(--ink)":"var(--surface)"}" stroke="${on?"var(--ink)":"var(--tick)"}" stroke-width="1.5" ${dash?'stroke-dasharray="4 3"':""}/><text x="${x+bw/2}" y="${cy+4.5}" text-anchor="middle" style="font-size:12.5px;font-weight:600;fill:${on?"var(--on-ink)":"var(--muted)"}">${t}</text>`;
  const pin=(x,t)=>`<path d="M${x} ${y+bh+4}l-5 8h10z" fill="var(--accent)"/><text x="${clamp(x,74,W-74)}" y="${y+bh+27}" text-anchor="middle" style="font-size:12px;fill:var(--accent);font-weight:600">${t}</text>`;
  const arrow=(dir)=>{const a=x1+bw+5,b=x2-5;return dir>0?`<path d="M${a} ${cy}H${b-7}" stroke="var(--fg)" stroke-width="2"/><path d="M${b} ${cy}l-9 -5v10z" fill="var(--fg)"/>`:`<path d="M${b} ${cy}H${a+7}" stroke="var(--exp)" stroke-width="2"/><path d="M${a} ${cy}l9 -5v10z" fill="var(--exp)"/>`;};
  const E=d==="ecr"?"Intervenção":"Exposição",D="Desfecho";
  if(d==="coorte"||d==="ecr")s=bx(x1,E,true)+bx(x2,D,false)+arrow(1)+pin(x1+bw/2,d==="ecr"?"começa aqui, com sorteio":"o estudo começa aqui");
  else if(d==="cc")s=bx(x1,E,false)+bx(x2,D,true)+arrow(-1)+pin(x2+bw/2,"o estudo começa aqui");
  else if(d==="serie")s=bx(x1,E,false,true)+bx(x2,D,true)+pin(x2+bw/2,"só há casos");
  else s=bx(x1,E,true)+bx(x2,D,true)+`<path d="M${x1+bw/2} ${y+bh+4}v7H${x2+bw/2}v-7" fill="none" stroke="var(--accent)" stroke-width="1.5"/><text x="${W/2}" y="${y+bh+27}" text-anchor="middle" style="font-size:12px;fill:var(--accent);font-weight:600">${grp?"medidas do grupo, não da pessoa":"medidos no mesmo momento"}</text>`;
  el.innerHTML=s;}
function tpLayout(rows){const st=$("tpStage"),W=st.clientWidth||320,gapX=18,pitch=clamp((W-gapX)/20,10,30),size=Math.max(6,Math.round(pitch-5)),capH=38,x0=Math.max(0,(W-20*pitch-gapX)/2);let y=0,caps="";
  rows.forEach(row=>{const two=row.length===2;let hmax=0;
    row.forEach((g,gi)=>{const cols=two?10:20,bx=x0+(two?gi*(10*pitch+gapX):0),w=cols*pitch+(two?0:gapX);
      caps+=`<div class="cap" style="transform:translate(${bx.toFixed(1)}px,${y}px);width:${w.toFixed(0)}px"><b>${g.label}</b><span>${g.sub||""}</span></div>`;
      const pc=two?pitch:(20*pitch+gapX)/20;
      g.ids.forEach((id,j)=>{const el=TP.el[id];el.style.width=el.style.height=size+"px";el.style.transform=`translate(${(bx+(j%cols)*pc+(pc-size)/2).toFixed(1)}px,${(y+capH+Math.floor(j/cols)*pitch+(pitch-size)/2).toFixed(1)}px)`;});
      hmax=Math.max(hmax,capH+Math.max(1,Math.ceil(g.ids.length/cols))*pitch);});
    y+=hmax+12;});
  st.style.height=y+"px";$("tpCaps").innerHTML=caps;}
function renderTP(){const steps=tpSteps();TP.step=clamp(TP.step,0,steps.length-1);const S=steps[TP.step],last=TP.step===steps.length-1,di=TP_DES.findIndex(d=>d[0]===TP.des);
  chipOn($("tpDes"),di);tpDiagram();
  $("tpBar").innerHTML=steps.map((s,i)=>`<button class="stp ${i===TP.step?"on":i<TP.step?"done":""}" data-s="${i}"><i>Passo ${i+1}</i><b>${s.tab}</b></button>`).join("");
  $("tpTxt").innerHTML=`<b class="t">${S.title}</b>${S.text}`;
  TP.P.forEach(p=>{const L=S.look(p),el=TP.el[p.id];el.style.transitionDelay=S.delay&&L.d?`0s,${(p.t*1.6).toFixed(2)}s,${(p.t*1.6).toFixed(2)}s,0s`:"";el.className=`e${L.e==null?"u":L.e} d${L.d==null?"u":L.d}${L.off?" off":""}`;});
  tpLayout(S.rows);
  $("tpNav").innerHTML=`<button class="btn small" id="tpPrev" ${TP.step?"":"disabled"}>‹ Voltar</button>${last?`<button class="btn small" id="tpAgain">Recomeçar</button>${di<TP_DES.length-1?`<button class="btn small primary" id="tpNextD">Próximo desenho: ${TP_DES[di+1][1]} ›</button>`:""}`:`<button class="btn small primary" id="tpNext">Próximo passo ›</button>`}`;
  $("tpRes").hidden=!S.result;$("tpRes").innerHTML=S.result?S.result():"";S.after&&S.after();
  $("tpEfW").hidden=TP.des==="serie";
  $("tpKey").innerHTML=(TP.des==="ecr"?keyDot({e:1,d:0},"intervenção")+keyDot({e:0,d:0},"controle"):keyDot({e:1,d:0},"exposto")+keyDot({e:0,d:0},"não exposto"))+keyDot({e:null,d:1},"com o desfecho")+keyDot({e:null,d:0},"sem o desfecho")+keyDot({e:null,d:null},"ainda não medido");}
LAB("tempo","Reconhecer","Linha do tempo",`
<div class="intro"><span class="eyebrow">Reconhecer · como cada desenho enxerga</span><h2>As mesmas 120 pessoas, vistas por seis desenhos de estudo</h2><p>Escolha o desenho e avance os passos. Repare em onde o estudo começa, o que ele mede primeiro e o que fica de fora.</p></div>
<div class="grid">
 <div class="card"><div class="card-h"><h3>Onde o estudo começa e para onde ele olha</h3><button class="more-btn" data-learn="tempo">Saiba mais</button></div>
  <div class="chips" id="tpDes"></div>
  <svg class="ch" id="tpDia" style="margin-top:12px;max-width:560px" role="img" aria-label="Direção do estudo entre exposição e desfecho"></svg>
  <div class="stepbar" id="tpBar"></div>
  <div class="tpw">
   <div class="steptxt" id="tpTxt" aria-live="polite"></div>
   <div class="tps"><div class="stage" id="tpStage" aria-hidden="true"><div id="tpCaps"></div></div><div class="key" id="tpKey"></div></div>
   <div class="stepnav" id="tpNav"></div>
   <div class="result" id="tpRes"></div>
  </div>
  <details class="fold"><summary>Mudar a população</summary>
   <div class="stack" style="margin-top:10px"><div id="tpEfW"><div class="sub">Efeito verdadeiro da exposição</div><div class="chips" id="tpEf"></div><p class="note">Na população, o risco de quem não se expõe é sempre 12,5%. O de quem se expõe é 12,5%, 25% ou 50%. No ensaio clínico, a intervenção mantém o risco, reduz pela metade ou reduz a um quarto.</p></div>
   <div class="row"><button class="btn small" id="tpNew">Sortear outra população</button></div></div></details>
 </div>
</div>`,()=>{
  const st=$("tpStage");for(let i=0;i<120;i++){const d=document.createElement("i");st.appendChild(d);TP.el.push(d);}
  tpWorld();
  chips($("tpDes"),TP_DES.map(d=>d[1]),i=>{TP.des=TP_DES[i][0];TP.step=0;TP.reveal=false;renderTP();},TP_DES.findIndex(d=>d[0]===TP.des));
  chips($("tpEf"),TP_EF,i=>{TP.ef=i;tpWorld();renderTP();},TP.ef);
  $("tpNew").onclick=()=>{TP.seed++;tpWorld();renderTP();};
  $("tpBar").addEventListener("click",e=>{const b=e.target.closest("[data-s]");if(b){TP.step=+b.dataset.s;renderTP();}});
  $("tpNav").addEventListener("click",e=>{const id=e.target.id;if(id==="tpNext")TP.step++;else if(id==="tpPrev")TP.step--;else if(id==="tpAgain")TP.step=0;else if(id==="tpNextD"){const i=TP_DES.findIndex(d=>d[0]===TP.des);TP.des=TP_DES[i+1][0];TP.step=0;}else return;TP.reveal=false;renderTP();});
  $("tpRes").addEventListener("click",e=>{if(e.target.id==="tpRev"){TP.reveal=!TP.reveal;renderTP();}const n=e.target.closest("[data-nav]");if(n)navGo(n.dataset.nav);});
},()=>renderTP());
