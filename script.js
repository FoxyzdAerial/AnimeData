// Tambah style.css jika belum ada
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "./style.css";
document.head.appendChild(link);

// Element reference
const headerTitle = document.getElementById("header-title");
const animeListContainer = document.getElementById("anime-list");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const logoButtons = document.getElementsByClassName("logo");
const animePopular = document.getElementById("popular-anime");
const searchResult = document.getElementById("search-result");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");

// Pagination control
let currentPage = 1;
const limit = 8;
const params = new URLSearchParams(window.location.search);
const keyword = params.get("query");

const fetchAnime = async (keyword, page = 1) => {
    animeListContainer.innerHTML = "Loading...";
    try {
        const response = await fetch(
            `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(keyword)}&page=${page}&limit=${limit}`,
        );
        const data = await response.json();
        renderAnimeList(data);
    } catch (error) {
        animeListContainer.innerHTML =
            "<p>Terjadi kesalahan saat mengambil data.</p>";
        console.error(error);
    }
};

const renderAnimeList = (data) => {
    animeListContainer.innerHTML = "";
    if (!data.data || data.data.length === 0) {
        animeListContainer.innerHTML =
            "<p>Tidak ditemukan anime dengan kata kunci tersebut.</p>";
        updatePaginationButtons(false);
        return;
    }

    data.data.forEach((anime) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <div class="result">
                <a href="${anime.url}" target="_blank">
                    <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
                    <h2>${anime.title_japanese || ""}</h2>
                    <h2>${anime.title}</h2>
                    <h3>Score: ${anime.score ?? "N/A"}</h3>
                </a>
            </div>
        `;
        animeListContainer.appendChild(card);
    });

    updatePaginationButtons(data.pagination.has_next_page);
};

const updatePaginationButtons = (hasNext) => {
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = !hasNext;
};

if (nextButton) {
    nextButton.addEventListener("click", () => {
        currentPage++;
        fetchAnime(keyword, currentPage);
    });
}

if (prevButton) {
    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            fetchAnime(keyword, currentPage);
        }
    });
}

if (searchInput) {
    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            const inputKeyword = searchInput.value.trim();
            if (inputKeyword !== "") {
                window.location.href = `search.html?query=${encodeURIComponent(inputKeyword)}`;
            }
        }
    });
}

if (searchButton) {
    searchButton.addEventListener("click", () => {
        const inputKeyword = searchInput.value.trim();
        if (inputKeyword !== "") {
            window.location.href = `search.html?query=${encodeURIComponent(inputKeyword)}`;
        }
    });
}


// Logo klik ke home
for (let i = 0; i < logoButtons.length; i++) {
    logoButtons[i].addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = "index.html";
    });
}

// Load awal saat membuka halaman search
if (keyword) {
    headerTitle.textContent = `Pencarian untuk "${keyword}"`;
    fetchAnime(keyword, currentPage);
} else {
    headerTitle.textContent = "Masukkan kata kunci di Search Bar untuk pencarian anime.";
    animeListContainer.innerHTML = "";
    updatePaginationButtons(false);
}
