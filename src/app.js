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
  headingElements.forEach(e => e.style.color = "black");
  console.log(headingElements);
  quizData.forEach((item, index) => {
    const selectedOption = document.querySelector(
      `input[name="question${index}"]:checked`
    );
    if (selectedOption && parseInt(selectedOption.value) === item.correct) {
      score++;
    } else {
      headingElements[index].style.color = "red";
    }
  });
  return score;
}

submitButton.addEventListener("click", () => {
  const quizData = quizesData[quizIdGlobal];
  const score = calculateScore();
  resultContainer.textContent = `You scored ${score} out of ${quizData.length}`;
});

getQuiz();