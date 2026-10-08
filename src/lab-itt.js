/* ===================== INTENÇÃO DE TRATAR × POR PROTOCOLO ===================== */
/* cada braço: 100 sorteados, 30 graves (risco 40%) e 70 leves (risco 10%). No controle: 12 + 7 = 19 desfechos. */
const IT={na:30,w:100,ef:0};
function itCalc(){const rr=IT.ef?.5:1,n=IT.na,nG=Math.min(30,Math.round(n*(.3+.7*IT.w/100))),nL=n-nG,aG=30-nG,aL=70-nL;
  const ev={aG:Math.round(aG*.4*rr),aL:Math.round(aL*.1*rr),nG:Math.round(nG*.4),nL:Math.round(nL*.1)},evA=ev.aG+ev.aL,evN=ev.nG+ev.nL,ad=100-n;
  return{rr,n,nG,nL,aG,aL,ev,evA,evN,ad,itt:div((evA+evN)/100,.19),pp:div(div(evA,ad),.19),rI:(evA+evN)/100,rP:div(evA,ad)};}
LAB("itt","Experimentais","Intenção de tratar",`
<div class="intro"><span class="eyebrow">Experimentais · análise</span><h2>Quem abandona o tratamento sai da análise?</h2><p>Nem todo sorteado segue o protocolo. A análise por intenção de tratar mantém cada pessoa no grupo em que foi sorteada; a análise por protocolo fica só com quem seguiu o tratamento.</p></div>
<div class="grid"><div class="card"><div class="card-h"><h3>Duas análises do mesmo ensaio</h3><button class="more-btn" data-learn="itt">Saiba mais</button></div>
 <p class="lede">Cem pessoas em cada braço, com a mesma proporção de graves, porque foram sorteadas. Depois, parte do grupo intervenção abandona o tratamento.</p>
 <div class="cols2">
  <div class="stack">
   <div class="range"><label for="itN">Abandonam o tratamento</label><output id="itNo"></output><input type="range" id="itN" min="0" max="50" step="5" value="30"></div>
   <div><div class="range"><label for="itW">Quem abandona?</label><output id="itWo"></output><input type="range" id="itW" min="0" max="100" step="10" value="100"></div><p class="mini" style="margin:2px 0 0;display:flex;justify-content:space-between;gap:12px"><span>‹ qualquer um</span><span>os mais graves ›</span></p></div>
   <div><div class="sub">Efeito verdadeiro do tratamento</div><div class="chips" id="itE"></div></div>
  </div>
  <div><div class="grps" id="itG"></div><div class="key" id="itK"></div></div>
 </div>
 <svg class="ch" id="itS" style="margin-top:14px;max-width:720px" role="img" aria-label="Risco relativo verdadeiro, por intenção de tratar e por protocolo"></svg>
 <div class="tiles" id="itTiles" style="margin-top:8px"></div><div class="insight" id="itTxt"></div>
</div></div>`,()=>{
  $("itN").oninput=e=>{IT.na=+e.target.value;renderIT();};$("itW").oninput=e=>{IT.w=+e.target.value;renderIT();};
  chips($("itE"),["Nenhum (RR 1,0)","Reduz o risco pela metade (RR 0,5)"],i=>{IT.ef=i;renderIT();},0);
},()=>renderIT());
function renderIT(){const c=itCalc(),P=[],C=[],push=(arr,k,ev,o)=>{for(let i=0;i<k;i++)arr.push(Object.assign({d:i<ev?1:0},o));};
  push(P,c.aG,c.ev.aG,{e:1,sq:true});push(P,c.aL,c.ev.aL,{e:1});push(P,c.nG,c.ev.nG,{e:1,sq:true,nad:true});push(P,c.nL,c.ev.nL,{e:1,nad:true});
  push(C,30,12,{e:0,sq:true});push(C,70,7,{e:0});
  $("itNo").textContent=c.n+" de 100";$("itWo").textContent=IT.w<=10?"ao acaso":IT.w>=90?"quase só os graves":"mais os graves";
  $("itG").innerHTML=grp("Intervenção",`${c.ad} seguem o tratamento · ${c.n} abandonam`,dotSVG(P,10))+grp("Controle","100 pessoas",dotSVG(C,10));
  $("itK").innerHTML=keyDot({e:1,d:0,sq:true},"grave")+keyDot({e:1,d:0},"leve")+keyDot({e:1,d:1},"teve o desfecho")+(c.n?keyDot({e:1,d:0,nad:true},"abandonou o tratamento"):"");
  logAxis($("itS"),[{v:c.rr,c:"var(--nex)",t:`Efeito verdadeiro: RR ${fmt(c.rr,2)}`,dia:true},{v:c.itt,c:"var(--accent)",t:`Intenção de tratar: RR ${rat(c.itt)}`},{v:c.pp,c:"var(--bad)",t:`Por protocolo: RR ${rat(c.pp)}`}],{lo:.25,hi:2,ticks:[.25,.5,1,2]});
  $("itTiles").innerHTML=tile("Controle","19%","19 de 100")+tile("Intenção de tratar",pct(c.rI,0),`${c.evA+c.evN} de 100 sorteados`,"acc")+tile("Por protocolo",has(c.rP)?pct(c.rP,0):"—",`${c.evA} de ${c.ad} que seguiram`,"bad");
  const pb=has(c.pp)&&Math.abs(Math.log(c.pp/c.rr))>.18,ib=Math.abs(Math.log(c.itt/c.rr))>.12;$("itTxt").className="insight"+(pb?" warn":"");
  $("itTxt").innerHTML=!c.n?"Com adesão total, as duas análises são idênticas e mostram o efeito verdadeiro.":
   pb?`Quem abandonou era ${IT.w>=50?"mais grave":"diferente"} do que quem ficou. Ao excluir essas pessoas, a análise por protocolo compara um grupo intervenção mais saudável com o controle inteiro: <b>a randomização foi quebrada</b>${IT.ef?" e o benefício parece maior do que é":" e aparece um benefício que não existe"}. ${ib?"A intenção de tratar dilui o efeito em direção a 1, mas preserva a comparação.":"A intenção de tratar mantém os grupos comparáveis."}`:
   ib?"O abandono foi ao acaso, e a análise por protocolo fica perto do efeito verdadeiro. A intenção de tratar aparece <b>diluída em direção a 1</b>, porque conta como tratados os que não tomaram o remédio. Ela estima o efeito de oferecer o tratamento, que é o que acontece na prática.":
   "Aqui as duas análises ficam perto do efeito verdadeiro. A análise por protocolo só é confiável quando quem abandona não difere de quem fica, e isso raramente se sabe.";}
