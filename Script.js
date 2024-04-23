/*Calendar.js*/
let nav = 0;
let clicked = null;
let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : [];

const calendar = document.getElementById("calendar");
const newEventModal = document.getElementById("newEventModal");
const deleteEventModal = document.getElementById("deleteEventModal");
const backDrop = document.getElementById("modalBackDrop");
const eventTitleInput = document.getElementById("eventTitleInput");
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function openModal(date) {
  clicked = date;

  const eventForDay = events.find((e) => e.date === clicked);

  if (eventForDay) {
    document.getElementById("eventText").innerText = eventForDay.title;
    deleteEventModal.style.display = "block";
  } else {
    newEventModal.style.display = "block";
  }

  backDrop.style.display = "block";
}

function load() {
  const dt = new Date();
  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  console.log("Day", day);
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Getting the first day of the month
  const dateString = firstDayOfMonth.toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  console.log("Weekday from Date:", dateString.split(", ")[0]); // Log to check what you are actually parsing

  const paddingDays = weekdays.indexOf(dateString.split(", ")[0]);
  console.log("paddingDays", paddingDays);

  document.getElementById("monthDisplay").innerText = `${dt.toLocaleDateString(
    "en-us",
    { month: "long" }
  )} ${year}`;

  calendar.innerHTML = "";

  for (let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement("div");
    daySquare.classList.add("day");

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;
      const eventForDay = events.find((e) => e.date === dayString);

      if (i - paddingDays === day && nav === 0) {
        daySquare.id = "currentDay"; // Highlight the current day
      }

      if (eventForDay) {
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event");
        eventDiv.innerText = eventForDay.title;
        daySquare.appendChild(eventDiv);
      }

      daySquare.addEventListener("click", () => openModal(dayString));
    } else {
      daySquare.classList.add("padding");
    }

    calendar.appendChild(daySquare);
  }
}

function closeModal() {
  eventTitleInput.classList.remove("error");
  newEventModal.style.display = "none";
  deleteEventModal.style.display = "none";
  backDrop.style.display = "none";
  eventTitleInput.value = "";
  clicked = null;
  load();
}

function saveEvent() {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove("error");

    events.push({
      date: clicked,
      title: eventTitleInput.value,
    });

    localStorage.setItem("events", JSON.stringify(events));
    closeModal();
  } else {
    eventTitleInput.classList.add("error");
  }
}

function deleteEvent() {
  events = events.filter((e) => e.date !== clicked);
  localStorage.setItem("events", JSON.stringify(events));
  closeModal();
}

function initButtons() {
  document.getElementById("nextButton").addEventListener("click", () => {
    nav++;
    load();
    const { month, year } = calculateMonthYear(nav);

    call_events(year, month - 1);
  });

  document.getElementById("backButton").addEventListener("click", () => {
    nav--;
    load();
    const { month, year } = calculateMonthYear(nav);

    call_events(year, month - 1);
  });
}
function calculateMonthYear(navOffset) {
  // Create a date object representing the current date/time
  const now = new Date();
  // Get the current month (0-11) and add the navigation offset
  now.setMonth(now.getMonth() + navOffset);
  // Extract the month and year from the date object
  const month = now.getMonth() + 1; // JavaScript months are 0-indexed, add 1 for human-readable month (1-12)
  const year = now.getFullYear();

  console.log("returning ", year, month);
  return { month, year };
}

initButtons();
load();

document.addEventListener("DOMContentLoaded", () => {
  // Toggle dropdowns
  document.querySelectorAll(".navbar-link").forEach((link) => {
    link.addEventListener("click", function (event) {
      if (this.getAttribute("href") === "#") {
        event.preventDefault();
      }
      let parentDropdown = this.closest(".has-dropdown");
      if (parentDropdown) {
        parentDropdown.classList.toggle("is-active");
      }
    });
  });

  // Close dropdown when clicking inside the dropdown
  document.querySelectorAll(".navbar-dropdown .navbar-item").forEach((item) => {
    item.addEventListener("click", function () {
      this.closest(".has-dropdown").classList.remove("is-active");
    });
  });

  // Additionally, listen for clicks on items that should hide the dropdown immediately
  const navBarItems = document.querySelectorAll(
    ".navbar-item:not(.has-dropdown > .navbar-link)"
  );
  navBarItems.forEach((item) => {
    item.addEventListener("click", () => {
      const activeDropdowns = document.querySelectorAll(
        ".navbar-dropdown.is-active, .has-dropdown.is-active"
      );
      activeDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("is-active");
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const registrationForm = document.getElementById("registrationForm");

  registrationForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Retrieve and trim values from input fields
    const employerContactNumber = document
      .getElementById("employerContactNumber")
      .value.trim();
    const event_name = document.getElementById("eventName").value.trim();
    const event_overview = document
      .getElementById("eventOverview")
      .value.trim();
    const event_description = document
      .getElementById("eventDescription")
      .value.trim();
    const event_category = document
      .getElementById("eventCategory")
      .value.trim();
    const location = document.getElementById("location").value.trim();
    const event_medium = document.getElementById("event_medium").value.trim();

    const event_capacity = document
      .getElementById("eventCapacity")
      .value.trim();

    // Validate required fields are not empty
    if (
      !employerContactNumber ||
      !event_name ||
      !event_overview ||
      !event_description ||
      !event_category ||
      !location ||
      !event_capacity ||
      !event_medium
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // Handle event date
    const eventDateInput = document.getElementById("eventDate");
    const eventDateValue = new Date(eventDateInput.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date for comparison

    if (eventDateValue < today) {
      alert("Please enter a date after the current day.");
      return; // Stop further processing if date is in the past
    }

    const seatingArrangement = document.querySelector(
      'input[name="seatingArrangement"]:checked'
    )?.value;

    // Prepare form data
    const regformData = {
      employerContactNumber,
      event_name,
      event_date: eventDateInput.value, // Directly use Date object here
      event_overview,
      event_description,
      event_category,
      location,
      event_medium,
      event_capacity,
      disposables: Array.from(
        document.querySelectorAll('input[name="disposables"]:checked')
      ).map((cb) => cb.value),
      meals: Array.from(
        document.querySelectorAll('input[name="meals"]:checked')
      ).map((cb) => cb.value),
      snacks: Array.from(
        document.querySelectorAll('input[name="snacks"]:checked')
      ).map((cb) => cb.value),
      beverages: Array.from(
        document.querySelectorAll('input[name="beverages"]:checked')
      ).map((cb) => cb.value),
      seatingArrangement,
    };

    console.log(regformData);

    // Submit event data to Firestore
    db.collection("events")
      .add(regformData)
      .then(() => {
        openNotificationModal(
          "Your event has been sent for approval to the admin team."
        );
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
        openNotificationModal("There was an error submitting your event.");
      });
  });
});

function openNotificationModal(message) {
  document.getElementById("notificationMessage").textContent = message;
  document.getElementById("notificationModal").classList.add("is-active");
}

function closeNotificationModal() {
  document.getElementById("notificationModal").classList.remove("is-active");
}

function toggleModal(modalId, show) {
  const modal = document.getElementById(modalId);
  if (show) {
    modal.classList.add("is-active");
  } else {
    modal.classList.remove("is-active");
  }
}

function submitSignInForm() {
  // Handle the sign-in/create user form submission here.
  // Validate input fields, make API calls if necessary, etc.

  console.log("Form Submitted"); // Placeholder action
  toggleModal("signInModal", false); // Close the modal upon submission
}


// calendar!!!
// calendar functions
function call_events(currentyear, currentmonth) {
  function fetchApprovedEvents() {
    console.log("Fetching events from Firestore...", currentyear, currentmonth);
    db.collection("events")
      .where("event_status", "==", "Approved")
      .get()
      .then((querySnapshot) => {
        approvedEvents = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const parsedDate = new Date(data.event_date);
          return {
            id: doc.id,
            event_name: data.event_name,
            event_date: isNaN(parsedDate) ? null : parsedDate,
            ...data,
          };
        });

        approved_calendar_events = approvedEvents.map((event) => ({
          event_date: event.event_date ? new Date(event.event_date) : null,
          event_name: event.event_name,
        }));

        console.log("approved_calendar_events", approved_calendar_events);

        // Generate the calendar here
        console.log("calling ", currentmonth, currentyear);
        generateCalendar(currentmonth, currentyear);
      })
      .catch((error) => {
        console.error("Error fetching events: ", error);
      });
  }

  // Call fetchApprovedEvents on document ready
  fetchApprovedEvents();

  function generateCalendar(month, year) {
    console.log("Generating month, year:", month, year);
    const calendarContainer = document.getElementById("calendar");
    calendarContainer.innerHTML = ""; // Clear existing calendar entries

    let daysInMonth = new Date(year, month + 1, 0).getDate(); // Calculate the number of days in the month
    let firstDayOfMonth = new Date(year, month, 1).getDay(); // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)

    // Ensure we have a valid approvedEvents array loaded
    if (!approved_calendar_events) {
      console.error("No approved events available");
      return;
    }

    // Add padding for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      let paddingDayElement = document.createElement("div");
      paddingDayElement.className = "day padding";
      calendarContainer.appendChild(paddingDayElement);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      let dayElement = document.createElement("div");
      dayElement.className = "day";

      // Format the date as YYYY-MM-DD for comparison
      let dateString = `${year}-${(month + 1).toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
      dayElement.setAttribute("data-date", dateString);

      // Set the day number as content
      let dayNumberSpan = document.createElement("span");
      dayNumberSpan.textContent = day;
      dayElement.appendChild(dayNumberSpan);

      // Find any approved events for this date
      approved_calendar_events.forEach((event) => {
        if (event.event_date) {
          // Convert event.date to YYYY-MM-DD string format
          let eventDateStr = event.event_date.toISOString().substring(0, 10);
          if (eventDateStr === dateString) {
            // Compare event date with formatted date string
            let eventElement = document.createElement("div");
            eventElement.textContent = event.event_name; // Use the event name
            eventElement.className = "event";
            dayElement.appendChild(eventElement); // Append the event name to the day element
          }
        }
      });

      calendarContainer.appendChild(dayElement);
    }
  }
}

let today = new Date();
// generateCalendar(today.getMonth(), today.getFullYear());
console.log("GOSSIP", today.getMonth(), today.getFullYear());

call_events(today.getFullYear(), today.getMonth());


// Fetch company options from the database
db.collection('events').get().then(snapshot => {
  const companySelect1 = document.getElementById('companySelect').querySelector('select');
  const companySelect2 = document.getElementById('companySelect2').querySelector('select');
  const uniqueCompanyNames = new Set(); // Set to store unique company names

  snapshot.forEach(doc => {
    const companyName = doc.data().company_name;
    // Check if the company name is not already added to the set
    if (!uniqueCompanyNames.has(companyName)) {
      const option1 = document.createElement('option');
      option1.value = companyName;
      option1.textContent = companyName;
      companySelect1.appendChild(option1);

      const option2 = document.createElement('option');
      option2.value = companyName;
      option2.textContent = companyName;
      companySelect2.appendChild(option2);

      uniqueCompanyNames.add(companyName); // Add the company name to the set
    }
  });
}).catch(error => {
  console.error('Error fetching companies: ', error);
});

function show_events_home() {
  // Fetch all events when the page loads
  db.collection("events")
    .where("event_status", "==", "Approved")
    .get()
    .then((res) => {
      let data = res.docs;
      let htmlColumn1 = ``;
      let htmlColumn2 = ``;
      let index = 0;
      data.forEach((d) => {
        const boxHtml = generateEventBoxHtml(d); // Generate HTML for each event
        if (index % 2 === 0) {
          htmlColumn1 += boxHtml;
        } else {
          htmlColumn2 += boxHtml;
        }
        index++;
      });
      // Append HTML to the document
      document.querySelector("#column1").innerHTML = htmlColumn1;
      document.querySelector("#column2").innerHTML = htmlColumn2;

      // Add event listeners to save buttons
      attachSaveEventListeners();
      attachButtonListeners2(); // Add listeners for accept and decline buttons
    });

  // Add event listener to the submit button
  document.getElementById("submitFilter").addEventListener("click", applyFilters);
}

function generateEventBoxHtml(eventDoc) {
  const currentUser = firebase.auth().currentUser;
  const currentUserId = currentUser ? currentUser.uid : null;
  const eventId = eventDoc.id; // Ensure this is the correct document ID from Firestore

  // Check if the current user is registered for the event
  const attendees = eventDoc.data().attendees || [];
  const isRegistered = attendees.includes(currentUserId);

  // Check if the current user has bookmarked the event
  const bookmarkUsers = eventDoc.data().bookmark_users || [];
  const isBookmarked = bookmarkUsers.includes(currentUserId);

  // Set the button colors based on user status
  const registerButtonColor = isRegistered ? "red" : "rgb(23, 66, 135)";
  const registerButtonTextColor = isRegistered ? "white" : "white";

  const bookmarkButtonColor = isBookmarked ? "black" : "black";
  const bookmarkButtonIconColor = isBookmarked ? "icon-red" : "icon-white";

  // Generate HTML for each event
  return `<div class="box">
            <div class="content">
              <!--Company name and logo-->
              <div class="media">
                <div class="media-left">
                  <figure class="image is-48x48">
                    <img src="Image/business_logo.jpeg" alt="Company Logo" />
                  </figure>
                </div>
                <div class="media-content">
                  <p class="title is-4">${eventDoc.data().company_name}</p>
                </div>
              </div>
              <!--Event Name-->
              <p class="title is-5 p-5">${eventDoc.data().event_name}</p>
              <!--Event Description-->
              <p>${eventDoc.data().event_description}</p>
              <!--Event and Medium Type-->
              <div class="field is-grouped">
                <p class="Type">
                  <span class="tag is-light">${
                    eventDoc.data().event_medium
                  }</span>
                  <span class="tag is-light">${
                    eventDoc.data().event_category
                  }</span>
                </p>
              </div>
              <!--Event Date-->
              <p>
                <span class="has-text-weight-semibold">Date:</span>
                ${eventDoc.data().event_date}
              </p>
              <!--Save Button-->
              <button class="button is-primary save-event-button" data-event-id="${eventId}" style="background-color: ${bookmarkButtonColor}">
                <span class="icon is-small">
                  <i class="fas fa-bookmark ${bookmarkButtonIconColor}"></i>
                </span>
              </button>
              <!--Register Button-->
              <button class="button is-primary register-button" data-event-id="${eventId}" style="background-color: ${registerButtonColor}; color: ${registerButtonTextColor}">
                ${isRegistered ? "Registered" : "Register"}f
            </div>
          </div>`;
}

function attachButtonListeners2() {
  document.querySelectorAll(".accept-button").forEach((button) => {
    button.addEventListener("click", () => {
      const eventId = button.getAttribute("data-event-id"); // Get the event ID
      const eventStatus = button.textContent.trim(); // Get the current text content of the button

      // If the button says "Accept", update the event status to "Approved" in Firestore
      if (eventStatus === "Accept") {
        db.collection("events")
          .doc(eventId)
          .update({ event_status: "Approved" })
          .then(() => {
            console.log("Event status updated to Approved");
            // You can add further logic here, like updating UI, etc.
            button.textContent = "Approved"; // Change the button text to "Approved"
          })
          .catch((error) => {
            console.error("Error updating event status:", error);
          });
      }
    });
  });
  document.querySelectorAll(".decline-button").forEach((button) => {
    button.addEventListener("click", () => {
      const eventId = button.getAttribute("data-event-id"); // Get the event ID
      const eventStatus = button.textContent.trim(); // Get the current text content of the button

      // If the button says "Decline", update the event status to "Approved" in Firestore
      if (eventStatus === "Decline") {
        db.collection("events")
          .doc(eventId)
          .update({ event_status: "Declined" })
          .then(() => {
            console.log("Event status updated to Declined");
            // You can add further logic here, like updating UI, etc.
            button.textContent = "Declined"; // Change the button text to "Declined"
          })
          .catch((error) => {
            console.error("Error updating event status:", error);
          });
      }
    });
  });
}

function attachSaveEventListeners() {
  // Add event listeners to save buttons
  document.querySelectorAll(".save-event-button").forEach((button) => {
    button.addEventListener("click", () => {
      const icon = button.querySelector(".fas");

      // Toggle color classes
      if (icon.classList.contains("icon-white")) {
        icon.classList.remove("icon-white");
        icon.classList.add("icon-red");
      } else {
        icon.classList.remove("icon-red");
        icon.classList.add("icon-white");
      }

      // Apply the jump animation
      icon.classList.add("jump");

      // Remove the animation class after it completes to allow it to run again on next click
      icon.addEventListener("animationend", () => {
        icon.classList.remove("jump");
      });

      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        alert("You must be logged in to bookmark an event.");
        return;
      }
      const currentUserId = currentUser.uid;
      const eventId = button.getAttribute("data-event-id"); // Ensure your button elements have a data-event-id attribute

      // Reference to the event document
      const eventRef = db.collection("events").doc(eventId);

      db.runTransaction((transaction) => {
        return transaction.get(eventRef).then((eventDoc) => {
          if (!eventDoc.exists) {
            throw "Event does not exist!";
          }

          let bookmarkUsers = eventDoc.data().bookmark_users || [];
          if (bookmarkUsers.includes(currentUserId)) {
            // Remove user from bookmark list
            bookmarkUsers = bookmarkUsers.filter((id) => id !== currentUserId);
            transaction.update(eventRef, { bookmark_users: bookmarkUsers });
          } else {
            // Add user to bookmark list
            bookmarkUsers.push(currentUserId);
            console.log("PUSHED USER TO BOOKMARK USERS");
            transaction.update(eventRef, { bookmark_users: bookmarkUsers });
          }
        });
      }).catch((error) => {
        console.error("Transaction failed: ", error);
        alert("Failed to bookmark/unbookmark. Please try again.");
      });
    });
  });

  document.querySelectorAll(".register-button").forEach((button) => {
    button.addEventListener("click", function () {
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        alert("You must be logged in to register for an event.");
        return;
      }
      const currentUserId = currentUser.uid;
      const eventId = this.getAttribute("data-event-id"); // Ensure your event elements have a data-event-id attribute

      // Reference to the event document
      const eventRef = db.collection("events").doc(eventId);

      db.runTransaction((transaction) => {
        return transaction.get(eventRef).then((eventDoc) => {
          if (!eventDoc.exists) {
            throw "Event does not exist!";
          }

          let attendees = eventDoc.data().attendees || [];
          if (attendees.includes(currentUserId)) {
            // Unregister the user
            attendees = attendees.filter((id) => id !== currentUserId);
            transaction.update(eventRef, { attendees });
            this.textContent = "Register"; // Change button text back to "Register"
            this.style.backgroundColor = "rgb(23, 66, 135)"; // Change button color back to blue
            this.style.color = "white"; // Ensure text color remains white
          } else {
            // Register the user
            attendees.push(currentUserId);
            transaction.update(eventRef, { attendees });
            this.textContent = "Registered"; // Change button text to "Registered"
            this.style.backgroundColor = "red"; // Change button color to red
            this.style.color = "white"; // Ensure text color is white for better visibility
          }
        });
      }).catch((error) => {
        console.error("Transaction failed: ", error);
        alert("Failed to register/unregister. Please try again.");
      });
    });
  });
}

function applyFilters() {
  // Fetch the selected company name from the dropdown
  const selectedCompany = document
    .getElementById("companySelect")
    .querySelector("select").value;

  // Get selected categories
  const selectedCategories = [];
  document.querySelectorAll(".category-checkbox").forEach((checkbox) => {
    if (checkbox.checked) {
      selectedCategories.push(checkbox.value);
    }
  });

  const selectedMedium = [];
  document.querySelectorAll(".medium-checkbox").forEach((checkbox) => {
    if (checkbox.checked) {
      selectedMedium.push(checkbox.value);
    }
  });

  // Fetch the search input value
  const searchInputValue = document.querySelector(".input").value.toLowerCase();

  // Fetch events based on the selected company, categories, and search input
  db.collection("events")
    .where("event_status", "==", "Approved")
    .get()
    .then((res) => {
      let data = res.docs;
      let htmlColumn1 = ``;
      let htmlColumn2 = ``;
      let index = 0;
      data.forEach((d) => {
        // Check if the event matches all the selected filters and search input
        if (
          (selectedCompany === '' || d.data().company_name === selectedCompany) &&
          (selectedCategories.length === 0 || selectedCategories.includes(d.data().event_category)) &&
          (selectedMedium.length === 0 || selectedMedium.includes(d.data().event_medium)) &&
          (d.data().event_name.toLowerCase().includes(searchInputValue))
        ) {
          const boxHtml = generateEventBoxHtml(d); // Generate HTML for each event
          if (index % 2 === 0) {
            htmlColumn1 += boxHtml;
          } else {
            htmlColumn2 += boxHtml;
          }
          index++;
        }
      });
      // Append HTML to the document
      document.querySelector("#column1").innerHTML = htmlColumn1;
      document.querySelector("#column2").innerHTML = htmlColumn2;

      // Add event listeners to save buttons
      attachSaveEventListeners();
      //attachButtonListeners2(); // Add listeners for accept and decline buttons
    });
}

show_events_home();

document
  .getElementById("notificationBell")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the link from navigating
    const notificationList = document.getElementById("notificationList");
    const dropdown = document.querySelector(".notification-dropdown");

    // Simulate fetching notifications (you would replace this with an actual API call)
    const notifications = [];

    // Clear existing notifications
    notificationList.innerHTML = "";

    // Check if there are notifications and display them
    if (notifications.length > 0) {
      notifications.forEach((notification) => {
        const li = document.createElement("li");
        li.textContent = notification.text;
        notificationList.appendChild(li);
      });
    } else {
      notificationList.innerHTML = "<li>Nothing new needs attention.</li>";
    }

    // Toggle dropdown display
    dropdown.style.display =
      dropdown.style.display === "none" ? "block" : "none";
  });

// Optional: Hide dropdown when clicking elsewhere on the page
document.addEventListener("click", function (event) {
  const isClickInside = document
    .getElementById("notificationBell")
    .contains(event.target);

  if (!isClickInside) {
    const dropdown = document.querySelector(".notification-dropdown");
    dropdown.style.display = "none";
  }
});

//Events Administration page
// Function to fetch and display events
function show_register_events() {
  // Fetch all events when the page loads
  db.collection("events")
    .get()
    .then((res) => {
      let data = res.docs;
      let htmlColumn1 = ``;
      let htmlColumn2 = ``;
      let index = 0;
      data.forEach((d) => {
        const eventId = d.id; // Get the event ID

        // Determine the text to display on the button based on the event status
        let buttonText1 = "";
        let buttonText2 = "";
        if (d.data().event_status === "Approved") {
          buttonText1 = "Approved";
        } else {
          buttonText1 = "Accept";
        }
        if (d.data().event_status === "Declined") {
          buttonText2 = "Declined";
        } else {
          buttonText2 = "Decline";
        }

        const boxHtml = generateEventBoxHtml2(d, eventId, buttonText1, buttonText2); // Generate HTML for each event
        if (index % 2 === 0) {
          htmlColumn1 += boxHtml;
        } else {
          htmlColumn2 += boxHtml;
        }
        index++;
      });
      // Append HTML to the document
      document.querySelector("#column1_events").innerHTML = htmlColumn1;
      document.querySelector("#column2_events").innerHTML = htmlColumn2;

      // Add event listeners to the buttons after they are added to the DOM
      attachButtonListeners2();
    });
}

// Function to generate HTML for each event
function generateEventBoxHtml2(eventDoc, eventId, buttonText1, buttonText2) {
  return `<div class="box">
            <div class="content">
              <!--Company name and logo-->
              <div class="media">
                <div class="media-left">
                  <figure class="image is-48x48">
                    <img src="Image/business_logo.jpeg" alt="Company Logo" />
                  </figure>
                </div>
                <div class="media-content">
                  <p class="title is-4">${eventDoc.data().company_name}</p>
                </div>
              </div>
              <!--Event Name-->
              <p class="title is-5 p-5">${eventDoc.data().event_name}</p>
              <!--Event Description-->
              <p>${eventDoc.data().event_description}</p>
              <!--Event and Medium Type-->
              <div class="field is-grouped">
                <p class="Type">
                  <span class="tag is-light">${eventDoc.data().event_medium}</span>
                  <span class="tag is-light">${eventDoc.data().event_category}</span>
                </p>
              </div>
              <!--Event Date-->
              <p>
                <span class="has-text-weight-semibold">Date:</span>
                ${eventDoc.data().event_date}
              </p>
              <!--Accept or Approved Button-->
              <button class="button is-primary accept-button" data-event-id="${eventId}" style="background-color: rgba(197, 35, 40, 255); color: white;">
                ${buttonText1}
              </button>
              <!-- Decline Button -->
              <button class="button is-primary decline-button" data-event-id="${eventId}" style="background-color: rgba(197, 35, 40, 255); color: white;">
                ${buttonText2}
              </button>
            </div>
          </div>`;
}

// Function to attach event listeners to Accept and Approved buttons
function attachButtonListeners2() {
  document.querySelectorAll(".accept-button").forEach((button) => {
    button.addEventListener("click", () => {
      const eventId = button.getAttribute("data-event-id"); // Get the event ID
      const eventStatus = button.textContent.trim(); // Get the current text content of the button

      // If the button says "Accept", update the event status to "Approved" in Firestore
      if (eventStatus === "Accept") {
        db.collection("events")
          .doc(eventId)
          .update({ event_status: "Approved" })
          .then(() => {
            console.log("Event status updated to Approved");
            // You can add further logic here, like updating UI, etc.
            button.textContent = "Approved"; // Change the button text to "Approved"
          })
          .catch((error) => {
            console.error("Error updating event status:", error);
          });
      }
    });
  });
  document.querySelectorAll(".decline-button").forEach((button) => {
    button.addEventListener("click", () => {
      const eventId = button.getAttribute("data-event-id"); // Get the event ID
      const eventStatus = button.textContent.trim(); // Get the current text content of the button

      // If the button says "Decline", update the event status to "Approved" in Firestore
      if (eventStatus === "Decline") {
        db.collection("events")
          .doc(eventId)
          .update({ event_status: "Declined" })
          .then(() => {
            console.log("Event status updated to Declined");
            // You can add further logic here, like updating UI, etc.
            button.textContent = "Declined"; // Change the button text to "Declined"
          })
          .catch((error) => {
            console.error("Error updating event status:", error);
          });
      }
    });
  });
}

// Function to apply filters and show events accordingly
function applyFilters2() {
  // Fetch the selected company name from the dropdown
  const selectedCompany2 = document.getElementById("companySelect2").querySelector("select").value;

  // Get selected categories
  const selectedCategories2 = [];
  document.querySelectorAll('.category2-checkbox').forEach((checkbox) => {
    if (checkbox.checked) {
      selectedCategories2.push(checkbox.value);
    }
  });

  const acceptEvents = document.getElementById('acceptEvents').checked;
  const declineEvents = document.getElementById('declineEvents').checked;

  // Fetch events based on the selected company, categories, and checkboxes
  db.collection("events")
    .get()
    .then((res) => {
      let data = res.docs;
      let htmlColumn1 = ``;
      let htmlColumn2 = ``;
      let index = 0;
      data.forEach((d) => {
        const eventId = d.id; // Get the event ID

        // Determine the text to display on the button based on the event status
        let buttonText1 = "";
        let buttonText2 = "";
        if (d.data().event_status === "Approved") {
          buttonText1 = "Approved";
        } else {
          buttonText1 = "Accept";
        }
        if (d.data().event_status === "Declined") {
          buttonText2 = "Declined";
        } else {
          buttonText2 = "Decline";
        }

        // Check if the event matches the selected company, categories, and checkboxes
        if (
          (selectedCompany2 === '' || d.data().company_name === selectedCompany2) &&
          (selectedCategories2.length === 0 || selectedCategories2.includes(d.data().event_category)) &&
          ((acceptEvents && d.data().event_status === "Approved") || 
          (declineEvents && d.data().event_status === "Declined") || 
          (!acceptEvents && !declineEvents))
        ) {
          const boxHtml = generateEventBoxHtml2(d, eventId, buttonText1, buttonText2); // Generate HTML for each event
          if (index % 2 === 0) {
            htmlColumn1 += boxHtml;
          } else {
            htmlColumn2 += boxHtml;
          }
          index++;
        }
      });
      // Append HTML to the document
      document.querySelector("#column1_events").innerHTML = htmlColumn1;
      document.querySelector("#column2_events").innerHTML = htmlColumn2;

      // Add event listeners to the buttons after they are added to the DOM
      attachButtonListeners2();
    });
}

// Call the function to show events immediately when the page is loaded
show_register_events();

// Add event listener to the "Apply" button to trigger the applyFilters function
document.getElementById("submitFilter2").addEventListener("click", applyFilters2);


