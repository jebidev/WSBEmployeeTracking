// Sign in modal code

// Sign in modal elements
const sign_in_button = document.getElementById('signinbutton');
const login_modal = document.getElementById('login_modal');
const close_modal_signin = document.getElementById('close-modal-button');
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
close_modal_signin.addEventListener('click', function() {
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
  const userType = document.getElementById('user_types').value; // Retrieve the user type from the select dropdown

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("User created:", userCredential.user);

      // Reference to Firestore
      const db = firebase.firestore();

      // Storing additional data in Firestore: Email and User Type
      db.collection('users').doc(userCredential.user.uid).set({
        email: email,
        userType: userType
      }).then(() => {
        console.log("User data with email and type stored in Firestore.");
      }).catch((error) => {
        console.error("Error storing user data in Firestore:", error.message);
      });

      // Close the registration modal
      registration_modal.classList.remove('is-active');
    })
    .catch((error) => {
      console.error("Error creating user:", error.message);
    });
});

const modal_signin = document.getElementById('modal_signin');

modal_signin.addEventListener('click', function() {
  const login_email = document.getElementById('login_email').value;
  const login_password = document.getElementById('login_password').value;
  firebase.auth().signInWithEmailAndPassword(login_email, login_password)
    .then((userCredential) => {
      console.log("User logged in:", userCredential.user);
      login_modal.classList.remove('is-active');
    });
});

// Elements for user type selection and modal triggers
const userTypesDropdown = document.getElementById('user_types');
const nextButton = document.getElementById('nextpage');

// Registration modal elements
const registrationModalStudent = document.getElementById('registration_modal_2_student');
const registrationModalEmployer = document.getElementById('registration_modal_2_employer');
const registrationModalAdmin = document.getElementById('registration_modal_2_admin');

// Close modal buttons
const closeStudentModal = document.getElementById('close_modal_2_student');
const closeEmployerModal = document.getElementById('close_modal_2_employer');
const closeAdminModal = document.getElementById('close_modal_2_admin');

// Event listener for 'Next Page' button to open the correct modal based on user type
nextButton.addEventListener('click', function() {
    const userType = userTypesDropdown.value;

    // Close the general registration modal
    registration_modal.classList.remove('is-active');

    // Open the specific modal based on user type
    switch (userType) {
        case 'student':
            registrationModalStudent.classList.add('is-active');
            break;
        case 'employer':
            registrationModalEmployer.classList.add('is-active');
            break;
        case 'admin':
            registrationModalAdmin.classList.add('is-active');
            break;
    }
});

// Close modal functions
function closeModal(modal) {
    modal.classList.remove('is-active');
}

closeStudentModal.addEventListener('click', function() {
    closeModal(registrationModalStudent);
});

closeEmployerModal.addEventListener('click', function() {
    closeModal(registrationModalEmployer);
});

closeAdminModal.addEventListener('click', function() {
    closeModal(registrationModalAdmin);
});
