// DepartmentManagement.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from "../redux/slices/departmentSlice";

const DepartmentManagement = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.departments);
  const [departmentId, setDepartmentId] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    // Auto-generate department ID if not editing
    if (editIndex === null && list.length > 0) {
      const lastDept = list[list.length - 1];
      const lastNum = parseInt(lastDept.department_id.slice(1)) || 0;
      setDepartmentId("D" + String(lastNum + 1).padStart(3, "0"));
    } else if (editIndex === null && list.length === 0) {
      setDepartmentId("D001");
    }
  }, [list, editIndex]);

  const handleSave = () => {
    if (!departmentName.trim()) return;

    const payload = { department_id: departmentId, department_name: departmentName };

    if (editIndex !== null) {
      dispatch(updateDepartment(payload));
      setEditIndex(null);
    } else {
      dispatch(addDepartment({ department_name: departmentName }));
    }

    setDepartmentName("");
  };

  const handleEdit = (index) => {
    const dept = list[index];
    setDepartmentId(dept.department_id);
    setDepartmentName(dept.department_name);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const dept = list[index];
    dispatch(deleteDepartment(dept.department_id));
  };

  const filteredList = list.filter((dept) =>
    dept.department_name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Department Management</h2>

      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          value={departmentId}
          readOnly
          placeholder="Department ID (Auto)"
        />
        <input
          style={styles.input}
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          placeholder="Department Name"
        />
        <button style={styles.saveButton} onClick={handleSave}>
          {editIndex !== null ? "Update" : "Add"}
        </button>
      </div>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          style={{ ...styles.input, width: "300px" }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by Department Name..."
        />
      </div>

      {loading ? (
        <p style={styles.loading}>Loading departments...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Department ID</th>
              <th style={styles.th}>Department Name</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((dept, idx) => (
              <tr key={dept.department_id} style={styles.tr}>
                <td style={styles.td}>{dept.department_id}</td>
                <td style={styles.td}>{dept.department_name}</td>
                <td style={styles.td}>
                  <button style={styles.editButton} onClick={() => handleEdit(idx)}>
                    Edit
                  </button>
                  <button style={styles.deleteButton} onClick={() => handleDelete(idx)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Styles
const styles = {
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "25px",
    backgroundColor: "#1f1f2e",
    color: "#f0f0f0",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: { textAlign: "center", color: "#00d4ff", marginBottom: "30px", fontSize: "28px", fontWeight: "700" },
  inputContainer: { display: "flex", justifyContent: "center", marginBottom: "25px", gap: "10px" },
  input: { padding: "12px", width: "180px", borderRadius: "10px", border: "1px solid #444", outline: "none", backgroundColor: "#2a2a3c", color: "#fff", fontSize: "15px" },
  saveButton: { padding: "12px 22px", border: "none", borderRadius: "10px", backgroundColor: "#00d4ff", color: "#1f1f2e", cursor: "pointer", fontWeight: "600", fontSize: "15px" },
  loading: { textAlign: "center", color: "#bbb", fontSize: "16px" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  th: { padding: "14px", backgroundColor: "#2a2a3c", color: "#00d4ff", fontWeight: "600", borderBottom: "2px solid #444" },
  td: { padding: "12px", borderBottom: "1px solid #444" },
  tr: { transition: "background 0.3s" },
  editButton: { marginRight: "8px", padding: "6px 14px", border: "none", borderRadius: "8px", backgroundColor: "#00d4ff", color: "#1f1f2e", cursor: "pointer", fontWeight: "500" },
  deleteButton: { padding: "6px 14px", border: "none", borderRadius: "8px", backgroundColor: "#ff4b5c", color: "#fff", cursor: "pointer", fontWeight: "500" },
};

export default DepartmentManagement;
