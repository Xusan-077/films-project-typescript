type filmFavoriteType = {
    id: string;
    title: string;
    poster: string;
    overview: string;
    release_date: number;
    genres: string[];
}[];

type filmFavoriteobj = {
    id: string;
    title: string;
    poster: string;
    overview: string;
    release_date: number;
    genres: string[];
}

let favoritearr: filmFavoriteType = [];
favoritearr = JSON.parse(localStorage.getItem("favorite") || "[]");

const elFavoriteList = document.querySelector(".favorite-list") as HTMLUListElement

const elFavoriteSortToGenresForm = document.querySelector(".sort-from-genres-form") as HTMLFormElement;
const elFavoriteSortToGenresSelect = document.querySelector(".sort-from-genres-select") as HTMLSelectElement;

const elFavoriteSortToLetterForm = document.querySelector(".sort-form") as HTMLFormElement;
const elFavoriteSortToLetterSelect = document.querySelector(".sort-select") as HTMLSelectElement;

const elFavoriteSearchForm = document.querySelector(".search-form") as HTMLFormElement;
const elFavoriteSearchInput = document.querySelector(".search-input") as HTMLInputElement;
const elFavoriteSearchVoiceBtn = document.querySelector(".btn-voice") as HTMLButtonElement;

elFavoriteSortToLetterForm.onsubmit = (evt: Event) => {
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

elFavoriteSortToGenresForm.onsubmit = (evt: Event) => {
    evt.preventDefault();

    const value = elFavoriteSortToGenresSelect.value;
    let filtered = value === "All"
        ? favoritearr
        : favoritearr.filter((el) => el.genres.includes(value));

    renderFavorite(filtered, elFavoriteList);
};

elFavoriteSearchVoiceBtn.onclick = (evt: Event) => {
    evt.preventDefault();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Speech recognition not supported in this browser.");
        return;
    }

    const record = new SpeechRecognition();
    record.start();

    elFavoriteSearchInput.value = "";

    record.onresult = (event: any) => {
        elFavoriteSearchInput.value = event.results[0][0].transcript;
    };
};

elFavoriteSearchForm.onsubmit = (evt: Event) => {
    evt.preventDefault();

    const query = elFavoriteSearchInput.value.toLowerCase();
    const filter = favoritearr.filter((el) => el.title.toLowerCase().includes(query));

    elFavoriteList.innerHTML = "";
    if (filter.length > 0) {
        renderFavorite(filter, elFavoriteList);
    } else {
        const p = document.createElement("p");
        p.textContent = "There is no such movie.";
        p.classList.add("list-active");
        elFavoriteList.appendChild(p);
    }
};

function renderFavorite(array: filmType, list: HTMLUListElement) {
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
        let span = document.createElement("span")

        span.innerHTML = "hali favorite yo`q"
        span.classList.add("listspan")

        list.append(span)

        return
    }
}

function renderFavoriteGenres() {
    const reduce = favoritearr.reduce((total: string[], el) => {
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
renderFavoriteGenres()

let itemId: (number | undefined);

const elUnFavorite = document.querySelectorAll<HTMLButtonElement>(".unfavorite")

elUnFavorite.forEach((btn) => {
    btn.onclick = () => {
        const itemId = Number(btn.dataset.id);
        favoritearr = favoritearr.filter((el) => Number(el.id) !== itemId);

        localStorage.setItem("favorite", JSON.stringify(favoritearr));
        renderFavorite(favoritearr, elFavoriteList);
    };
});
