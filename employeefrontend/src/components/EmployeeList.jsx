import React, { useState, useEffect } from "react";
import API from "../api";
import EmployeeForm from "./EmployeeForm";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      await API.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  return (
    <div className="container">
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Employee List</h2>

      {/* Admin Add Employee / Close Form Button */}
      {user?.role === "admin" && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <button
            className={`add-button ${showForm ? "close" : ""}`}
            onClick={() => {
              setShowForm(!showForm);
              setEditingEmployee(null);
            }}
          >
            {showForm ? "Close Form" : "Add Employee"}
          </button>
        </div>
      )}

      {/* Show form only when toggled */}
      {showForm && (
        <EmployeeForm
          fetchEmployees={fetchEmployees}
          editingEmployee={editingEmployee}
          setEditingEmployee={setEditingEmployee}
          setShowForm={setShowForm}
        />
      )}

      {/* Employee Table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Position</th>
            <th>Department</th>
            {user?.role === "admin" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.position}</td>
              <td>{emp.department}</td>
              {user?.role === "admin" && (
                <td style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => {
                      setEditingEmployee(emp);
                      setShowForm(true); // Show form when editing
                    }}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(emp._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
