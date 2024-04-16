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
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dateString = firstDayOfMonth.toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const paddingDays = weekdays.indexOf(dateString.split(", ")[0]);

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
        daySquare.id = "currentDay";
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
    console.log("newmonth");
    call_events(2024, 4);
    console.log("after call events");
  });

  document.getElementById("backButton").addEventListener("click", () => {
    nav--;
    console.log("navvvv", nav);

    load();
    console.log("oldmonth");

    call_events(2024, 2);
  });

  document.getElementById("saveButton").addEventListener("click", saveEvent);
  document.getElementById("cancelButton").addEventListener("click", closeModal);
  document
    .getElementById("deleteButton")
    .addEventListener("click", deleteEvent);
  document.getElementById("closeButton").addEventListener("click", closeModal);
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
      !event_capacity
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

// Example usage: to show the modal
// document
//   .getElementById("yourSignInButtonId")
//   .addEventListener("click", function () {
//     toggleModal("signInModal", true);
//   });

function show_events_home() {
  db.collection("events")
    .where("event_status", "==", "Approved")
    .get()
    .then((res) => {
      let data = res.docs;
      let htmlColumn1 = ``;
      let htmlColumn2 = ``;
      let index = 0;
      data.forEach((d) => {
        const boxHtml = `<div class="box">
          <div class="content">
            <!--Company name and logo-->
            <div class="media">
              <div class="media-left">
                <figure class="image is-48x48">
                  <img src="Image/business_logo.jpeg" alt="Company Logo" />
                </figure>
              </div>
              <div class="media-content">
                <p class="title is-4">${d.data().company_name}</p>
              </div>
            </div>
            <!--Event Name-->
            <p class="title is-5 p-5">${d.data().event_name}</p>
            <!--Event Description-->
            <p>${d.data().event_description}</p>
            <!--Event and Medium Type-->
            <div class="field is-grouped">
              <p class="Type">
                <span class="tag is-light">${d.data().event_medium}</span>
                <span class="tag is-light">${d.data().event_type}</span>
              </p>
            </div>
            <!--Event Date-->
            <p>
              <span class="has-text-weight-semibold">Date:</span>
              ${d.data().event_date}
            </p>
            <!--Save Button-->
            <button
            class="button is-primary save-event-button"
            style="background-color: black"
          >
            <span class="icon is-small">
              <i class="fas fa-bookmark icon-white"></i>
              <!-- Initial class for white color -->
            </span>
          </button>
          </div>
        </div>`;

        if (index % 2 === 0) {
          htmlColumn1 += boxHtml;
        } else {
          htmlColumn2 += boxHtml;
        }

        index++;
      });
      //append html variable to the document
      document.querySelector("#column1").innerHTML += htmlColumn1;
      document.querySelector("#column2").innerHTML += htmlColumn2;

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
        });
      });
    });
}
show_events_home();

function show_register_events() {
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

        const boxHtml = `<div class="box">
          <div class="content">
            <!--Company name and logo-->
            <div class="media">
              <div class="media-left">
                <figure class="image is-48x48">
                  <img src="Image/business_logo.jpeg" alt="Company Logo" />
                </figure>
              </div>
              <div class="media-content">
                <p class="title is-4">${d.data().company_name}</p>
              </div>
            </div>
            <!--Event Name-->
            <p class="title is-5 p-5">${d.data().event_name}</p>
            <!--Event Description-->
            <p>${d.data().event_description}</p>
            <!--Event and Medium Type-->
            <div class="field is-grouped">
              <p class="Type">
                <span class="tag is-light">${d.data().event_medium}</span>
                <span class="tag is-light">${d.data().event_type}</span>
              </p>
            </div>
            <!--Event Date-->
            <p>
              <span class="has-text-weight-semibold">Date:</span>
              ${d.data().event_date}
            </p>
            <!--Accept or Approved Button-->
            <button
              class="button is-primary accept-button"
              data-event-id="${eventId}"
              style="
                background-color: rgba(197, 35, 40, 255);
                color: white;
              "
            >
              ${buttonText1}
            </button>
            <!-- Decline Button -->
            <button
              class="button is-primary decline-button"
              data-event-id="${eventId}"
              style="
                background-color: rgba(197, 35, 40, 255);
                color: white;
              "
            >
            ${buttonText2}
            </button>
          </div>
        </div>`;

        if (index % 2 === 0) {
          htmlColumn1 += boxHtml;
        } else {
          htmlColumn2 += boxHtml;
        }

        index++;
      });
      //append html variable to the document
      document.querySelector("#column1_events").innerHTML += htmlColumn1;
      document.querySelector("#column2_events").innerHTML += htmlColumn2;

      // Attach event listeners to the buttons after they are added to the DOM
      attachButtonListeners();
    });
}

// Function to attach event listeners to Accept and Approved buttons
function attachButtonListeners() {
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
            button.textContent = "Declined"; // Change the button text to "Approved"
          })
          .catch((error) => {
            console.error("Error updating event status:", error);
          });
      }
    });
  });
}
show_register_events();

// calendar!!!
// calendar functions
function call_events(currentyear, currentmonth) {
  function fetchApprovedEvents() {
    console.log("Fetching events from Firestore...");
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

        console.log("Processed approved events:", approvedEvents);
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
    console.log("generatingg month year", month, year);
    const calendarContainer = document.getElementById("calendar");
    calendarContainer.innerHTML = ""; // Clear existing calendar entries

    let daysInMonth = new Date(year, month + 1, 0).getDate(); // Calculate the number of days in the month

    // Ensure we have a valid approvedEvents array loaded
    if (!approved_calendar_events) {
      console.error("No approved events available");
      return;
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

      console.log("approvedEvents new", approved_calendar_events);

      calendarContainer.appendChild(dayElement);
    }
  }
}

call_events(2024, 3);

let today = new Date();
// generateCalendar(today.getMonth(), today.getFullYear());
console.log("GOSSIP", today.getMonth(), today.getFullYear());
