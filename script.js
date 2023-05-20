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
      for (key in data) {
        if (key === "items") {
          arrayItems = data[key];
        }
      }
      search__results.style.display = "flex";
      search__resultsUL.innerHTML = "";
      if (!data.total_count) {
        search__resultsUL.innerHTML = `<li>${"not found"}</li>`;
      }
      arrayItems.forEach((element) => {
        search__resultsUL.innerHTML += `<li data-id=${element.id}>${element.name}</li>`;
      });
    })
    .catch((err) => alert(err));
}

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
inp.addEventListener("input", debounce(callFetch, 200));
search__resultsUL.addEventListener("click", function (event) {
  arrayItems.forEach((element) => {
    if (counterCards === 3) {
      return;
    }
    if (String(element.id) === event.target.dataset.id) {
      counterCards++;
      addRepoCard(element);
    }
  });
 input.value = '';
 search__results.style.display = "none";
});

results__list.addEventListener("click", function (event) {
  const btn = event.target.closest(".card__button");
  if (!btn) {
    return;
  }
  btn.parentElement.remove();
  counterCards--;
});
