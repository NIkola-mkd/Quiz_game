// api
const api_categories = "https://opentdb.com/api_category.php";
const api = "https://opentdb.com/api.php?amount=";
const typeOfQuestions = "&type=multiple";
const categoryOfQuestions = "&category=";
const difficultyOfQuestions = "&difficulty=";

// all selectors
let selectCategory = document.getElementById("category");
let form = document.getElementById("form");
let errCategories = document.getElementById("errCategories");
let start = document.getElementById("start");
let number = document.getElementById("number");
let difficulty = document.getElementById("difficulty");
let welcome = document.getElementById("welcome");
let startLayout = document.getElementById("startLayout");
let loader = document.getElementById("loader");
let questions = document.getElementById("questions");
let history = document.getElementById("history");
let tryAgain = document.getElementById("tryAgain");
let reload = document.getElementById("reload");

// score
let score = 0;
let questionsArr = [];
let answersSubmitted = []; //answered questions
let currentQuestionNumber = 0;
let answers = [];
let arrAnsw = []; //shuffled answers
let answer1 = document.getElementById("answer1");
let answer2 = document.getElementById("answer2");
let answer3 = document.getElementById("answer3");
let answer4 = document.getElementById("answer4");

// using flags to manipulate with answered questions
let answered1 = false;
let answered2 = false;
let answered3 = false;
let answered4 = false;

// ! categories
window.addEventListener("load", getCategories(api_categories));

// **take data for categories
async function getCategories(api_categories) {
  await fetch(api_categories)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      for (let i = 0; i < data["trivia_categories"].length; i++) {
        let option = document.createElement("option");
        option.value = data["trivia_categories"][i].id;
        option.innerHTML = data["trivia_categories"][i].name;
        selectCategory.appendChild(option);
      }
    })
    .catch((err) => {
      form.style.display = "none";
      errCategories.style.display = "block";
    });
}

// ** take questions

async function getQuestions(api) {
  await fetch(api)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      loader.style.display = "block";
      loader.innerHTML = `<div
                class="d-flex align-items-center"
                style="display: none !important"
              >
                <strong class="text-white">Loading Questions...</strong>
                <div
                  class="spinner-border ms-auto text-white"
                  role="status"
                  aria-hidden="true"
                ></div>
              </div>`;
      welcome.style.display = "none";
      startGame(data["results"]);
    })
    .catch((err) => {
      questions.style.display = "none";
      errCategories.style.display = "block";
    });
}

start.addEventListener("click", (e) => {
  e.preventDefault();
  let fetchApi = api + number.value;
  if (selectCategory.value === "Any" && difficulty.value === "Any") {
    getQuestions(fetchApi + typeOfQuestions);
  } else if (selectCategory.value !== "Any" && difficulty.value === "Any") {
    getQuestions(
      fetchApi + categoryOfQuestions + selectCategory.value + typeOfQuestions
    );
  } else if (selectCategory.value === "Any" && difficulty.value !== "Any") {
    getQuestions(
      fetchApi + difficultyOfQuestions + difficulty.value + typeOfQuestions
    );
  } else {
    getQuestions(
      fetchApi +
        categoryOfQuestions +
        selectCategory.value +
        difficultyOfQuestions +
        difficulty.value +
        typeOfQuestions
    );
  }

  startLayout.style.display = "none";
});

// checking answers
document.getElementById("a1").onclick = function () {
  answered1 = true;
  checkAnswer();
};
document.getElementById("a2").onclick = function () {
  answered2 = true;
  checkAnswer();
};
document.getElementById("a3").onclick = function () {
  answered3 = true;
  checkAnswer();
};
document.getElementById("a4").onclick = function () {
  answered4 = true;
  checkAnswer();
};

// shuffle array
function shuffle(arr) {
  let curr = arr.length;
  let random;
  while (curr != 0) {
    random = Math.floor(Math.random() * curr);
    curr--;
    [arr[curr], arr[random]] = [arr[random], arr[curr]];
  }

  return arr;
}

// game start
function startGame(q) {
  questionsArr = q;
  questions.style.display = "block";
  displayQuestion(questionsArr);
}

// display questions
function displayQuestion(questionsArr) {
  questionText = questionsArr[currentQuestionNumber]["question"];
  correctAnswer = questionsArr[currentQuestionNumber]["correct_answer"];
  incorrectAnswers = questionsArr[currentQuestionNumber]["incorrect_answers"];
  answers = [];
  answers.push(correctAnswer);
  for (let i = 0; i < 3; i++) {
    answers.push(incorrectAnswers[i]);
  }
  answers = shuffle(answers);
  arrAnsw.push(answers);
  document.getElementById("question").innerHTML = questionText;
  answer1.innerHTML = answers[0];
  answer2.innerHTML = answers[1];
  answer3.innerHTML = answers[2];
  answer4.innerHTML = answers[3];

  loader.innerHTML = `<strong class="text-white text-center"> Completed ${currentQuestionNumber}/${number.value}</strong>
 `;
}

function checkAnswer() {
  if (answered1 == true) {
    if (answers[0] === questionsArr[currentQuestionNumber]["correct_answer"]) {
      score++;
    }
    answered1 = false;
    answersSubmitted.push(0);
    displayNext();
  } else if (answered2 == true) {
    if (answers[1] === questionsArr[currentQuestionNumber]["correct_answer"]) {
      score++;
    }
    answered2 = false;
    answersSubmitted.push(1);
    displayNext();
  } else if (answered3 == true) {
    if (answers[2] === questionsArr[currentQuestionNumber]["correct_answer"]) {
      score++;
    }
    answered3 = false;
    answersSubmitted.push(2);
    displayNext();
  } else if (answered4 == true) {
    if (answers[3] === questionsArr[currentQuestionNumber]["correct_answer"]) {
      score++;
    }
    answered4 = false;
    answersSubmitted.push(3);
    displayNext();
  }
}

// displaying next question using hashchange
function displayNext() {
  if (currentQuestionNumber == parseInt(number.value) - 1) {
    gameOver();
  } else {
    currentQuestionNumber++;
    displayQuestion(questionsArr);
  }
}

// check if the game is over
function gameOver() {
  var currentdate = new Date();
  localStorage.setItem(
    currentdate,
    JSON.stringify(
      `<ul class="list-group list-group">
              <li
                class="list-group-item d-flex justify-content-between align-items-start"
              >
                <div class="ms-2 me-auto">
                  <div class="fw-bold"></div>
                 ${"Number of questions: " + number.value}
                 <br>
                 ${
                   "Category: " +
                   selectCategory.options[selectCategory.selectedIndex].text
                 }
                 <br>
                 ${
                   "Difficulty: " +
                   difficulty.options[difficulty.selectedIndex].text
                 }
                </div>
                <span class="badge bg-primary rounded-pill">${score}</span>
              </li>
            </ul>`
    )
  );
  questions.style.display = "none";
  loader.innerHTML = `<strong class="text-white text-center"> Your score ${score}</strong>`;
  tryAgain.style.display = "block";
  reload.addEventListener("click", function (e) {
    location.reload();
  });
}

const items = { ...localStorage };

function allStorage() {
  var values = [],
    keys = Object.keys(localStorage),
    i = keys.length;

  while (i--) {
    values.push(localStorage.getItem(keys[i]));
  }

  return values;
}

let historyArr = allStorage(items);

for (let i = 0; i < historyArr.length; i++) {
  history.innerHTML += JSON.parse(historyArr[i]);
}
