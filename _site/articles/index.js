let currentPage = 1;
const pageSize = 6;

// Your Guardian API key
const GUARDIAN_API_KEY = "289cf2b6-3439-4726-9717-19f187ad594f";

// Sections you want
const FILTER_SECTIONS = ["science", "technology", "film", "culture", "books", "history", "philosophy", "environment", "global-development"];

// Build a section query string for the API
function buildSectionQuery(sections) {
  return sections.join("|"); // Guardian API uses '|' to separate multiple sections
}

async function fetchArticles(page = 1, pageSize = 3) {
  const sections = buildSectionQuery(FILTER_SECTIONS);

  try {
    const url = `https://content.guardianapis.com/search?api-key=${GUARDIAN_API_KEY}&section=${sections}&page-size=${pageSize}&page=${page}&show-fields=thumbnail,trailText`;

    const response = await fetch(url);
    const data = await response.json();

    console.log("Fetched data:", data); // Debugging

    if (!data.response || !data.response.results || data.response.results.length === 0) {
      return [];
    }

    return data.response.results;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

function renderArticles(articles) {
  const container = document.getElementById("articles-container");

  if (!articles || articles.length === 0) {
    const loadButton = document.getElementById("load-more");
    loadButton.disabled = true;
    loadButton.textContent = "No more articles";
    return;
  }

  articles.forEach((article) => {
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

document.addEventListener("DOMContentLoaded", () => {
  // Initial load
  fetchArticles(currentPage, pageSize).then(renderArticles);

  // Load more button
  document.getElementById("load-more").addEventListener("click", () => {
    currentPage++;
    fetchArticles(currentPage, pageSize).then(renderArticles);
  });
});
