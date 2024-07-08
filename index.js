const moviesSearchBox = document.getElementById('movieSearchBox');
const searchList = document.getElementById('searchList');
const resultGrid = document.getElementById('resultGrid');

// load movies from API

async function loadMovies(searchTerm){
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=817454c0`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    // console.log(data.Search);
    if(data.Response == "True")  displayMovieList(data.Search);
}
function findMovies(){
    let searchTerm = (moviesSearchBox.value).trim();
    if(searchTerm.length > 0){
        searchList.classList.remove('hideSearchList');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hideSearchList');
    }
}
function displayMovieList(movies){
    searchList.innerHTML= "";
    for(let idx = 0; idx < movies.length; idx++){
        let moviesListItem = document.createElement('div');
       moviesListItem.dataset.id = movies[idx].imdbID;
       moviesListItem.classList.add('searchListItem');
       if(movies[idx].Poster != "N/A")
            moviesPoster = movies[idx].Poster;
       else 
            moviesPoster = 'image_not_found.png';

        moviesListItem.innerHTML = `
        <div class="searchListItem">
                        <div class="searchItemThumbnail">
                            <img src="${moviePoster}">
                        </div>
                        <div class="searchItemInfo">
                            <h3> ${movies[idx].Title}</h3>
                            <p>${movies[idx].Year}</p>
        </div>
        `;

        searchList.appendChild(moviesListItem);
    }
    
    loadMovieDetails();
}

function loadMovieDatails(){
    const searchListMovies = searchList.querySelectorAll('.searchListItem');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add(hideSearchList);
            moviesSearchBox.value = "";
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=817454c0`)
            const movieDetails = await result.json();
            displayMovieDetails(movieDetails);
        
        })
    })
}


