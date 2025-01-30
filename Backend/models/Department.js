const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
  created_at: { type: Date, default: Date.now }
});

const Department = mongoose.model("Department", DepartmentSchema);
module.exports = Department;
