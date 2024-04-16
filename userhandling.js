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
  login_modal.classList.add('modal-background');
});

// Close sign in modal
fuckthis.addEventListener('click', function() {
  login_modal.classList.remove('modal-background');
});

// Show registration modal
register.addEventListener('click', function() {
  registration_modal.classList.add('modal-background');
  login_modal.classList.remove('modal-background');
});

// Close registration modal
close_registration.addEventListener('click', function() {
  registration_modal.classList.remove('modal-background');
});

  // Register an account
document.getElementById('create_account_button').addEventListener('click', function() {
  const email = document.getElementById('registration_email').value;
  const password = document.getElementById('registration_password').value;
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("User created:", userCredential.user);
      registration_modal.classList.remove('modal-background');
    })
    .catch((error) => {
      console.error("Error creating user:", error.message);
    });
});
