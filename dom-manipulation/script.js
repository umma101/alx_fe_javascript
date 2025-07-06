 const API_URL = 'https://6868ec46d5933161d70cdea8.mockapi.io/quotes'; // 🔁 Replace this!

function getLocalQuotes() {
  return JSON.parse(localStorage.getItem('quotes')) || [];
}

function saveLocalQuotes(quotes) {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function renderQuotes(quotes) {
  const list = document.getElementById('quote-list');
  list.innerHTML = '';
  quotes.forEach(quote => {
    const li = document.createElement('li');
    li.textContent = quote.text;
    list.appendChild(li);
  });
}

async function postQuoteToServer(quote) {
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quote)
  });
}

async function fetchQuotesFromServer() {
  const response = await fetch(API_URL);
  const data = await response.json();
  return data;
}

async function addQuote() {
  const input = document.getElementById('quote-input');
  const text = input.value.trim();
  if (!text) return;

  const newQuote = { text };
  const localQuotes = getLocalQuotes();
  localQuotes.push(newQuote);
  saveLocalQuotes(localQuotes);
  await postQuoteToServer(newQuote);

  input.value = '';
  renderQuotes(localQuotes);
}

function showConflictNotification() {
  const notice = document.getElementById('conflict-notification');
  notice.style.display = 'block';
  setTimeout(() => {
    notice.style.display = 'none';
  }, 5000);
}

async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  const localQuotes = getLocalQuotes();

  const conflict = JSON.stringify(serverQuotes) !== JSON.stringify(localQuotes);
  if (conflict) {
    saveLocalQuotes(serverQuotes); // Server wins
    renderQuotes(serverQuotes);
    showConflictNotification();
  }
}

window.onload = async () => {
  renderQuotes(getLocalQuotes());
  await syncQuotes();
};

setInterval(syncQuotes, 10000); // Every 10 seconds