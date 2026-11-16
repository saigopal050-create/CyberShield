// MOBILE NAVIGATION
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", () => {
  navMenu.classList.toggle("show");
});

document.querySelectorAll("#navMenu a").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("show");
  });
});


// WEBSITE RISK SCANNER
const scanBtn = document.getElementById("scanBtn");
const urlInput = document.getElementById("urlInput");
const scanResult = document.getElementById("scanResult");

scanBtn.addEventListener("click", () => {
  const entered = urlInput.value.trim();
  scanResult.classList.add("show");

  if (!entered) {
    scanResult.innerHTML = "Please enter a website address.";
    return;
  }

  let address;

  try {
    address = new URL(
      entered.match(/^https?:\/\//i) ? entered : "https://" + entered
    );

    if (!["http:", "https:"].includes(address.protocol)) {
      throw new Error("Invalid protocol");
    }
  } catch {
    scanResult.innerHTML = "Please enter a valid website address.";
    return;
  }

  const host = address.hostname.toLowerCase();
  const warnings = [];

  if (address.protocol !== "https:") {
    warnings.push("The address does not use HTTPS.");
  }

  if (host.includes("@")) {
    warnings.push("The address contains an unusual @ symbol.");
  }

  if (host.startsWith("xn--")) {
    warnings.push("The domain uses encoded characters.");
  }

  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    warnings.push("The address uses a numerical IP address.");
  }

  if (host.split(".").length > 4) {
    warnings.push("The domain has an unusually complex structure.");
  }

  if (host.length > 50) {
    warnings.push("The domain name is unusually long.");
  }

  if (/(login|verify|secure|account|update|free|gift)/i.test(host)) {
    warnings.push("The domain contains words sometimes used in deceptive links.");
  }

  if (warnings.length === 0) {
    scanResult.innerHTML = `
      <strong style="color:#55e6a5">No common warning signs detected.</strong>
      <p>This basic check found no listed indicators. It does NOT prove the website is safe.</p>
    `;
  } else {
    scanResult.innerHTML = `
      <strong style="color:#ffcc70">Potential warning signs found: ${warnings.length}</strong>
      <ul>${warnings.map(item => `<li>${item}</li>`).join("")}</ul>
      <p>Be cautious. These indicators alone do not prove a website is malicious.</p>
    `;
  }
});


// PASSWORD CHECKER
const passwordInput = document.getElementById("passwordInput");
const checkPassword = document.getElementById("checkPassword");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");
const passwordTips = document.getElementById("passwordTips");

checkPassword.addEventListener("click", () => {
  const password = passwordInput.value;

  if (!password) {
    strengthText.textContent = "Please enter a sample password.";
    strengthBar.style.width = "0%";
    passwordTips.innerHTML = "";
    return;
  }

  let score = 0;
  const tips = [];

  if (password.length >= 12) score++;
  else tips.push("Try using at least 12 characters.");

  if (/[A-Z]/.test(password)) score++;
  else tips.push("Include an uppercase letter.");

  if (/[a-z]/.test(password)) score++;
  else tips.push("Include a lowercase letter.");

  if (/[0-9]/.test(password)) score++;
  else tips.push("Consider including a number.");

  if (/[^A-Za-z0-9]/.test(password)) score++;
  else tips.push("Consider including a symbol.");

  const labels = [
    "Very weak",
    "Weak",
    "Fair",
    "Good",
    "Strong",
    "Very strong"
  ];

  strengthBar.style.width = (score / 5 * 100) + "%";
  strengthText.textContent = "Strength: " + labels[score];

  passwordTips.innerHTML = tips.length
    ? tips.map(tip => `<p>• ${tip}</p>`).join("")
    : "<p>✓ Good combination of password characteristics.</p>";
});


// CYBER QUIZ
const questions = [
  {
    question: "What is phishing?",
    answers: [
      "A type of computer screen",
      "A trick to steal personal information",
      "A computer game",
      "A search engine"
    ],
    correct: 1
  },
  {
    question: "What should you do with a suspicious link?",
    answers: [
      "Click it immediately",
      "Share it with everyone",
      "Avoid clicking and verify it",
      "Enter your password"
    ],
    correct: 2
  },
  {
    question: "Which password is generally stronger?",
    answers: [
      "123456",
      "password",
      "Your name",
      "A long, unique passphrase"
    ],
    correct: 3
  },
  {
    question: "What does HTTPS indicate?",
    answers: [
      "The connection is encrypted",
      "The website is always safe",
      "The website is government owned",
      "The website has no viruses"
    ],
    correct: 0
  },
  {
    question: "What is malware?",
    answers: [
      "A safe browser",
      "A type of harmful software",
      "A password manager",
      "A computer keyboard"
    ],
    correct: 1
  }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

const questionCount = document.getElementById("questionCount");
const quizScore = document.getElementById("quizScore");
const questionText = document.getElementById("question");
const answersBox = document.getElementById("answers");
const quizFeedback = document.getElementById("quizFeedback");
const nextQuestion = document.getElementById("nextQuestion");
const quizProgress = document.getElementById("quizProgress");

function showQuestion() {
  answered = false;

  const q = questions[currentQuestion];

  questionCount.textContent =
    `QUESTION ${currentQuestion + 1} / ${questions.length}`;

  quizScore.textContent = "SCORE: " + score;
  questionText.textContent = q.question;
  quizFeedback.textContent = "";
  answersBox.innerHTML = "";

  quizProgress.style.width =
    (currentQuestion / questions.length * 100) + "%";

  nextQuestion.disabled = true;

  q.answers.forEach((answer, index) => {
    const button = document.createElement("button");

    button.className = "answer-btn";
    button.textContent = answer;

    button.addEventListener("click", () => {
      if (answered) return;

      answered = true;

      const buttons = answersBox.querySelectorAll("button");

      buttons.forEach((btn, i) => {
        btn.disabled = true;

        if (i === q.correct) {
          btn.classList.add("correct");
        }
      });

      if (index === q.correct) {
        score++;
        quizFeedback.textContent = "✓ Correct! Well done.";
      } else {
        button.classList.add("wrong");
        quizFeedback.textContent =
          "Not quite! The correct answer is: " + q.answers[q.correct];
      }

      quizScore.textContent = "SCORE: " + score;
      nextQuestion.disabled = false;
    });

    answersBox.appendChild(button);
  });
}

nextQuestion.addEventListener("click", () => {
  if (!answered) return;

  currentQuestion++;

  if (currentQuestion >= questions.length) {
    questionCount.textContent = "QUIZ COMPLETED";
    quizProgress.style.width = "100%";

    questionText.textContent =
      `You scored ${score} out of ${questions.length}!`;

    answersBox.innerHTML = "";
    quizFeedback.textContent =
      score === 5
        ? "Excellent cybersecurity awareness!"
        : "Great attempt! Keep learning and improving.";

    nextQuestion.textContent = "Restart Quiz ↻";
    nextQuestion.disabled = false;

    nextQuestion.onclick = () => {
      currentQuestion = 0;
      score = 0;
      nextQuestion.textContent = "Next Question →";
      nextQuestion.onclick = null;
      showQuestion();
    };

    return;
  }

  showQuestion();
});

showQuestion();
