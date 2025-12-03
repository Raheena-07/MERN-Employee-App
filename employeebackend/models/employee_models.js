const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  position:   { type: String },
  department: { type: String },
  email:      { type: String, required: true, unique: true },
  phone:      { type: String },
  salary:     { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
