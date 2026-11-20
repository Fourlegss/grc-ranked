/* Conteúdo de estudo do CGRCP: domínios, missões, respostas curtas e projeto. */
const DOM=[
 {n:1,name:"GRC Foundations & Frameworks",pt:"Fundamentos e frameworks",w:15},
 {n:2,name:"Governance & Corporate Oversight",pt:"Governança e supervisão",w:12},
 {n:3,name:"Risk Management",pt:"Gestão de riscos",w:18},
 {n:4,name:"Compliance Management",pt:"Gestão de compliance",w:15},
 {n:5,name:"Information Security & Privacy GRC",pt:"Segurança da informação e privacidade",w:15},
 {n:6,name:"Audit & Assurance",pt:"Auditoria e asseguração",w:12},
 {n:7,name:"Technology & GRC Tools",pt:"Tecnologia e ferramentas GRC",w:13},
 {n:8,name:"Final Review",pt:"Revisão final e prática",w:0}
];

const M=[
/* ===== D1 ===== */
{id:"1.1",d:1,t:"O que é GRC (e por que integrado)",goal:"Explicar GRC em uma frase e dizer por que G, R e C precisam andar juntos.",
learn:[
"<b>Governance</b>: como a organização é dirigida e controlada. Quem decide, com que autoridade e como presta contas.",
"<b>Risk</b>: o efeito da incerteza nos objetivos. Gerenciar risco é identificar, avaliar, tratar e monitorar.",
"<b>Compliance</b>: cumprir obrigações. Leis, regulamentos, contratos e políticas internas.",
"Definição da OCEG: GRC é o conjunto integrado de capacidades que permite à organização <b>atingir objetivos de forma confiável, lidar com a incerteza e agir com integridade</b>. O nome disso é <b>Principled Performance</b>.",
"O problema dos <b>silos</b>: cada área com sua planilha, avaliações repetidas, equipes cansadas de responder auditoria e nenhuma visão única. GRC integrado usa uma linguagem, um inventário de riscos e controles e um relatório só."],
terms:[["Principled Performance","Atingir objetivos de forma confiável, lidando com a incerteza e agindo com integridade (OCEG)."],["Silo","Área que gerencia risco ou compliance isolada, gerando duplicidade e lacunas."],["Obligation","Requisito que a organização precisa cumprir (lei, contrato) ou escolhe cumprir (norma voluntária)."],["Integrated GRC","G, R e C compartilhando processos, dados, tecnologia e linguagem."]],
do:"Escreva 3 linhas: o que G, R e C significariam para um estúdio de jogos indie. Exemplo: quem aprova um lançamento, o risco de vazar o build, a LGPD dos jogadores.",
quiz:[
["Segundo a OCEG, GRC permite à organização:",["Eliminar todos os riscos","Atingir objetivos de forma confiável, lidar com a incerteza e agir com integridade","Passar em qualquer auditoria externa","Substituir a auditoria interna"],1,"É a definição de Principled Performance. GRC não elimina risco e não substitui auditoria."],
["Qual o principal problema de gerenciar risco e compliance em silos?",["Custo de software menor","Avaliações duplicadas e nenhuma visão consolidada","Integração excessiva","Conformidade automática"],1,"Silos repetem trabalho e deixam lacunas entre as áreas."]]},

{id:"1.2",d:1,t:"OCEG Red Book (GRC Capability Model)",goal:"Saber os 4 componentes do modelo da OCEG e dar um exemplo de cada.",
learn:[
"O <b>Red Book</b> da OCEG descreve as capacidades de um programa GRC. Ele tem <b>4 componentes</b>: <b>Learn, Align, Perform, Review</b>.",
"<b>Learn</b>: entender o contexto externo e interno, a cultura e as partes interessadas.",
"<b>Align</b>: alinhar direção, objetivos, apetite a risco e obrigações. Aqui você identifica e avalia riscos e desenha a resposta.",
"<b>Perform</b>: agir. Controles, políticas, comunicação, treinamento, incentivos, canal de denúncia, investigação e resposta.",
"<b>Review</b>: monitorar, avaliar e melhorar o programa.",
"Ideia central: GRC é um <b>ciclo contínuo</b>, não um projeto com data de fim."],
terms:[["Learn","Entender contexto, cultura e stakeholders."],["Align","Ligar estratégia, objetivos, riscos e obrigações."],["Perform","Executar ações e controles: prevenir, detectar, responder."],["Review","Monitorar, avaliar e melhorar o programa."]],
do:"Desenhe um círculo L → A → P → R e escreva um exemplo do estúdio em cada parte.",
quiz:[
["Os 4 componentes do OCEG GRC Capability Model são:",["Plan, Do, Check, Act","Learn, Align, Perform, Review","Identify, Protect, Detect, Respond","Govern, Map, Measure, Manage"],1,"PDCA é o ciclo das normas ISO. Identify/Protect... é NIST CSF. Govern/Map/Measure/Manage é NIST AI RMF."],
["Treinar funcionários e manter um canal de denúncia pertence a qual componente?",["Learn","Align","Perform","Review"],2,"São ações executadas pelo programa: Perform."]]},

{id:"1.3",d:1,t:"Modelo das Três Linhas (IIA 2020)",goal:"Dizer quem faz o quê nas três linhas e por que a auditoria interna é independente.",
learn:[
"Atualização de 2020 do antigo <i>Three Lines of Defense</i>. O foco passou a ser <b>papéis e colaboração</b>, não só defesa.",
"<b>Governing body</b> (conselho): presta contas aos stakeholders, define a direção e supervisiona.",
"<b>1ª linha</b> (gestão operacional): entrega produtos e serviços e é a <b>dona dos riscos</b> (risk owner).",
"<b>2ª linha</b> (riscos, compliance, segurança): dá apoio especializado, monitora e <b>questiona</b> (challenge) a 1ª linha.",
"<b>3ª linha</b> (auditoria interna): <b>avaliação independente e objetiva</b> (assurance). Reporta ao conselho ou comitê de auditoria.",
"<b>External assurance providers</b> (auditor externo, reguladores) ficam fora das três linhas."],
terms:[["Risk owner","Quem tem autoridade e responsabilidade para gerenciar um risco. Fica na 1ª linha."],["Second line","Especialistas que apoiam, monitoram e questionam a gestão de riscos."],["Third line","Auditoria interna: assurance independente e objetiva."],["External assurance providers","Auditores externos e reguladores, fora das três linhas."]],
do:"No estúdio, quem seria 1ª, 2ª e 3ª linha? Exemplo: lead dev = 1ª; consultor de LGPD = 2ª; auditor contratado = 3ª.",
quiz:[
["Quem é o dono do risco no Three Lines Model?",["Auditoria interna","Conselho","Gestão operacional (1ª linha)","Auditor externo"],2,"Quem executa o processo é dono do risco dele."],
["A principal característica da 3ª linha é:",["Executar controles","Dar avaliação independente e objetiva","Definir o apetite a risco","Aprovar o orçamento"],1,"A auditoria interna reporta funcionalmente ao conselho ou comitê de auditoria para ser independente."]]},

{id:"1.4",d:1,t:"Mapa dos frameworks",goal:"Saber para que serve cada framework e quais são certificáveis.",
learn:[
"<b>COSO Internal Control (2013)</b>: 5 componentes (Control Environment, Risk Assessment, Control Activities, Information &amp; Communication, Monitoring Activities) e 17 princípios. Objetivos: Operations, Reporting, Compliance. É a base do SOX 404.",
"<b>COSO ERM (2017)</b>: liga risco a estratégia e desempenho. 5 componentes e 20 princípios.",
"<b>ISO 31000:2018</b>: diretrizes de gestão de riscos para qualquer organização. <b>Não é certificável</b>.",
"<b>NIST CSF 2.0</b> (2024): cibersegurança, 6 funções. <b>ISO/IEC 27001</b>: sistema de gestão de segurança da informação, certificável.",
"<b>COBIT 2019</b> (ISACA): governança e gestão de TI. <b>ISO 37301</b>: sistema de gestão de compliance, certificável.",
"Dica de prova: <b>framework</b> é boa prática voluntária, <b>standard</b> é norma com requisitos, <b>regulation</b> é obrigação legal."],
terms:[["COSO IC components","Control Environment, Risk Assessment, Control Activities, Information & Communication, Monitoring Activities."],["Framework vs regulation","Framework: boa prática voluntária. Regulation: obrigação legal (ex.: GDPR)."],["COBIT 2019","Framework da ISACA para governança e gestão de TI."],["Certifiable standard","Norma auditável por certificadora: ISO 27001, 22301, 37301. ISO 31000 não."]],
do:"Monte uma tabela de 3 colunas: framework, serve para, certificável? Preencha de memória e depois confira.",
quiz:[
["Qual destas normas NÃO é certificável?",["ISO/IEC 27001","ISO 31000","ISO 22301","ISO 37301"],1,"A ISO 31000 é um guia de diretrizes, sem requisitos certificáveis."],
["Qual framework é a referência mais usada para avaliar controles internos sobre relatórios financeiros (SOX 404)?",["NIST CSF","COSO Internal Control – Integrated Framework","ISO 31000","OCEG Red Book"],1,"A SEC aceita o COSO 2013 como framework para a avaliação do ICFR."]]},

/* ===== D2 ===== */
{id:"2.1",d:2,t:"Conselho e governança corporativa",goal:"Explicar o papel do conselho, dos comitês e dos deveres fiduciários.",
learn:[
"Governança corporativa é o sistema pelo qual empresas são <b>dirigidas e controladas</b> (Relatório Cadbury, 1992).",
"<b>Board of directors</b>: supervisiona a gestão, aprova a estratégia e o apetite a risco, contrata e avalia o CEO.",
"Comitês comuns: <b>Audit Committee</b> (relatórios financeiros, auditoria interna e externa), Risk, Compensation, Nominating/Governance.",
"<b>Independent directors</b> e a separação entre <b>Chair</b> e <b>CEO</b> reduzem conflitos de interesse.",
"<b>Agency problem</b>: gestores (agentes) podem agir contra os interesses dos donos (principais). A governança cria freios.",
"<b>Fiduciary duties</b>: duty of care (agir com diligência e informação) e duty of loyalty (sem conflito de interesse)."],
terms:[["Agency problem","Conflito entre os interesses dos gestores e os dos donos."],["Duty of care","Dever de decidir com diligência e bem informado."],["Duty of loyalty","Dever de pôr a empresa acima de interesses pessoais."],["Audit committee","Comitê do conselho que supervisiona relatórios financeiros e auditorias."],["Independent director","Conselheiro sem vínculo relevante com a gestão ou a empresa."]],
do:"Explique em voz alta, sem olhar, por que o CEO não deveria presidir o comitê de auditoria.",
quiz:[
["Qual comitê do conselho normalmente supervisiona a auditoria interna e a externa?",["Compensation","Audit","Nominating","Product"],1,"O Audit Committee é o elo entre conselho, auditoria interna e auditor externo."],
["Um diretor aprova contrato com a empresa da própria família sem declarar o vínculo. Isso viola principalmente:",["Duty of care","Duty of loyalty","Business judgment rule","Segregation of duties"],1,"Conflito de interesse não declarado é quebra do dever de lealdade."]]},

{id:"2.2",d:2,t:"Políticas, normas e procedimentos",goal:"Diferenciar policy, standard, procedure e guideline e saber tratar exceções.",
learn:[
"<b>Policy</b>: declaração de alto nível da intenção da gestão. Obrigatória. Aprovada pela alta gestão ou pelo conselho.",
"<b>Standard</b>: requisito obrigatório e específico que apoia a política. Exemplo: senha com 12 caracteres ou mais.",
"<b>Procedure</b>: o passo a passo de como fazer.",
"<b>Guideline</b>: recomendação, <b>não obrigatória</b>.",
"Ciclo de vida: redigir → revisar → aprovar → comunicar e treinar → colher ciência (attestation) → monitorar → revisar (em geral todo ano) → aposentar.",
"<b>Policy exception</b>: desvio formal com justificativa, aprovação, controle compensatório e prazo de validade."],
terms:[["Policy","Intenção da gestão, de alto nível e obrigatória."],["Standard","Requisito obrigatório e específico."],["Procedure","Passo a passo operacional."],["Guideline","Recomendação, não obrigatória."],["Policy exception","Desvio aprovado, com prazo e controle compensatório."]],
do:"Escreva uma política de 3 frases sobre uso de IA generativa no estúdio. Depois escreva um standard e uma guideline ligados a ela.",
quiz:[
["Qual documento é recomendação e não obrigação?",["Policy","Standard","Procedure","Guideline"],3,"Guidelines orientam. As outras três são obrigatórias."],
["Um time precisa descumprir uma política temporariamente. O correto é:",["Ignorar e corrigir depois","Registrar exceção formal com aprovação, prazo e controle compensatório","Mudar a política na hora","Pedir à auditoria interna que aprove"],1,"A auditoria interna não aprova exceções: isso comprometeria a independência dela."]]},

{id:"2.3",d:2,t:"Ética, cultura e responsabilidades",goal:"Entender tone at the top, SoD, RACI e o triângulo da fraude.",
learn:[
"<b>Tone at the top</b>: o exemplo da liderança define a cultura de ética e risco.",
"<b>Code of conduct</b>: regras de comportamento, conflitos de interesse, brindes, antissuborno.",
"<b>Whistleblowing</b>: canal de denúncia confidencial ou anônimo, com <b>proteção contra retaliação</b>.",
"<b>Segregation of duties (SoD)</b>: ninguém controla sozinho uma transação inteira. Quem cadastra o fornecedor não aprova o pagamento.",
"<b>RACI</b>: Responsible (executa), <b>Accountable</b> (responde pelo resultado, só uma pessoa), Consulted, Informed.",
"<b>Fraud triangle</b>: pressão, oportunidade e racionalização. Controles internos atacam principalmente a <b>oportunidade</b>."],
terms:[["Tone at the top","Exemplo ético dado pela alta liderança."],["Segregation of duties","Dividir etapas críticas entre pessoas diferentes."],["Accountable (RACI)","A única pessoa que responde pelo resultado final."],["Fraud triangle","Pressure, opportunity, rationalization."],["Non-retaliation","Proteção a quem denuncia de boa-fé."]],
do:"Ache um conflito de SoD num estúdio: quem publica o build na loja também aprova o próprio código? Como separar?",
quiz:[
["No RACI, quantas pessoas devem ser Accountable por tarefa?",["Nenhuma","Exatamente uma","Pelo menos duas","Todas"],1,"Accountability compartilhada vira accountability de ninguém."],
["Qual lado do triângulo da fraude os controles internos mais conseguem reduzir?",["Pressure","Opportunity","Rationalization","Motivation"],1,"Controles fecham brechas, ou seja, oportunidades."]]},

{id:"2.4",d:2,t:"Apetite a risco, métricas e reporte",goal:"Diferenciar apetite, tolerância e capacidade e saber criar KRIs.",
learn:[
"<b>Risk appetite</b>: quanto risco a organização aceita buscar para cumprir seus objetivos. Aprovado pelo conselho.",
"<b>Risk tolerance</b>: a variação aceitável em torno de um objetivo específico. <b>Risk capacity</b>: o máximo que a organização aguenta sem quebrar.",
"<b>KPI</b> mede desempenho (olha para trás). <b>KRI</b> é sinal de alerta de risco (olha para frente). <b>KCI</b> mede se um controle funciona.",
"O COBIT 2019 separa <b>governança</b> (EDM: Evaluate, Direct, Monitor) de <b>gestão</b> (APO, BAI, DSS, MEA).",
"Bom reporte ao conselho: poucos indicadores, tendência, limites (thresholds) e a ação recomendada."],
terms:[["Risk appetite","Quanto risco se aceita buscar para atingir objetivos."],["Risk tolerance","Variação aceitável em um objetivo específico."],["Risk capacity","Risco máximo suportável sem comprometer a organização."],["KRI","Key Risk Indicator: alerta antecipado de aumento de risco."],["EDM","Evaluate, Direct, Monitor: o domínio de governança do COBIT."]],
do:"Crie 2 KRIs para o estúdio com limites verde, amarelo e vermelho. Exemplo: % de builds publicados sem revisão de código.",
quiz:[
["'Patches críticos pendentes há mais de 30 dias' é melhor classificado como:",["KPI","KRI","Risk capacity","Risk appetite"],1,"É um sinal antecipado de exposição: KRI."],
["No COBIT 2019, Evaluate, Direct and Monitor (EDM) pertence a:",["Gestão","Governança","Auditoria","Operações"],1,"EDM é o único domínio de governança. Os outros quatro são de gestão."]]},

/* ===== D3 ===== */
{id:"3.1",d:3,t:"Vocabulário do risco",goal:"Usar corretamente inherent, residual, threat, vulnerability e risk register.",
learn:[
"ISO 31000: risco é o <b>efeito da incerteza nos objetivos</b>. Pode ser negativo (ameaça) ou positivo (oportunidade).",
"Uma <b>threat</b> explora uma <b>vulnerability</b> e causa <b>impact</b>. Na prática, risco ≈ likelihood × impact.",
"<b>Inherent risk</b>: antes dos controles. <b>Residual risk</b>: depois dos controles. É o residual que se compara com o apetite.",
"<b>Risk owner</b>: a pessoa com autoridade e responsabilidade para gerenciar aquele risco.",
"<b>Risk register</b>: inventário com ID, descrição, causa, consequência, dono, nota inerente, controles, nota residual, tratamento e prazo.",
"Modelo de descrição: 'Por causa de <i>causa</i>, pode ocorrer <i>evento</i>, resultando em <i>consequência</i>'."],
terms:[["Inherent risk","Risco antes de considerar controles."],["Residual risk","Risco que sobra depois dos controles."],["Threat","Algo que pode explorar uma fraqueza e causar dano."],["Vulnerability","Fraqueza que pode ser explorada."],["Risk register","Inventário documentado dos riscos e do tratamento de cada um."]],
do:"Escreva 3 riscos do estúdio no formato causa → evento → consequência. Eles vão para o seu projeto final.",
quiz:[
["O risco avaliado depois de considerar os controles existentes é o:",["Inherent","Residual","Secondary","Systemic"],1,"Residual = o que sobra depois dos controles."],
["Segundo a ISO 31000, risco é:",["A probabilidade de perda financeira","O efeito da incerteza nos objetivos","Uma ameaça explorando uma vulnerabilidade","Qualquer evento negativo"],1,"A definição da ISO inclui efeitos positivos e negativos."]]},

{id:"3.2",d:3,t:"ISO 31000:2018",goal:"Desenhar de memória os princípios, o framework e o processo da ISO 31000.",
learn:[
"Três partes: <b>Principles</b>, <b>Framework</b> e <b>Process</b>.",
"8 princípios em volta de <b>value creation and protection</b>: integrated, structured and comprehensive, customized, inclusive, dynamic, best available information, human and cultural factors, continual improvement.",
"Framework: <b>leadership and commitment</b> no centro, cercado por integration, design, implementation, evaluation e improvement.",
"Processo: <b>scope, context and criteria</b> → <b>risk assessment</b> (identification → analysis → evaluation) → <b>risk treatment</b>. Em volta de tudo: communication and consultation, monitoring and review, recording and reporting.",
"Pegadinha comum: <b>risk assessment</b> = identificar + analisar + avaliar. Tratamento fica fora."],
terms:[["Risk assessment","Identification + analysis + evaluation."],["Risk evaluation","Comparar o resultado da análise com os critérios para decidir se e como tratar."],["Risk criteria","Referências usadas para julgar a importância do risco."],["Leadership and commitment","O centro do framework da ISO 31000."]],
do:"Feche o material e desenhe o processo da ISO 31000 numa folha. Depois confira e corrija com outra cor.",
quiz:[
["Na ISO 31000, risk assessment é composto por:",["Identificação, análise e avaliação","Identificação, tratamento e monitoramento","Análise, tratamento e reporte","Contexto, análise e aceitação"],0,"Tratamento é a etapa seguinte, separada."],
["O que fica no centro do framework da ISO 31000?",["Risk register","Leadership and commitment","Internal audit","Risk treatment"],1,"Sem liderança comprometida, o framework não se integra à organização."]]},

{id:"3.3",d:3,t:"COSO ERM 2017",goal:"Listar os 5 componentes do COSO ERM e diferenciá-lo do COSO IC e da ISO 31000.",
learn:[
"Título completo: <i>Enterprise Risk Management — Integrating with Strategy and Performance</i>. A ideia é que risco faz parte da <b>estratégia</b>.",
"5 componentes: <b>Governance &amp; Culture</b>; <b>Strategy &amp; Objective-Setting</b>; <b>Performance</b>; <b>Review &amp; Revision</b>; <b>Information, Communication &amp; Reporting</b>. São 20 princípios.",
"Risco é considerado em três momentos: a estratégia pode não combinar com a missão, a estratégia escolhida tem implicações, e a execução tem riscos.",
"COSO IC 2013 foca em controles internos. COSO ERM foca em estratégia e desempenho da empresa inteira.",
"ISO 31000 é curta e universal. COSO ERM é mais detalhado e comum em empresas listadas nos EUA."],
terms:[["Governance & Culture","Componente 1 do COSO ERM: supervisão do conselho, cultura e valores."],["Strategy & Objective-Setting","Componente 2: apetite a risco e objetivos de negócio."],["Performance (COSO ERM)","Componente 3: identificar, avaliar, priorizar e responder a riscos."],["Review & Revision","Componente 4: rever o desempenho e mudanças relevantes."],["Information, Communication & Reporting","Componente 5: dados e comunicação sobre risco."]],
do:"Crie uma frase-gancho para lembrar os 5 componentes (ex.: 'Gatos Sempre Pulam Rápido Igual'). Diga em voz alta 3 vezes.",
quiz:[
["Qual NÃO é componente do COSO ERM 2017?",["Governance & Culture","Review & Revision","Control Activities","Strategy & Objective-Setting"],2,"Control Activities é componente do COSO Internal Control 2013."],
["Quantos princípios tem o COSO ERM 2017?",["17","20","8","5"],1,"20 princípios. O COSO IC 2013 tem 17."]]},

{id:"3.4",d:3,t:"Avaliar risco: qualitativo e quantitativo",goal:"Calcular SLE e ALE sem errar e saber quando usar cada abordagem.",
learn:[
"<b>Qualitativo</b>: escalas de 1 a 5 de probabilidade e impacto que viram um <b>heat map</b>. É rápido, mas subjetivo.",
"<b>Quantitativo</b>: valores em dinheiro. <b>SLE = AV × EF</b> (Single Loss Expectancy = Asset Value × Exposure Factor).",
"<b>ALE = SLE × ARO</b> (Annualized Loss Expectancy = SLE × Annualized Rate of Occurrence).",
"Exemplo: servidor de R$ 100.000 que perde 40% do valor num incidente → SLE = R$ 40.000. Acontece uma vez a cada 2 anos (ARO 0,5) → ALE = R$ 20.000 por ano. Um controle que custe mais que isso por ano provavelmente não compensa.",
"Outras técnicas: <b>bow-tie</b> (causas ↔ evento ↔ consequências), FMEA, simulação de Monte Carlo, <b>FAIR</b> (modelo quantitativo de risco cibernético) e análise de cenários."],
terms:[["SLE","Single Loss Expectancy = AV × EF."],["ALE","Annualized Loss Expectancy = SLE × ARO."],["ARO","Quantas vezes por ano o evento deve ocorrer."],["Exposure factor","% do valor do ativo perdido num incidente."],["Heat map","Matriz probabilidade × impacto colorida."]],
do:"Calcule: notebook de R$ 8.000, um roubo perde 100% do valor, ARO = 0,25. Qual é o ALE? (Resposta: R$ 2.000.)",
quiz:[
["AV = R$ 200.000, EF = 25%, ARO = 2. Qual é o ALE?",["R$ 50.000","R$ 100.000","R$ 400.000","R$ 25.000"],1,"SLE = 200.000 × 0,25 = 50.000. ALE = 50.000 × 2 = 100.000."],
["Principal desvantagem da avaliação qualitativa:",["É lenta","Exige dados históricos precisos","É subjetiva e difícil de comparar em dinheiro","Não serve para o conselho"],2,"Escalas dependem do julgamento de quem avalia."]]},

{id:"3.5",d:3,t:"Tratar risco, controles e continuidade",goal:"Escolher a resposta ao risco e o tipo de controle certo, e diferenciar RTO e RPO.",
learn:[
"Respostas: <b>Avoid</b> (parar a atividade), <b>Mitigate</b> (controles), <b>Transfer/Share</b> (seguro, terceirização; a responsabilidade final continua sua), <b>Accept</b> (dentro do apetite e documentado).",
"Controles por função: <b>preventive</b>, <b>detective</b>, <b>corrective</b>, deterrent e <b>compensating</b> (substitui um controle que não dá para aplicar).",
"Controles por natureza: <b>administrative</b> (políticas, treinamento), <b>technical</b> (MFA, criptografia), <b>physical</b> (fechadura, câmera).",
"<b>Third-party risk</b>: due diligence, cláusulas contratuais, direito de auditoria, monitoramento contínuo e plano de saída.",
"Continuidade (ISO 22301): a <b>BIA</b> identifica processos críticos. <b>RTO</b> = tempo máximo para restaurar. <b>RPO</b> = quanto dado se pode perder, medido em tempo. <b>MTD</b> = tempo máximo tolerável parado."],
terms:[["Risk transfer","Passar o impacto financeiro a terceiros (ex.: seguro)."],["Compensating control","Controle alternativo quando o principal não é viável."],["BIA","Business Impact Analysis: identifica processos críticos e impactos de parada."],["RTO","Recovery Time Objective: tempo máximo para voltar a operar."],["RPO","Recovery Point Objective: perda máxima de dados aceitável, em tempo."]],
do:"Para cada um dos seus 3 riscos, escolha uma resposta e um controle preventivo ou detectivo.",
quiz:[
["Contratar seguro cibernético é exemplo de:",["Avoid","Accept","Transfer/Share","Mitigate"],2,"O seguro transfere o impacto financeiro, mas o risco reputacional continua seu."],
["'Podemos perder no máximo 4 horas de dados' define o:",["RTO","RPO","MTD","SLA"],1,"RPO mede perda de dados. RTO mede tempo de parada."]]},

/* ===== D4 ===== */
{id:"4.1",d:4,t:"Programa de compliance",goal:"Montar a sequência de um programa de compliance e conhecer os 7 elementos de um programa eficaz.",
learn:[
"Sequência: identificar <b>obrigações</b> (compliance obligations register) → avaliar o risco de compliance → políticas e controles → treinamento → monitorar e testar → reportar → corrigir.",
"<b>ISO 37301:2021</b>: sistema de gestão de compliance, <b>certificável</b>. Substituiu a ISO 19600.",
"US Federal Sentencing Guidelines, 7 elementos de um programa eficaz: normas e procedimentos; supervisão da alta gestão; cuidado ao delegar autoridade; comunicação e treinamento; monitoramento, auditoria e canal de denúncia; incentivos e disciplina consistentes; resposta e prevenção após violações.",
"<b>Regulatory change management</b>: acompanhar leis novas, avaliar o impacto e atualizar políticas e controles.",
"<b>Monitorar</b> (contínuo, feito por 1ª e 2ª linha) é diferente de <b>auditar</b> (periódico e independente, 3ª linha)."],
terms:[["Compliance obligation","Requisito que a organização deve ou escolhe cumprir."],["ISO 37301","Norma certificável de sistema de gestão de compliance."],["Regulatory change management","Processo de acompanhar e absorver mudanças regulatórias."],["Compliance monitoring","Verificação contínua feita pela gestão, não pela auditoria."]],
do:"Liste 5 obrigações do estúdio: LGPD, termos da Steam ou Google Play, classificação indicativa, impostos, licenças de assets.",
quiz:[
["Qual norma ISO trata de sistema de gestão de compliance certificável?",["ISO 31000","ISO 37301","ISO 27701","ISO 9001"],1,"A ISO 37301 substituiu a ISO 19600, que era só um guia."],
["Primeiro passo lógico de um programa de compliance:",["Comprar um software GRC","Identificar e registrar as obrigações aplicáveis","Contratar auditoria externa","Treinar todos"],1,"Sem saber o que cumprir, não dá para desenhar controles."]]},

{id:"4.2",d:4,t:"SOX 302 e 404",goal:"Diferenciar as seções 302, 404(a), 404(b) e 906 da SOX.",
learn:[
"Sarbanes-Oxley Act (2002), criada após escândalos como Enron e WorldCom. Vale para empresas com ações listadas nos EUA.",
"<b>Section 302</b>: CEO e CFO <b>certificam pessoalmente</b> cada relatório periódico (10-K, 10-Q) e a eficácia dos disclosure controls.",
"<b>Section 404(a)</b>: a gestão avalia e reporta a eficácia do <b>ICFR</b> (Internal Control over Financial Reporting). <b>404(b)</b>: o auditor externo atesta essa avaliação.",
"<b>Section 906</b>: penalidades criminais por certificação falsa. O <b>PCAOB</b> supervisiona os auditores (norma AS 2201).",
"Framework usado: COSO 2013. A TI entra pelos <b>ITGCs</b>: acesso, mudanças, operações e desenvolvimento."],
terms:[["SOX 302","CEO e CFO certificam relatórios e disclosure controls."],["SOX 404","Avaliação do ICFR pela gestão (a) e atestação do auditor (b)."],["ICFR","Internal Control over Financial Reporting."],["PCAOB","Órgão que supervisiona os auditores de empresas listadas nos EUA."],["ITGC","IT General Controls, que sustentam os controles automatizados."]],
do:"Explique para uma criança de 10 anos por que o CEO precisa assinar o relatório financeiro.",
quiz:[
["Qual seção da SOX exige que CEO e CFO certifiquem os relatórios periódicos?",["302","404","802","409"],0,"A 302 traz a certificação. A 906 acrescenta penalidades criminais."],
["A SOX 404(b) exige:",["Que o CEO assine o relatório","Que o auditor externo ateste a avaliação do ICFR","Um canal de denúncia","Notificação de vazamento em 72 h"],1,"404(a) é a avaliação da gestão; 404(b) é a atestação do auditor."]]},

{id:"4.3",d:4,t:"GDPR (e a LGPD)",goal:"Saber os princípios, bases legais, direitos, prazos e multas do GDPR.",
learn:[
"GDPR: regulamento da União Europeia, aplicado desde 2018. Também vale para quem oferece serviços ou monitora pessoas na UE (alcance extraterritorial).",
"<b>Controller</b> decide a finalidade e os meios. <b>Processor</b> trata dados em nome do controller.",
"Princípios (Art. 5): lawfulness, fairness and transparency; purpose limitation; <b>data minimisation</b>; accuracy; storage limitation; integrity and confidentiality; <b>accountability</b>.",
"6 bases legais (Art. 6): consent, contract, legal obligation, vital interests, public task, legitimate interests.",
"Direitos: acesso, retificação, apagamento (right to be forgotten), restrição, portabilidade, oposição e não ser sujeito a decisão só automatizada.",
"Vazamento: avisar a autoridade em até <b>72 horas</b>. DPIA para tratamento de alto risco. Multa de até <b>€ 20 milhões ou 4%</b> do faturamento global anual, o que for maior.",
"A LGPD (Brasil) é parecida: ANPD como autoridade, encarregado no papel do DPO e 10 bases legais."],
terms:[["Controller","Quem decide por que e como os dados são tratados."],["Processor","Quem trata dados em nome do controller."],["DPIA","Data Protection Impact Assessment, obrigatória em tratamento de alto risco."],["Data minimisation","Coletar só o necessário para a finalidade."],["72 hours","Prazo do GDPR para notificar a autoridade sobre um vazamento."]],
do:"Pense num jogo mobile seu: que dados pessoais ele coleta? Qual seria a base legal de cada um?",
quiz:[
["Prazo do GDPR para notificar a autoridade depois de saber de um vazamento:",["24 horas","72 horas","30 dias","60 dias"],1,"72 horas, quando houver risco aos titulares."],
["Coletar só os dados estritamente necessários é o princípio de:",["Purpose limitation","Data minimisation","Storage limitation","Accuracy"],1,"Purpose limitation é sobre a finalidade; minimisation é sobre a quantidade."]]},

{id:"4.4",d:4,t:"HIPAA e outros regimes",goal:"Saber o que é PHI, quem a HIPAA alcança e quais são suas três regras principais.",
learn:[
"A HIPAA (EUA) protege <b>PHI</b> (Protected Health Information).",
"<b>Covered entities</b>: planos de saúde, clearinghouses e prestadores que transmitem dados eletronicamente. <b>Business associates</b> prestam serviço a elas e assinam um <b>BAA</b>.",
"<b>Privacy Rule</b>: uso e divulgação de PHI, princípio do <b>minimum necessary</b> e direitos do paciente.",
"<b>Security Rule</b>: protege a ePHI com salvaguardas <b>administrative, physical e technical</b>.",
"<b>Breach Notification Rule</b>: avisar os indivíduos sem demora injustificada, em até <b>60 dias</b>.",
"Outros: <b>PCI DSS v4.0</b> (dados de cartão; padrão da indústria, não lei) e leis setoriais."],
terms:[["PHI","Informação de saúde identificável protegida pela HIPAA."],["Covered entity","Plano de saúde, clearinghouse ou prestador que transmite dados eletronicamente."],["Business associate","Terceiro que trata PHI para uma covered entity; assina BAA."],["Minimum necessary","Usar ou divulgar só o mínimo de PHI necessário."],["PCI DSS","Padrão de segurança da indústria de cartões de pagamento."]],
do:"Compare em 3 linhas: GDPR 72 h para a autoridade × HIPAA até 60 dias para os indivíduos. Quem é avisado em cada caso?",
quiz:[
["Uma empresa de nuvem que guarda prontuários para um hospital é, na HIPAA, um(a):",["Covered entity","Business associate","Clearinghouse","Data subject"],1,"Ela presta serviço à covered entity e precisa assinar um BAA."],
["PCI DSS é:",["Uma lei federal dos EUA","Um padrão da indústria de cartões","Um regulamento da UE","Uma norma ISO"],1,"É exigido por contrato com as bandeiras, não por lei."]]},

/* ===== D5 ===== */
{id:"5.1",d:5,t:"Fundamentos de segurança",goal:"Aplicar CIA, least privilege, defense in depth e classificação de dados.",
learn:[
"<b>CIA triad</b>: Confidentiality, Integrity, Availability.",
"<b>Least privilege</b> (só o acesso necessário), <b>need to know</b> e <b>defense in depth</b> (camadas de controle).",
"<b>Data classification</b>: por exemplo Public, Internal, Confidential, Restricted. O <b>data owner</b> classifica; o <b>custodian</b> opera e protege.",
"<b>IAM</b>: identificação, autenticação (MFA), autorização e accountability (logs). Revisões periódicas de acesso.",
"Ameaças comuns: phishing, ransomware, insider e falhas de terceiros."],
terms:[["CIA triad","Confidentiality, Integrity, Availability."],["Least privilege","Dar só o acesso mínimo necessário à função."],["Defense in depth","Várias camadas de controle; se uma falha, outra segura."],["Data owner","Responsável por classificar e decidir o acesso ao dado."],["Data custodian","Quem opera e protege o dado no dia a dia (ex.: TI)."]],
do:"Classifique 5 arquivos do estúdio: código-fonte, arte final, lista de e-mails de jogadores, trailer público, contrato com a publisher.",
quiz:[
["Ransomware que criptografa os servidores afeta primeiro:",["Confidentiality","Integrity","Availability","Non-repudiation"],2,"O impacto imediato é ficar sem acesso. Se houver exfiltração, afeta também a confidencialidade."],
["Quem é responsável por classificar um conjunto de dados?",["Data custodian","Data owner","Usuário final","Auditor"],1,"O owner classifica; o custodian implementa a proteção."]]},

{id:"5.2",d:5,t:"NIST CSF 2.0",goal:"Saber as 6 funções, os Profiles e os Tiers do NIST CSF 2.0.",
learn:[
"Publicado em fevereiro de 2024. Serve para qualquer organização, não só infraestrutura crítica.",
"6 funções: <b>Govern</b> (nova), <b>Identify</b>, <b>Protect</b>, <b>Detect</b>, <b>Respond</b>, <b>Recover</b>. Govern fica no centro e orienta as outras.",
"Estrutura: Functions → Categories → Subcategories. Exemplo: GV.OC = Organizational Context.",
"<b>Organizational Profiles</b>: Current Profile (como estamos) e Target Profile (onde queremos chegar). A diferença vira plano de ação (<b>gap analysis</b>).",
"<b>Tiers</b>: 1 Partial, 2 Risk Informed, 3 Repeatable, 4 Adaptive. Descrevem o rigor da gestão de risco; não são metas obrigatórias."],
terms:[["Govern (CSF 2.0)","Função nova: estratégia, papéis, políticas e supervisão de risco cibernético."],["Current Profile","Retrato dos resultados de segurança atuais."],["Target Profile","Resultados de segurança desejados."],["CSF Tiers","Partial, Risk Informed, Repeatable, Adaptive."],["Gap analysis","Comparar atual e alvo para priorizar ações."]],
do:"Escreva as 6 funções do CSF em ordem e uma ação do estúdio em cada (ex.: Recover = backup do repositório testado).",
quiz:[
["Qual função foi adicionada no NIST CSF 2.0?",["Identify","Govern","Recover","Detect"],1,"Govern entrou na versão 2.0 de 2024."],
["Comparar o Current Profile com o Target Profile serve para:",["Certificar a empresa","Identificar lacunas e priorizar ações","Calcular o ALE","Definir o Tier legal"],1,"O NIST CSF não é certificável; profiles servem para gap analysis."]]},

{id:"5.3",d:5,t:"ISO 27001, NIST RMF e SOC 2",goal:"Diferenciar ISO 27001, NIST RMF e SOC 2 e saber o que é SoA.",
learn:[
"<b>ISO/IEC 27001:2022</b>: requisitos de um ISMS (SGSI), certificável. Cláusulas 4 a 10: contexto, liderança, planejamento, suporte, operação, avaliação de desempenho e melhoria (lógica PDCA).",
"<b>Annex A</b>: 93 controles em 4 temas: Organizational (37), People (8), Physical (14), Technological (34). A ISO 27002 explica como implementar.",
"<b>Statement of Applicability (SoA)</b>: lista quais controles do Annex A se aplicam, a justificativa e o status.",
"<b>NIST RMF</b> (SP 800-37), 7 passos: Prepare, Categorize, Select, Implement, Assess, Authorize, Monitor. Catálogo de controles: SP 800-53.",
"<b>SOC 2</b> (AICPA): relatório de auditor sobre os Trust Services Criteria (Security, Availability, Processing Integrity, Confidentiality, Privacy). <b>Type I</b> = desenho num ponto no tempo. <b>Type II</b> = eficácia ao longo de um período (6 a 12 meses, por exemplo)."],
terms:[["ISMS","Information Security Management System (SGSI)."],["Statement of Applicability","Documento da ISO 27001 que justifica cada controle do Annex A."],["Annex A (2022)","93 controles em 4 temas."],["SOC 2 Type II","Atesta que os controles funcionaram ao longo de um período."],["NIST RMF","Prepare, Categorize, Select, Implement, Assess, Authorize, Monitor."]],
do:"Responda: um cliente grande pede 'prova de segurança' ao seu estúdio. Você ofereceria ISO 27001 ou SOC 2? Por quê?",
quiz:[
["Documento da ISO 27001 que justifica incluir ou excluir cada controle do Annex A:",["Risk register","Statement of Applicability","SOC 2 report","BIA"],1,"A SoA é obrigatória na certificação."],
["Um cliente quer saber se os controles de um fornecedor funcionaram durante o último ano. Peça um:",["SOC 2 Type I","SOC 2 Type II","Certificado ISO 31000","Current Profile"],1,"Type I olha só o desenho num dia; Type II testa o período."]]},

{id:"5.4",d:5,t:"Privacidade e resposta a incidentes",goal:"Aplicar Privacy by Design e as fases de resposta a incidentes.",
learn:[
"<b>Privacy by Design</b> (7 princípios de Ann Cavoukian): proativo; privacidade <b>por padrão</b> (by default); embutida no design; funcionalidade total; segurança de ponta a ponta; visibilidade e transparência; respeito ao usuário.",
"<b>PIA/DPIA</b>: avaliar o impacto na privacidade antes de lançar um tratamento novo ou de alto risco.",
"Ciclo de vida do dado: coleta → uso → armazenamento → compartilhamento → retenção → descarte seguro.",
"Resposta a incidentes (NIST SP 800-61, modelo clássico): <b>Preparation</b> → <b>Detection &amp; Analysis</b> → <b>Containment, Eradication &amp; Recovery</b> → <b>Post-Incident Activity</b>. A revisão 3 (2025) liga esse ciclo às funções do CSF 2.0.",
"O papel do GRC no incidente: acionar jurídico e privacidade, avaliar a obrigação de notificar (GDPR 72 h, HIPAA até 60 dias) e preservar evidências."],
terms:[["Privacy by default","A opção mais protetora já vem ligada, sem o usuário agir."],["Privacy by Design","Privacidade embutida desde o desenho do sistema."],["Containment","Fase de isolar o incidente para limitar o dano."],["Lessons learned","Revisão pós-incidente para melhorar controles."]],
do:"Simule: vazou a lista de e-mails dos jogadores. Escreva o que fazer em cada uma das 4 fases.",
quiz:[
["Um app que já vem configurado para coletar o mínimo de dados, sem o usuário mexer em nada, aplica:",["Privacy by default","Data portability","Legitimate interest","Pseudonymisation"],0,"Configuração protetora de fábrica é privacy by default."],
["Na fase Post-Incident Activity, o foco é:",["Isolar o sistema","Lições aprendidas e melhoria","Restaurar backups","Detectar o ataque"],1,"Isolar e restaurar ficam na fase de Containment, Eradication & Recovery."]]},

/* ===== D6 ===== */
{id:"6.1",d:6,t:"Auditoria interna e normas do IIA",goal:"Diferenciar independência e objetividade e conhecer as normas atuais do IIA.",
learn:[
"Auditoria interna: atividade <b>independente e objetiva</b> de assurance e consultoria, que agrega valor e melhora as operações.",
"<b>Global Internal Audit Standards</b> do IIA, em vigor desde janeiro de 2025, substituíram as normas de 2017: <b>5 domínios e 15 princípios</b> (Purpose; Ethics &amp; Professionalism; Governing the IA Function; Managing the IA Function; Performing IA Services).",
"Material antigo ainda fala em 'Practice Advisories' e normas numeradas 1000/2000. Saiba que existem, mas a versão atual é a de 2024.",
"<b>Independence</b> é organizacional: o CAE reporta funcionalmente ao conselho ou comitê de auditoria. <b>Objectivity</b> é individual: sem conflito, e sem auditar algo que você operou nos últimos 12 meses.",
"<b>Internal audit charter</b>: documento aprovado pelo conselho com propósito, autoridade e responsabilidades da auditoria.",
"Auditoria interna (para a organização, todos os riscos) ≠ auditoria externa (opinião sobre as demonstrações financeiras, para terceiros)."],
terms:[["CAE","Chief Audit Executive: o líder da auditoria interna."],["Independence","Livre de interferência na estrutura: reporta ao conselho."],["Objectivity","Atitude imparcial do auditor, sem conflito de interesse."],["Audit charter","Documento que dá mandato e autoridade à auditoria interna."],["Assurance vs consulting","Assurance avalia e opina; consulting aconselha sem assumir a gestão."]],
do:"Escreva 2 frases: por que a auditoria interna não deveria reportar só ao CFO?",
quiz:[
["Para garantir independência, o Chief Audit Executive deve reportar funcionalmente a:",["CFO","CEO","Conselho ou comitê de auditoria","Gerente de TI"],2,"O reporte administrativo pode ser ao CEO; o funcional é ao conselho."],
["Um auditor que gerenciou compras até 6 meses atrás vai auditar compras. O problema é de:",["Competência","Objetividade","Confidencialidade","Materialidade"],1,"Ele estaria avaliando o próprio trabalho."]]},

{id:"6.2",d:6,t:"Processo de auditoria e evidências",goal:"Saber as fases da auditoria, os tipos de teste e a força de cada evidência.",
learn:[
"Fases: <b>Planning</b> (plano anual baseado em risco, escopo e objetivos) → <b>Fieldwork</b> (testes) → <b>Reporting</b> → <b>Follow-up</b> (conferir se a ação foi implementada).",
"<b>Test of design</b>: o controle, se funcionar, mitiga o risco? Normalmente via walkthrough. <b>Test of operating effectiveness</b>: funcionou de fato no período? Normalmente via amostra.",
"Técnicas, da mais fraca para a mais forte: inquiry (entrevista), observation, inspection (documentos) e <b>re-performance</b> (o auditor refaz o controle).",
"A evidência precisa ser <b>sufficient, reliable, relevant e useful</b>. Evidência de terceiro independente vale mais que evidência interna.",
"Amostragem estatística permite generalizar o resultado; a não estatística depende de julgamento."],
terms:[["Walkthrough","Seguir uma transação do início ao fim para entender e testar o desenho."],["Re-performance","Auditor executa o controle de novo; evidência mais forte."],["Test of design","Avalia se o controle, como desenhado, mitiga o risco."],["Operating effectiveness","Avalia se o controle funcionou durante o período."],["Follow-up","Verificar se as ações corretivas foram implementadas."]],
do:"Escolha um controle do estúdio (ex.: revisão de código antes do merge) e descreva como testaria o desenho e a eficácia.",
quiz:[
["Qual técnica dá a evidência mais forte de que um controle funcionou?",["Inquiry","Observation","Re-performance","Questionário"],2,"Inquiry sozinha nunca basta."],
["Verificar se a aprovação foi feita em 25 transações do ano é teste de:",["Design","Operating effectiveness","Walkthrough","Inquiry"],1,"Amostra ao longo do período = eficácia operacional."]]},

{id:"6.3",d:6,t:"Achados, deficiências e assurance",goal:"Escrever um achado nos 5 Cs e classificar deficiências e opiniões.",
learn:[
"Achado de auditoria (5 Cs): <b>Criteria</b> (o que deveria ser), <b>Condition</b> (o que é), <b>Cause</b> (por quê), <b>Consequence/Effect</b> (impacto) e <b>Corrective action</b> (recomendação).",
"SOX: <b>control deficiency</b> &lt; <b>significant deficiency</b> &lt; <b>material weakness</b>. A material weakness é a possibilidade razoável de um erro material não ser prevenido ou detectado a tempo.",
"Opiniões do auditor externo: <b>unqualified/unmodified</b> (limpa), <b>qualified</b> (com ressalva), <b>adverse</b> (adversa) e <b>disclaimer</b> (abstenção).",
"<b>Continuous auditing</b> é a auditoria usando dados automatizados. <b>Continuous monitoring</b> é a gestão monitorando os próprios controles.",
"<b>Combined assurance / assurance map</b>: mostra quem dá assurance sobre qual risco, para evitar lacunas e duplicação."],
terms:[["Criteria","O padrão esperado num achado de auditoria."],["Condition","O que o auditor encontrou de fato."],["Material weakness","Deficiência grave no ICFR com possibilidade razoável de erro material."],["Disclaimer of opinion","O auditor não consegue opinar por falta de evidência."],["Combined assurance","Coordenação das fontes de assurance sobre os riscos."]],
do:"Escreva um achado nos 5 Cs: 'contas de ex-funcionários ainda ativas no painel da loja de jogos'.",
quiz:[
["Num achado, 'a política exige remover o acesso em até 24 h após o desligamento' é o:",["Condition","Criteria","Cause","Effect"],1,"Criteria é a regra; Condition é o que foi encontrado."],
["Opinião em que o auditor não consegue obter evidência suficiente para opinar:",["Unqualified","Qualified","Adverse","Disclaimer"],3,"Adverse é quando há evidência de distorção relevante e generalizada."]]},

/* ===== D7 ===== */
{id:"7.1",d:7,t:"Plataformas GRC",goal:"Saber os módulos de uma plataforma GRC e como escolher uma.",
learn:[
"Ferramentas GRC ou IRM (Integrated Risk Management): ServiceNow IRM, Archer, MetricStream, AuditBoard, OneTrust. Planilhas servem no começo, mas não escalam.",
"Módulos típicos: risk register, controls library, policy management, issues &amp; remediation, audit management, third-party risk, compliance mapping, incidentes e continuidade.",
"<b>Common control framework</b>: um controle mapeado para vários requisitos (ISO 27001, SOC 2, LGPD). 'Test once, comply many'.",
"Como escolher: requisitos do negócio primeiro; depois integração, usabilidade, relatórios, escalabilidade e custo total (<b>TCO</b>). Implantar em fases, começando pelo maior problema.",
"Erro clássico: comprar a ferramenta antes de ter processo. Tecnologia automatiza processo; não cria processo."],
terms:[["IRM","Integrated Risk Management: nome que o Gartner usa para plataformas GRC."],["Controls library","Catálogo central de controles da organização."],["Common control framework","Um controle atende vários frameworks ao mesmo tempo."],["Control mapping","Ligação entre controles internos e requisitos externos."],["TCO","Total Cost of Ownership: licença + implantação + manutenção."]],
do:"Liste 3 requisitos que o seu estúdio teria para uma ferramenta GRC, antes de olhar qualquer fornecedor.",
quiz:[
["Mapear um único controle de MFA para ISO 27001, SOC 2 e PCI DSS ao mesmo tempo é benefício de:",["Risk acceptance","Common control framework","Heat map","Audit charter"],1,"Test once, comply many."],
["Primeiro passo ao escolher uma plataforma GRC:",["Pedir demo ao fornecedor mais famoso","Definir requisitos e processos do negócio","Migrar todas as planilhas","Comprar a licença anual"],1,"Processo antes de ferramenta."]]},

{id:"7.2",d:7,t:"Automação, dados e monitoramento contínuo",goal:"Explicar CCM, integrações e o modelo de responsabilidade compartilhada.",
learn:[
"<b>Continuous Control Monitoring (CCM)</b>: testar controles automaticamente com dados e APIs. Exemplo: checar todo dia se todos os usuários têm MFA.",
"Integrações comuns: IAM/AD, SIEM, scanners de vulnerabilidade, ERP, ferramentas de nuvem (CSPM) e sistemas de chamados.",
"Dados de qualidade: fonte única, dono do dado, dicionário e trilha de auditoria (<b>audit trail</b>). Indicador ruim gera decisão ruim.",
"<b>Shared responsibility model</b> na nuvem: o provedor protege a nuvem; o cliente protege o que coloca nela (dados, identidades, configuração).",
"Dashboards: KRIs com limites, tendência e detalhamento. Mostrar primeiro o que pede decisão."],
terms:[["CCM","Continuous Control Monitoring: teste automatizado e frequente de controles."],["SIEM","Ferramenta que centraliza e correlaciona logs de segurança."],["Shared responsibility","Divisão de deveres de segurança entre provedor de nuvem e cliente."],["Audit trail","Registro cronológico de quem fez o quê e quando."]],
do:"Escolha um controle do estúdio e descreva como automatizar o teste dele (o que checar, com que frequência, quem recebe o alerta).",
quiz:[
["Em IaaS, quem configura corretamente as permissões dos buckets de armazenamento?",["O provedor de nuvem","O cliente","O auditor externo","Ninguém"],1,"Configuração e dados são responsabilidade do cliente."],
["Um script que checa todo dia contas sem MFA e abre um chamado é exemplo de:",["Continuous Control Monitoring","Risk transfer","Test of design","Disclaimer"],0,"É monitoramento automatizado e contínuo de um controle."]]},

{id:"7.3",d:7,t:"ITGCs e governança de IA",goal:"Listar as áreas de ITGC e os principais frameworks de governança de IA.",
learn:[
"<b>ITGCs</b> (IT General Controls): <b>access to programs and data</b>, <b>program changes</b>, <b>program development</b> e <b>computer operations</b> (jobs, backup, incidentes).",
"Se os ITGCs falham, não dá para confiar nos <b>application controls</b> (controles automatizados) que dependem deles.",
"<b>Change management</b>: solicitação → aprovação → teste → implantação por pessoa diferente de quem desenvolveu (SoD) → revisão.",
"Governança de IA: <b>NIST AI RMF 1.0</b> tem 4 funções: <b>Govern, Map, Measure, Manage</b>. <b>ISO/IEC 42001</b>: sistema de gestão de IA, certificável. <b>EU AI Act</b>: classifica por risco (inaceitável, alto, limitado, mínimo).",
"IA dentro do GRC: resumir regulamentos, mapear controles, analisar evidências. Sempre com revisão humana e trilha de auditoria."],
terms:[["ITGC","Access, program changes, program development, computer operations."],["Application control","Controle automatizado dentro de um sistema (ex.: validação de campo)."],["NIST AI RMF","Govern, Map, Measure, Manage."],["ISO/IEC 42001","Norma certificável de sistema de gestão de IA."],["EU AI Act","Lei europeia que classifica sistemas de IA por nível de risco."]],
do:"Descreva o fluxo de mudança ideal para publicar um patch do seu jogo, com quem aprova e quem publica.",
quiz:[
["Qual NÃO é uma área clássica de ITGC?",["Access to programs and data","Program changes","Computer operations","Marketing analytics"],3,"As quatro clássicas são acesso, mudanças, desenvolvimento e operações."],
["As 4 funções do NIST AI RMF são:",["Govern, Map, Measure, Manage","Identify, Protect, Detect, Respond","Plan, Do, Check, Act","Learn, Align, Perform, Review"],0,"Cuidado para não confundir com CSF, PDCA e OCEG."]]},

/* ===== REVISÃO ===== */
{id:"R1",d:8,t:"Simulado A: domínios 1 a 4",kind:"quiz",preset:[1,2,3,4],n:20,goal:"20 questões dos domínios 1 a 4. Meta: 70% ou mais. Anote os temas que errar."},
{id:"R2",d:8,t:"Simulado B: domínios 5 a 7",kind:"quiz",preset:[5,6,7],n:18,goal:"18 questões dos domínios 5 a 7. Meta: 70% ou mais. Anote os temas que errar."},
{id:"R3",d:8,t:"Respostas curtas em inglês",kind:"sa",goal:"Treinar as 25 questões abertas da prova: definir, explicar e dar exemplo em 2 a 4 frases, em inglês."},
{id:"R4",d:8,t:"Projeto: mini programa GRC do estúdio",kind:"proj",goal:"Juntar tudo o que você escreveu nas missões num mini programa GRC. Isso é a sua experiência prática."}
];

const SA=[
["Define residual risk and explain how it relates to risk appetite.","Residual risk is the risk that remains after controls and treatments are applied. It is compared with the risk appetite: if it is above appetite, more treatment is needed; if it is within appetite, the risk owner can accept it and keep monitoring it."],
["Describe the roles in the IIA Three Lines Model.","The governing body oversees and is accountable to stakeholders. The first line (operational management) owns and manages risk. The second line (risk, compliance) provides expertise, monitoring and challenge. The third line (internal audit) gives independent and objective assurance to the board."],
["What is the difference between SOX Section 302 and Section 404?","Section 302 requires the CEO and CFO to personally certify periodic financial reports and disclosure controls. Section 404 requires management to assess internal control over financial reporting (404a) and the external auditor to attest to that assessment (404b)."],
["List the six functions of NIST CSF 2.0.","Govern, Identify, Protect, Detect, Respond and Recover. Govern was added in version 2.0 and guides the other five."],
["Explain the difference between a SOC 2 Type I and a Type II report.","A Type I report evaluates the design of controls at a single point in time. A Type II report tests whether the controls operated effectively over a period, usually 6 to 12 months, so it gives stronger assurance."],
["Calculate the ALE: asset value $50,000, exposure factor 40%, ARO 0.5. Show the formula.","SLE = AV × EF = 50,000 × 0.4 = $20,000. ALE = SLE × ARO = 20,000 × 0.5 = $10,000 per year."],
["Name four GDPR data subject rights.","Right of access, right to rectification, right to erasure (right to be forgotten), right to data portability. Others: restriction, objection, and rights related to automated decision-making."],
["What are the elements of a well-written audit finding?","Criteria (what should be), condition (what was found), cause (why it happened), effect or consequence (the impact), and a recommendation or corrective action."],
["Why is segregation of duties important? Give an example.","It prevents one person from controlling a whole transaction, which reduces fraud and error. Example: the employee who creates a vendor in the system should not approve payments to that vendor."],
["What is a compensating control? Give an example.","A compensating control is an alternative control used when the primary control is not feasible, giving similar risk reduction. Example: in a small team without full segregation of duties, a manager reviews a monthly log of all payments."],
["What is the difference between RTO and RPO?","RTO (Recovery Time Objective) is the maximum acceptable time to restore a process after a disruption. RPO (Recovery Point Objective) is the maximum acceptable data loss, measured in time since the last good backup."],
["Explain the difference between a policy and a standard.","A policy is a high-level, mandatory statement of management intent. A standard is a mandatory, specific requirement that supports the policy, for example a minimum password length."]
];

const PROJ=[
"Contexto: 1 parágrafo descrevendo o estúdio fictício (tamanho, jogos, plataformas, dados que coleta).",
"Obrigações: as 5 obrigações da missão 4.1 numa tabela (fonte, requisito, dono).",
"Risk register: 10 riscos no formato causa → evento → consequência, com nota inerente, controle, nota residual e dono (missões 3.1, 3.4, 3.5).",
"Políticas: 3 políticas curtas (IA generativa, controle de acesso, backup), cada uma com um standard (missão 2.2).",
"Mapa de controles: 8 controles ligados ao NIST CSF 2.0 e à LGPD (missões 5.2 e 7.1).",
"KRIs: 3 indicadores com limites verde, amarelo e vermelho (missão 2.4).",
"Auditoria: 1 achado nos 5 Cs e o teste de um controle (missões 6.2 e 6.3).",
"Incidente: o plano de resposta ao vazamento de e-mails (missão 5.4)."
];

