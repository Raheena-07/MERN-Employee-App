const express = require('express');
const Employee = require('../models/employee_models');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all employees (any authenticated user)
router.get('/', verifyToken, async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single employee
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    res.json(emp);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create employee (admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, position, department, email, phone, salary } = req.body;
    const existing = await Employee.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Employee email already exists' });
    const emp = new Employee({ name, position, department, email, phone, salary });
    await emp.save();
    res.status(201).json(emp);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update employee (admin only)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Employee not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete employee (admin only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const del = await Employee.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
