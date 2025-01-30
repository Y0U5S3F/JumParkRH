const mongoose = require("mongoose");

// Schema for Bank Information
const BankInfoSchema = new mongoose.Schema({
  compteBancaire: { type: String, required: true }, // Bank account number
  ribBancaire: { type: String, required: true },   // RIB (Relevé d'Identité Bancaire)
});

// Schema for Emergency Contact
const EmergencyContactSchema = new mongoose.Schema({
  nom: { type: String, required: true },           // Last name of the emergency contact
  prenom: { type: String, required: true },        // First name of the emergency contact
  phoneNumber: { type: String, required: true },   // Phone number of the emergency contact
});

// Main Employee Schema
const EmployeeSchema = new mongoose.Schema({
  fullName: { type: String, required: true },      // Full name of the employee
  password: { type: String, required: true },      // Password for authentication
  nom: { type: String, required: true },           // Last name
  prenom: { type: String, required: true },        // First name
  matricule: { type: String, required: true, unique: true }, // Employee ID (unique)
  role: {                                          // Role of the employee
    type: String,
    enum: ["personnel", "rh", "manager"],          // Only these roles are allowed
    required: true,
  },
  departement: {                                   // Reference to the Department collection
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  dateDeNaissance: { type: Date, required: true }, // Date of birth
  lieuDeNaissance: { type: String, required: true }, // Place of birth
  nationality: { type: String, required: true },   // Nationality
  genre: {                                         // Gender
    type: String,
    enum: ["homme", "femme"],                      // Only "homme" or "femme" are allowed
    required: true,
  },
  situationFamiliale: {                            // Marital status
    type: String,
    enum: ["single", "engaged", "married", "widowed"], // Only these statuses are allowed
    required: true,
  },
  cin: { type: String, required: true, unique: true }, // CIN (National ID)
  phoneNumber: { type: String, required: true },   // Phone number
  adresse: { type: String, required: true },       // Address
  ville: { type: String, required: true },         // City
  codePostal: { type: String, required: true },    // Postal code
  personneAContacterEnCasUrgence: {                // Emergency contact
    type: EmergencyContactSchema,
    required: true,
  },
  infoBanque: {                                    // Bank information
    type: BankInfoSchema,
    required: true,
  },
  created_at: { type: Date, default: Date.now },   // Timestamp of creation
});

// Create the Employee model
const Employee = mongoose.model("Employee", EmployeeSchema);

module.exports = Employee;