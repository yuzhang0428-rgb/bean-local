/**
 * @file config.js
 * @description Common non-sensitive Bean Local configuration.
 * Never store passwords or secret API keys in client-side JavaScript.
 */
const CONFIG = Object.freeze({
  weatherApiUrl: "https://api.open-meteo.com/v1/forecast",
  melbourne: {
    latitude: -37.8136,
    longitude: 144.9631,
    timezone: "Australia/Melbourne"
  },
  coffeeApiUrl: "/api/coffees",
  feedbackApiUrl: "/api/feedback",
  feedbackCountApiUrl: "/api/feedback-count"
});
