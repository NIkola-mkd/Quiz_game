// api for all categories
const api_categories = "https://opentdb.com/api_category.php";
let selectCategory = document.getElementById("category");
let form = document.getElementById("form");
let errCategories = document.getElementById("errCategories");

// all selectors

// functions

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

window.addEventListener("load", getCategories(api_categories));
