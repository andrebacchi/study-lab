/* ===================== TRÊS PERGUNTAS ===================== */
/* Quadro-resumo dos desenhos (Aula 10, resumo comparativo; quase-experimentais da Aula 12) */
const DES={
 serie:{n:"Relato ou série de casos",s:"descritivo",def:"Descreve em detalhe um ou vários pacientes com a mesma condição. Não há grupo de comparação.",unit:"Indivíduo",tempo:"Descrição da evolução",med:"Nenhuma (descritivo)",lim:"Sem comparação; não permite inferência causal"},
 transversal:{n:"Transversal",s:"observacional",def:"Exposição e desfecho são medidos no mesmo momento, em uma amostra de uma população definida.",unit:"Indivíduo",tempo:"Um momento",med:"Prevalência; razão de prevalências (RP)",lim:"Sem temporalidade; viés de prevalência"},
 ecologico:{n:"Ecológico",s:"observacional",def:"A unidade de análise é o grupo (município, estado, país), nunca o indivíduo.",unit:"Grupo",tempo:"Um momento ou série",med:"Correlação, regressão, razão de taxas",lim:"Falácia ecológica; confusão"},
 cc:{n:"Caso-controle",s:"observacional",def:"Seleciona as pessoas pelo desfecho (casos e controles) e investiga a exposição passada.",unit:"Indivíduo",tempo:"Do desfecho para a exposição passada",med:"Razão de chances (OR)",lim:"Viés de memória; escolha dos controles"},
 coorte:{n:"Coorte",s:"observacional",def:"Pessoas livres do desfecho são classificadas pela exposição e acompanhadas no tempo.",unit:"Indivíduo",tempo:"Da exposição para o desfecho",med:"Incidência; RR, HR",lim:"Custo, tempo, perdas de seguimento"},
 ecr:{n:"Ensaio clínico randomizado",s:"experimental",def:"O pesquisador define a exposição (a intervenção) por sorteio e acompanha os grupos.",unit:"Indivíduo ou conglomerado",tempo:"Prospectivo",med:"RR, HR, diferença de risco, NNT",lim:"Custo; ética; validade externa"},
 quase:{n:"Quase-experimental",s:"experimental",def:"Há intervenção controlada pelo pesquisador, mas a alocação não é aleatória.",unit:"Indivíduo ou grupo",tempo:"Antes e depois da intervenção",med:"Mudança antes e depois; comparação entre grupos",lim:"Sem sorteio: regressão à média, tendências e grupos diferentes"}};
const DES_ORD=["serie","transversal","ecologico","cc","coorte","ecr","quase"];
const TQ=[
 {q:"Quem decidiu a exposição?",o:[["sorteio","O pesquisador, por sorteio",["ecr"]],["sem","O pesquisador, sem sorteio",["quase"]],["vida","A vida, o paciente, o médico",["serie","transversal","ecologico","cc","coorte"]]]},
 {q:"Qual é a unidade de análise?",o:[["grupo","O grupo (município, estado, país)",["ecologico","ecr","quase"]],["ind","O indivíduo",["serie","transversal","cc","coorte","ecr","quase"]]]},
 {q:"Como o tempo entra no estudo?",o:[["mesmo","Exposição e desfecho no mesmo momento",["transversal"]],["frente","Parte da exposição e segue até o desfecho",["coorte","ecr","quase"]],["tras","Parte do desfecho e investiga a exposição passada",["cc"]],["semcomp","Só descreve casos, sem grupo de comparação",["serie"]]]}];
const T3={ans:[null,null,null]};
/* múltiplos icebergs: para cada tipo de pergunta, o desenho de referência é outro (Aula 10) */
const ICE=[
 {k:"Terapia e intervenção",q:"Este anti-hipertensivo evita AVC?",top:"Ensaio clínico randomizado",mid:["Coortes","Caso-controle e séries"],sub:["Dados de mundo real","Registros eletrônicos","Farmacovigilância"],
  li:["O ensaio randomizado é o desenho de referência: o sorteio equilibra, em média, confundidores conhecidos e desconhecidos.","Coortes entram quando o ensaio é inviável, antiético ou insuficiente (efeitos raros ou tardios, populações excluídas dos ensaios).","Na base submersa, dados de mundo real complementam o ensaio: seguimento longo, segurança pós-comercialização e subgrupos."]},
 {k:"Etiologia, dano e prognóstico",q:"Trabalhar no turno da noite aumenta o risco de diabetes?",top:"Coorte prospectiva",mid:["Caso-controle","Séries e relatos de casos"],sub:["Dados genéticos","Dados sociais e ambientais","Registros populacionais"],
  li:["Sortear pessoas para uma exposição nociva seria antiético: a evidência causal vem de estudos observacionais.","Coortes prospectivas dão a melhor garantia de temporalidade (a exposição antes do desfecho).","A emulação de ensaio-alvo organiza a análise observacional como se fosse um ensaio randomizado."]},
 {k:"Acurácia diagnóstica",q:"Este teste rápido identifica a infecção?",top:"Estudo transversal",mid:["Coorte de casos suspeitos","Caso-controle diagnóstico"],sub:["Registros eletrônicos","Aprendizado de máquina","IA multimodal"],
  li:["Sensibilidade e especificidade se medem em estudo transversal: teste-índice e padrão de referência no mesmo momento.","O caso-controle diagnóstico (“duas portas”) superestima a acurácia, porque compara doentes graves com sadios evidentes.","Saber se o exame melhora desfechos do paciente exige um ensaio randomizado de estratégias diagnósticas: raro e caro, mas possível."]}];
let ICEi=0;
LAB("tres","Reconhecer","Três perguntas",`
<div class="intro"><span class="eyebrow">Reconhecer · classificação</span><h2>Três perguntas reconhecem qualquer desenho de estudo</h2><p>Responda pensando em um estudo que você leu. A cada resposta, os desenhos que não combinam saem do quadro.</p></div>
<div class="grid two">
 <div class="card wide"><div class="card-h"><h3>Qual é o desenho?</h3><button class="more-btn" data-learn="tres">Saiba mais</button></div>
  <div class="cols2">
   <div class="qs" id="t3Q"></div>
   <div><div class="sub">Desenhos possíveis</div><div class="dzs" id="t3D"></div><div id="t3V"></div></div>
  </div></div>
 <div class="card wide"><div class="card-h"><h3>Cada pergunta tem o seu iceberg</h3><button class="more-btn" data-learn="iceberg">Saiba mais</button></div>
  <p class="lede">A pirâmide clássica foi desenhada para tratamentos. Troque o tipo de pergunta e veja qual desenho fica no topo.</p>
  <div class="chips" id="iceC"></div>
  <div class="cols2" style="margin-top:12px"><div id="iceS"></div><div><p class="q" id="iceQ" style="font-size:19px;margin-top:0"></p><ul id="iceL" style="margin:0;padding-left:18px;display:grid;gap:6px;font-size:14px;max-width:60ch"></ul><p class="note">Em todos os icebergs, a revisão sistemática funciona como uma lente para examinar e combinar os estudos, não como um nível acima deles.</p></div></div></div>
</div>`,()=>{
  $("t3Q").addEventListener("click",e=>{const b=e.target.closest("[data-q]");if(!b)return;const q=+b.dataset.q;T3.ans[q]=T3.ans[q]===b.dataset.v?null:b.dataset.v;for(let i=q+1;i<3;i++)T3.ans[i]=null;renderT3();});
  $("t3V").addEventListener("click",e=>{if(e.target.closest("#t3R")){T3.ans=[null,null,null];renderT3();}const g=e.target.closest("[data-go]");if(g){TP.des=g.dataset.go;TP.step=0;navGo("tempo");}});
  chips($("iceC"),ICE.map(x=>x.k),i=>{ICEi=i;renderIce();},0);
},()=>{renderT3();renderIce();});
function t3Left(){let set=new Set(DES_ORD);T3.ans.forEach((a,i)=>{if(a==null)return;const keep=TQ[i].o.find(o=>o[0]===a)[2];set=new Set([...set].filter(k=>keep.includes(k)));});return set;}
function renderT3(){const left=t3Left(),done=left.size===1;let h="",stop=false;
  TQ.forEach((Q,i)=>{if(stop)return;h+=`<div class="qq"><b><i>${i+1}</i>${Q.q}</b><div class="opts">${Q.o.map(o=>`<button class="opt ${T3.ans[i]===o[0]?"on":""}" data-q="${i}" data-v="${o[0]}">${o[1]}</button>`).join("")}</div></div>`;
    if(T3.ans[i]==null||t3LeftUpTo(i).size===1)stop=true;});
  $("t3Q").innerHTML=h;
  $("t3D").innerHTML=DES_ORD.map(k=>`<div class="dz ${left.has(k)?(done?"win":""):"out"}">${DES[k].n}<small>${DES[k].s}</small></div>`).join("");
  if(done){const k=[...left][0],D=DES[k],tl={serie:"serie",transversal:"transversal",ecologico:"ecologico",cc:"cc",coorte:"coorte",ecr:"ecr"}[k];
    $("t3V").innerHTML=`<div class="verdict"><h4>${D.n}</h4><p>${D.def}</p><dl><dt>Unidade</dt><dd>${D.unit}</dd><dt>Tempo</dt><dd>${D.tempo}</dd><dt>Medida principal</dt><dd>${D.med}</dd><dt>Limitação principal</dt><dd>${D.lim}</dd></dl><div class="row">${tl?`<button class="btn small primary" data-go="${tl}">Ver na linha do tempo ›</button>`:""}<button class="btn small" id="t3R">Recomeçar</button></div></div>`;}
  else $("t3V").innerHTML=`<p class="note">${T3.ans[0]==null?"Sete desenhos em jogo. Comece pela primeira pergunta.":`Restam ${left.size} desenhos. Responda a próxima pergunta.`}</p>`;}
function t3LeftUpTo(i){let set=new Set(DES_ORD);for(let j=0;j<=i;j++){const a=T3.ans[j];if(a==null)continue;const keep=TQ[j].o.find(o=>o[0]===a)[2];set=new Set([...set].filter(k=>keep.includes(k)));}return set;}
function renderIce(){const I=ICE[ICEi],wl=116,H=284,cx=70;
  $("iceS").innerHTML=`<div class="ice"><div class="water"></div>
  <svg viewBox="0 0 140 ${H}" width="140" height="${H}" aria-hidden="true"><path d="M${cx} 12 L${cx+34} ${wl} L${cx-30} ${wl} Z" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6" stroke-linejoin="round"/><path d="M${cx-30} ${wl} L${cx+34} ${wl} L${cx+60} ${wl+62} L${cx+30} ${H-12} L${cx-28} ${H-20} L${cx-62} ${wl+74} Z" fill="var(--nex)" fill-opacity=".25" stroke="var(--nex)" stroke-width="1.6" stroke-linejoin="round"/><line x1="${cx+8}" x2="140" y1="34" y2="34" stroke="var(--accent)" stroke-width="1.5"/></svg>
  <div class="ice-t"><div class="above"><b>${I.top}</b><small>desenho de referência</small>${I.mid.map(t=>`<span>${t}</span>`).join("")}</div><div class="below"><small>submerso</small>${I.sub.map(t=>`<span>${t}</span>`).join("")}</div></div></div>`;
  $("iceQ").textContent="“"+I.q+"”";$("iceL").innerHTML=I.li.map(t=>`<li>${t}</li>`).join("");}
