const API_URL = "https://api.jikan.moe/v4";

async function getTopAnime() {
    const response = await fetch(`${API_URL}/top/anime?limit=16`);
    const data = await response.json();
    const popularAnime = document.getElementById("anime-top");
    
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "style.css";
    document.head.appendChild(link);

    const animeTop = Array.isArray(data.data)
        ? data.data
            .map((item) => {
                return `
                  <div class="card" >
                      <a href="${item.url}" id="anime-link" target="_blank">
                          <img id="anime-img" src="${item.images.jpg.image_url}">
                          <h2 id="anime-title-jpn">${item.title_japanese}</h2>
                          <h2 id="anime-title">${item.title}</h2>
                          <h3 id="anime-score">Score: ${item.score}</h3>
                      </a>
                  </div>
              `;
            })
            .join("")
        : "";

    popularAnime.innerHTML = animeTop;
}

getTopAnime();