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
  });

  document.getElementById("backButton").addEventListener("click", () => {
    nav--;
    load();
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

document.querySelectorAll(".save-event-button").forEach((button) => {
  button.addEventListener("click", () => {
    // Select the icon within the clicked button
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

    // Basic field validations
    const employerContactNumber = document
      .getElementById("employerContactNumber")
      .value.trim();
    const eventName = document.getElementById("eventName").value.trim();
    const eventOverview = document.getElementById("eventOverview").value.trim();
    const eventDescription = document
      .getElementById("eventDescription")
      .value.trim();
    const eventCategory = document.getElementById("eventCategory").value.trim();
    const location = document.getElementById("location").value.trim();
    const eventCapacity = document.getElementById("eventCapacity").value.trim();

    // Validate required fields are not empty
    if (
      !employerContactNumber ||
      !eventName ||
      !eventOverview ||
      !eventDescription ||
      !eventCategory ||
      !location ||
      !eventCapacity
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // Date validation
    const eventDateInput = document.getElementById("eventDate");
    const eventDateValue = new Date(eventDateInput.value);
    const today = new Date();
    const seatingArrangement = document.querySelector(
      'input[name="seatingArrangement"]:checked'
    )?.value;

    today.setHours(0, 0, 0, 0); // Reset hours for today's date to ensure correct comparison

    if (eventDateValue < today) {
      alert("Please enter a date after the current day.");
      return; // Stop the function if the date is not valid
    }

    // Assuming all validations passed
    const regformData = {
      employerContactNumber,
      eventName,
      eventDate: eventDateInput.value,
      eventOverview,
      eventDescription,
      eventCategory,
      location,
      eventCapacity,
      // Collecting checkboxes by their names
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

    db.collection("events")
      .add(regformData)
      .then(() =>
        openNotificationModal(
          "Your event has been sent for approval to the admin team."
        )
      )
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
document
  .getElementById("yourSignInButtonId")
  .addEventListener("click", function () {
    toggleModal("signInModal", true);
  });
