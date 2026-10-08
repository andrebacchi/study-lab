/* ===================== SUBGRUPOS: quanto mais fatias, mais achados pelo acaso ===================== */
/* ensaio com 1.200 pessoas por braço e 20% de eventos no controle. O efeito é o mesmo em todos os subgrupos (RR 0,80) ou nenhum. */
const SB_G=[["Sexo",["Mulheres","Homens"]],["Faixa etária",["Menos de 50 anos","50 a 59 anos","60 a 69 anos","70 anos ou mais"]],["Signo",["Áries","Touro","Gêmeos","Câncer","Leão","Virgem","Libra","Escorpião","Sagitário","Capricórnio","Aquário","Peixes"]],["Centro",Array.from({length:20},(_,i)=>"Centro "+(i+1))]];
const SB={g:2,ef:1,seed:8,res:null,rep:null};
function sbBin(n,p,r){let k=0;for(let i=0;i<n;i++)if(r()<p)k++;return k;}
function sbTrial(r){const names=SB_G[SB.g][1],k=names.length,n=Math.round(1200/k),rr=SB.ef?.8:1,rows=[];let A=0,C=0;
  names.forEach(nm=>{const a=sbBin(n,.2*rr,r),c=sbBin(n,.2,r),ci=ciRR(a,n-a,c,n-c);A+=a;C+=c;rows.push({nm,a,c,n,rr:a&&c?(a/n)/(c/n):NaN,ci,flag:SB.ef?(a>=c):(!!ci&&(ci[0]>1||ci[1]<1))});});
  const N=n*k;return{rows,all:{a:A,c:C,n:N,rr:(A/N)/(C/N),ci:ciRR(A,N-A,C,N-C)},nf:rows.filter(x=>x.flag).length};}
function sbRun(){SB.res=sbTrial(rng(SB.seed*131+SB.g*7+SB.ef));}
function sbRep(){const r=rng(777+SB.g*13+SB.ef),T=400;let any=0;for(let i=0;i<T;i++)if(sbTrial(r).nf)any++;SB.rep=any/T;}
LAB("sub","Resultados","Subgrupos",`
<div class="intro"><span class="eyebrow">Resultados · desfechos secundários e subgrupos</span><h2>Quem procura em muitas fatias sempre encontra alguma coisa</h2><p>O ensaio foi dimensionado para responder ao desfecho primário na amostra inteira. Cada subgrupo é um ensaio pequeno, e com muitos deles o acaso produz achados.</p></div>
<div class="grid"><div class="card"><div class="card-h"><h3>O ensaio fatiado</h3><button class="more-btn" data-learn="subgrupos">Saiba mais</button></div>
 <p class="lede">São 2.400 participantes. O efeito do tratamento é rigorosamente o mesmo em todo mundo. Escolha como fatiar e refaça o ensaio algumas vezes.</p>
 <div class="row"><div><div class="sub">Fatiar por</div><div class="chips" id="sbG"></div></div></div>
 <div style="margin-top:10px"><div class="sub">Efeito verdadeiro, igual em todos</div><div class="chips" id="sbE"></div></div>
 <div class="row" style="margin-top:12px"><button class="btn small primary" id="sbGo">Refazer o ensaio</button></div>
 <svg class="ch" id="sbS" style="margin-top:10px" role="img" aria-label="Forest plot dos subgrupos e do resultado geral"></svg>
 <div class="cols2" style="margin-top:12px"><div><div class="tiles" id="sbT"></div></div>
  <div><div class="sub">Sem efeito algum: probabilidade de pelo menos um subgrupo “significativo”</div><svg class="ch" id="sbC" role="img" aria-label="Probabilidade de ao menos um falso positivo conforme o número de comparações"></svg></div></div>
 <div class="insight" id="sbI"></div>
</div></div>`,()=>{
  chips($("sbG"),SB_G.map(g=>`${g[0]} <small style="color:var(--muted)">${g[1].length}</small>`),i=>{SB.g=i;sbRun();sbRep();renderSB();},SB.g);
  chips($("sbE"),["Reduz o risco em 20% (RR 0,80)","Nenhum (RR 1,00)"],i=>{SB.ef=i?0:1;sbRun();sbRep();renderSB();},0);
  $("sbGo").onclick=()=>{SB.seed++;sbRun();renderSB();};sbRun();sbRep();
},()=>renderSB());
function renderSB(){const R=SB.res,rows=R.rows,k=rows.length,el=$("sbS"),rh=k>12?20:24,T=8,H=T+k*rh+62,W=box(el,H),wide=W>=560,L=wide?150:112,Rn=wide?130:8,iw=W-L-Rn,lo=.25,hi=4,X=v=>L+(Math.log(clamp(v,lo,hi))-Math.log(lo))/(Math.log(hi)-Math.log(lo))*iw;let s="";
  s+=`<line x1="${X(1)}" x2="${X(1)}" y1="${T-2}" y2="${T+k*rh+26}" stroke="var(--tick)" stroke-dasharray="4 3"/>`;
  rows.forEach((r,i)=>{const y=T+i*rh+rh/2,c=r.flag?"var(--bad)":"var(--fg)";s+=`<text x="4" y="${y+4}" style="font-size:12px;fill:${c};${r.flag?"font-weight:600":""}">${r.nm}</text>`;
    if(r.ci)s+=`<line x1="${X(r.ci[0])}" x2="${X(r.ci[1])}" y1="${y}" y2="${y}" stroke="${c}" stroke-width="1.5"/>`;if(has(r.rr))s+=`<rect x="${X(r.rr)-4}" y="${y-4}" width="8" height="8" fill="${c}"/>`;
    if(wide)s+=`<text x="${W-4}" y="${y+4}" text-anchor="end" style="font-size:11px;fill:${c};font-variant-numeric:tabular-nums">${has(r.rr)?fmt(r.rr,2):"—"}${r.ci?` (${fmt(r.ci[0],2)}–${fmt(r.ci[1],2)})`:""}</text>`;});
  const yd=T+k*rh+12,A=R.all;s+=`<path d="M${X(A.ci[0])} ${yd}L${X(A.rr)} ${yd-8}L${X(A.ci[1])} ${yd}L${X(A.rr)} ${yd+8}Z" fill="var(--accent)"/><text x="4" y="${yd+4}" class="lbl" style="font-size:12.5px;fill:var(--accent)">Todos</text>`;
  if(wide)s+=`<text x="${W-4}" y="${yd+4}" text-anchor="end" class="lbl" style="font-size:11px;fill:var(--accent)">${fmt(A.rr,2)} (${fmt(A.ci[0],2)}–${fmt(A.ci[1],2)})</text>`;
  s+=xAxis(X,[.25,.5,1,2,4],yd+16,numTxt,L,L+iw)+`<text x="${X(1)-8}" y="${H-2}" text-anchor="end" style="font-size:11px">‹ favorece o tratamento</text><text x="${X(1)+8}" y="${H-2}" style="font-size:11px">favorece o controle ›</text>`;el.innerHTML=s;
  const sig=A.ci[1]<1||A.ci[0]>1,pf=1-Math.pow(.95,k),odd=rows.filter(r=>r.flag).map(r=>r.nm);
  $("sbT").innerHTML=tile("Resultado em todos","RR "+fmt(A.rr,2),ciTxt(A.ci),"acc")+tile(SB.ef?"Subgrupos em que o benefício some":"Subgrupos “significativos”",`${R.nf} de ${k}`,SB.ef?"RR igual ou maior que 1":"IC 95% não inclui 1",R.nf?"bad":"")+tile("Em 400 ensaios refeitos",pct(SB.rep,0),SB.ef?"têm ao menos um subgrupo sem benefício":"têm ao menos um subgrupo “significativo”",SB.rep>.3?"bad":"");
  const e2=$("sbC"),H2=150,W2=box(e2,H2),L2=38,T2=10,ih=H2-T2-30,iw2=W2-L2-12,X2=v=>L2+(v-1)/19*iw2,Y2=v=>T2+ih-v*ih;let d="",c=yGrid(Y2,[0,.25,.5,.75],L2,W2-12,v=>pct(v,0))+xAxis(X2,[1,5,10,15,20],T2+ih,v=>v,L2,W2-12);
  for(let x=1;x<=20;x++)d+=(d?"L":"M")+X2(x)+","+Y2(1-Math.pow(.95,x));c+=`<path d="${d}" fill="none" stroke="var(--accent)" stroke-width="2.2"/><circle cx="${X2(k)}" cy="${Y2(pf)}" r="6" fill="var(--accent)"/><text x="${clamp(X2(k)-10,L2+40,W2-20)}" y="${Y2(pf)-10}" text-anchor="end" class="lbl" style="fill:var(--accent);font-size:12px">${pct(pf,0)}</text><text x="${W2-12}" y="${H2-1}" text-anchor="end" style="font-size:11px">número de subgrupos testados</text>`;e2.innerHTML=c;
  const list=odd.length>3?odd.slice(0,3).join(", ")+" e outros":odd.length>1?odd.slice(0,-1).join(", ")+" e "+odd[odd.length-1]:odd.join("");
  $("sbI").className="insight"+(R.nf?" warn":"");
  $("sbI").innerHTML=(SB.ef?(R.nf?`O tratamento funciona igualmente em todos, mas neste ensaio ele “não funcionou” em: <b>${list}</b>. Nada distingue ${odd.length>1?"esses subgrupos":"esse subgrupo"}: é o acaso em amostras pequenas. Refaça o ensaio e os subgrupos “sem benefício” serão outros. Foi o que os autores do ISIS-2 mostraram de propósito, ao relatar que o ácido acetilsalicílico reduzia a mortalidade depois do infarto, exceto em quem nasceu sob Gêmeos ou Libra.`:`Neste ensaio, todos os subgrupos apontaram para o mesmo lado. Com ${k} fatias isso ${k<=4?"é o mais comum":"é sorte"}: refaça algumas vezes ou fatie mais fino.`)
   :(R.nf?`O tratamento não faz nada, e ainda assim ${R.nf>1?"apareceram subgrupos “significativos”":"apareceu um subgrupo “significativo”"}: <b>${list}</b>. Com ${k} comparações, a probabilidade de pelo menos um achado desses é de ${pct(pf,0)}.`:`Nenhum subgrupo “significativo” desta vez. Com ${k} comparações, isso acontece em ${pct(1-pf,0)} dos ensaios; nos outros ${pct(pf,0)}, o acaso entrega pelo menos um.`))
   +" Subgrupos geram hipóteses, não confirmam. Para merecer crédito, precisam ser pré-especificados, poucos, com teste de interação, plausíveis e replicados."+(sig?"":" Repare que, desta vez, nem o resultado geral excluiu o 1.");}
