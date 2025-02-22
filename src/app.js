const quizContainer = document.getElementById("quiz");
const submitButton = document.getElementById("submit");
const resultContainer = document.getElementById("result");
const quizSelector = document.getElementById("quiz-selector");
let quizesData = {};
let quizIdGlobal = '';

async function getData() {
  try {
    const response = await fetch('./static/data/tests-db.json');
    return response.json();
  } catch (error) {
    return error;
  }
}

async function getQuiz() {
  quizesData = await getData();
  const numOfTests = Object.keys(quizesData).length;

  for (let i = 1; i <= numOfTests; i++) {
    const testButton = document.createElement("button");
    testButton.dataset.quizid = `${i}`;
    testButton.textContent = `Quiz #${i}`;
    testButton.addEventListener("click", loadQuiz);
    quizSelector.appendChild(testButton);
  }
}

async function loadQuiz(e) {
  const quizId = e.currentTarget.getAttribute("data-quizid");
  const quizData = quizesData[quizId];
  
  resultContainer.innerHTML = "";
  
  quizIdGlobal = quizId;
  quizContainer.parentElement.querySelector("h2").textContent = `Quiz #${quizId}`;
  quizContainer.innerHTML = quizData
    .map((item, index) => `
        <div class="question">
          <h3>${index + 1}. ${item.question}</h3>
          <ul class="options">
            ${item.options
        .map(
          (option, i) => `
                  <li>
                    <label>
                      <input type="radio" name="question${index}" value="${i}">
                      ${option}
                    </label>
                  </li>
                `
        )
        .join("")}
          </ul>
        </div>
      `)
    .join("");

  document.querySelector(".quiz-container").style.display = "block";
}

function calculateScore() {
  let score = 0;
  const quizData = quizesData[quizIdGlobal];
  const headingElements = Array.from(quizContainer.querySelectorAll("h3"));
  const labels = Array.from(quizContainer.querySelectorAll("label"));

  headingElements.forEach(e => e.classList.remove("wrong-answer-text"));
  labels.forEach(l => l.classList.remove("wrong-answer-text"));

  quizData.forEach((item, index) => {
    const selectedOption = document.querySelector(
      `input[name="question${index}"]:checked`
    );
    if (selectedOption && parseInt(selectedOption.value) === item.correct) {
      score++;
    } else {
      headingElements[index].classList.add("wrong-answer-text");
      if (selectedOption) {
        selectedOption.parentElement.classList.add("wrong-answer-text");
        selectedOption.classList.add("wrong-answer-radio");
      }
    }
  });
  return score;
}

submitButton.addEventListener("click", () => {
  resultContainer.innerHTML = "";
  
  const quizData = quizesData[quizIdGlobal];
  const score = calculateScore();

  const paragraphElement = document.createElement("p");
  paragraphElement.textContent = `You scored ${score} out of ${quizData.length}`;

  const answersButton = document.createElement("button");
  answersButton.textContent = "Show Answers";
  answersButton.id = "show-answers";
  answersButton.addEventListener("click", showAnswers);

  const answersContainer = document.createElement("div");
  answersContainer.classList.add("answers-container");
  answersContainer.id = "answers-container";

  resultContainer.appendChild(paragraphElement);
  resultContainer.appendChild(answersButton);
  resultContainer.appendChild(answersContainer);
});

function showAnswers(e) {
  const button = e.currentTarget;
  const buttonState = button.textContent;
  const answersContainer = document.querySelector("#answers-container");

  if (buttonState == "Show Answers") {
    const answers = quizesData[quizIdGlobal].map(q => [q.question, q.options[q.correct]]);
    answersContainer.innerHTML = answers
      .map((answer, index) => `
        <div>
          <h4>${index + 1}. ${answer[0]}</h4>
          <ul>
              <li>${answer[1]}</li>
          </ul>
        </div>
      `)
      .join("");

    answersContainer.style.display = "block";
    button.textContent = "Hide Answers";
  } else {
    answersContainer.innerHTML = "";
    answersContainer.style.display = "none";
    button.textContent = "Show Answers";
  }

}

getQuiz();