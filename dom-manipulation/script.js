// script.js

// ----------------------------
// Global Variables & Data
// ----------------------------
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
];

let lastShownQuote = sessionStorage.getItem('lastQuote') || '';

// ----------------------------
// DOM Elements
// ----------------------------
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuote");
const categoryFilter = document.getElementById("categoryFilter");
const exportBtn = document.getElementById("exportJson");
const importInput = document.getElementById("importFile");

// ----------------------------
// Functions
// ----------------------------
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const filteredQuotes = selectedCategory === 'all'
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) return (quoteDisplay.textContent = "No quotes available in this category.");

  const random = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  quoteDisplay.textContent = random.text;
  sessionStorage.setItem('lastQuote', random.text);
}

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    textInput.value = "";
    categoryInput.value = "";
  }
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
  categoryFilter.value = localStorage.getItem("selectedCategory") || "all";
}

function filterQuotes() {
  localStorage.setItem("selectedCategory", categoryFilter.value);
  showRandomQuote();
}

function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

async function syncWithServer() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    const serverQuotes = await res.json();
    const converted = serverQuotes.map(post => ({ text: post.title, category: "Server" }));

    // Basic Conflict Resolution: Server > Local
    const allQuotes = [...quotes, ...converted];
    const unique = Array.from(new Set(allQuotes.map(q => q.text)))
      .map(text => allQuotes.find(q => q.text === text));

    quotes = unique;
    saveQuotes();
    populateCategories();
  } catch (error) {
    console.error("Error syncing with server:", error);
  }
}

// ----------------------------
// Event Listeners
// ----------------------------
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  quoteDisplay.textContent = lastShownQuote || "Click 'Show New Quote' to begin!";
  syncWithServer();
});

newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
categoryFilter.addEventListener("change", filterQuotes);
exportBtn.addEventListener("click", exportQuotes);
importInput.addEventListener("change", importFromJsonFile);

// Auto sync every 2 minutes
setInterval(syncWithServer, 2 * 60 * 1000);
