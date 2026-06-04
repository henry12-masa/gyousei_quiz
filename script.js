const params = new URLSearchParams(location.search);
const type = params.get("type") || "kenpou";

const quizInfo = {
  kenpou: {
    title: "憲法",
    desc: "人権・統治・判例"
  },

  minpou: {
    title: "民法",
    desc: "総則・物権・債権・親族相続"
  },

  gyouseihou: {
    title: "行政法",
    desc: "行政手続法・行政不服審査法・行政事件訴訟法"
  },

  gyouseihouAdvanced: {
    title: "行政法上級100問",
    desc: "行政法総論・行政手続法・行政不服審査法・行政事件訴訟法・国家賠償法"
  },

  shouhou: {
    title: "商法・会社法",
    desc: "商法総則・会社法"
  },

  kiso: {
    title: "基礎知識",
    desc: "政治・経済・社会・情報通信・個人情報保護"
  },

  practice: {
    title: "総合演習",
    desc: "全科目ミックス"
  },

  mistake: {
    title: "ひっかけ問題",
    desc: "数字・例外・判例の誤文対策"
  }
};

const info = quizInfo[type] || quizInfo.kenpou;

document.title = info.title;
document.getElementById("pageTitle").textContent = info.title;
document.getElementById("pageDesc").textContent = info.desc;

const quizList = document.getElementById("quizList");

quizList.innerHTML = Object.keys(quizInfo).map(key => `
  <a href="?type=${key}" class="${key === type ? "active" : ""}">
    ${quizInfo[key].title}
  </a>
`).join("");

function normalizeQuestion(q) {
  return {
    question: q.question || q.q,
    choices: q.choices || q.c,
    answer: q.answer || q.a,
    explanation: q.explanation || q.e || ""
  };
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

const rawQuestions =
  window.quizData[type] ||
  window.quizData.kenpou ||
  [];

let questions =
  shuffle(rawQuestions.map(normalizeQuestion))
  .slice(0, 50);

let current = 0;
let score = 0;
let answered = false;

const counter = document.getElementById("counter");
const scoreEl = document.getElementById("score");
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const resultEl = document.getElementById("result");
const progressBar = document.getElementById("progressBar");

function showQuestion() {

  if (questions.length === 0) {
    counter.textContent = "0 / 0";
    questionEl.textContent = "問題データが読み込めません";
    choicesEl.innerHTML = "";
    resultEl.textContent =
      `window.quizData.${type} がありません`;
    return;
  }

  if (current >= questions.length) {
    finishQuiz();
    return;
  }

  answered = false;

  const q = questions[current];

  counter.textContent =
    `${current + 1} / ${questions.length}`;

  scoreEl.textContent =
    `スコア: ${score}`;

  questionEl.textContent =
    q.question;

  resultEl.textContent = "";

  progressBar.style.width =
    `${(current / questions.length) * 100}%`;

  choicesEl.innerHTML = "";

  shuffle(q.choices).forEach(choice => {

    const button =
      document.createElement("button");

    button.textContent = choice;

    button.onclick = () =>
      checkAnswer(button, choice);

    choicesEl.appendChild(button);

  });

}

function checkAnswer(button, choice) {

  if (answered) return;

  answered = true;

  const q = questions[current];

  document
    .querySelectorAll("#choices button")
    .forEach(btn => {

      btn.disabled = true;

      if (btn.textContent === q.answer) {
        btn.classList.add("correct");
      }

    });

  if (choice === q.answer) {

    score++;

    button.classList.add("correct");

    resultEl.textContent =
      q.explanation
      ? `正解！ ${q.explanation}`
      : "正解！";

  } else {

    button.classList.add("wrong");

    resultEl.textContent =
      q.explanation
      ? `不正解！ 正解は「${q.answer}」 ${q.explanation}`
      : `不正解！ 正解は「${q.answer}」`;

  }

  scoreEl.textContent =
    `スコア: ${score}`;

  setTimeout(() => {

    current++;

    showQuestion();

  }, 1700);

}

function finishQuiz() {

  counter.textContent = "終了";

  progressBar.style.width = "100%";

  questionEl.textContent = "結果発表";

  choicesEl.innerHTML = `
    <div class="finish">
      <p>${questions.length}問中 ${score}問正解！</p>

      <button onclick="location.reload()">
        もう一度挑戦
      </button>

      <a class="home-btn" href="./">
        ジャンル選択へ戻る
      </a>
    </div>
  `;

  resultEl.textContent = "";

}

showQuestion();
