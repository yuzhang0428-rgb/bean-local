/**
 * @file app.js
 * @description Implements the Bean Local application.
 * It creates the BeanList instance, connects UI event listeners,
 * validates user input and controls the CRUD/search/sort interface.
 * @author Yu Zhang
 * @version 3.1.0
 */

/**
 * Initial data structure for the Bean Local directory.
 * Each object contains a beanName string and an integer rating.
 * @type {Array<Object>}
 */
let initBeans = [];

/**
 * Main BeanList object used throughout the application.
 * @type {BeanList}
 */
let beanList = new BeanList('list', initBeans);

// Get all buttons from the application.
const searchBtn = document.getElementById('searchBtn');
const sortA2ZBtn = document.getElementById('sortA2ZBtn');
const sortZ2ABtn = document.getElementById('sortZ2ABtn');
const addSubmit = document.getElementById('addSubmit');
const updateSubmit = document.getElementById('updateSubmit');
const deleteSubmit = document.getElementById('deleteSubmit');

// Add event handlers.
searchBtn.addEventListener('click', searchClick);
sortA2ZBtn.addEventListener('click', a2zClick);
sortZ2ABtn.addEventListener('click', z2aClick);
addSubmit.addEventListener('click', addClick);
updateSubmit.addEventListener('click', updateClick);
deleteSubmit.addEventListener('click', deleteClick);

/**
 * Search Bean Local using a partial coffee bean name.
 */
function searchClick() {
  const formElements = document.getElementById("form-list-control").elements;
  const text = formElements["search-string"].value;
  beanList.search(text);
}

/**
 * Sort the bean list in ascending alphabetical order.
 */
function a2zClick() {
  beanList.sortA2Z();
}

/**
 * Sort the bean list in descending alphabetical order.
 */
function z2aClick() {
  beanList.sortZ2A();
}

/**
 * Validate a coffee bean name.
 * @param {string} beanName - User-entered coffee bean name.
 * @returns {boolean} True when the name is valid.
 */
function validBeanName(beanName) {
  const pattern = /^[a-z0-9À-ÿ'&.\-\s]+$/i;
  return beanName.trim().length >= 2 && pattern.test(beanName);
}

/**
 * Validate a rating.
 * @param {number} rating - User-entered rating.
 * @returns {boolean} True when rating is an integer from 1 to 5.
 */
function validRating(rating) {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

/**
 * Add a new bean to the directory (Create).
 */
function addClick() {
  const formElements = document.getElementById("form-add").elements;
  const beanName = formElements["beanName"].value.trim();
  const rating = Number(formElements["rating"].value);

  if (validBeanName(beanName) && validRating(rating)) {
    beanList.add(beanName, rating);
    formElements.beanName.value = "";
    formElements.rating.value = "";
    showMessage("Coffee added to Bean Local", "#d9ead3", "#243126");
    saveCoffeeData();
    updateRatingChart();
  } else if (!validBeanName(beanName)) {
    showMessage(
      "Enter a bean name using at least 2 letters, numbers or standard punctuation.",
      "#f5d7cf",
      "#6a2d1d"
    );
  } else {
    showMessage("Rating must be a whole number from 1 to 5.", "#f5d7cf", "#6a2d1d");
  }
}

/**
 * Load an existing bean into the Update form.
 */
function getData() {
  const idValue = document.getElementById('upIndex').value;
  const upIndex = Number(idValue);
  const upperBound = beanList.beanList.length;

  if (Number.isInteger(upIndex) && upIndex > 0 && upIndex <= upperBound) {
    const beanName = document.getElementById('upBeanName');
    const rating = document.getElementById('upRating');
    const row = beanList.getRow(upIndex - 1);

    beanName.value = row.beanName;
    rating.value = row.rating;
  } else {
    showMessage("That coffee number is not in the current list.", "#f4dfbd", "#614719");
  }
}

const upIndex = document.getElementById('upIndex');
upIndex.addEventListener('change', getData);

/**
 * Update an existing bean by its displayed number (Update).
 */
function updateClick() {
  const formElements = document.getElementById("form-update").elements;
  const displayedIndex = Number(formElements["index"].value);
  const beanName = formElements["beanName"].value.trim();
  const rating = Number(formElements["rating"].value);
  const upperBound = beanList.beanList.length;

  if (!Number.isInteger(displayedIndex) || displayedIndex < 1 || displayedIndex > upperBound) {
    showMessage("Choose a valid coffee number from the current list.", "#f4dfbd", "#614719");
  } else if (!validBeanName(beanName)) {
    showMessage(
      "Enter a bean name using at least 2 letters, numbers or standard punctuation.",
      "#f5d7cf",
      "#6a2d1d"
    );
  } else if (!validRating(rating)) {
    showMessage("Rating must be a whole number from 1 to 5.", "#f5d7cf", "#6a2d1d");
  } else {
    beanList.update(displayedIndex - 1, beanName, rating);
    formElements.index.value = "";
    formElements.beanName.value = "";
    formElements.rating.value = "";
    showMessage("Coffee details updated", "#d9ead3", "#243126");
    saveCoffeeData();
    updateRatingChart();
  }
}

/**
 * Delete a bean by its displayed number (Delete).
 */
function deleteClick() {
  const indexElement = document.getElementById("delIndex");
  let index = Number(indexElement.value);
  const upperBound = beanList.beanList.length;

  if (Number.isInteger(index) && index > 0 && index <= upperBound) {
    index = index - 1;
    const bean = beanList.getRow(index);
    const confirmed = window.confirm(`Remove "${bean.beanName}" from Bean Local?`);

    if (confirmed) {
      beanList.delete(index);
      indexElement.value = "";
      showMessage("Coffee removed from Bean Local", "#d9ead3", "#243126");
    saveCoffeeData();
    updateRatingChart();
    } else {
      showMessage("Nothing was removed", "#f4dfbd", "#614719");
    }
  } else {
    showMessage("That coffee number is not in the current list.", "#f4dfbd", "#614719");
  }
}

/**
 * Open one CRUD form tab.
 * @param {Event} evt - Click event from the tab button.
 * @param {string} action - Id of the tab panel to display.
 */
function openForm(evt, action) {
  let i, tabContent, tabLinks;

  tabContent = document.getElementsByClassName('tabcontent');
  for (i = 0; i < tabContent.length; i++) {
    tabContent[i].style.display = 'none';
  }

  tabLinks = document.getElementsByClassName('tablinks');
  for (i = 0; i < tabLinks.length; i++) {
    tabLinks[i].className = tabLinks[i].className.replace(" active", "");
  }

  document.getElementById(action).style.display = "block";
  evt.currentTarget.className += " active";
}

// Open Add tab by default.
document.getElementById('defaultOpen').click();

// Inject current year into footer.
const dateSpan = document.getElementById("date");
const theDate = new Date();
dateSpan.textContent = theDate.getFullYear();

/**
 * Show a user-facing status/error message.
 * @param {string} message - Message text.
 * @param {string} colour - Background colour.
 * @param {string} text - Text colour.
 */
function showMessage(message, colour, text) {
  const msg = document.getElementById('msg');
  msg.style.display = "block";
  msg.textContent = message;
  msg.style.backgroundColor = colour;
  msg.style.color = text;
  msg.focus();
}


/* =========================================================
   API + EMERGING TECHNOLOGY
   ========================================================= */

/**
 * Fetches current Melbourne weather from Open-Meteo and displays it.
 * @returns {Promise<void>}
 */
async function loadMelbourneWeather() {
  const output = document.getElementById("weatherOutput");
  if (!output || typeof CONFIG === "undefined") return;

  const location = CONFIG.melbourne;
  const url =
    `${CONFIG.weatherApiUrl}?latitude=${location.latitude}` +
    `&longitude=${location.longitude}` +
    `&current=temperature_2m,apparent_temperature` +
    `&timezone=${encodeURIComponent(location.timezone)}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather request failed: ${response.status}`);
    }

    const data = await response.json();
    const temperature = data.current.temperature_2m;
    const apparent = data.current.apparent_temperature;

    let coffeeTip = "A balanced filter coffee could be a good choice today.";

    if (temperature >= 28) {
      coffeeTip = "Warm day: consider a cold brew or iced filter.";
    } else if (temperature <= 14) {
      coffeeTip = "Cool day: a warm flat white or long black could be a good choice.";
    }

    output.textContent =
      `Melbourne is ${temperature}°C and feels like ${apparent}°C. ${coffeeTip}`;
  } catch (error) {
    console.error("Open-Meteo API error:", error);
    output.textContent =
      "Live weather is unavailable right now. Please try again later.";
  }
}

/** @type {Chart|null} Current Chart.js chart instance. */
let ratingChart = null;

/**
 * Creates or refreshes the coffee rating chart using current BeanList data.
 */
function updateRatingChart() {
  const canvas = document.getElementById("ratingChart");

  if (!canvas || typeof Chart === "undefined") return;

  const labels = beanList.beanList.map((bean) => bean.beanName);
  const ratings = beanList.beanList.map((bean) => bean.rating);

  if (ratingChart) {
    ratingChart.destroy();
  }

  ratingChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Community rating / 5",
        data: ratings
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 5,
          ticks: { stepSize: 1 }
        }
      }
    }
  });
}




/**
 * Reads Coffee Finder records from data/coffees.txt through the Node server.
 */
async function loadCoffeeData() {
  try {
    const response = await fetch(CONFIG.coffeeApiUrl);
    if (!response.ok) throw new Error("Coffee data could not be loaded.");
    beanList.beanList = await response.json();
    beanList.refresh();
    updateRatingChart();
  } catch (error) {
    console.error(error);
    showMessage("Coffee data could not be loaded. Run npm start.", "#f5d7cf", "#6a2d1d");
  }
}

/**
 * Writes the current BeanList data to data/coffees.txt through the Node server.
 */
async function saveCoffeeData() {
  try {
    const response = await fetch(CONFIG.coffeeApiUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(beanList.beanList)
    });
    if (!response.ok) throw new Error("Coffee data could not be saved.");
    updateRatingChart();
  } catch (error) {
    console.error(error);
    showMessage("Coffee changed on screen, but the text file could not be updated.", "#f5d7cf", "#6a2d1d");
  }
}

loadMelbourneWeather();
loadCoffeeData();
