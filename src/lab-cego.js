/* ===================== CEGAMENTO: quem está mascarado e o que isso muda ===================== */
/* tamanho de cada viés em pontos de efeito (valores ilustrativos): [desfecho subjetivo, desfecho objetivo] */
const CG_W=[["p","Participante","Se sabe o grupo, a expectativa muda o que sente e relata, e ele pode buscar outros tratamentos ou abandonar o estudo.","expectativa e relato","var(--g4)",[8,1]],
 ["e","Equipe que trata","Se sabe o grupo, pode dar mais atenção, ajustar doses ou acrescentar outros cuidados a um dos grupos.","cuidados diferentes","var(--g5)",[4,2]],
 ["a","Avaliador do desfecho","Se sabe o grupo, tende a medir ou interpretar o desfecho a favor do que espera.","viés de aferição","var(--g1)",[6,0]],
 ["n","Analista de dados","Se sabe o grupo, pode escolher exclusões, cortes e análises que favorecem um lado.","escolhas de análise","var(--g3)",[2,1]]];
const CG={p:false,e:false,a:false,n:false,out:0,srt:{}};
const CG_PRE=[["Aberto",{}],["Simples-cego",{p:1}],["Duplo-cego",{p:1,e:1,a:1}],["Triplo-cego",{p:1,e:1,a:1,n:1}]];
const CG_OUT=[["Subjetivo: intensidade da ansiedade","a intensidade da ansiedade"],["Objetivo: óbito","o óbito"]];
const EYE=on=>on?`<svg viewBox="0 0 26 26" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 13c2.6-4.3 6-6.4 10-6.4s7.4 2.1 10 6.4c-2.6 4.3-6 6.4-10 6.4S5.600 17.300 3 13z"/><path d="M4.500 4.500l17 17"/></svg>`:`<svg viewBox="0 0 26 26" fill="none" stroke="var(--bad)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 13c2.6-4.3 6-6.4 10-6.4s7.4 2.1 10 6.4c-2.6 4.3-6 6.4-10 6.4S5.600 17.300 3 13z"/><circle cx="13" cy="13" r="3.2" fill="var(--bad)"/></svg>`;
const CG_IT=[
 ["A sequência do sorteio fica em uma central telefônica. Quem recruta só descobre o grupo depois de registrar o paciente.","sig","Atua antes da designação: quem recruta não sabe qual é o próximo grupo. Previne viés de seleção."],
 ["O placebo tem a mesma cor, o mesmo gosto e a mesma embalagem do medicamento.","mas","Atua depois da designação: nem o participante nem a equipe sabem qual tratamento está em uso. Previne vieses de performance e de aferição."],
 ["As alocações ficam em envelopes opacos, selados e numerados, abertos só depois da inclusão do paciente.","sig","É uma das formas clássicas de esconder a sequência de quem recruta. O sigilo de alocação é sempre possível."],
 ["O radiologista que lê os exames de seguimento não sabe a que grupo o paciente pertence.","mas","É o avaliador do desfecho que está mascarado. Previne viés de aferição."],
 ["A lista do sorteio fica afixada na parede do ambulatório, e o médico escolhe em que dia chamar cada paciente.","sig","É uma falha de sigilo de alocação: quem recruta sabe o próximo grupo e pode escolher quem entra. O resultado é viés de seleção."],
 ["O ensaio compara cirurgia com fisioterapia. Não há como esconder do paciente, mas quem mede a dor e a função não sabe o grupo.","mas","Mascarar nem sempre é possível, mas o avaliador do desfecho quase sempre pode ser cegado."],
 ["O estatístico recebe os grupos identificados apenas como A e B.","mas","É o analista de dados que está mascarado: o último passo para um ensaio triplo-cego."],
 ["Um sistema na internet só libera o grupo depois que os critérios de inclusão foram conferidos e o paciente foi registrado.","sig","A designação só é revelada quando a decisão de incluir já não pode mudar. Previne viés de seleção."]];
LAB("cego","Experimentais","Cegamento",`
<div class="intro"><span class="eyebrow">Experimentais · mascaramento</span><h2>Quem sabe o grupo de cada paciente, e o que isso faz com o resultado</h2><p>O sorteio deixa os grupos iguais no início. O mascaramento impede que eles passem a ser tratados, medidos e analisados de forma diferente depois.</p></div>
<div class="grid two">
 <div class="card wide"><div class="card-h"><h3>Quem está mascarado?</h3><button class="more-btn" data-learn="cego">Saiba mais</button></div>
  <p class="lede">Toque em cada pessoa para mascarar ou revelar. O tratamento tem um efeito verdadeiro de 10 pontos; veja quanto o ensaio enxerga.</p>
  <div class="row" style="justify-content:space-between"><div class="chips" id="cgP"></div></div>
  <div style="margin:10px 0"><div class="sub">O desfecho do ensaio</div><div class="seg" id="cgO"><button data-v="0">${CG_OUT[0][0]}</button><button data-v="1">${CG_OUT[1][0]}</button></div></div>
  <div class="who" id="cgW"></div>
  <svg class="ch" id="cgS" style="margin-top:16px" role="img" aria-label="Efeito verdadeiro e vieses somados ao efeito observado"></svg>
  <div class="legend" id="cgLg"></div>
  <div class="cols2" style="margin-top:12px"><div><div class="tiles" id="cgT"></div><div class="insight" id="cgI"></div></div>
   <div><div class="sub">Mascaramento × objetividade do desfecho</div><div class="tw"><table class="mx" id="cgMx"></table></div><p class="note">Os tamanhos dos vieses são ilustrativos. O que importa é a ordem: quanto mais subjetivo o desfecho, mais o mascaramento pesa.</p></div></div></div>
 <div class="card wide"><div class="card-h"><h3>Sigilo de alocação ou mascaramento?</h3><button class="more-btn" data-learn="sigilo">Saiba mais</button></div>
  <div class="axis2"><div><b>Sigilo de alocação</b><p>Atua até a designação: quem recruta não sabe o próximo grupo. Previne viés de seleção. Sempre possível.</p></div><div class="mk"><i></i>alocação</div><div><b>Mascaramento</b><p>Atua depois da designação: esconde qual tratamento cada um recebe. Previne vieses de performance e de aferição. Nem sempre possível.</p></div></div>
  <div id="cgSrt" style="max-width:760px"></div></div>
</div>`,()=>{
  chips($("cgP"),CG_PRE.map(p=>p[0]),i=>{CG_W.forEach(w=>CG[w[0]]=!!CG_PRE[i][1][w[0]]);renderCG();},0);
  segBind($("cgO"),"0",v=>{CG.out=+v;renderCG();});
  $("cgW").addEventListener("click",e=>{const b=e.target.closest("[data-w]");if(b){CG[b.dataset.w]=!CG[b.dataset.w];renderCG();}});
},()=>{renderCG();sorter($("cgSrt"),CG.srt,CG_IT,[["sig","Sigilo de alocação"],["mas","Mascaramento"]]);});
function cgLabel(){const {p,e,a,n}=CG;return p&&(e||a)&&n?"Triplo-cego":p&&(e||a)?"Duplo-cego":p||a||e?"Simples-cego":n?"Só o analista mascarado":"Aberto";}
function renderCG(){const o=CG.out,parts=CG_W.filter(w=>!CG[w[0]]&&w[5][o]>0),bias=parts.reduce((t,w)=>t+w[5][o],0),obs=10+bias,lab=cgLabel();
  chipOn($("cgP"),CG_PRE.findIndex(pr=>CG_W.every(w=>!!pr[1][w[0]]===CG[w[0]])));
  $("cgW").innerHTML=CG_W.map(w=>`<button class="wh ${CG[w[0]]?"on":""}" data-w="${w[0]}" aria-pressed="${CG[w[0]]}">${EYE(CG[w[0]])}<b>${w[1]}</b><em>${CG[w[0]]?"mascarado":"sabe o grupo"}</em><span>${w[2]}</span></button>`).join("");
  const el=$("cgS"),H=92,W=box(el,H),L=10,Rm=10,iw=W-L-Rm,mx=32,X=v=>L+v/mx*iw;let x=0,s="";
  const seg=(v,c,t)=>{const w=X(x+v)-X(x);s+=`<rect x="${X(x)+.5}" y="8" width="${Math.max(0,w-1)}" height="34" rx="3" fill="${c}"/>${w>22?`<text x="${X(x)+w/2}" y="30" text-anchor="middle" style="fill:var(--surface);font-size:12.5px;font-weight:600">${t}</text>`:""}`;x+=v;};
  seg(10,"var(--exp)","10");parts.forEach(w=>seg(w[5][o],w[4],"+"+w[5][o]));
  s+=`<path d="M${X(0)} 50v7H${X(10)}v-7" fill="none" stroke="var(--fg)" stroke-width="1.4"/><text x="${X(0)}" y="71" style="font-size:11.5px;fill:var(--fg)">efeito verdadeiro</text>`;
  if(bias)s+=`<path d="M${X(10)+3} 50v7H${X(obs)}v-7" fill="none" stroke="var(--bad)" stroke-width="1.4"/><text x="${X(obs)}" y="71" text-anchor="end" style="font-size:11.5px;fill:var(--bad)">vieses: +${bias}</text>`;
  s+=xAxis(X,[0,10,20,30],76,v=>v,L,W-Rm);el.setAttribute("viewBox",`0 0 ${W} 98`);el.innerHTML=s;
  $("cgLg").innerHTML=`<span><i style="background:var(--exp);height:10px;width:10px;border-radius:2px"></i>Efeito do tratamento</span>`+CG_W.map(w=>`<span><i style="background:${w[4]};height:10px;width:10px;border-radius:2px"></i>${w[1]}: ${w[3]}</span>`).join("");
  $("cgT").innerHTML=tile("Tipo de estudo",lab)+tile("Efeito observado",obs+" pontos","",bias>4?"bad":bias?"alt":"acc")+tile("Efeito verdadeiro","10 pontos",bias?`exagero de ${fmt(bias/10*100,0)}%`:"medido sem exagero");
  const blind=CG.p&&CG.a,open=!CG.p&&!CG.e&&!CG.a,cells=[["Inaceitável","bad"],["Possível","mid"],["Possível","mid"],["Ideal","good"]],cur=open?o:blind?2+o:-1;
  $("cgMx").innerHTML=`<tr><th></th><th>Desfecho subjetivo</th><th>Desfecho objetivo</th></tr>`+[0,1].map(r=>`<tr><th class="rh">${r?"Cego":"Aberto"}</th>${[0,1].map(c=>{const i=r*2+c;return `<td class="${i===cur?"now "+cells[i][1]:""}">${cells[i][0]}</td>`;}).join("")}</tr>`).join("");
  $("cgI").className="insight"+(bias>4?" warn":"");
  $("cgI").innerHTML=(o===0?(bias===0?"Com todos mascarados, o efeito observado é o verdadeiro, mesmo com um desfecho subjetivo."
    :bias>=14?`Com ${CG_OUT[0][1]} como desfecho, quase tudo depende de quem sente, de quem cuida e de quem mede. Sem mascaramento, o efeito observado é ${fmt(obs/10,1)} vezes o verdadeiro.`
    :`Ainda entram ${bias} pontos de viés. Com desfecho subjetivo, cada pessoa que sabe o grupo acrescenta a sua parte.`)
   :(bias===0?"Com todos mascarados, o efeito observado é o verdadeiro."
    :`Com ${CG_OUT[1][1]} como desfecho, a expectativa do paciente e o olhar do avaliador quase não mudam o resultado. Restam ${bias} pontos, vindos de cuidados diferentes entre os grupos e de escolhas de análise. Por isso um estudo aberto com desfecho objetivo é aceitável, e com desfecho subjetivo não.`))
   +(cur<0&&!open?" <br>Mascaramento parcial: os rótulos “simples”, “duplo” e “triplo” não dizem quem estava mascarado. Ao ler um artigo, procure essa informação.":"");}
