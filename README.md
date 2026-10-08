# STUDY LAB

**Laboratório visual e interativo sobre tipos de estudos epidemiológicos.**

Criado por **André Demambre Bacchi** (Universidade Federal de Rondonópolis). Faz parte da série EPIDEMIO LAB do [BACCHI LAB](https://andrebacchi.github.io/bacchilab/).

👉 Endereço previsto: **https://andrebacchi.github.io/study-lab/**

Versão piloto 0.2 (outubro de 2026).

## O que é

Aplica e complementa as aulas de Tipos de estudos epidemiológicos (partes I, II e III). A ideia central: uma população de bolinhas (cor = exposição, bolinha cheia = desfecho) vista por cada desenho de estudo.

**Reconhecer**
- Três perguntas: quem decidiu a exposição, qual a unidade de análise, como o tempo entra. Um iceberg para cada tipo de pergunta.
- Linha do tempo: as mesmas 120 pessoas vistas por série de casos, transversal, ecológico, caso-controle, coorte e ensaio clínico, passo a passo, até a tabela 2×2.
- Qual estudo é este?: 14 resumos fictícios para classificar.
- Certeza da evidência: a escada do GRADE.

**Observacionais**
- Transversal: a foto favorece as doenças longas (viés de prevalência); quem veio primeiro (causalidade reversa e confusão).
- Ecológico: a falácia ecológica; tipos de medida (agregada, ambiental, global); razão de taxas.
- Coorte: dez anos de seguimento, perdas ao acaso e diferenciais; risco atribuível nos expostos e na população (RA, RAP, FAP); prospectiva, retrospectiva e ambidirecional.
- Caso-controle: por que a OR e não o RR; quando a OR se parece com o RR; viés de memória; fonte dos controles.

**Experimentais**
- Por que sortear: a vida escolhe × o sorteio escolhe.
- Randomização: recrutamento paciente a paciente com sorteio simples, em blocos (4, 6, variável), estratificado, por minimização e por conglomerados; equilíbrio de três fatores; adivinhar a próxima alocação; sigilo de alocação quebrado; mil ensaios com cada método.
- Cegamento: quem está mascarado (participante, equipe, avaliador, analista) × desfecho subjetivo ou objetivo; sigilo de alocação × mascaramento.
- O que parece efeito: história natural, regressão à média, Hawthorne e placebo; simulador de regressão à média.
- Quase-experimentos: antes e depois, série temporal interrompida, controle não equivalente e controles históricos sobre os mesmos dados.
- Tipos de ensaio: superioridade, não inferioridade e equivalência; paralelo, cruzado, fatorial e por conglomerados; fases I a IV e eventos raros.

**Resultados**
- Desfechos: substituto × clinicamente relevante (caminho causal, classificar desfechos, casos em que o marcador enganou).
- Medidas de efeito: RR, RRR, RAR e NNT conforme o risco basal; hazard ratio e curvas de sobrevida.
- Intenção de tratar × por protocolo.
- Subgrupos: o ensaio fatiado por sexo, idade, signo ou centro.
- Metanálise: forest plot editável, efeito fixo × aleatórios, I², estudos com alto risco de viés.

## Ligação com o 2×2 LAB

Na Linha do tempo, o botão "Abrir esta tabela no 2×2 LAB" abre `https://andrebacchi.github.io/2-2-lab/?a=..&b=..&c=..&d=..&tipo=..` (`tipo`: `coorte`, `caso_controle`, `transversal` ou `ensaio`, as mesmas chaves de `src/lib/studyTypes.js` do 2×2 LAB). O 2×2 LAB lê esses parâmetros em `src/lib/studyLab.js`.

No sentido contrário, o seletor de desenho do 2×2 LAB abre `https://andrebacchi.github.io/study-lab/#tempo-<desenho>`, que cai na Linha do tempo já no desenho escolhido (`serie`, `transversal`, `ecologico`, `cc`, `coorte` ou `ecr`). No fim de cada desenho há o botão "Aprofundar", que leva à tela dele.

## Como editar

O código-fonte fica em `src/` (um arquivo por tela, mais `base.css`, `study.css`, `body.html` e `head.html`).
- `sh build.sh` gera o `index.html` (GitHub Pages, com PWA).
- `sh build.sh artifact` gera `study-lab.html` (versão para artefato do Claude).
- Antes de publicar, aumente `VERSION` no `sw.js`.

`base.css` é o padrão visual da série LAB (o mesmo do STAT LAB), com a cor do app: verde-oliva `#56671b`.

## Conteúdo

- Baseado nas aulas do André; os "Saiba mais" (`src/learn.js` e `src/learn2.js`) trazem o conteúdo delas. Os exemplos do app são genéricos e fictícios, exceto onde o André pediu o conteúdo do slide: o quadro de desfechos substitutos e os três casos históricos (clofibrato, flecainida, rosiglitazona).
- Os tamanhos dos vieses em Cegamento e as camadas em "O que parece efeito" são ilustrativos, e a tela diz isso.
- Escreva "probabilidade", não "chance" (exceto no termo técnico "razão de chances" e na chance de exposição/doença).
- As populações são fixas ou geradas por semente (`rng`), para a turma inteira ver os mesmos números.

© André Demambre Bacchi
