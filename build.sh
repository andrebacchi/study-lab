#!/bin/sh
# Gera o STUDY LAB a partir de src/.
#   sh build.sh            -> index.html (site no GitHub Pages, com PWA)
#   sh build.sh artifact   -> study-lab.html (versão para artefato do Claude, sem <head>)
# Depois de editar, aumente VERSION no sw.js antes de publicar.
set -e
cd "$(dirname "$0")"
body() {
echo '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
echo '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,500;0,6..72,600;1,6..72,500&family=Instrument+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">'
echo '<style>'; cat src/base.css src/study.css; echo '</style>'
cat src/body.html
echo '<script>'; for f in ui lab-tres lab-tempo lab-quiz lab-grade lab-transv lab-eco lab-coorte lab-cc lab-sorteio lab-rand lab-cego lab-efeito lab-quase lab-tipos lab-desfecho lab-medidas lab-itt lab-sub lab-meta learn learn2 main; do cat src/$f.js; echo; done; echo '</script>'
}
if [ "$1" = "artifact" ]; then
  { echo '<title>STUDY LAB</title>'; body; } > study-lab.html; wc -c study-lab.html
else
  { cat src/head.html; body
    echo '<script>if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));}</script>'
    echo '</body>'; echo '</html>'; } > index.html; wc -c index.html
fi
