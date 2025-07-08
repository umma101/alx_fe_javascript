
let quotes = [];
const defaultQuotes = [
  { text: "Be yourself; everyone else is already taken.", category: "Inspiration" },
  { text: "Two things are infinite: the universe and human stupidity.", category: "Humor" },
  { text: "Success is not final, failure is not fatal.", category: "Motivation" }
];

// ========== ELEMENT REFERENCES ==========
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuote");
const quoteTextInput = document.getElementById("newQuoteText");
const quoteCategoryInput = document.getElementById("newQuoteCategory");
const categoryFilter = document.getElementById("categoryFilter");
const importFileInput = document.getElementById("importFile");
const exportJsonBtn = document.getElementById("exportJson");

// ========== STORAGE ==========
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  quotes = stored ? JSON.parse(stored) : defaultQuotes;
  saveQuotes();
}

// ========== RANDOM QUOTE ==========
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  let filteredQuotes = quotes;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = `"${filteredQuotes[randomIndex].text}" — ${filteredQuotes[randomIndex].category}`;
}

// ========== ADD QUOTE ==========
function addQuote() {
  const text = quoteTextInput.value.trim();
  const category = quoteCategoryInput.value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    quoteTextInput.value = "";
    quoteCategoryInput.value = "";
    alert("Quote added!");
  }
}

// ========== POPULATE CATEGORIES ==========
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });

  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) categoryFilter.value = savedCategory;
}

// ========== FILTER QUOTES ==========
function filterQuotes() {
  localStorage.setItem("selectedCategory", categoryFilter.value);
  showRandomQuote();
}

// ========== EXPORT JSON ==========
function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "quotes.json";
  link.click();
}

// ========== IMPORT JSON ==========
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const imported = JSON.parse(e.target.result);
    quotes.push(...imported);
    saveQuotes();
    populateCategories();
    alert("Quotes imported successfully!");
  };
  reader.readAsText(event.target.files[0]);
}

// ========== SERVER SYNC ==========
function fetchQuotesFromServer() {
  return fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
    .then(res => res.json())
    .then(data => data.map(post => ({
      text: post.title,
      category: "Server"
    })))
    .catch(() => []);
}

function postQuoteToServer(quote) {
  return fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quote)
  }).then(res => res.json());
}

// ========== CONFLICT RESOLUTION + NOTIFY ==========
function notifyUser(message) {
  let notice = document.getElementById("notification");
  if (!notice) {
    notice = document.createElement("div");
    notice.id = "notification";
    notice.style.background = "#ffeb3b";
    notice.style.padding = "10px";
    notice.style.margin = "10px 0";
    document.body.insertBefore(notice, quoteDisplay);
  }
  notice.textContent = message;
  setTimeout(() => (notice.textContent = ""), 5000);
}

async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  const serverData = JSON.stringify(serverQuotes);
  const localData = JSON.stringify(quotes);

  if (serverData !== localData) {
    quotes = serverQuotes;
    saveQuotes();
    populateCategories();
    notifyUser("Quotes synced with server (conflict resolved)");
  }
}

// ========== EVENT LISTENERS ==========
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
exportJsonBtn.addEventListener("click", exportToJson);
importFileInput.addEventListener("change", importFromJsonFile);

// ========== INITIALIZE ==========
loadQuotes();
populateCategories();
showRandomQuote();
syncQuotes();
setInterval(syncQuotes, 10000); // sync every 10 seconds