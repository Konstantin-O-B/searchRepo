const inp = document.querySelector("input");

const debounce = function (fn, ms) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, ms);
  };
};

let arrayItems = [];
const search__results = document.querySelector(".search__results");
const search__resultsUL = search__results.querySelector("ul");
const results__list = document.querySelector(".results__list");

let resultItem;

function callFetch() {
  const inputValue = document.querySelector("input").value.trim();
  if (!inputValue) {
    search__results.style.display = "none";
    return;
  }
  console.log(inputValue);
  const urla = `https://api.github.com/search/repositories?q=${inputValue}&per_page=5`;
  fetch(urla)
    .then((res) => {
        if (!res.ok) {throw new Error('Ошибка запроса')}
        return res.json()})
    .then((data) => {
      console.log(data);
      for (key in data) {
        if (key === "items") {
          arrayItems = data[key];
        }
      }
      search__results.style.display = "flex";
      /* console.log(arrayItems); */
      search__resultsUL.innerHTML = "";
      if (!data.total_count) {
        search__resultsUL.innerHTML = `<li>${"not found"}</li>`;
      }
      arrayItems.forEach((element) => {
        search__resultsUL.innerHTML += `<li>${element.name}</li>`;
      });
    })
    .catch((err) => alert(err));
}
/* console.log(search__resultsUL); */

function addRepoCard(element) {
  results__list.insertAdjacentHTML(
    "beforeEnd",
    `
    <li>
        <div class="card">
            <div class="card__text">
                <div class="card_name"><span>Name: ${element.name}</span></div>
                <div class="card_owner"><span>Owner: ${element.owner.login}</span></div>
                <div class="card_stars"><span>Stars: ${element.stargazers_count}</span></div>
            </div>
        <div class="card__button"><span></span></div>
        </div>
    </li>`
  );
}

let counterCards = 0;
inp.addEventListener("keyup", debounce(callFetch, 200));
search__resultsUL.addEventListener("click", function (event) {
/*   console.log(results__list); */

  arrayItems.forEach((element) => {
    if (counterCards === 3) {
      return;
    }
    if (element.name === event.target.textContent) {
      counterCards++;
      addRepoCard(element);
/*       console.log(element); */
    }
  });
});

results__list.addEventListener("click", function (event) {
  const btn = event.target.closest(".card__button");
  if (!btn) {
    return;
  }
  btn.parentElement.remove();
  counterCards--;
});
