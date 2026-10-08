# STUDY LAB

**Laboratório visual e interativo sobre tipos de estudos epidemiológicos.**

Criado por **André Demambre Bacchi** (Universidade Federal de Rondonópolis). Faz parte da série EPIDEMIO LAB do [BACCHI LAB](https://andrebacchi.github.io/bacchilab/).

👉 Endereço previsto: **https://andrebacchi.github.io/study-lab/**

Protótipo 0.1 (outubro de 2026).

## O que é

Aplica e complementa as aulas de Tipos de estudos epidemiológicos (partes I, II e III). A ideia central: uma população de bolinhas (cor = exposição, bolinha cheia = desfecho) vista por cada desenho de estudo.

**Reconhecer**
- Três perguntas: quem decidiu a exposição, qual a unidade de análise, como o tempo entra. Os desenhos que não combinam saem do quadro. Um iceberg para cada tipo de pergunta.
- Linha do tempo: as mesmas 120 pessoas vistas por série de casos, transversal, ecológico, caso-controle, coorte e ensaio clínico, passo a passo, até a tabela 2×2.
- Qual estudo é este?: 14 resumos fictícios para classificar.
- Certeza da evidência: a escada do GRADE.

**Observacionais**
- Transversal: a foto favorece as doenças longas (viés de prevalência); quem veio primeiro (causalidade reversa e confusão).
- Ecológico: a falácia ecológica; razão de taxas.
- Coorte: dez anos de seguimento, perdas ao acaso e diferenciais; prospectiva, retrospectiva e ambidirecional.
- Caso-controle: por que a OR e não o RR; quando a OR se parece com o RR; viés de memória; fonte dos controles.

**Experimentais**
- Sorteio: a vida escolhe × sorteio simples, em blocos e estratificado.
- O que parece efeito: história natural, regressão à média, Hawthorne e placebo; simulador de regressão à média.
- Intenção de tratar × por protocolo.
- Metanálise: forest plot editável, efeito fixo × aleatórios, I², estudos com alto risco de viés.

## Ligação com o 2×2 LAB

Na Linha do tempo, o botão "Abrir esta tabela no 2×2 LAB" abre `https://andrebacchi.github.io/2-2-lab/?a=..&b=..&c=..&d=..&tipo=..` (`tipo`: `coorte`, `caso_controle`, `transversal` ou `ensaio`, as mesmas chaves de `src/lib/studyTypes.js` do 2×2 LAB). **O 2×2 LAB ainda precisa passar a ler esses parâmetros** (em `src/pages/Laboratorio.jsx`, no estado inicial de `values` e `studyType`).

## Como editar

O código-fonte fica em `src/` (um arquivo por tela, mais `base.css`, `study.css`, `body.html` e `head.html`).
- `sh build.sh` gera o `index.html` (GitHub Pages, com PWA).
- `sh build.sh artifact` gera `study-lab.html` (versão para artefato do Claude).
- Antes de publicar, aumente `VERSION` no `sw.js`.

`base.css` é o padrão visual da série LAB (o mesmo do STAT LAB), com a cor do app: verde-oliva `#56671b`.

## Conteúdo

- Baseado nas aulas do André; os "Saiba mais" trazem o conteúdo delas. Os exemplos do app são genéricos e fictícios.
- Escreva "probabilidade", não "chance" (exceto no termo técnico "razão de chances" e na chance de exposição/doença).
- As populações são fixas ou geradas por semente (`rng`), para a turma inteira ver os mesmos números.

© André Demambre Bacchi
