
  // Load Header
  fetch('../header.html')
      .then(response => response.text())
      .then(html => {
          document.getElementById('header').innerHTML = html;
      });

  // Load Footer
  fetch('../footer.html')
      .then(response => response.text())
      .then(html => {
          document.getElementById('footer').innerHTML = html;
      });

    // Load Sidebar
    fetch('../sidebar.html')
      .then(response => response.text())
      .then(html => {
          document.getElementById('sidebar').innerHTML = html;
      });