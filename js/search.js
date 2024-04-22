import { BACKEND_URL } from './config.js'

document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const query = document.getElementById('searchInput').value;
    fetch(`${BACKEND_URL}/search?query=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            displayResults(data);
        })
        .catch(error => console.error('Error fetching search results:', error));
});

function displayResults(results) {
  const resultsDiv = document.getElementById('searchResults');
  
  resultsDiv.innerHTML = '';
  const posts = document.getElementById('posts'); 
    posts.style.display = 'none';
  if (results.length > 0) {
      results.forEach(result => {
          const card = document.createElement('div');
          card.className = 'card mb-3'; 

          const cardBody = document.createElement('div');
          cardBody.className = 'card-body';

          const title = document.createElement('h5');
          title.className = 'card-title';
          title.textContent = result.title;

          const message = document.createElement('p');
          message.className = 'card-text';
          message.textContent = result.message;

          cardBody.appendChild(title);
          cardBody.appendChild(message);
          card.appendChild(cardBody);
          resultsDiv.appendChild(card);
      });
  } else {
      resultsDiv.innerHTML = '<p>No results found.</p>';
  }
}