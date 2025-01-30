const express = require("express");
const connectDB = require("../db");
const Department = require("../models/Department");

const app = express();
app.use(express.json());

connectDB();

app.post("/departments", async (req, res) => {
  try {
    const department = new Department(req.body);
    await department.save();
    res.status(201).json({ message: "Department created!", department });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/departments", async (req, res) => {
  const departments = await Department.find().populate("employees");
  res.json(departments);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
