/* ===================== METANÁLISE: forest plot ===================== */
/* cada estudo: n por grupo, RR, incluído?, alto risco de viés? Risco no controle fixo em 30%. */
const MT_PRE=[
 ["Estudos concordantes",[[120,.7],[200,.65],[80,.75],[400,.7],[150,.6],[60,.8]]],
 ["Um estudo grande discorda",[[60,.5],[80,.55],[50,.45],[2000,1],[70,.6],[40,.5]]],
 ["Estudos discordantes",[[150,.4],[200,1.3],[120,.6],[300,1.1],[100,.35],[180,1.5]]],
 ["Pequenos e com alto risco de viés",[[40,.4,1],[50,.45,1],[30,.35,1],[600,.95],[800,1],[45,.5,1]]]];
const MT={st:[],sel:0,model:"re",drop:false};
const mtLoad=i=>{MT.st=MT_PRE[i][1].map((s,j)=>({name:"Estudo "+"ABCDEF"[j],n:s[0],rr:s[1],on:true,bias:!!s[2]}));MT.sel=0;};
const mtN=x=>{const v=20*Math.pow(100,x/100);return v<100?Math.round(v/5)*5:v<1000?Math.round(v/10)*10:Math.round(v/50)*50;},mtX=n=>Math.round(Math.log(n/20)/Math.log(100)*100);
function mtCalc(){const rows=MT.st.map(s=>{const c=Math.round(s.n*.3),a=Math.max(1,Math.round(s.n*.3*s.rr)),y=Math.log((a/s.n)/(c/s.n)),v=1/a-1/s.n+1/c-1/s.n,se=Math.sqrt(v);return{s,a,c,y,v,lo:Math.exp(y-1.96*se),hi:Math.exp(y+1.96*se),rr:Math.exp(y),use:s.on&&!(MT.drop&&s.bias)};});
  const U=rows.filter(r=>r.use),k=U.length;if(!k)return{rows,k};
  const sw=U.reduce((t,r)=>t+1/r.v,0),yf=U.reduce((t,r)=>t+r.y/r.v,0)/sw,Q=U.reduce((t,r)=>t+(r.y-yf)**2/r.v,0),C=sw-U.reduce((t,r)=>t+1/r.v**2,0)/sw,tau2=k>1&&C>0?Math.max(0,(Q-(k-1))/C):0,I2=k>1&&Q>0?Math.max(0,(Q-(k-1))/Q):0;
  const w=r=>1/(r.v+(MT.model==="re"?tau2:0)),W=U.reduce((t,r)=>t+w(r),0),yp=U.reduce((t,r)=>t+w(r)*r.y,0)/W,sp=Math.sqrt(1/W);rows.forEach(r=>r.w=r.use?w(r)/W:0);
  return{rows,k,pool:Math.exp(yp),lo:Math.exp(yp-1.96*sp),hi:Math.exp(yp+1.96*sp),I2,wmax:Math.max(...rows.map(r=>r.w))};}
LAB("meta","Resultados","Metanálise",`
<div class="intro"><span class="eyebrow">Resultados · revisões</span><h2>A metanálise combina estudos, e herda os problemas deles</h2><p>A revisão sistemática é uma pesquisa sobre pesquisas. Quando os estudos são combináveis, a metanálise junta os resultados em uma estimativa só. Monte a sua e leia o forest plot.</p></div>
<div class="grid"><div class="card"><div class="card-h"><h3>Forest plot</h3><button class="more-btn" data-learn="forest">Saiba mais</button></div>
 <div class="chips" id="mtP"></div>
 <svg class="ch" id="mtS" style="margin-top:12px" role="img" aria-label="Forest plot dos estudos e estimativa combinada"></svg>
 <div class="row" style="margin-top:6px"><div class="seg" id="mtM"><button data-v="re">Efeitos aleatórios</button><button data-v="fe">Efeito fixo</button></div><label class="toggle"><input type="checkbox" id="mtD"> Excluir estudos com alto risco de viés</label></div>
 <div class="tiles" id="mtTiles" style="margin-top:12px"></div><div class="insight" id="mtTxt"></div>
 <div class="ed" id="mtEd"></div>
 <p class="note">Toque em um estudo no gráfico para editá-lo. Em todos, o desfecho ocorre em 30% do grupo controle.</p>
</div></div>`,()=>{mtLoad(0);
  chips($("mtP"),MT_PRE.map(p=>p[0]),i=>{mtLoad(i);renderMT();},0);
  segBind($("mtM"),MT.model,v=>{MT.model=v;renderMT(true);});$("mtD").onchange=e=>{MT.drop=e.target.checked;renderMT(true);};
  $("mtS").addEventListener("click",e=>{const r=e.target.closest("[data-i]");if(r){MT.sel=+r.dataset.i;renderMT();}});
  $("mtEd").addEventListener("input",e=>{const s=MT.st[MT.sel],t=e.target;if(t.id==="mtN")s.n=mtN(+t.value);else if(t.id==="mtR")s.rr=+t.value;else if(t.id==="mtOn")s.on=t.checked;else if(t.id==="mtB")s.bias=t.checked;else return;chipOn($("mtP"),-1);renderMT(true);});
},()=>renderMT());
function renderMT(keepEd){const R=mtCalc(),el=$("mtS"),rh=32,T=22,n=R.rows.length,H=T+n*rh+70,W=box(el,H),wide=W>=560,L=wide?104:92,Rn=wide?150:10,iw=W-L-Rn,lo=.15,hi=4,X=v=>L+(Math.log(clamp(v,lo,hi))-Math.log(lo))/(Math.log(hi)-Math.log(lo))*iw;let s="";
  s+=`<line x1="${X(1)}" x2="${X(1)}" y1="${T-8}" y2="${T+n*rh+30}" stroke="var(--tick)" stroke-dasharray="4 3"/>`;
  if(wide)s+=`<text x="${W}" y="12" text-anchor="end" style="font-size:11px">RR (IC 95%) · peso</text>`;
  R.rows.forEach((r,i)=>{const y=T+i*rh+rh/2,on=r.use,sd=on?7+15*Math.sqrt(r.w/(R.wmax||1)):8,c=r.s.bias?"var(--bad)":"var(--fg)";
    s+=`<g class="metarow" data-i="${i}" opacity="${on?1:.35}">${i===MT.sel?`<rect x="0" y="${y-rh/2+1}" width="${W}" height="${rh-2}" rx="6" fill="var(--accent-soft)"/>`:`<rect x="0" y="${y-rh/2+1}" width="${W}" height="${rh-2}" fill="transparent"/>`}
    <text x="6" y="${y+(wide?4:-1)}" class="lbl" style="font-size:12.5px">${r.s.name}${r.s.bias?" ⚑":""}</text>${wide?"":`<text x="6" y="${y+12}" style="font-size:10.5px">n = ${fmt(r.s.n*2,0)}</text>`}
    <line x1="${X(r.lo)}" x2="${X(r.hi)}" y1="${y}" y2="${y}" stroke="${c}" stroke-width="1.6"/><rect x="${X(r.rr)-sd/2}" y="${y-sd/2}" width="${sd}" height="${sd}" fill="${c}"/>
    ${wide?`<text x="${W-4}" y="${y+4}" text-anchor="end" style="font-size:11.5px;font-variant-numeric:tabular-nums">${fmt(r.rr,2)} (${fmt(r.lo,2)}–${fmt(r.hi,2)}) · ${on?pct(r.w,0):"fora"}</text>`:""}</g>`;});
  const yd=T+n*rh+14;if(R.k){s+=`<path d="M${X(R.lo)} ${yd}L${X(R.pool)} ${yd-9}L${X(R.hi)} ${yd}L${X(R.pool)} ${yd+9}Z" fill="var(--accent)"/><text x="6" y="${yd+4}" class="lbl" style="font-size:12.5px;fill:var(--accent)">Combinado</text>`;if(wide)s+=`<text x="${W-4}" y="${yd+4}" text-anchor="end" class="lbl" style="font-size:11.5px;fill:var(--accent)">${fmt(R.pool,2)} (${fmt(R.lo,2)}–${fmt(R.hi,2)})</text>`;}
  s+=xAxis(X,[.25,.5,1,2,4],yd+18,numTxt,L,L+iw)+`<text x="${X(1)-8}" y="${H-2}" text-anchor="end" style="font-size:11px">‹ favorece a intervenção</text><text x="${X(1)+8}" y="${H-2}" style="font-size:11px">favorece o controle ›</text>`;el.innerHTML=s;
  const nb=R.rows.filter(r=>r.use&&r.s.bias).length,big=R.k?R.rows.reduce((a,b)=>b.w>a.w?b:a):null;
  $("mtTiles").innerHTML=R.k?tile("RR combinado",fmt(R.pool,2),`IC 95%: ${fmt(R.lo,2)} a ${fmt(R.hi,2)}`,"acc")+tile("Heterogeneidade (I²)",pct(R.I2,0),R.I2>.5?"alta":R.I2>.25?"moderada":"baixa",R.I2>.5?"bad":"")+tile("Estudos incluídos",R.k+" de "+n,nb?n1(nb,"com alto risco de viés","com alto risco de viés"):"")+tile("Maior peso",pct(big.w,0),big.s.name):tile("RR combinado","—","nenhum estudo incluído");
  $("mtTxt").className="insight"+(R.k&&(nb||R.I2>.5)?" warn":"");
  $("mtTxt").innerHTML=!R.k?"Inclua pelo menos um estudo.":nb?`${n1(nb,"estudo incluído tem","estudos incluídos têm")} alto risco de viés (⚑). A metanálise não corrige isso: compilar estudos duvidosos gera uma estimativa igualmente duvidosa, só que com cara de precisa. Marque a exclusão e compare.`:R.I2>.5?"Os estudos discordam mais do que o acaso explicaria. O losango resume mal resultados tão diferentes: antes de combinar, é preciso entender por que eles diferem. Às vezes, a melhor síntese é narrativa. Troque entre efeitos aleatórios e efeito fixo e veja o losango mudar.":R.hi<1||R.lo>1?`Os estudos apontam na mesma direção e o IC do losango não inclui 1. Combinados, eles têm mais precisão do que qualquer um sozinho${big.w>.5?`. Repare que o ${big.s.name} responde por ${pct(big.w,0)} do peso`:""}.`:"O IC do losango inclui 1: os dados combinados são compatíveis com ausência de efeito, e talvez também com efeitos relevantes.";
  if(keepEd){const o=$("mtNo");if(o){const s0=MT.st[MT.sel];o.textContent=fmt(s0.n,0)+" por grupo";$("mtRo").textContent=fmt(R.rows[MT.sel].rr,2);}return;}
  const s0=MT.st[MT.sel];$("mtEd").innerHTML=`<h4>${s0.name}</h4><div class="cols2"><div class="range"><label for="mtN">Tamanho do estudo</label><output id="mtNo">${fmt(s0.n,0)} por grupo</output><input type="range" id="mtN" min="0" max="100" step="1" value="${mtX(s0.n)}"></div><div class="range"><label for="mtR">RR encontrado</label><output id="mtRo">${fmt(R.rows[MT.sel].rr,2)}</output><input type="range" id="mtR" min="0.3" max="2" step="0.05" value="${s0.rr}"></div></div>
   <div class="row"><label class="toggle"><input type="checkbox" id="mtOn" ${s0.on?"checked":""}> Incluir na metanálise</label><label class="toggle"><input type="checkbox" id="mtB" ${s0.bias?"checked":""}> Alto risco de viés</label></div>`;}
