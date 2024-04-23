// Fetch company options from the database
db.collection('events').get().then(snapshot => {
    const companySelect = document.getElementById('companySelect2').querySelector('select');
    const uniqueCompanyNames = new Set(); // Set to store unique company names
  
    snapshot.forEach(doc => {
      const companyName = doc.data().company_name;
      // Check if the company name is not already added to the set
      if (!uniqueCompanyNames.has(companyName)) {
        const option = document.createElement('option');
        option.value = companyName;
        option.textContent = companyName;
        companySelect.appendChild(option);
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
      });
  
    // Add event listener to the submit button
    document.getElementById("submitFilter").addEventListener("click", applyFilters);
  }
  
  function generateEventBoxHtml(eventDoc) {
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
                    <span class="tag is-light">${eventDoc.data().event_medium}</span>
                    <span class="tag is-light">${eventDoc.data().event_category}</span>
                  </p>
                </div>
                <!--Event Date-->
                <p>
                  <span class="has-text-weight-semibold">Date:</span>
                  ${eventDoc.data().event_date}
                </p>
                <!--Save Button-->
                <button class="button is-primary save-event-button" style="background-color: black">
                  <span class="icon is-small">
                    <i class="fas fa-bookmark icon-white"></i>
                    <!-- Initial class for white color -->
                  </span>
                </button>
              </div>
            </div>`;
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
      });
    });
  }
  
  function applyFilters() {
    // Fetch the selected company name from the dropdown
    const selectedCompany = document.getElementById("companySelect").querySelector("select").value;
  
    // Get selected categories
    const selectedCategories = [];
    document.querySelectorAll('.category-checkbox').forEach((checkbox) => {
      if (checkbox.checked) {
        selectedCategories.push(checkbox.value);
      }
    });
  
    const selectedMedium = [];
    document.querySelectorAll('.medium-checkbox').forEach((checkbox) => {
      if (checkbox.checked) {
        selectedMedium.push(checkbox.value);
      }
    });
  
    // Fetch the search input value
    const searchInputValue = document.querySelector('.input').value.toLowerCase();
  
    // Fetch the selected date
    const selectedDate = document.querySelector('.input[type="date"]').value;
  
    // Fetch events based on the selected company, categories, search input, and date
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
            (d.data().event_name.toLowerCase().includes(searchInputValue)) &&
            (selectedDate === '' || d.data().event_date === selectedDate)
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
  
  // show values from db in dropdown
  db.collection('events').get().then(snapshot => {
    const companySelect = document.getElementById('companySelect2').querySelector('select');
    const uniqueCompanyNames = new Set(); // Set to store unique company names
  
    snapshot.forEach(doc => {
      const companyName = doc.data().company_name;
      // Check if the company name is not already added to the set
      if (!uniqueCompanyNames.has(companyName)) {
        const option = document.createElement('option');
        option.value = companyName;
        option.textContent = companyName;
        companySelect.appendChild(option);
        uniqueCompanyNames.add(companyName); // Add the company name to the set
      }
    });
  }).catch(error => {
    console.error('Error fetching companies: ', error);
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
            (acceptEvents && d.data().event_status === "Approved") || 
            (declineEvents && d.data().event_status === "Declined") || (!acceptEvents && !declineEvents)
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
  
  
  