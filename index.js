/* ============================================================
   EcoPegada — Calculadora de Pegada de Carbono Interativa
   Cada alternativa tem um valor estimado de emissão (kg CO₂/ano).
   Os valores são aproximações educativas.
   ============================================================ */

const QUESTIONS = [
  {
    category: "Transporte",
    text: "Como você costuma ir para a escola?",
    options: [
      { label: "Caminhando ou de bicicleta", co2: 0 },
      { label: "Transporte público", co2: 180 },
      { label: "Carona ou transporte escolar", co2: 350 },
      { label: "Carro particular", co2: 600 },
    ],
    tip: "Sempre que possível, vá a pé, de bicicleta ou use transporte coletivo. Um carro emite em média 120 g de CO₂ por km.",
  },
  {
    category: "Transporte",
    text: "Com que frequência sua família utiliza carro?",
    options: [
      { label: "Quase nunca", co2: 50 },
      { label: "Algumas vezes por semana", co2: 400 },
      { label: "Todos os dias", co2: 900 },
      { label: "Mais de uma vez por dia", co2: 1400 },
    ],
    tip: "Combine trajetos da família em uma única saída e prefira caronas compartilhadas para reduzir as viagens de carro.",
  },
  {
    category: "Alimentação",
    text: "Com que frequência você consome alimentos produzidos na sua região?",
    options: [
      { label: "Sempre", co2: 50 },
      { label: "Frequentemente", co2: 150 },
      { label: "Raramente", co2: 300 },
      { label: "Nunca", co2: 450 },
    ],
    tip: "Alimentos locais viajam menos até o seu prato. Prefira feiras e produtores da sua região para cortar emissões de transporte.",
  },
  {
    category: "Resíduos",
    text: "Quantas vezes por semana você recicla resíduos?",
    options: [
      { label: "Todos os dias", co2: 20 },
      { label: "Algumas vezes por semana", co2: 100 },
      { label: "Raramente", co2: 220 },
      { label: "Nunca", co2: 350 },
    ],
    tip: "Separe papel, plástico, vidro e metal. Reciclar 1 kg de alumínio evita a emissão de cerca de 9 kg de CO₂.",
  },
  {
    category: "Consumo",
    text: "Com que frequência você utiliza garrafas ou copos reutilizáveis?",
    options: [
      { label: "Sempre", co2: 10 },
      { label: "Frequentemente", co2: 40 },
      { label: "Às vezes", co2: 90 },
      { label: "Nunca", co2: 150 },
    ],
    tip: "Adote uma garrafa reutilizável: cada garrafa plástica descartável gera cerca de 80 g de CO₂ na produção.",
  },
  {
    category: "Energia",
    text: "Quanto tempo você costuma deixar aparelhos eletrônicos ligados sem uso?",
    options: [
      { label: "Nunca", co2: 10 },
      { label: "Poucos minutos", co2: 40 },
      { label: "Algumas horas", co2: 150 },
      { label: "Muitas horas", co2: 320 },
    ],
    tip: "Desligue aparelhos da tomada quando não estiver usando. O modo \"stand-by\" pode representar até 12% da conta de luz.",
  },
  {
    category: "Consumo",
    text: "Com que frequência sua família compra produtos com muitas embalagens?",
    options: [
      { label: "Nunca", co2: 20 },
      { label: "Raramente", co2: 80 },
      { label: "Frequentemente", co2: 200 },
      { label: "Sempre", co2: 320 },
    ],
    tip: "Prefira produtos a granel, refis e embalagens recicláveis. Embalagens representam boa parte do lixo doméstico.",
  },
  {
    category: "Compensação",
    text: "Quantas árvores você já ajudou a plantar?",
    options: [
      { label: "Mais de 10", co2: -220 },
      { label: "Entre 5 e 10", co2: -150 },
      { label: "Entre 1 e 4", co2: -60 },
      { label: "Nenhuma", co2: 0 },
    ],
    tip: "Participe de mutirões de plantio na sua escola ou bairro. Uma árvore absorve em média 22 kg de CO₂ por ano.",
  },
  {
    category: "Energia",
    text: "Com que frequência você apaga as luzes ao sair de um cômodo?",
    options: [
      { label: "Sempre", co2: 10 },
      { label: "Quase sempre", co2: 40 },
      { label: "Às vezes", co2: 100 },
      { label: "Nunca", co2: 180 },
    ],
    tip: "Apagar as luzes ao sair e trocar lâmpadas por LED reduz bastante o consumo de energia da casa.",
  },
  {
    category: "Resíduos",
    text: "Com que frequência você reutiliza materiais antes de descartá-los?",
    options: [
      { label: "Sempre", co2: 15 },
      { label: "Frequentemente", co2: 60 },
      { label: "Raramente", co2: 150 },
      { label: "Nunca", co2: 240 },
    ],
    tip: "Antes de jogar fora, pense: dá para reutilizar? Potes, papéis e tecidos podem ganhar uma segunda vida.",
  },
];

const LETTERS = ["A", "B", "C", "D"];
const KG_CO2_PER_TREE_YEAR = 22; // absorção média de uma árvore por ano
const MAX_CO2 = QUESTIONS.reduce(
  (sum, q) => sum + Math.max(...q.options.map((o) => o.co2)),
  0
);

const LEVELS = [
  {
    max: 800,
    title: "Pegada leve 🌿",
    color: "#bef264",
    message:
      "Parabéns! Seus hábitos já são muito sustentáveis. Você emite bem menos CO₂ que a média e é um exemplo para as pessoas ao seu redor.",
  },
  {
    max: 1800,
    title: "Pegada moderada 🍃",
    color: "#fbbf24",
    message:
      "Você está no caminho certo, mas ainda há espaço para melhorar. Pequenas mudanças na rotina podem reduzir bastante suas emissões.",
  },
  {
    max: 2800,
    title: "Pegada alta 🔥",
    color: "#fb923c",
    message:
      "Sua rotina gera uma quantidade considerável de CO₂. Vale a pena repensar alguns hábitos — as sugestões abaixo são um ótimo começo.",
  },
  {
    max: Infinity,
    title: "Pegada muito alta 🚨",
    color: "#fb7185",
    message:
      "Suas emissões estão bem acima do ideal. A boa notícia: é justamente quem tem pegada alta que consegue as maiores reduções com mudanças simples!",
  },
];


let currentQuestion = 0;
const answers = new Array(QUESTIONS.length).fill(null);


const screens = {
  start: document.getElementById("screen-start"),
  quiz: document.getElementById("screen-quiz"),
  result: document.getElementById("screen-result"),
};

const el = {
  btnStart: document.getElementById("btn-start"),
  btnBack: document.getElementById("btn-back"),
  btnNext: document.getElementById("btn-next"),
  btnRestart: document.getElementById("btn-restart"),
  counter: document.getElementById("quiz-counter"),
  progressFill: document.getElementById("quiz-progress-fill"),
  card: document.getElementById("quiz-card"),
  category: document.getElementById("quiz-category"),
  question: document.getElementById("quiz-question"),
  options: document.getElementById("quiz-options"),
  gaugeFill: document.getElementById("gauge-fill"),
  resultNumber: document.getElementById("result-number"),
  resultLevel: document.getElementById("result-level"),
  resultMessage: document.getElementById("result-message"),
  resultCompare: document.getElementById("result-compare"),
  resultTips: document.getElementById("result-tips"),
  resultOffset: document.getElementById("result-offset"),
  resultTrees: document.getElementById("result-trees"),
};


function showScreen(name) {
  Object.values(screens).forEach((s) => s.classList.remove("screen--active"));
  screens[name].classList.add("screen--active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}


function renderQuestion(animate = true) {
  const q = QUESTIONS[currentQuestion];

  el.counter.textContent = `Pergunta ${currentQuestion + 1} de ${QUESTIONS.length}`;
  el.progressFill.style.width = `${(currentQuestion / QUESTIONS.length) * 100}%`;
  el.category.textContent = q.category;
  el.question.textContent = q.text;

  el.options.innerHTML = "";
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option";
    if (answers[currentQuestion] === i) btn.classList.add("is-selected");
    btn.innerHTML = `<span class="option__letter">${LETTERS[i]}</span><span>${opt.label}</span>`;
    btn.addEventListener("click", () => selectOption(i));
    el.options.appendChild(btn);
  });

  el.btnBack.disabled = currentQuestion === 0;
  el.btnNext.disabled = answers[currentQuestion] === null;
  el.btnNext.innerHTML =
    currentQuestion === QUESTIONS.length - 1
      ? 'Ver resultado <span class="btn__arrow">→</span>'
      : 'Próxima <span class="btn__arrow">→</span>';

  if (animate) {
    el.card.classList.remove("is-entering");
    void el.card.offsetWidth; // reinicia a animação
    el.card.classList.add("is-entering");
  }
}

function selectOption(index) {
  answers[currentQuestion] = index;
  [...el.options.children].forEach((btn, i) =>
    btn.classList.toggle("is-selected", i === index)
  );
  el.btnNext.disabled = false;
}

function goNext() {
  if (answers[currentQuestion] === null) return;

  if (currentQuestion === QUESTIONS.length - 1) {
    showResult();
    return;
  }

  transitionCard(() => {
    currentQuestion++;
    renderQuestion();
  });
}

function goBack() {
  if (currentQuestion === 0) return;
  transitionCard(() => {
    currentQuestion--;
    renderQuestion();
  });
}

function transitionCard(callback) {
  el.card.classList.add("is-leaving");
  setTimeout(() => {
    el.card.classList.remove("is-leaving");
    callback();
  }, 250);
}


function calculateTotal() {
  return answers.reduce(
    (sum, answer, i) => sum + QUESTIONS[i].options[answer].co2,
    0
  );
}

function getLevel(total) {
  return LEVELS.find((l) => total < l.max);
}

function buildTips() {
  // gera sugestões para as perguntas com respostas de maior impacto (C ou D)
  const tips = QUESTIONS.filter((q, i) => answers[i] >= 2).map((q) => q.tip);

  if (tips.length === 0) {
    return [
      "Seus hábitos já são excelentes! Continue assim e inspire amigos e familiares a fazer o mesmo.",
      "Compartilhe o que você sabe: ensinar outras pessoas multiplica o impacto positivo.",
    ];
  }
  return tips;
}

function animateNumber(target, color) {
  const duration = 1400;
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.resultNumber.textContent = Math.round(target * eased).toLocaleString("pt-BR");
    if (progress < 1) requestAnimationFrame(frame);
  }

  el.resultNumber.style.color = color;
  requestAnimationFrame(frame);
}

function animateGauge(total, color) {
  const circumference = 527.8;
  const ratio = Math.min(Math.max(total / MAX_CO2, 0), 1);

  el.gaugeFill.style.setProperty("--gauge-color", color);
  el.gaugeFill.style.stroke = color;
  el.gaugeFill.style.filter = `drop-shadow(0 0 10px ${color})`;

  // força o reflow antes de animar
  el.gaugeFill.style.strokeDashoffset = circumference;
  void el.gaugeFill.getBoundingClientRect();
  el.gaugeFill.style.strokeDashoffset = circumference * (1 - ratio);
}

function renderTrees(count) {
  el.resultTrees.innerHTML = "";
  const visible = Math.min(count, 40);
  for (let i = 0; i < visible; i++) {
    const span = document.createElement("span");
    span.textContent = "🌳";
    span.style.animationDelay = `${0.6 + i * 0.05}s`;
    el.resultTrees.appendChild(span);
  }
  if (count > 40) {
    const more = document.createElement("span");
    more.textContent = ` +${count - 40}`;
    more.style.animationDelay = `${0.6 + visible * 0.05}s`;
    el.resultTrees.appendChild(more);
  }
}

function showResult() {
  const total = Math.max(calculateTotal(), 0);
  const level = getLevel(total);
  const trees = Math.ceil(total / KG_CO2_PER_TREE_YEAR);
  const carKm = Math.round(total / 0.12); // ~120 g CO₂ por km de carro

  showScreen("result");

  el.resultLevel.textContent = level.title;
  el.resultLevel.style.color = level.color;
  el.resultMessage.textContent = level.message;

  el.resultCompare.innerHTML =
    total > 0
      ? `Isso equivale a dirigir cerca de <strong>${carKm.toLocaleString("pt-BR")} km</strong> de carro — ` +
        `ou aproximadamente <strong>${Math.round(total / 2.3).toLocaleString("pt-BR")} litros de gasolina</strong> queimados.`
      : "Suas ações de plantio compensam totalmente as suas emissões estimadas. Impacto líquido próximo de zero!";

  el.resultTips.innerHTML = "";
  buildTips().forEach((tip) => {
    const li = document.createElement("li");
    li.textContent = tip;
    el.resultTips.appendChild(li);
  });

  if (trees > 0) {
    el.resultOffset.innerHTML =
      `Para compensar suas emissões, seria preciso plantar cerca de ` +
      `<strong>${trees} árvore${trees > 1 ? "s" : ""}</strong> ` +
      `(cada árvore absorve em média ${KG_CO2_PER_TREE_YEAR} kg de CO₂ por ano). ` +
      `Você também pode participar de mutirões de plantio, hortas comunitárias e projetos de reflorestamento na sua região.`;
  } else {
    el.resultOffset.innerHTML =
      `Você não precisa compensar nada — suas árvores plantadas já absorvem mais CO₂ do que você emite. <strong>Continue plantando!</strong> 🌎`;
  }

  renderTrees(trees);

  requestAnimationFrame(() => {
    animateNumber(total, level.color);
    animateGauge(total, level.color);
  });
}


function restart() {
  currentQuestion = 0;
  answers.fill(null);
  renderQuestion(false);
  showScreen("start");
}


el.btnStart.addEventListener("click", () => {
  showScreen("quiz");
  renderQuestion();
});

el.btnNext.addEventListener("click", goNext);
el.btnBack.addEventListener("click", goBack);
el.btnRestart.addEventListener("click", restart);

document.addEventListener("keydown", (e) => {
  if (!screens.quiz.classList.contains("screen--active")) return;

  const key = e.key.toUpperCase();
  const letterIndex = LETTERS.indexOf(key);
  const numberIndex = ["1", "2", "3", "4"].indexOf(e.key);

  if (letterIndex !== -1) selectOption(letterIndex);
  else if (numberIndex !== -1) selectOption(numberIndex);
  else if (e.key === "Enter" && !el.btnNext.disabled) goNext();
});
