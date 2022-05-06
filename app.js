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
      console.log(data["results"]);
      loader.style.display = "block";
      welcome.style.display = "none";
      // for (let i = 0; i < data["results"].length; i++) {}
    })
    .catch((err) => {
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
