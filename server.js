/**
 * @file server.js
 * @description Bean Local local Node.js server.
 * Serves static project files and demonstrates text-file read/write using fs.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const FEEDBACK_FILE = path.join(ROOT, "data", "feedback.txt");
const COFFEE_FILE = path.join(ROOT, "data", "coffees.txt");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

function sendJson(response, status, data) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8"
  });
  response.end(JSON.stringify(data));
}

function cleanText(value) {
  return String(value ?? "")
    .replace(/[\r\n|]+/g, " ")
    .trim();
}

const server = http.createServer((request, response) => {

  // READ persistent Coffee Finder data from the text file.
  if (request.url === "/api/coffees" && request.method === "GET") {
    fs.readFile(COFFEE_FILE, "utf8", (error, content) => {
      if (error) return sendJson(response, 500, { message: "Coffee file could not be read." });
      try { sendJson(response, 200, JSON.parse(content)); }
      catch { sendJson(response, 500, { message: "Invalid coffee file." }); }
    });
    return;
  }

  // WRITE the current Coffee Finder array to the text file.
  if (request.url === "/api/coffees" && request.method === "PUT") {
    let body = "";
    request.on("data", chunk => { body += chunk; });
    request.on("end", () => {
      try {
        const coffees = JSON.parse(body);
        if (!Array.isArray(coffees)) return sendJson(response, 400, { message: "Invalid coffee data." });
        const cleaned = coffees.map(c => ({
          beanName: cleanText(c.beanName),
          rating: Number(c.rating)
        }));
        const valid = cleaned.every(c =>
          c.beanName.length >= 2 && Number.isInteger(c.rating) && c.rating >= 1 && c.rating <= 5
        );
        if (!valid) return sendJson(response, 400, { message: "Invalid coffee data." });
        fs.writeFile(COFFEE_FILE, JSON.stringify(cleaned, null, 2) + "\n", "utf8", error => {
          if (error) return sendJson(response, 500, { message: "Coffee data could not be saved." });
          sendJson(response, 200, { message: "Coffee data saved." });
        });
      } catch {
        sendJson(response, 400, { message: "Invalid request data." });
      }
    });
    return;
  }

  // WRITE: append validated feedback to the text file.
  if (request.url === "/api/feedback" && request.method === "POST") {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 100000) request.destroy();
    });

    request.on("end", () => {
      try {
        const input = JSON.parse(body);
        const name = cleanText(input.name);
        const email = cleanText(input.email);
        const message = cleanText(input.message);

        if (name.length < 2 || !email.includes("@") || message.length < 10) {
          return sendJson(response, 400, {
            message: "Invalid feedback data."
          });
        }

        const record =
          `${new Date().toISOString()} | ${name} | ${email} | ${message}\n`;

        fs.appendFile(FEEDBACK_FILE, record, "utf8", (error) => {
          if (error) {
            return sendJson(response, 500, {
              message: "Feedback could not be saved."
            });
          }

          sendJson(response, 201, {
            message: "Thank you. Your feedback was saved successfully."
          });
        });
      } catch {
        sendJson(response, 400, { message: "Invalid request data." });
      }
    });

    return;
  }

  // READ: read feedback.txt and return only the number of saved records.
  if (request.url === "/api/feedback-count" && request.method === "GET") {
    fs.readFile(FEEDBACK_FILE, "utf8", (error, content) => {
      if (error) {
        return sendJson(response, 500, {
          message: "Feedback file could not be read."
        });
      }

      const count = content
        .split("\n")
        .filter((line) => line.trim() && !line.startsWith("#"))
        .length;

      sendJson(response, 200, { count });
    });

    return;
  }

  let requestedPath = decodeURIComponent(request.url.split("?")[0]);
  if (requestedPath === "/") requestedPath = "/index.html";

  const safePath = path
    .normalize(requestedPath)
    .replace(/^(\.\.[/\\])+/, "");

  const filePath = path.join(ROOT, safePath);

  if (!filePath.startsWith(ROOT)) {
    response.writeHead(403);
    return response.end("Forbidden");
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500);
      return response.end(error.code === "ENOENT" ? "Not found" : "Server error");
    }

    response.writeHead(200, {
      "Content-Type":
        MIME_TYPES[path.extname(filePath).toLowerCase()] ||
        "application/octet-stream"
    });
    response.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`Bean Local running at http://localhost:${PORT}`);
});
