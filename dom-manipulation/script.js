 const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuote");
const newQuoteInput = document.getElementById("newQuoteText");
const newCategoryInput = document.getElementById("newQuoteCategory");

// Array of quote objects
let quotes = [
  { text: "The only limit is your mind.", category: "Motivation" },
  { text: "Stay curious, stay learning.", category: "Education" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

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
}

// Add a new quote
function addQuote() {
  const text = newQuoteInput.value.trim();
  const category = newCategoryInput.value.trim();

  if (text && category) {
    quotes.push({ text, category });
    newQuoteInput.value = "";
    newCategoryInput.value = "";
    alert("Quote added successfully!");
  } else {
    alert("Please enter both quote and category.");
  }
}

// Event Listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);

// Display one quote on load
showRandomQuote();
