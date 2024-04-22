function search() {
    const searchQuery = document.getElementById('searchInput').value;
  
    $.ajax({
      url: '/search',
      method: 'GET',
      data: { query: searchQuery },
      success: function(response) {
        displayResults(response);
      },
      error: function(xhr, status, error) {
        console.error('Error:', error);
      }
    });
  }
  
  function displayResults(results) {
    const searchResultsDiv = document.getElementById('searchResults');
    searchResultsDiv.innerHTML = '';
  
    if (results.length === 0) {
      searchResultsDiv.innerHTML = '<p>No results found</p>';
    } else {
      results.forEach(result => {
        const resultDiv = document.createElement('div');
        resultDiv.innerHTML = `
          <p>ID: ${result.id}</p>
          <p>Title: ${result.title}</p>
          <p>Message: ${result.message}</p>
          <hr>
        `;
        searchResultsDiv.appendChild(resultDiv);
      });
    }
  }
  