const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public")); // לשים את index.html בתיקייה public

const filePath = path.join(__dirname, "guests.json");

// API לשמירת אורח
app.post("/api/rsvp", (req, res) => {
  const { name, attendance } = req.body;
  if (!name || !attendance) {
    return res.status(400).json({ message: "נא למלא את כל השדות" });
  }

  // API להחזרת כל האורחים
app.get("/api/guests", (req, res) => {
  let guests = [];
  if (fs.existsSync(filePath)) {
    guests = JSON.parse(fs.readFileSync(filePath));
  }
  res.json(guests);
});


  let guests = [];
  if (fs.existsSync(filePath)) {
    guests = JSON.parse(fs.readFileSync(filePath));
  }

  // בודק אם האורח כבר מילא לפני
  const existingIndex = guests.findIndex((g) => g.name === name);
  if (existingIndex !== -1) {
    guests[existingIndex].attendance = attendance;
  } else {
    guests.push({ name, attendance });
  }

  fs.writeFileSync(filePath, JSON.stringify(guests, null, 2));

  res.json({ message: "תודה! התשובה שלך נשמרה." });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
