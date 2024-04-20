// Sign in modal code

// Sign in modal elements
const sign_in_button = document.getElementById('signinbutton');
const login_modal = document.getElementById('login_modal');
const fuckthis = document.getElementById('close-modal-button');
const register = document.getElementById('register');

// Registration modal elements
const registration_modal = document.getElementById('registration_modal');
const close_registration = document.getElementById('close_registration_button');
const create_account = document.getElementById('create_account_button');

//Show sign-in modal
sign_in_button.addEventListener('click', function() {
  login_modal.classList.add('is-active');
});

// Close sign in modal
fuckthis.addEventListener('click', function() {
  login_modal.classList.remove('is-active');
});

// Show registration modal
register.addEventListener('click', function() {
  registration_modal.classList.add('is-active');
  login_modal.classList.remove('is-active');
});

// Close registration modal
close_registration.addEventListener('click', function() {
  registration_modal.classList.remove('is-active');
});

// Register an account
document.getElementById('create_account_button').addEventListener('click', function() {
  const email = document.getElementById('registration_email').value;
  const password = document.getElementById('registration_password').value;
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("User created:", userCredential.user);
      registration_modal.classList.remove('is-active');
    })
    .catch((error) => {
      console.error("Error creating user:", error.message);
    });
});

// // Login an account
// login_submit_button.addEventListener('click', function() {
//   const email = document.getElementById('login_email').value;
//   const password = document.getElementById('login_password').value;
//   firebase.auth().signInWithEmailAndPassword(email, password)
//     .then((userCredential) => {
//       console.log("User logged in:", userCredential.user);
//       login_modal.classList.remove('is-active');
//     })
//     .catch((error) => {
//       console.error("Error logging in:", error.message);
//     });
// });

const modal_signin = document.getElementById('modal_signin');

modal_signin.addEventListener('click', function() {
  const login_email = document.getElementById('login_email').value;
  const login_password = document.getElementById('login_password').value;
  firebase.auth().signInWithEmailAndPassword(login_email, login_password)
    .then((userCredential) => {
      console.log("User logged in:", userCredential.user);
    });
});