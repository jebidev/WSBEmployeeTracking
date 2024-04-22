function r_e(id) {
  return document.querySelector(`#${id}`);
}

function appendContent(html) {
  r_e("main").innerHTML += html;
}

function removeContent() {
  r_e("main").innerHTML = "";
}

// Message bar
function configure_message_bar(message) {
  r_e("message_bar").classList.remove("is-hidden");
  r_e("message_bar").innerHTML = `${message}`;

  setTimeout(() => {
    r_e("message_bar").classList.add("is-hidden");
    r_e("message_bar").innerHTML = "";
  }, 7000);
}


// Sign in modal code
// Sign in modal elements
const sign_in_button = document.getElementById('signinbutton');
const login_modal = document.getElementById('login_modal');
const close_modal_signin = document.getElementById('close-modal-button');
const register = document.getElementById('register');
const sign_up_button = document.getElementById('signupbutton');
const sign_out_button = document.getElementById('signoutbutton');

// Registration modal elements
const registration_modal = document.getElementById('registration_modal');
const close_registration = document.getElementById('close_registration_button');
const create_account = document.getElementById('create_account_button');



//Sign out a user
sign_out_button.addEventListener('click', function() {
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    console.log("User signed out successfully");
    // alert("You have been signed out.");
  }).catch(function(error) {
    // An error happened during sign out.
    console.error("Error signing out:", error);
    // alert("Failed to sign out. Error: " + error.message);
  });
});



//Show sign-in modal
sign_in_button.addEventListener('click', function() {
  login_modal.classList.add('is-active');
});

// Close sign in modal
close_modal_signin.addEventListener('click', function() {
  login_modal.classList.remove('is-active');
});

// Show registration modal
sign_up_button.addEventListener('click', function() {
  registration_modal.classList.add('is-active');
  login_modal.classList.remove('is-active');
});

// Show registration modal II
// register.addEventListener('click', function() {
//   registration_modal.classList.add('is-active');
//   login_modal.classList.remove('is-active');
// });

// Close registration modal
close_registration.addEventListener('click', function() {
  registration_modal.classList.remove('is-active');
});

// // Register an account
// document.getElementById('create_account_button').addEventListener('click', function() {
//   const email = document.getElementById('registration_email').value;
//   const password = document.getElementById('registration_password').value;
//   const userType = document.getElementById('user_types').value; // Retrieve the user type from the select dropdown

//   firebase.auth().createUserWithEmailAndPassword(email, password)
//     .then((userCredential) => {
//       console.log("User created:", userCredential.user);

//       // Reference to Firestore
//       const db = firebase.firestore();

//       // Storing additional data in Firestore: Email and User Type
//       db.collection('users').doc(userCredential.user.uid).set({
//         email: email,
//         userType: userType
//       }).then(() => {
//         console.log("User data with email and type stored in Firestore.");
//       }).catch((error) => {
//         console.error("Error storing user data in Firestore:", error.message);
//       });

//       // Close the registration modal
//       registration_modal.classList.remove('is-active');
//     })
//     .catch((error) => {
//       console.error("Error creating user:", error.message);
//     });
// });

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

document.addEventListener('DOMContentLoaded', function() {
  // Firebase Authentication setup
  function registerAccount(email, password, additionalData, closeModalCallback) {
      firebase.auth().createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
              console.log("User created:", userCredential.user);

              // Reference to Firestore
              const db = firebase.firestore();
              db.collection('users').doc(userCredential.user.uid).set({
                  email: email,
                  ...additionalData
              }).then(() => {
                  console.log("User data stored in Firestore.");
                  closeModalCallback();
              }).catch((error) => {
                  console.error("Error storing user data in Firestore:", error.message);
              });
          })
          .catch((error) => {
              console.error("Error creating user:", error.message);
          });
  }

  // Student account creation
  document.getElementById('create_student_account').addEventListener('click', function() {
      const email = document.getElementById('registration_email').value;
      const password = document.getElementById('registration_password').value;
      const firstName = document.getElementById('student_first_name').value;
      const lastName = document.getElementById('student_last_name').value;
      const additionalData = {
          userType: 'student',
          firstName: firstName,
          lastName: lastName
      };
      registerAccount(email, password, additionalData, () => closeModal(registrationModalStudent));
  });

  // // Employer account creation
  // document.getElementById('create_employer_account').addEventListener('click', function() {
  //     const email = document.getElementById('registration_email').value;
  //     const password = document.getElementById('registration_password').value;
  //     const companyName = document.getElementById('company_name').value;
  //     const additionalData = {
  //         userType: 'employer',
  //         companyName: companyName
  //         // Assuming file handling for 'company_logo' is managed elsewhere
  //     };
  //     registerAccount(email, password, additionalData, () => closeModal(registrationModalEmployer));

  //     let company_logo = document.getElementById('company_logo').files[0];
  // });
  // Employer account creation
document.getElementById('create_employer_account').addEventListener('click', function() {
  const email = document.getElementById('registration_email').value;
  const password = document.getElementById('registration_password').value;
  const companyName = document.getElementById('company_name').value;
  const companyLogoFile = document.getElementById('company_logo').files[0]; // Get the file

  if (companyLogoFile) {
      // Create a storage reference
      const storageRef = firebase.storage().ref();
      const logoRef = storageRef.child('company_logos/' + companyLogoFile.name);

      // Upload the file
      const uploadTask = logoRef.put(companyLogoFile);

      uploadTask.on('state_changed', 
          function(snapshot) {
              // Observe state change events such as progress, pause, and resume
              // You can use these to show upload progress to users
          }, function(error) {
              // Handle unsuccessful uploads
              console.error("Error uploading file: ", error);
          }, function() {
              // Handle successful uploads on complete
              // For instance, get the download URL
              uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                  console.log('File available at', downloadURL);
                  
                  // Create user account after logo upload to ensure logo URL is ready to be saved
                  const additionalData = {
                      userType: 'employer',
                      companyName: companyName,
                      companyLogoUrl: downloadURL // Save logo URL in user's profile or wherever it's needed
                  };

                  registerAccount(email, password, additionalData, () => closeModal(registrationModalEmployer));
              });
          });
  } else {
      console.error("No file selected for upload");
  }
});


  // Admin account creation
  document.getElementById('create_admin_account').addEventListener('click', function() {
      const email = document.getElementById('registration_email').value;
      const password = document.getElementById('registration_password').value;
      const firstName = document.getElementById('admin_first_name').value;
      const lastName = document.getElementById('admin_last_name').value;
      const accessCode = document.getElementById('admin_access_code').value;
      const additionalData = {
          userType: 'admin',
          firstName: firstName,
          lastName: lastName,
          accessCode: accessCode
      };
      registerAccount(email, password, additionalData, () => closeModal(registrationModalAdmin));
  });
});

// Handle showing and hiding sign in buttons
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    const userEmail = user.email; // Assuming the user has an email. Adjust according to your user model.
    sign_in_button.classList.add('is-hidden');
    sign_up_button.classList.add('is-hidden');
    sign_out_button.classList.remove('is-hidden');
  } else {
    // No user is signed in.
    console.log("No user is logged in");
    sign_in_button.classList.remove('is-hidden');
    sign_up_button.classList.remove('is-hidden');
    sign_out_button.classList.add('is-hidden');
  }
});

// Configuring the message bar
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    // Fetch user details from Firestore
    db.collection('users').doc(user.uid).get().then(doc => {
      if (doc.exists) {
        const userData = doc.data();
        let welcomeMessage = "";
        if (userData.userType === 'employer') {
          // Display company name for employers
          welcomeMessage = `Welcome ${userData.companyName}!`; 
        } else {
          // Display first name for students and admins
          welcomeMessage = `Welcome ${userData.firstName + " " + userData.lastName}!`; 
        }
        configure_message_bar(welcomeMessage);
      } else {
        console.log("No additional user data found.");
      }
    }).catch(error => {
      console.error("Error fetching user data:", error);
    });
  } else {
    // No user is signed in.
    configure_message_bar("Please sign in or register"); // Display a default message when no user is logged in.
  }
});
