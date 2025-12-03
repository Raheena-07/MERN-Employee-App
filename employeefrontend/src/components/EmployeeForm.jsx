import React, { useState, useEffect } from "react";
import API from "../api";

const EmployeeForm = ({ fetchEmployees, editingEmployee, setEditingEmployee, setShowForm }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    position: "",
    department: "",
    phone: "",
    salary: ""
  });

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user || user.role !== 'admin') return null;

  useEffect(() => {
    if (editingEmployee) {
      setForm({
        name: editingEmployee.name || "",
        email: editingEmployee.email || "",
        position: editingEmployee.position || "",
        department: editingEmployee.department || "",
        phone: editingEmployee.phone || "",
        salary: editingEmployee.salary || ""
      });
    }
  }, [editingEmployee]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await API.put(`/employees/${editingEmployee._id}`, form);
        setEditingEmployee(null);
      } else {
        await API.post("/employees", form);
      }
      setForm({ name: "", email: "", position: "", department: "", phone: "", salary: "" });
      fetchEmployees();
      if (setShowForm) setShowForm(false); // Close form after submit
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: "500px", margin: "20px auto" }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <h2>{editingEmployee ? "Edit Employee" : "Add Employee"}</h2>
        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input type="text" name="position" placeholder="Position" value={form.position} onChange={handleChange} />
        <input type="text" name="department" placeholder="Department" value={form.department} onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <input type="number" name="salary" placeholder="Salary" value={form.salary} onChange={handleChange} />
        <button type="submit">{editingEmployee ? "Update" : "Add"}</button>
      </form>
    </div>
  );
};

export default EmployeeForm;
