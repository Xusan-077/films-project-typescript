"use strict";
let favoritearr = [];
favoritearr = JSON.parse(localStorage.getItem("favorite") || "[]");
const elFavoriteList = document.querySelector(".favorite-list");
const elFavoriteSortToGenresForm = document.querySelector(".sort-from-genres-form");
const elFavoriteSortToGenresSelect = document.querySelector(".sort-from-genres-select");
const elFavoriteSortToLetterForm = document.querySelector(".sort-form");
const elFavoriteSortToLetterSelect = document.querySelector(".sort-select");
const elFavoriteSearchForm = document.querySelector(".search-form");
const elFavoriteSearchInput = document.querySelector(".search-input");
const elFavoriteSearchVoiceBtn = document.querySelector(".btn-voice");
elFavoriteSortToLetterForm.onsubmit = (evt) => {
    evt.preventDefault();
    let sortedList = [...favoritearr];
    if (elFavoriteSortToLetterSelect.value === "A-Z") {
        sortedList.sort((a, b) => a.title.localeCompare(b.title));
    }
    if (elFavoriteSortToLetterSelect.value === "Z-A") {
        sortedList.sort((a, b) => b.title.localeCompare(a.title));
    }
    if (elFavoriteSortToLetterSelect.value === "All") {
        sortedList = favoritearr;
    }
    renderFavorite(sortedList, elFavoriteList);
};
elFavoriteSortToGenresForm.onsubmit = (evt) => {
    evt.preventDefault();
    const value = elFavoriteSortToGenresSelect.value;
    let filtered = value === "All"
        ? favoritearr
        : favoritearr.filter((el) => el.genres.includes(value));
    renderFavorite(filtered, elFavoriteList);
};
elFavoriteSearchVoiceBtn.onclick = (evt) => {
    evt.preventDefault();
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Speech recognition not supported in this browser.");
        return;
    }
    const record = new SpeechRecognition();
    record.start();
    elFavoriteSearchInput.value = "";
    record.onresult = (event) => {
        elFavoriteSearchInput.value = event.results[0][0].transcript;
    };
};
elFavoriteSearchForm.onsubmit = (evt) => {
    evt.preventDefault();
    const query = elFavoriteSearchInput.value.toLowerCase();
    const filter = favoritearr.filter((el) => el.title.toLowerCase().includes(query));
    elFavoriteList.innerHTML = "";
    if (filter.length > 0) {
        renderFavorite(filter, elFavoriteList);
    }
    else {
        const p = document.createElement("p");
        p.textContent = "There is no such movie.";
        p.classList.add("list-active");
        elFavoriteList.appendChild(p);
    }
};
function renderFavorite(array, list) {
    list.innerHTML = array.map((el) => `
    <li class="item">
      <img class="item_img" src="${el.poster}" alt="${el.title}">
      <div class="item_text">
        <p class="item_id">id: ${el.id}</p>
        <p class="item_title">title: ${el.title}</p>
        <p class="item_release_date">date: ${new Date(el.release_date * 1000).getFullYear()}</p>
        <p class="item_genres">genres: ${el.genres.join(", ")}</p>
        <div class="item_btns">
          <a class="link" href="./detail.html?id=${el.id}">more</a>
          <button class="unfavorite" data-id="${el.id}">unfavorite</button>
        </div>
      </div>
    </li>
  `).join("");
    if (favoritearr.length == 0) {
        let span = document.createElement("span");
        span.innerHTML = "hali favorite yo`q";
        span.classList.add("listspan");
        list.append(span);
        return;
    }
}
function renderFavoriteGenres() {
    const reduce = favoritearr.reduce((total, el) => {
        el.genres.forEach((g) => {
            if (!total.includes(g)) {
                total.push(g);
            }
        });
        return total;
    }, []);
    reduce.forEach((el) => {
        elFavoriteSortToGenresSelect.innerHTML += `
        <option value="${el}">${el}</option>
      `;
    });
}
renderFavorite(favoritearr, elFavoriteList);
renderFavoriteGenres();
let itemId;
const elUnFavorite = document.querySelectorAll(".unfavorite");
elUnFavorite.forEach((btn) => {
    btn.onclick = () => {
        const itemId = Number(btn.dataset.id);
        favoritearr = favoritearr.filter((el) => Number(el.id) !== itemId);
        localStorage.setItem("favorite", JSON.stringify(favoritearr));
        renderFavorite(favoritearr, elFavoriteList);
    };
});
