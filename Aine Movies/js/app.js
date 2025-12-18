// TMDB API Configuration
const API_KEY = 'eefcc515ed0980a6aa4717c8080f9ccc';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// DOM Elements
const heroSearchInput = document.querySelector('.hero input');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

// Utility Functions
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
        <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title || movie.name}" loading="lazy">
        <div class="info">
            <h3>${movie.title || movie.name}</h3>
            <p>${movie.release_date || movie.first_air_date ? new Date(movie.release_date || movie.first_air_date).getFullYear() : 'N/A'}</p>
        </div>
    `;
    card.addEventListener('click', () => {
        const type = movie.title ? 'movie' : 'tv';
        addToRecentlyViewed(movie);
        window.location.href = `${type}.html?id=${movie.id}`;
    });
    return card;
}

function createCastMember(cast) {
    const member = document.createElement('div');
    member.className = 'cast-member';
    member.innerHTML = `
        <img src="${cast.profile_path ? IMAGE_BASE_URL + cast.profile_path : 'https://via.placeholder.com/100x100?text=No+Image'}" alt="${cast.name}" loading="lazy">
        <p>${cast.name}</p>
        <p>${cast.character}</p>
    `;
    return member;
}

// API Functions
async function fetchTrending(mediaType = 'movie', timeWindow = 'week') {
    const response = await fetch(`${BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results;
}

async function fetchMovies(endpoint) {
    const response = await fetch(`${BASE_URL}/movie/${endpoint}?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results;
}

async function fetchTVShows(endpoint) {
    const response = await fetch(`${BASE_URL}/tv/${endpoint}?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results;
}

async function fetchMovieDetails(id) {
    const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits,similar`);
    const data = await response.json();
    return data;
}

async function fetchTVDetails(id) {
    const response = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&append_to_response=credits,similar`);
    const data = await response.json();
    return data;
}

async function searchMulti(query) {
    const response = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.results;
}

async function fetchGenres(mediaType) {
    const response = await fetch(`${BASE_URL}/genre/${mediaType}/list?api_key=${API_KEY}`);
    const data = await response.json();
    return data.genres;
}

async function fetchMoviesByGenre(genreId, page = 1) {
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`);
    const data = await response.json();
    return data.results;
}

async function fetchTVByGenre(genreId, page = 1) {
    const response = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`);
    const data = await response.json();
    return data.results;
}

// Page-specific functions
async function loadHomePage() {
    try {
        // Load trending movies for hero
        const trendingMovies = await fetchTrending('movie', 'week');
        if (trendingMovies.length > 0) {
            const heroMovie = trendingMovies[0];
            document.querySelector('.hero').style.backgroundImage = `url(${IMAGE_BASE_URL}${heroMovie.backdrop_path})`;
            document.querySelector('.hero h1').textContent = heroMovie.title;
            document.querySelector('.hero p').textContent = heroMovie.overview.substring(0, 150) + '...';
        }

        // Load movie sections
        const nowPlaying = await fetchMovies('now_playing');
        const popularMovies = await fetchMovies('popular');
        const topRatedMovies = await fetchMovies('top_rated');
        const upcomingMovies = await fetchMovies('upcoming');

        // Load TV sections
        const popularTV = await fetchTVShows('popular');
        const topRatedTV = await fetchTVShows('top_rated');
        const airingToday = await fetchTVShows('airing_today');

        // Populate sections
        populateSection('now-playing', nowPlaying);
        populateSection('popular-movies', popularMovies);
        populateSection('top-rated-movies', topRatedMovies);
        populateSection('upcoming-movies', upcomingMovies);
        populateSection('popular-tv', popularTV);
        populateSection('top-rated-tv', topRatedTV);
        populateSection('airing-today', airingToday);

    } catch (error) {
        console.error('Error loading home page:', error);
    }
}

function populateSection(sectionId, items) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.innerHTML = '';
        items.slice(0, 10).forEach(item => {
            section.appendChild(createMovieCard(item));
        });
    }
}

async function loadMovieDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    if (!movieId) return;

    try {
        const movie = await fetchMovieDetails(movieId);
        
        document.getElementById('movie-poster').src = IMAGE_BASE_URL + movie.poster_path;
        document.getElementById('movie-title').textContent = movie.title;
        document.getElementById('movie-rating').textContent = `⭐ ${movie.vote_average.toFixed(1)}`;
        document.getElementById('movie-release').textContent = new Date(movie.release_date).getFullYear();
        document.getElementById('movie-runtime').textContent = `${movie.runtime} min`;
        document.getElementById('movie-genres').textContent = movie.genres.map(g => g.name).join(', ');
        document.getElementById('movie-overview').textContent = movie.overview;

        // Cast
        const castList = document.getElementById('cast-list');
        movie.credits.cast.slice(0, 10).forEach(cast => {
            castList.appendChild(createCastMember(cast));
        });

        // Similar movies
        populateSection('similar-list', movie.similar.results);

        // Watch now button
        document.getElementById('watch-now').addEventListener('click', () => {
            addToRecentlyViewed(movie);
            window.location.href = `player.html?id=${movieId}&type=movie`;
        });

    } catch (error) {
        console.error('Error loading movie details:', error);
    }
}

async function loadTVDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const tvId = urlParams.get('id');
    if (!tvId) return;

    try {
        const tv = await fetchTVDetails(tvId);
        
        document.getElementById('tv-poster').src = IMAGE_BASE_URL + tv.poster_path;
        document.getElementById('tv-title').textContent = tv.name;
        document.getElementById('tv-rating').textContent = `⭐ ${tv.vote_average.toFixed(1)}`;
        document.getElementById('tv-first-air').textContent = new Date(tv.first_air_date).getFullYear();
        document.getElementById('tv-seasons').textContent = `${tv.number_of_seasons} seasons`;
        document.getElementById('tv-genres').textContent = tv.genres.map(g => g.name).join(', ');
        document.getElementById('tv-overview').textContent = tv.overview;

        // Cast
        const castList = document.getElementById('cast-list');
        tv.credits.cast.slice(0, 10).forEach(cast => {
            castList.appendChild(createCastMember(cast));
        });

        // Similar TV shows
        populateSection('similar-list', tv.similar.results);

        // Watch now button
        document.getElementById('watch-now').addEventListener('click', () => {
            window.location.href = `player.html?id=${tvId}&type=tv`;
        });

    } catch (error) {
        console.error('Error loading TV details:', error);
    }
}

async function loadPlayer() {
    console.log('loadPlayer called');
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const type = urlParams.get('type');
    console.log('ID:', id, 'Type:', type);
    if (!id || !type) return;

    try {
        let item;
        if (type === 'movie') {
            item = await fetchMovieDetails(id);
            document.getElementById('player-title').textContent = item.title;
        } else {
            item = await fetchTVDetails(id);
            document.getElementById('player-title').textContent = item.name;
        }

        console.log('Item loaded:', item.title || item.name);

        // Integrate with VidSrc streaming service
        let embedUrl;
        if (type === 'movie') {
            embedUrl = `https://vidsrc.to/embed/movie/${id}`;
        } else {
            embedUrl = `https://vidsrc.to/embed/tv/${id}`;
        }

        const playerContainer = document.querySelector('.player-container');
        playerContainer.innerHTML = `
            <iframe src="${embedUrl}" width="100%" height="600" frameborder="0" allowfullscreen allow="autoplay; encrypted-media" referrerpolicy="no-referrer"></iframe>
        `;

        // Load related videos
        const similar = type === 'movie' ? item.similar.results : item.similar.results;
        populateSection('related-list', similar);

    } catch (error) {
        console.error('Error loading player:', error);
        const playerContainer = document.querySelector('.player-container');
        if (playerContainer) {
            playerContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; background: #1a1a1a; border-radius: 8px;">
                    <h3>Error Loading Player</h3>
                    <p>There was an error loading the player. Check the console for details.</p>
                    <button onclick="location.reload()" style="background: #ff6b6b; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; margin-top: 1rem;">Retry</button>
                </div>
            `;
        }
    }
}

async function performSearch(query) {
    if (!query.trim()) return;

    try {
        const results = await searchMulti(query);
        searchResults.innerHTML = '';
        results.forEach(item => {
            if (item.media_type === 'movie' || item.media_type === 'tv') {
                searchResults.appendChild(createMovieCard(item));
            }
        });
    } catch (error) {
        console.error('Error performing search:', error);
    }
}

// Event Listeners
if (heroSearchInput) {
    heroSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            window.location.href = `search.html?q=${encodeURIComponent(heroSearchInput.value)}`;
        }
    });
}

if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(e.target.value);
        }, 500);
    });

    // Load search query from URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) {
        searchInput.value = query;
        performSearch(query);
    }
}

// Special Features: Watchlist, Continue Watching, Recently Viewed
function addToWatchlist(item) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    if (!watchlist.find(w => w.id === item.id && w.type === (item.title ? 'movie' : 'tv'))) {
        watchlist.push({
            id: item.id,
            type: item.title ? 'movie' : 'tv',
            title: item.title || item.name,
            poster: item.poster_path,
            addedAt: new Date().toISOString()
        });
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }
}

function getWatchlist() {
    return JSON.parse(localStorage.getItem('watchlist') || '[]');
}

function addToRecentlyViewed(item) {
    let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    recentlyViewed = recentlyViewed.filter(r => !(r.id === item.id && r.type === (item.title ? 'movie' : 'tv')));
    recentlyViewed.unshift({
        id: item.id,
        type: item.title ? 'movie' : 'tv',
        title: item.title || item.name,
        poster: item.poster_path,
        viewedAt: new Date().toISOString()
    });
    recentlyViewed = recentlyViewed.slice(0, 20); // Keep only last 20
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
}

function getRecentlyViewed() {
    return JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
}

function saveProgress(id, type, currentTime, duration) {
    const progress = { currentTime, duration, savedAt: new Date().toISOString() };
    localStorage.setItem(`progress_${type}_${id}`, JSON.stringify(progress));
}

function getProgress(id, type) {
    return JSON.parse(localStorage.getItem(`progress_${type}_${id}`) || 'null');
}


// Caching
const cache = {};
function getCachedData(key) {
    const cached = cache[key];
    if (cached && Date.now() - cached.timestamp < 3600000) { // 1 hour cache
        return cached.data;
    }
    return null;
}

function setCachedData(key, data) {
    cache[key] = { data, timestamp: Date.now() };
}

// Modified API functions with caching
async function fetchWithCache(url) {
    const cached = getCachedData(url);
    if (cached) return cached;

    const response = await fetch(url);
    const data = await response.json();
    setCachedData(url, data);
    return data;
}

// Update fetch functions to use cache
async function fetchTrending(mediaType = 'movie', timeWindow = 'week') {
    const url = `${BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${API_KEY}`;
    const data = await fetchWithCache(url);
    return data.results;
}

async function fetchMovies(endpoint) {
    const url = `${BASE_URL}/movie/${endpoint}?api_key=${API_KEY}`;
    const data = await fetchWithCache(url);
    return data.results;
}

async function fetchTVShows(endpoint) {
    const url = `${BASE_URL}/tv/${endpoint}?api_key=${API_KEY}`;
    const data = await fetchWithCache(url);
    return data.results;
}

async function fetchMovieDetails(id) {
    const url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits,similar`;
    return await fetchWithCache(url);
}

async function fetchTVDetails(id) {
    const url = `${BASE_URL}/tv/${id}?api_key=${API_KEY}&append_to_response=credits,similar`;
    return await fetchWithCache(url);
}

async function searchMulti(query) {
    const url = `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
    const data = await fetchWithCache(url);
    return data.results;
}

async function fetchGenres(mediaType) {
    const url = `${BASE_URL}/genre/${mediaType}/list?api_key=${API_KEY}`;
    const data = await fetchWithCache(url);
    return data.genres;
}

async function fetchMoviesByGenre(genreId, page = 1) {
    const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`;
    const data = await fetchWithCache(url);
    return data.results;
}

async function fetchTVByGenre(genreId, page = 1) {
    const url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`;
    const data = await fetchWithCache(url);
    return data.results;
}

// Page initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, checking page type...');
    if (document.querySelector('.hero')) {
        console.log('Loading home page');
        loadHomePage();
    } else if (document.getElementById('movie-poster')) {
        console.log('Loading movie details');
        loadMovieDetails();
    } else if (document.getElementById('tv-poster')) {
        console.log('Loading TV details');
        loadTVDetails();
    } else if (document.querySelector('.player-container')) {
        console.log('Loading player');
        loadPlayer();
    } else if (document.getElementById('genres-list')) {
        console.log('Loading genres page');
        loadGenresPage();
    } else {
        console.log('No matching page type found');
    }
});