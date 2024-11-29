const movieSearchBox = document.getElementById('movieSearchBox');
const searchList = document.getElementById('searchList');
const resultGrid = document.getElementById('resultGrid');

// load api
async function loadMovies(searchTerm) {
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=817454c0`;
    try {
        const res = await fetch(URL);
        const data = await res.json();
        console.log(data); // Depuração
        if (data.Response == "True") {
            displayMovieList(data.Search);
        } else {
            console.error(data.Error);
        }
    } catch (error) {
        console.error("Erro ao buscar filmes:", error);
    }
}

// function search movies
function findMovies() {
    let searchTerm = (movieSearchBox.value).trim();
    if (searchTerm.length > 0) {
        searchList.classList.remove('hideSearchList');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hideSearchList');
    }
}

movieSearchBox.addEventListener('input', findMovies);

function displayMovieList(movies) {
    searchList.innerHTML = "";
    for (let idx = 0; idx < movies.length; idx++) {
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID;
        movieListItem.classList.add('searchListItem');
        let moviePoster = (movies[idx].Poster != "N/A") ? movies[idx].Poster : 'image_not_found.png';

        movieListItem.innerHTML = `
            <div class="searchItemThumbnail">
                <img src="${moviePoster}">
            </div>
            <div class="searchItemInfo">
                <h3>${movies[idx].Title}</h3>
                <p>${movies[idx].Year}</p>
            </div>
        `;
        searchList.appendChild(movieListItem);
    }
    attachMovieClickEvents();
}

function attachMovieClickEvents() {
    const searchListMovies = searchList.querySelectorAll('.searchListItem');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hideSearchList'); // Fecha o dropdown
            movieSearchBox.value = ""; // Limpa o campo de busca
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=817454c0`);
            const movieDetails = await result.json();
            displayMovieDetails(movieDetails);
        });
    });
}

function displayMovieDetails(details) {
    resultGrid.innerHTML = `
        <div class="moviePoster">
            <img src="${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt="movie poster">
        </div>
        <div class="movieInfo">
            <h3 class="movieTitle">${details.Title}</h3>
            <ul class="movieMiscInfo">
                <li class="year">Year: ${details.Year}</li>
                <li class="rated">Ratings: ${details.Rated}</li>
                <li class="released">Released: ${details.Released}</li>
            </ul>
            <p class="genre"><b>Genre:</b> ${details.Genre}</p>
            <p class="writer"><b>Writer:</b> ${details.Writer}</p>
            <p class="actors"><b>Actors: </b>${details.Actors}</p>
            <p class="plot"><b>Plot:</b> ${details.Plot}</p>
            <p class="language"><b>Language:</b> ${details.Language}</p>
            <p class="awards"><b><i class="fas fa-award"></i></b> ${details.Awards}</p>
        </div>
    `;
}

// Listener global para cliques fora do dropdown
window.addEventListener('click', (event) => {
    // Verifica se o clique foi fora do campo de busca ou da lista de sugestões
    if (!searchList.contains(event.target) && event.target !== movieSearchBox) {
        searchList.classList.add('hideSearchList');
    }
});
