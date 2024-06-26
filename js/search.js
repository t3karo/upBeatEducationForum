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

/* display search results */
function displayResults(results) {
  const resultsDiv = document.getElementById('searchResults');
  
  resultsDiv.innerHTML = '';
  const posts = document.getElementById('posts'); 
    posts.style.display = 'none';
    if (results.length > 0) {
        results.forEach(result => {
            const cardLink = document.createElement('a');
            cardLink.href = `post.html?id=${result.id}`;
            cardLink.className = 'card mb-3 card-link';
  
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
            cardLink.appendChild(cardBody);
            resultsDiv.appendChild(cardLink);
            
        });
    } else {
        resultsDiv.innerHTML = '<p>No results found.</p>';
    }
  }