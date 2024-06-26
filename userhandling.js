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
const sign_in_button = document.getElementById("signinbutton");
const login_modal = document.getElementById("login_modal");
const close_modal_signin = document.getElementById("close_modal_signin");
const register = document.getElementById("register");
const sign_up_button = document.getElementById("signupbutton");
const sign_out_button = document.getElementById("signoutbutton");

// Registration modal elements
const registration_modal = document.getElementById("registration_modal");
const close_registration = document.getElementById("close_registration_button");
const create_account = document.getElementById("create_account_button");

//Sign out a user
sign_out_button.addEventListener("click", function () {
  firebase
    .auth()
    .signOut()
    .then(function () {
      // Sign-out successful.
      console.log("User signed out successfully");
      // alert("You have been signed out.");
    })
    .catch(function (error) {
      // An error happened during sign out.
      console.error("Error signing out:", error);
      // alert("Failed to sign out. Error: " + error.message);
    });
});

//Show sign-in modal
sign_in_button.addEventListener("click", function () {
  login_modal.classList.add("is-active");
});

// Close sign in modal
close_modal_signin.addEventListener("click", function () {
  login_modal.classList.remove("is-active");
});

// Show registration modal
sign_up_button.addEventListener("click", function () {
  registration_modal.classList.add("is-active");
  login_modal.classList.remove("is-active");
});

// Show registration modal II
// register.addEventListener('click', function() {
//   registration_modal.classList.add('is-active');
//   login_modal.classList.remove('is-active');
// });

// Close registration modal
close_registration.addEventListener("click", function () {
  registration_modal.classList.remove("is-active");
});

const modal_signin = document.getElementById("modal_signin");

// modal_signin.addEventListener('click', function() {
//   const login_email = document.getElementById('login_email').value;
//   const login_password = document.getElementById('login_password').value;
//   firebase.auth().signInWithEmailAndPassword(login_email, login_password)
//     .then((userCredential) => {
//       console.log("User logged in:", userCredential.user);
//       login_modal.classList.remove('is-active');
//     });
// });

// modal_signin.addEventListener('click', function() {
//   const login_email = document.getElementById('login_email').value;
//   const login_password = document.getElementById('login_password').value;
//   firebase.auth().signInWithEmailAndPassword(login_email, login_password)
//       .then((userCredential) => {
//           console.log("User logged in:", userCredential.user);
//           login_modal.classList.remove('is-active');
//       })
//       .catch((error) => {
//           console.error("Login failed:", error);
//           displayWarning('regiswarning_login', "Login error: " + error.message);
//       });
// });

// Utility function to display warnings with cleaner UI
function displayWarning(elementId, message) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = message; // Use textContent for security and simplicity
    element.style.display = "block"; // Make sure the element is visible
    setTimeout(() => {
      element.style.display = "none"; // Hide the message after 7 seconds
    }, 7000);
  }
}

// A function to translate Firebase error messages to user-friendly text
function getFriendlyErrorMessage(errorCode) {
  const errorMap = {
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/user-not-found": "No user found with this email address.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/email-already-in-use": "Email is already in use by another account.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/internal-error": "Invalid login credentials.",
    // Add more Firebase auth error codes as needed
  };

  return (
    errorMap[errorCode] || "An unexpected error occurred. Please try again."
  );
}

// Enhanced login functionality with cleaner error messaging for Firebase 8.3.1
modal_signin.addEventListener("click", function () {
  const login_email = document.getElementById("login_email").value;
  const login_password = document.getElementById("login_password").value;
  firebase
    .auth()
    .signInWithEmailAndPassword(login_email, login_password)
    .then(function (result) {
      console.log("User logged in:", result.user);
      login_modal.classList.remove("is-active");
    })
    .catch(function (error) {
      console.error("Login failed:", error);
      const friendlyMessage = getFriendlyErrorMessage(error.code);
      displayWarning("regiswarning_login", friendlyMessage);
    });
});

// Elements for user type selection and modal triggers
const userTypesDropdown = document.getElementById("user_types");
const nextButton = document.getElementById("nextpage");

// Registration modal elements
const registrationModalStudent = document.getElementById(
  "registration_modal_2_student"
);
const registrationModalEmployer = document.getElementById(
  "registration_modal_2_employer"
);
const registrationModalAdmin = document.getElementById(
  "registration_modal_2_admin"
);

// Close modal buttons
const closeStudentModal = document.getElementById("close_modal_2_student");
const closeEmployerModal = document.getElementById("close_modal_2_employer");
const closeAdminModal = document.getElementById("close_modal_2_admin");

// Event listener for 'Next Page' button to open the correct modal based on user type
nextButton.addEventListener("click", function () {
  const userType = userTypesDropdown.value;

  // Close the general registration modal
  registration_modal.classList.remove("is-active");

  // Open the specific modal based on user type
  switch (userType) {
    case "student":
      registrationModalStudent.classList.add("is-active");
      break;
    case "employer":
      registrationModalEmployer.classList.add("is-active");
      break;
    case "admin":
      registrationModalAdmin.classList.add("is-active");
      break;
  }
});

// Close modal functions
function closeModal(modal) {
  modal.classList.remove("is-active");
}

closeStudentModal.addEventListener("click", function () {
  closeModal(registrationModalStudent);
});

closeEmployerModal.addEventListener("click", function () {
  closeModal(registrationModalEmployer);
});

closeAdminModal.addEventListener("click", function () {
  closeModal(registrationModalAdmin);
});

document.addEventListener("DOMContentLoaded", function () {
  // Firebase Authentication setup
  const db = firebase.firestore();
  function registerAccount(
    email,
    password,
    additionalData,
    warningElementId,
    closeModalCallback
  ) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log("User created:", userCredential.user.uid);
        const userId = userCredential.user.uid;
        const newData = {
          email: email,
          ...additionalData,
        };
        db.collection("users")
          .doc(userId)
          .set(newData)
          .then(() => {
            console.log("User data stored in Firestore.");
            //closeModalCallback();
          })
          .catch((error) => {
            console.error(
              "Error storing user data in Firestore:",
              error.message
            );
            alert("error storing firestore data");
          });
      })
      .catch((error) => {
        alert(error.message);
        console.error("Error creating user:", error.message);
        displayWarning(
          warningElementId,
          "Registration error: " + error.message
        );
      });
  }

  // Student account creation
  // document
  //   .getElementById("create_student_account")
  //   .addEventListener("click", function (event) {
  //     event.preventDefault();
  //     const email = document.getElementById("registration_email").value;
  //     const password = document.getElementById("registration_password").value;
  //     const firstName = document.getElementById("student_first_name").value;
  //     const lastName = document.getElementById("student_last_name").value;
  //     const additionalData = {
  //       userType: "student",
  //       firstName: firstName,
  //       lastName: lastName,
  //     };
  //     registerAccount(
  //       email,
  //       password,
  //       additionalData,
  //       "regiswarning_student",
  //       () => closeModal(registrationModalStudent)
  //     );
  //   });

  // // Employer account creation
  // document
  //   .getElementById("create_employer_account")
  //   .addEventListener("click", function (event) {
  //     event.preventDefault();
  //     const email = document.getElementById("registration_email").value;
  //     const password = document.getElementById("registration_password").value;
  //     const companyName = document.getElementById("company_name").value;
  //     const companyLogoFile = document.getElementById("company_logo").files[0]; // Get the file

  //     if (companyLogoFile) {
  //       // Create a storage reference
  //       const storageRef = firebase.storage().ref();
  //       const logoRef = storageRef.child(
  //         "company_logos/" + companyLogoFile.name
  //       );

  //       // Upload the file
  //       const uploadTask = logoRef.put(companyLogoFile);

  //       uploadTask.on(
  //         "state_changed",
  //         function (snapshot) {
  //           // Observe state change events such as progress, pause, and resume
  //         },
  //         function (error) {
  //           // Handle unsuccessful uploads
  //           console.error("Error uploading file: ", error);
  //           displayWarning(
  //             "regiswarning_employer",
  //             "Upload error: " + error.message
  //           );
  //         },
  //         function () {
  //           // Handle successful uploads on complete
  //           uploadTask.snapshot.ref
  //             .getDownloadURL()
  //             .then(function (downloadURL) {
  //               console.log("File available at", downloadURL);

  //               // Create user account after logo upload to ensure logo URL is ready to be saved
  //               const additionalData = {
  //                 userType: "employer",
  //                 companyName: companyName,
  //                 companyLogoUrl: downloadURL,
  //               };

  //               registerAccount(
  //                 email,
  //                 password,
  //                 additionalData,
  //                 "regiswarning_employer",
  //                 () => closeModal(registrationModalEmployer)
  //               );
  //             });
  //         }
  //       );
  //     } else {
  //       console.error("No file selected for upload");
  //       displayWarning("regiswarning_employer", "No file selected for upload.");
  //     }
  //   });

  // // Admin account creation
  // document
  //   .getElementById("create_admin_account")
  //   .addEventListener("click", function (event) {
  //     const email = document.getElementById("registration_email").value;
  //     const password = document.getElementById("registration_password").value;
  //     const firstName = document.getElementById("admin_first_name").value;
  //     const lastName = document.getElementById("admin_last_name").value;
  //     const accessCode = document.getElementById("admin_access_code").value;
  //     const additionalData = {
  //       userType: "admin",
  //       firstName: firstName,
  //       lastName: lastName,
  //     };

  //     if (accessCode === "wsbadminaccount") {
  //       registerAccount(
  //         email,
  //         password,
  //         additionalData,
  //         "regiswarning_admin",
  //         () => closeModal(registrationModalAdmin)
  //       );
  //     } else {
  //       displayWarning(
  //         "regiswarning_admin",
  //         "Incorrect access code for admin registration."
  //       );
  //     }
  //   });

  // Handle showing and hiding sign in buttons
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      const userEmail = user.email; // Assuming the user has an email. Adjust according to your user model.
      sign_in_button.classList.add("is-hidden");
      sign_up_button.classList.add("is-hidden");
      sign_out_button.classList.remove("is-hidden");
      // // Fetch user details from Firestore
      // const db = firebase.firestore();
      // db.collection("users")
      //   .doc(user.uid)
      //   .get()
      //   .then((doc) => {
      //     if (doc.exists) {
      //       const userData = doc.data();
      //       let welcomeMessage = `You are signed in as ${
      //         userData.firstName + " " + userData.lastName
      //       }`;

      //       // Display welcome message in the user_welcome div
      //       document.getElementById("user_welcome").textContent =
      //         welcomeMessage;
      //     } else {
      //       // console.log("No additional user data found.");
      //       document.getElementById("user_welcome").textContent = "Error fetching sign in details";
      //     }
      //   })
    } else {
      // No user is signed in.
      console.log("No user is logged in");
      sign_in_button.classList.remove("is-hidden");
      sign_up_button.classList.remove("is-hidden");
      sign_out_button.classList.add("is-hidden");
    }
  });
});

// firebase.auth().onAuthStateChanged(function (user) {
//   if (user) {
//       // Fetch user details from Firestore
//       const db = firebase.firestore();
//       db.collection("users").doc(user.uid).get().then((doc) => {
//           if (doc.exists) {
//               const userData = doc.data();
//               adjustNavItemsForRole(userData.userType);
//           } else {
//               console.log("No user data available");
//           }
//       });
//   }
// });

// function adjustNavItemsForRole(userType) {
//   const registrationNavItem = document.getElementById('registrationNavItem');
//   const eventsRegisterNavItem = document.getElementById('EventsRegisterNavItem');

//   // Hide both initially
//   registrationNavItem.classList.add('is-hidden');
//   eventsRegisterNavItem.classList.add('is-hidden');

//   if (userType === 'employer') {
//       registrationNavItem.classList.remove('is-hidden');
//   } else if (userType === 'admin') {
//       registrationNavItem.classList.remove('is-hidden');
//       eventsRegisterNavItem.classList.remove('is-hidden');
//   }
// }

document.addEventListener("DOMContentLoaded", function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // Fetch user details from Firestore
      const db = firebase.firestore();
      db.collection("users").doc(user.uid).get().then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          adjustNavItemsForRole(userData.userType);
        } else {
          console.log("No user data available");
        }
      });
    } else {
      // Handle non-logged in users
      adjustNavItemsForRole(null);
    }
  });

  function adjustNavItemsForRole(userType) {
    const registrationNavItem = document.getElementById('registrationNavItem');
    const EventsRegisterNavItem = document.getElementById('EventsRegisterNavItem');

    // Hide both initially using "is-hidden" for compatibility
    registrationNavItem.classList.add('is-hidden');
    EventsRegisterNavItem.classList.add('is-hidden');

    // Remove "is-active" to ensure elements are not interactable
    registrationNavItem.classList.remove('is-active');
    EventsRegisterNavItem.classList.remove('is-active');

    if (userType === 'employer') {
      registrationNavItem.classList.remove('is-hidden');
      registrationNavItem.classList.add('is-active');
    } else if (userType === 'admin') {
      registrationNavItem.classList.remove('is-hidden');
      EventsRegisterNavItem.classList.remove('is-hidden');
      registrationNavItem.classList.add('is-active');
      EventsRegisterNavItem.classList.add('is-active');
    }
    // Non-logged in users and students do not see these items
  }
});
// configure_message_bar("I hate my life");

// document.addEventListener("DOMContentLoaded", function() {
//   firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//       // Fetch user details from Firestore
//       const db = firebase.firestore();
//       db.collection("users").doc(user.uid).get().then((doc) => {
//         if (doc.exists) {
//           const userData = doc.data();
//         } else {
//           configure_message_bar("You fucking suck");
//         }
//       });
//     } else {
//       // Handle non-logged in users
//       adjustNavItemsForRole(null);
//     }
//   });
// });
document.addEventListener("DOMContentLoaded", function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // Fetch user details from Firestore
      const db = firebase.firestore();
      db.collection("users").doc(user.uid).get().then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          let message = "";
          if (userData.userType === "employer") {
            message = `Welcome! You are signed in as ${userData.companyName}`;
          } else if (userData.userType === "admin" || userData.userType === "student") {
            message = `Welcome! You are signed in as ${userData.firstName} ${userData.lastName}`;
          }
          configure_message_bar(message);
        } else {
          console.log("No user data available");
          configure_message_bar("Welcome!");
        }
      });
    } else {
      configure_message_bar("Please log in to continue.");
    }
  });
});
