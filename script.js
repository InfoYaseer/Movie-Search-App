// OMDb API Key
const API_KEY = "94449576";

const movieSearchBox = document.getElementById("movie-search-box");
const searchList = document.getElementById("search-list");
const resultGrid = document.getElementById("result-grid");

/* ---------------- SEARCH MOVIES ---------------- */
async function loadMovies(searchTerm) {
    try {
        const url = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.Response === "True") {
            displayMovieList(data.Search);
        } else {
            searchList.innerHTML = "";
        }
    } catch (error) {
        console.error("Search error:", error);
    }
}

function findMovies() {
    const searchTerm = movieSearchBox.value.trim();

    if (searchTerm.length > 0) {
        searchList.classList.remove("hide-search-list");
        loadMovies(searchTerm);
    } else {
        searchList.classList.add("hide-search-list");
        searchList.innerHTML = "";
    }
}

/* ---------------- DISPLAY SEARCH LIST ---------------- */
function displayMovieList(movies) {
    searchList.innerHTML = "";

    movies.forEach(movie => {
        const movieListItem = document.createElement("div");
        movieListItem.classList.add("search-list-item");
        movieListItem.dataset.id = movie.imdbID;

        const poster =
            movie.Poster && movie.Poster !== "N/A"
                ? movie.Poster
                : "images/image_not_found.png";

        movieListItem.innerHTML = `
            <div class="search-item-thumbnail">
                <img src="${poster}" alt="poster"
                     onerror="this.src='images/image_not_found.png'">
            </div>
            <div class="search-item-info">
                <h3>${movie.Title}</h3>
                <p>${movie.Year}</p>
            </div>
        `;

        searchList.appendChild(movieListItem);
    });

    loadMovieDetails();
}

/* ---------------- LOAD MOVIE DETAILS ---------------- */
function loadMovieDetails() {
    const searchListMovies = searchList.querySelectorAll(".search-list-item");

    searchListMovies.forEach(movie => {
        movie.addEventListener("click", async () => {
            searchList.classList.add("hide-search-list");
            movieSearchBox.value = "";

            try {
                const url = `https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=${API_KEY}`;
                const res = await fetch(url);
                const details = await res.json();

                if (details.Response === "True") {
                    displayMovieDetails(details);
                }
            } catch (error) {
                console.error("Details error:", error);
            }
        });
    });
}

/* ---------------- DISPLAY DETAILS ---------------- */
function displayMovieDetails(details) {
    const poster =
        details.Poster && details.Poster !== "N/A"
            ? details.Poster
            : "images/image_not_found.png";

    resultGrid.innerHTML = `
        <div class="movie-poster">
            <img src="${poster}" alt="movie poster"
                 onerror="this.src='images/image_not_found.png'">
        </div>

        <div class="movie-info">
            <h3 class="movie-title">${details.Title}</h3>

            <ul class="movie-misc-info">
                <li class="year">Year: ${details.Year}</li>
                <li class="rated">Rated: ${details.Rated}</li>
                <li class="released">Released: ${details.Released}</li>
            </ul>

            <p class="genre"><b>Genre:</b> ${details.Genre}</p>
            <p class="writer"><b>Writer:</b> ${details.Writer}</p>
            <p class="actors"><b>Actors:</b> ${details.Actors}</p>
            <p class="plot"><b>Plot:</b> ${details.Plot}</p>
            <p class="language"><b>Language:</b> ${details.Language}</p>
            <p class="awards">
                <i class="fa fa-award"></i> ${details.Awards}
            </p>
        </div>
    `;
}

/* ---------------- CLICK OUTSIDE TO CLOSE ---------------- */
window.addEventListener("click", event => {
    if (!event.target.classList.contains("form-control")) {
        searchList.classList.add("hide-search-list");
    }
});
