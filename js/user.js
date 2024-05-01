import { User } from './class/User.js'

const login_link_a = document.querySelector('a#login-link')

const user = new User()

if (user.isLoggedIn) {
    login_link_a.innerHTML = "Logout"
    login_link_a.href="logout.html"
} else {
    login_link_a.innerHTML = "Login"
    login_link_a.href="login.html"
}

const hide_register = document.getElementById('hide_register');

if (user.isLoggedIn) {
    hide_register.style.display = 'none';
} else {
    hide_register.style.display = 'inline-block';
}

const hide_deletes = document.querySelectorAll('delete-post-button');
hide_deletes.forEach(hide_delete => {
  if (user.isLoggedIn) {
    hide_delete.style.display = 'block';
  } else {
    hide_delete.style.display = 'none';
  }
});