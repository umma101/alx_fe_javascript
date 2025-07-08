// Initial quotes array
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Believe in yourself.", category: "Motivation" },
  { text: "Life is beautiful.", category: "Inspiration" },
  { text: "Always keep learning.", category: "Education" }
];

// Show random quote
function showRandomQuote() {
  const category = document.getElementById("categoryFilter").value;
  const filteredQuotes = category === "all" ? quotes : quotes.filter(q => q.category === category);
  const random = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  if (random) {
    document.getElementById("quoteDisplay").textContent = `"${random.text}" - [${random.category}]`;
    sessionStorage.setItem("lastQuote", JSON.stringify(random));
  } else {
    document.getElementById("quoteDisplay").textContent = "No quotes available for this category.";
  }
}

// Save to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("Quote added!");
  } else {
    alert("Please fill in both fields.");
  }
}

// Populate categories dynamically
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const categories = Array.from(new Set(quotes.map(q => q.category)));
  const selected = select.value;

  select.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    if (category === selected) option.selected = true;
    select.appendChild(option);
  });
}

// Filter quotes by selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);
  showRandomQuote();
}

// Export quotes as JSON file
document.getElementById("exportJson").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
});

// Import quotes from JSON file
document.getElementById("importFile").addEventListener("change", event => {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        alert("Quotes imported!");
      }
    } catch {
      alert("Invalid JSON file.");
    }
  };
  reader.readAsText(event.target.files[0]);
});

// Simulate syncing quotes with a mock server (JSONPlaceholder)
function syncWithServer() {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then(res => res.json())
    .then(data => {
      const serverQuotes = data.slice(0, 3).map(post => ({
        text: post.title,
        category: "Server"
      }));

      const newOnes = serverQuotes.filter(serverQ =>
        !quotes.some(localQ => localQ.text === serverQ.text)
      );

      if (newOnes.length > 0) {
        quotes.push(...newOnes);
        saveQuotes();
        populateCategories();
        alert(`${newOnes.length} new quotes synced from server.`);
      }
    })
    .catch(err => console.error("Sync failed:", err));
}

// Sync every 30 seconds
setInterval(syncWithServer, 30000);

// On page load
window.onload = () => {
  populateCategories();
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    document.getElementById("categoryFilter").value = savedFilter;
  }
  const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
  if (lastQuote) {
    document.getElementById("quoteDisplay").textContent = `"${lastQuote.text}" - [${lastQuote.category}]`;
  } else {
    showRandomQuote();
  }

  // Attach events
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("addQuote").addEventListener("click", addQuote);
};
