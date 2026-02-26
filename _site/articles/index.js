let currentPage = 1;
const pageSize = 6;

// Your Guardian API key
const GUARDIAN_API_KEY = "289cf2b6-3439-4726-9717-19f187ad594f";

// Sections you want
const FILTER_SECTIONS = ["science", "technology", "film", "culture", "books", "history", "philosophy"];

// JSTOR articles (static, no images)
const JSTOR_ARTICLES = [
  {
    title: "The Concept of Civilization from Enlightenment to Revolution: An Ambiguous Transfer",
    author: "Raymonde Monnier",
    details: "Contributions to the History of Concepts, Vol. 4, No. 1 (2008), pp. 106-136 (31 pages)",
    link: "https://www.jstor.org/stable/23730859",
    pdf: "mailto:r.masud@g.nsu.ru?subject=Request PDF: The Concept of Civilization"
  },
  {
    title: "Empire & 'Civilizing' Missions, Past & Present",
    author: "Kenneth Pomeranz",
    details: "Daedalus, Vol. 134, No. 2, On Imperialism (Spring, 2005), pp. 34-45 (12 pages)",
    link: "https://www.jstor.org/stable/20027976",
    pdf: "mailto:r.masud@g.nsu.ru?subject=Request PDF: Empire & 'Civilizing' Missions"
  },
  {
    title: "Eurocentrism, ‘civilization’ and the ‘barbarians’",
    details: "Humanitarian Intervention in the Long Nineteenth Century: Setting the Precedent, 2015, pp. 31-56 (26 pages)",
    link: "https://doi.org/10.2307/j.ctt1mf71b8.7",
    pdf: "mailto:r.masud@g.nsu.ru?subject=Request PDF: Eurocentrism, civilization and the barbarians"
  },
  {
    title: "CHAPTER THREE TRADE NETWORKS IN ANCIENT SOUTH ASIA",
    details: "Early Buddhist Transmission and Trade Networks: Mobility and Exchange within and beyond the Northwestern Borderlands of South Asia, 2011, pp. 183-228 (46 pages)",
    link: "https://www.jstor.org/stable/10.1163/j.ctt1w8h16r.9",
    pdf: "mailto:r.masud@g.nsu.ru?subject=Request PDF: Trade Networks in Ancient South Asia"
  }
];

// Build Guardian section query
function buildSectionQuery(sections) {
  return sections.join("|");
}

// Fetch Guardian articles
async function fetchGuardianArticles(page = 1, pageSize = 3) {
  const sections = buildSectionQuery(FILTER_SECTIONS);
  try {
    const url = `https://content.guardianapis.com/search?api-key=${GUARDIAN_API_KEY}&section=${sections}&page-size=${pageSize}&page=${page}&show-fields=thumbnail,trailText`;
    const response = await fetch(url);
    const data = await response.json();
    if (!data.response || !data.response.results) return [];
    return data.response.results;
  } catch (error) {
    console.error("Error fetching Guardian articles:", error);
    return [];
  }
}

// Render JSTOR articles (no images)
function renderJSTORArticles(articles) {
  const container = document.getElementById("jstor-articles-container");
  if (!container) return;

  articles.forEach(article => {
    const div = document.createElement("div");
    div.classList.add("article-card");
    div.innerHTML = `
      <h4>${article.title}</h4>
      ${article.author ? `<p><strong>${article.author}</strong></p>` : ""}
      <p>${article.details}</p>
      <a href="${article.link}" target="_blank">View Article</a>
      ${article.pdf ? `<a href="${article.pdf}" class="pdf-request-btn"><i class="bi bi-file-earmark-pdf-fill"></i> Request PDF</a>` : ""}
    `;
    container.appendChild(div);
  });
}

// Render Guardian articles (with thumbnails)
function renderGuardianArticles(articles) {
  const container = document.getElementById("guardian-articles-container");
  if (!container) return;

  if (!articles || articles.length === 0) {
    const loadButton = document.getElementById("load-more");
    loadButton.disabled = true;
    loadButton.textContent = "No more articles";
    return;
  }

  articles.forEach(article => {
    const div = document.createElement("div");
    div.classList.add("article-card");

    const imageHTML = article.fields && article.fields.thumbnail
      ? `<img src="${article.fields.thumbnail}" alt="Cover image">`
      : "";

    div.innerHTML = `
      ${imageHTML}
      <h4>${article.webTitle}</h4>
      <p>${(article.fields && article.fields.trailText) || ""}</p>
      <a href="${article.webUrl}" target="_blank">Read more</a>
    `;
    container.appendChild(div);
  });
}

// Initialize page
document.addEventListener("DOMContentLoaded", async () => {
  // Render JSTOR articles first
  renderJSTORArticles(JSTOR_ARTICLES);

  // Load initial Guardian articles
  const guardianArticles = await fetchGuardianArticles(currentPage, pageSize);
  renderGuardianArticles(guardianArticles);

  // Load more button for Guardian articles
  document.getElementById("load-more").addEventListener("click", async () => {
    currentPage++;
    const moreArticles = await fetchGuardianArticles(currentPage, pageSize);
    renderGuardianArticles(moreArticles);
  });
});
