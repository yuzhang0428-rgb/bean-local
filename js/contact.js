/**
 * @file contact.js
 * @description Validates contact input and sends valid feedback to the local
 * Node server, which stores it in data/feedback.txt.
 */

const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");
const feedbackCount = document.getElementById("feedbackCount");

/**
 * Displays an accessible contact form status message.
 * @param {string} message
 * @param {boolean} success
 */
function showContactStatus(message, success) {
  contactStatus.textContent = message;
  contactStatus.className = success
    ? "contact-status success"
    : "contact-status error";
  contactStatus.focus();
}

/**
 * Reads the feedback text file indirectly through the server.
 * Only the number of records is returned, so email addresses stay private.
 */
async function loadFeedbackCount() {
  if (!feedbackCount || typeof CONFIG === "undefined") return;

  try {
    const response = await fetch(CONFIG.feedbackCountApiUrl);
    if (!response.ok) throw new Error("Count request failed");

    const data = await response.json();
    feedbackCount.textContent = data.count;
  } catch {
    feedbackCount.textContent = "0";
  }
}

if (contactForm && contactStatus) {
  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const data = {
      name: contactForm.elements.name.value.trim(),
      email: contactForm.elements.email.value.trim(),
      message: contactForm.elements.message.value.trim()
    };

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (data.name.length < 2) {
      showContactStatus("Please enter a name with at least 2 characters.", false);
      return;
    }

    if (!emailPattern.test(data.email)) {
      showContactStatus("Please enter a valid email address.", false);
      return;
    }

    if (data.message.length < 10) {
      showContactStatus("Please enter a message with at least 10 characters.", false);
      return;
    }

    try {
      const response = await fetch(CONFIG.feedbackApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Feedback could not be saved.");
      }

      showContactStatus(result.message, true);
      contactForm.reset();
      loadFeedbackCount();
    } catch (error) {
      console.error("Feedback save error:", error);
      showContactStatus(
        "Feedback could not be saved. Make sure the project is running with npm start.",
        false
      );
    }
  });
}

loadFeedbackCount();
