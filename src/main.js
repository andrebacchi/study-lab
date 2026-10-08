/* ===================== navegação e início ===================== */
const GRP_L={Reconhecer:"Reconhecer",Observacionais:"Observacionais",Experimentais:"Experimentais"};
function renderNav(){const L=LABS.find(l=>l.id===cur);document.querySelectorAll(".blk").forEach(b=>b.classList.toggle("on",b.dataset.grp===L.grp));
  $("subs").innerHTML=LABS.filter(l=>l.grp===L.grp).map((l,i)=>`<button class="sb ${l.id===cur?"on":""}" data-lab="${l.id}"><i>${i+1}</i>${l.name}</button>`).join("");
  const i=LABS.indexOf(L),p=LABS[i-1],n=LABS[i+1];
  $("labFoot").innerHTML=(p?`<button data-lab="${p.id}"><span>‹ Anterior${p.grp!==L.grp?" · "+GRP_L[p.grp]:""}</span><b>${p.name}</b></button>`:"")+(n?`<button class="nx" data-lab="${n.id}"><span>Próximo${n.grp!==L.grp?" · "+GRP_L[n.grp]:""} ›</span><b>${n.name}</b></button>`:"");}
function go(id){if(typeof coStop==="function"&&cur==="coorte"&&id!=="coorte")coStop();cur=id;document.querySelectorAll(".lab").forEach(s=>s.hidden=s.id!=="lab-"+id);renderNav();R[id]&&R[id]();try{history.replaceState(null,"","#"+id)}catch(e){}}
const navGo=id=>{go(id);window.scrollTo({top:0});};
$("subs").addEventListener("click",e=>{const b=e.target.closest("[data-lab]");if(b)navGo(b.dataset.lab);});
$("labFoot").addEventListener("click",e=>{const b=e.target.closest("[data-lab]");if(b)navGo(b.dataset.lab);});
$("blocks").addEventListener("click",e=>{const b=e.target.closest("[data-grp]");if(!b)return;const L=LABS.find(l=>l.id===cur);if(L.grp===b.dataset.grp)return;navGo(LABS.find(l=>l.grp===b.dataset.grp).id);});
document.querySelectorAll(".more-btn").forEach(b=>b.insertAdjacentHTML("afterbegin",`<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8" cy="8" r="6.3"/><path d="M8 7.2v4M8 4.9v.1" stroke-linecap="round"/></svg>`));
document.addEventListener("click",e=>{const b=e.target.closest("[data-learn]");if(b){const L=LEARN[b.dataset.learn];if(L)openSheet(L[0],L[1]);}});
$("howBtn").onclick=()=>openSheet("Como usar o STUDY LAB",`<p>O STUDY LAB é um laboratório para entender os tipos de estudos epidemiológicos mexendo neles. No topo, escolha o bloco e depois a tela. No fim de cada tela há atalhos para a anterior e a próxima.</p>
<h4>Como ler as pessoas</h4><ul><li><b>A cor</b> mostra a exposição: laranja para expostos (ou tratados), azul para não expostos (ou controles).</li><li><b>Bolinha cheia</b> é quem teve o desfecho; <b>vazada</b>, quem não teve.</li><li><b>Cinza</b> é o que o estudo ainda não mediu.</li><li><b>Quadrado</b>, quando aparece, é um paciente grave.</li></ul>
<h4>As telas</h4><p><b>Reconhecer:</b> ${LABS.filter(l=>l.grp==="Reconhecer").map(l=>l.name).join(", ")}.</p><p><b>Observacionais:</b> ${LABS.filter(l=>l.grp==="Observacionais").map(l=>l.name).join(", ")}.</p><p><b>Experimentais:</b> ${LABS.filter(l=>l.grp==="Experimentais").map(l=>l.name).join(", ")}.</p>
<h4>Ligação com o 2×2 LAB</h4><p>Na Linha do tempo, cada desenho termina em uma tabela 2×2. O botão “Abrir esta tabela no 2×2 LAB” leva os mesmos números para lá, onde dá para explorar a tabela a fundo.</p>
<h4>Sugestão para aula</h4><ol><li>Antes de mexer em um controle, peça para a turma prever o que vai acontecer.</li><li>Mostre no laboratório.</li><li>Discuta a diferença entre a previsão e o resultado.</li></ol>
<p class="src">As populações são simuladas e os exemplos são fictícios. Cada painel tem um “Saiba mais” com o conteúdo das aulas.</p>`);
let rt;window.addEventListener("resize",()=>{clearTimeout(rt);rt=setTimeout(()=>R[cur]&&R[cur](),150);});
function fromHash(){const h=(location.hash||"").slice(1);go(LABS.some(l=>l.id===h)?h:"tres");}
fromHash();window.addEventListener("hashchange",()=>{const h=(location.hash||"").slice(1);if(h!==cur){fromHash();window.scrollTo({top:0});}});

(function(){let seen=false;try{seen=localStorage.getItem("studylab.intro")==="1";}catch(e){}const w=$("welcome");if(!seen)w.hidden=false;
  const done=()=>{w.hidden=true;try{localStorage.setItem("studylab.intro","1")}catch(e){}};
  $("wClose").onclick=done;$("wStart").onclick=()=>{done();navGo("tres");};})();

/* instalar como aplicativo (padrão do BACCHI LAB) */
function platform(){const u=navigator.userAgent||"";if(/iPhone|iPad|iPod/.test(u)||(/Macintosh/.test(u)&&navigator.maxTouchPoints>1))return"ios";if(/Android/.test(u))return"android";return"desktop";}
const SC={ios:`<ol class="steps-l"><li>Abra esta página no <b>Safari</b>.</li><li>Toque em <b>Compartilhar</b> <kbd>⬆︎</kbd>.</li><li>Toque em <b>Adicionar à Tela de Início</b>.</li><li>Confirme o nome e toque em <b>Adicionar</b>.</li></ol>`,
 android:`<ol class="steps-l"><li>Abra esta página no <b>Chrome</b>.</li><li>Toque no menu <kbd>⋮</kbd>.</li><li>Toque em <b>Adicionar à tela inicial</b> ou <b>Instalar app</b>.</li><li>Confirme. O ícone aparece junto dos seus apps.</li></ol>`,
 desktop:`<ol class="steps-l"><li><b>Chrome ou Edge:</b> use o ícone de instalar na barra de endereço, ou o menu <kbd>⋮</kbd> → <b>Transmitir, salvar e compartilhar</b> → <b>Instalar página como app</b>.</li><li><b>Safari (Mac):</b> menu <b>Arquivo</b> → <b>Adicionar ao Dock</b>.</li><li><b>Qualquer navegador:</b> salve nos favoritos com <kbd>Ctrl</kbd>+<kbd>D</kbd>.</li></ol>`};
/* Janela em que o app está rodando: "navegador" (aba comum), "propria" (instalado, na janela dele) ou "outra"
   (aberto dentro de outro app instalado, como o BACCHI LAB). */
function janelaApp(k){
  if(!(matchMedia("(display-mode: standalone)").matches||navigator.standalone===true))return"navegador";
  let fora=false,marca=false;
  try{const r=document.referrer&&new URL(document.referrer);fora=!!r&&r.origin===location.origin&&!r.pathname.startsWith(new URL("./",location.href).pathname);}catch(e){}
  try{if(!document.referrer)localStorage.setItem(k,"1");if(!fora)sessionStorage.setItem(k,"1");marca=localStorage.getItem(k)==="1"||sessionStorage.getItem(k)==="1";}catch(e){}
  return !fora||marca?"propria":"outra";
}
function appInstalado(k){
  if(!navigator.getInstalledRelatedApps)return Promise.resolve(false);
  return navigator.getInstalledRelatedApps().then(l=>{if(l.length){try{localStorage.setItem(k,"1");}catch(e){}}return l.length>0;}).catch(()=>false);
}
const JAN_K="study-lab.instalado";let janela=janelaApp(JAN_K);if(janela==="outra")appInstalado(JAN_K).then(ok=>{if(ok)janela="propria";});
let deferredInstall=null;window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstall=e;});window.addEventListener("appinstalled",()=>{deferredInstall=null;try{localStorage.setItem(JAN_K,"1");}catch(e){}toast("STUDY LAB instalado");});
/* QR code do app. O desenho é fixo: aponta para o endereço do app no ar.
   Foi gerado com o qrcode.js do repositório bacchilab (nível M); se o endereço mudar, gere de novo. */
const QR_URL="https://andrebacchi.github.io/study-lab/",QR_SVG="<svg viewBox=\"0 0 33 33\" shape-rendering=\"crispEdges\" role=\"img\" aria-label=\"QR code para andrebacchi.github.io/study-lab\"><rect width=\"33\" height=\"33\" fill=\"#fff\"/><path d=\"M2 2h7v1h-7zM10 2h1v1h-1zM12 2h1v1h-1zM15 2h1v1h-1zM18 2h1v1h-1zM21 2h2v1h-2zM24 2h7v1h-7zM2 3h1v1h-1zM8 3h1v1h-1zM10 3h3v1h-3zM18 3h3v1h-3zM24 3h1v1h-1zM30 3h1v1h-1zM2 4h1v1h-1zM4 4h3v1h-3zM8 4h1v1h-1zM11 4h2v1h-2zM15 4h1v1h-1zM21 4h1v1h-1zM24 4h1v1h-1zM26 4h3v1h-3zM30 4h1v1h-1zM2 5h1v1h-1zM4 5h3v1h-3zM8 5h1v1h-1zM10 5h4v1h-4zM15 5h2v1h-2zM19 5h1v1h-1zM21 5h1v1h-1zM24 5h1v1h-1zM26 5h3v1h-3zM30 5h1v1h-1zM2 6h1v1h-1zM4 6h3v1h-3zM8 6h1v1h-1zM14 6h1v1h-1zM16 6h2v1h-2zM21 6h1v1h-1zM24 6h1v1h-1zM26 6h3v1h-3zM30 6h1v1h-1zM2 7h1v1h-1zM8 7h1v1h-1zM11 7h1v1h-1zM13 7h1v1h-1zM15 7h1v1h-1zM21 7h2v1h-2zM24 7h1v1h-1zM30 7h1v1h-1zM2 8h7v1h-7zM10 8h1v1h-1zM12 8h1v1h-1zM14 8h1v1h-1zM16 8h1v1h-1zM18 8h1v1h-1zM20 8h1v1h-1zM22 8h1v1h-1zM24 8h7v1h-7zM10 9h4v1h-4zM19 9h1v1h-1zM21 9h1v1h-1zM2 10h1v1h-1zM4 10h2v1h-2zM7 10h3v1h-3zM11 10h3v1h-3zM16 10h2v1h-2zM19 10h3v1h-3zM24 10h1v1h-1zM27 10h1v1h-1zM29 10h2v1h-2zM3 11h5v1h-5zM9 11h3v1h-3zM18 11h1v1h-1zM21 11h6v1h-6zM30 11h1v1h-1zM6 12h1v1h-1zM8 12h1v1h-1zM10 12h1v1h-1zM12 12h2v1h-2zM15 12h2v1h-2zM19 12h2v1h-2zM22 12h2v1h-2zM25 12h2v1h-2zM28 12h2v1h-2zM3 13h5v1h-5zM10 13h1v1h-1zM12 13h4v1h-4zM20 13h1v1h-1zM22 13h3v1h-3zM30 13h1v1h-1zM3 14h2v1h-2zM7 14h4v1h-4zM13 14h1v1h-1zM15 14h1v1h-1zM17 14h1v1h-1zM19 14h1v1h-1zM21 14h1v1h-1zM25 14h1v1h-1zM27 14h2v1h-2zM4 15h2v1h-2zM10 15h3v1h-3zM15 15h5v1h-5zM21 15h2v1h-2zM24 15h1v1h-1zM28 15h3v1h-3zM4 16h1v1h-1zM8 16h1v1h-1zM12 16h1v1h-1zM14 16h1v1h-1zM16 16h1v1h-1zM19 16h1v1h-1zM21 16h2v1h-2zM24 16h1v1h-1zM28 16h3v1h-3zM2 17h3v1h-3zM6 17h2v1h-2zM9 17h2v1h-2zM12 17h1v1h-1zM14 17h1v1h-1zM16 17h3v1h-3zM20 17h1v1h-1zM23 17h4v1h-4zM29 17h1v1h-1zM2 18h1v1h-1zM5 18h1v1h-1zM8 18h1v1h-1zM12 18h1v1h-1zM14 18h1v1h-1zM16 18h1v1h-1zM18 18h1v1h-1zM21 18h3v1h-3zM25 18h3v1h-3zM29 18h1v1h-1zM4 19h1v1h-1zM6 19h2v1h-2zM11 19h2v1h-2zM17 19h1v1h-1zM19 19h1v1h-1zM22 19h1v1h-1zM25 19h1v1h-1zM27 19h3v1h-3zM2 20h1v1h-1zM4 20h2v1h-2zM7 20h5v1h-5zM13 20h5v1h-5zM19 20h1v1h-1zM23 20h1v1h-1zM28 20h1v1h-1zM4 21h2v1h-2zM7 21h1v1h-1zM10 21h4v1h-4zM15 21h2v1h-2zM18 21h2v1h-2zM22 21h2v1h-2zM26 21h1v1h-1zM28 21h1v1h-1zM3 22h2v1h-2zM6 22h4v1h-4zM11 22h1v1h-1zM15 22h2v1h-2zM19 22h2v1h-2zM22 22h7v1h-7zM10 23h2v1h-2zM18 23h3v1h-3zM22 23h1v1h-1zM26 23h5v1h-5zM2 24h7v1h-7zM10 24h1v1h-1zM12 24h3v1h-3zM16 24h1v1h-1zM18 24h2v1h-2zM21 24h2v1h-2zM24 24h1v1h-1zM26 24h2v1h-2zM29 24h1v1h-1zM2 25h1v1h-1zM8 25h1v1h-1zM10 25h2v1h-2zM14 25h5v1h-5zM20 25h1v1h-1zM22 25h1v1h-1zM26 25h2v1h-2zM30 25h1v1h-1zM2 26h1v1h-1zM4 26h3v1h-3zM8 26h1v1h-1zM12 26h1v1h-1zM17 26h3v1h-3zM22 26h5v1h-5zM28 26h3v1h-3zM2 27h1v1h-1zM4 27h3v1h-3zM8 27h1v1h-1zM10 27h2v1h-2zM15 27h1v1h-1zM17 27h2v1h-2zM21 27h1v1h-1zM23 27h1v1h-1zM25 27h3v1h-3zM30 27h1v1h-1zM2 28h1v1h-1zM4 28h3v1h-3zM8 28h1v1h-1zM10 28h2v1h-2zM14 28h3v1h-3zM19 28h3v1h-3zM25 28h1v1h-1zM28 28h1v1h-1zM30 28h1v1h-1zM2 29h1v1h-1zM8 29h1v1h-1zM12 29h3v1h-3zM18 29h1v1h-1zM22 29h2v1h-2zM25 29h3v1h-3zM29 29h1v1h-1zM2 30h7v1h-7zM10 30h1v1h-1zM17 30h1v1h-1zM21 30h5v1h-5zM29 30h1v1h-1z\" fill=\"#161a22\"/></svg>";
function showQR(){
  openSheet("QR code do STUDY LAB",`<div class="qr-wrap"><p>Aponte a câmera do celular para o código.</p><div class="qr-box">${QR_SVG}</div><p class="qr-url" id="qrUrl">andrebacchi.github.io/study-lab</p><div class="qr-acts"><button class="btn primary" id="qrCopy">Copiar link</button>${navigator.share?'<button class="btn" id="qrShare">Compartilhar</button>':''}</div><p class="qr-nota">QR Code é marca registrada da DENSO WAVE INCORPORATED.</p></div>`);
  const g=id=>document.getElementById(id);
  g("qrCopy").onclick=async e=>{const b=e.currentTarget;
    try{await navigator.clipboard.writeText(QR_URL);b.textContent="Link copiado";}
    catch(_){const r=document.createRange();r.selectNodeContents(g("qrUrl"));const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent="Selecionado: copie";}
    setTimeout(()=>{if(b.isConnected)b.textContent="Copiar link";},2200);};
  if(g("qrShare"))g("qrShare").onclick=()=>navigator.share({title:"STUDY LAB",url:QR_URL}).catch(()=>{});
}
$("qrBtn").onclick=showQR;
$("instBtn").onclick=async()=>{if(deferredInstall){try{deferredInstall.prompt();const r=await deferredInstall.userChoice;deferredInstall=null;if(r&&r.outcome==="accepted")return;}catch(e){}}
  openSheet("Instalar o STUDY LAB",`${janela==="outra"?`<p class="fora">Você abriu este app por dentro de outro, como o BACCHI LAB, e daqui não dá para instalar. Toque em <kbd>⋮</kbd> no alto da tela e em <b>Abrir no Chrome</b>; lá, toque de novo em <b>Instalar</b>.</p>`:""}<p>O STUDY LAB pode ficar na tela inicial como um aplicativo, abrir em tela cheia e funcionar sem internet depois da primeira visita.</p><div class="seg" id="platSeg" style="margin:6px 0 10px"><button data-p="ios">iPhone e iPad</button><button data-p="android">Android</button><button data-p="desktop">Computador</button></div><div id="platBody"></div>`);
  const set=k=>{$("platBody").innerHTML=SC[k];document.querySelectorAll("#platSeg button").forEach(b=>b.classList.toggle("on",b.dataset.p===k));};$("platSeg").onclick=e=>{const b=e.target.closest("button");if(b)set(b.dataset.p);};set(platform());};
