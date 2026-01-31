require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

// CHANGE YOUR PASSWORD HERE
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sathyajph@2005",
  database: "quickloan",
});

db.connect((err) => {
  if (err) return console.log("DB Error:", err);
  console.log("MySQL Connected ✅");
});

app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

// REGISTER
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email & password required" });
  }

  const hashed = bcrypt.hashSync(password, 10);

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(sql, [name || "", email, hashed], (err) => {
    if (err) return res.status(500).json({ message: "User already exists / error" });
    res.json({ message: "Registered ✅" });
  });
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, result) => {
    if (err || result.length === 0) {
      return res.status(401).json({ message: "Invalid login" });
    }

    const user = result[0];
    const ok = bcrypt.compareSync(password, user.password);

    if (!ok) return res.status(401).json({ message: "Wrong password" });

    res.json({
      message: "Login success ✅",
      user: { id: user.id, name: user.name, email: user.email },
    });
  });
});

app.post("/forgot-password", (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) return res.status(400).json({ message: "Email & new password required" });

  const hashed = bcrypt.hashSync(newPassword, 10);

  db.query("UPDATE users SET password=? WHERE email=?", [hashed, email], (err, result) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Email not found" });

    res.json({ message: "Password updated ✅" });
  });
});

// APPLY (save application)
app.post("/apply", (req, res) => {
  const { borrowerName, loanType, loanAmount, phone, address } = req.body;

  if (!borrowerName || !loanType || !loanAmount || !phone || !address) {
    return res.status(400).json({ message: "Fill all fields" });
  }

  const sql =
    "INSERT INTO applications (borrower_name, loan_type, loan_amount, phone, address) VALUES (?, ?, ?, ?, ?)";

  db.query(sql, [borrowerName, loanType, loanAmount, phone, address], (err) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json({ message: "Application saved ✅" });
  });
});


app.listen(5000, () => console.log("Server running on http://localhost:5000"));
