/* ===================== CERTEZA DA EVIDÊNCIA (GRADE) ===================== */
const GR_DOWN=[["vies","Risco de viés","problemas metodológicos que podem distorcer o resultado"],["inc","Inconsistência","variabilidade inesperada entre os estudos"],["imp","Imprecisão","intervalos de confiança amplos, amostras pequenas"],["ind","Evidência indireta","a população ou a pergunta dos estudos difere da sua"],["pub","Viés de publicação","resultados negativos tendem a não ser publicados"]];
const GR_UP=[["mag","Efeito de grande magnitude","associação muito forte, difícil de explicar só por confusão"],["dose","Gradiente dose-resposta","quanto maior a exposição, maior o efeito"],["conf","Confusão jogaria contra","os confundidores plausíveis reduziriam o efeito observado"]];
const GR_LV=["Muito baixa","Baixa","Moderada","Alta"],GR_COL=["var(--bad)","var(--warn)","var(--nex)","var(--good)"];
const GR={A:{},B:{}};
const grLevel=k=>{const S=GR[k],base=k==="A"?4:2,dn=GR_DOWN.filter(x=>S[x[0]]).length,up=k==="B"?GR_UP.filter(x=>S[x[0]]).length:0;return clamp(base-dn+up,1,4);};
const GR_PRE=[["Ponto de partida",{},{}],["Ensaios frágeis, coortes fortes",{vies:1,inc:1,imp:1},{mag:1,dose:1}],["Ensaios bons, coortes com problemas",{},{vies:1,imp:1}]];
LAB("grade","Reconhecer","Certeza da evidência",`
<div class="intro"><span class="eyebrow">Reconhecer · além do desenho</span><h2>O desenho define o ponto de partida, não o ponto de chegada</h2><p>No sistema GRADE, a certeza sobe ou desce conforme a qualidade do conjunto de estudos. Marque os problemas e veja a evidência mudar de degrau.</p></div>
<div class="grid"><div class="card"><div class="card-h"><h3>A escada da certeza</h3><button class="more-btn" data-learn="grade">Saiba mais</button></div>
 <div class="chips" id="grPre"></div>
 <svg class="ch" id="grS" style="margin-top:12px;max-width:640px" role="img" aria-label="Nível de certeza de dois conjuntos de evidência"></svg>
 <div class="insight" id="grTxt"></div>
 <div class="gcols" style="margin-top:14px" id="grC"></div>
 <p class="note">Simplificação didática: aqui cada problema desce um degrau e cada ponto forte sobe um. No GRADE real, o julgamento é qualitativo e um problema muito grave pode descer dois.</p>
</div></div>`,()=>{
  chips($("grPre"),GR_PRE.map(p=>p[0]),i=>{GR.A=Object.assign({},GR_PRE[i][1]);GR.B=Object.assign({},GR_PRE[i][2]);renderGR();},0);
  $("grC").addEventListener("change",e=>{const c=e.target;if(c.dataset.k){GR[c.dataset.k][c.dataset.f]=c.checked;$("grPre").querySelectorAll(".chip").forEach(x=>x.classList.remove("on"));renderGR(true);}});
},()=>renderGR());
function renderGR(keep){const a=grLevel("A"),b=grLevel("B"),el=$("grS"),H=188,W=box(el,H),L=96,rh=40,X1=L+(W-L)*0.3,X2=L+(W-L)*0.7;let s="";
  for(let lv=4;lv>=1;lv--){const y=8+(4-lv)*rh;s+=`<rect x="${L}" y="${y}" width="${W-L}" height="${rh-5}" rx="8" fill="${GR_COL[lv-1]}" opacity=".13"/><text x="${L-10}" y="${y+rh/2+2}" text-anchor="end" class="lbl" style="font-size:13px;fill:${GR_COL[lv-1]}">${GR_LV[lv-1]}</text>`;}
  const tok=(x,lv,c,t)=>{const y=8+(4-lv)*rh+(rh-5)/2;return `<g style="transition:transform .35s" transform="translate(${x},${y})"><rect x="-58" y="-13" width="116" height="26" rx="13" fill="${c}"/><text x="0" y="4.5" text-anchor="middle" style="fill:var(--surface);font-size:12.5px;font-weight:600">${t}</text></g>`;};
  s+=tok(X1,a,"var(--exp)","Ensaios")+tok(X2,b,"var(--accent)","Observacionais");el.innerHTML=s;
  $("grTxt").innerHTML=a===b?`Os dois conjuntos chegaram ao mesmo degrau: certeza <b>${GR_LV[a-1].toLowerCase()}</b>.`:a>b?`Os ensaios randomizados sustentam certeza <b>${GR_LV[a-1].toLowerCase()}</b>; os estudos observacionais, <b>${GR_LV[b-1].toLowerCase()}</b>.`:`Aqui os estudos observacionais (certeza <b>${GR_LV[b-1].toLowerCase()}</b>) informam mais que os ensaios (<b>${GR_LV[a-1].toLowerCase()}</b>). Um ensaio mal conduzido pode valer menos que uma coorte bem desenhada: qualidade não é só o rótulo do desenho.`;
  if(keep)return;
  const tg=(k,x)=>`<label class="toggle"><input type="checkbox" id="gr_${k}_${x[0]}" data-k="${k}" data-f="${x[0]}" ${GR[k][x[0]]?"checked":""}><span>${x[1]}<small>${x[2]}</small></span></label>`;
  $("grC").innerHTML=`<div class="gset"><h4><i style="background:var(--exp)"></i>Ensaios clínicos randomizados</h4><p class="mini">Começam em certeza alta.</p><div class="sub">O que reduz a certeza</div>${GR_DOWN.map(x=>tg("A",x)).join("")}</div>
  <div class="gset"><h4><i style="background:var(--accent)"></i>Estudos observacionais</h4><p class="mini">Começam em certeza baixa.</p><div class="sub">O que reduz a certeza</div>${GR_DOWN.map(x=>tg("B",x)).join("")}<div class="sub">O que pode elevar a certeza</div>${GR_UP.map(x=>tg("B",x)).join("")}</div>`;}
