const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Path to JSON file
const dataFile = path.join(__dirname, "data.json");

// Ensure data.json exists
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify([]));
}

// Route to handle form submission
app.post("/submit", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newEntry = {
    id: Date.now(),
    name,
    email,
    message,
  };

  // Read existing data
  const data = JSON.parse(fs.readFileSync(dataFile));
  data.push(newEntry);

  // Save updated data
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

  res.json({ success: true, message: "Form submitted successfully!" });
});

// API to get all submissions
app.get("/submissions", (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataFile));
  res.json(data);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
