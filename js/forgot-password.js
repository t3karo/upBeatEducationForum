document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('forgotPasswordForm');
    form.addEventListener('submit', function(event) {
      event.preventDefault(); 
  
      const emailInput = document.getElementById('email');
      const email = emailInput.value;
      fetch('http://127.0.0.1:3001/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Email Not Found!');
        }
        return response.text();
      })
      .then(data => {
        emailInput.value = '';  
        alert(data);  
      })
      .catch(error => {
        alert('Error: ' + error.message);  
      });
    });
  });
  