const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuote");
const exportBtn = document.getElementById("exportJson");
const importFileInput = document.getElementById("importFile");

const newQuoteInput = document.getElementById("newQuoteText");
const newCategoryInput = document.getElementById("newQuoteCategory");

// Load from localStorage
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit is your mind.", category: "Motivation" },
  { text: "Stay curious, stay learning.", category: "Education" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

// Save to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <blockquote>
      "${quote.text}"
      <footer><em>— ${quote.category}</em></footer>
    </blockquote>
  `;

  // Save last shown quote to sessionStorage (optional)
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Add a new quote
function addQuote() {
  const text = newQuoteInput.value.trim();
  const category = newCategoryInput.value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    newQuoteInput.value = "";
    newCategoryInput.value = "";
    alert("Quote added successfully!");
  } else {
    alert("Please enter both quote and category.");
  }
}

// Export JSON file
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
}

// Import from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid format in JSON file.");
      }
    } catch (error) {
      alert("Failed to import: " + error.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Event Listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
exportBtn.addEventListener("click", exportQuotes);
importFileInput.addEventListener("change", importFromJsonFile);

// Show a quote when page loads
showRandomQuote();
