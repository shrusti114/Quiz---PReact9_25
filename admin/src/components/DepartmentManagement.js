import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState("");
  const [searchText, setSearchText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/departments/display");
      setDepartments(res.data);
    } catch {
      toast.error("❌ Failed to fetch departments");
    }
  };

  const generateDepartmentId = () => {
    if (departments.length === 0) return "D001";
    const lastDept = departments[departments.length - 1];
    const lastNum = parseInt(lastDept.department_id.slice(1)) || 0;
    return "D" + String(lastNum + 1).padStart(3, "0");
  };

  const handleAddOrUpdate = async () => {
    if (!newDepartment.trim() && !editName.trim()) return;

    if (editId) {
      try {
        await axios.put("http://localhost:5000/departments/update", {
          department_id: editId,
          department_name: editName,
        });
        setEditId(null);
        setEditName("");
        fetchDepartments();
        toast.success("✅ Department updated successfully");
      } catch {
        toast.error("❌ Failed to update department");
      }
    } else {
      try {
        const department_id = generateDepartmentId();
        await axios.post("http://localhost:5000/departments/insert", {
          department_id,
          department_name: newDepartment,
        });
        setNewDepartment("");
        fetchDepartments();
        toast.success("✅ Department added successfully");
      } catch {
        toast.error("❌ Failed to add department");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/departments/delete?id=${id}`);
      fetchDepartments();
      toast.info("🗑️ Department deleted");
    } catch {
      toast.error("❌ Failed to delete department");
    }
  };

  const handleEdit = (dept) => {
    setEditId(dept.department_id);
    setEditName(dept.department_name);
  };

  const filteredDepartments = departments.filter((dept) =>
    dept.department_name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <ToastContainer position="top-right" autoClose={2500} />
      <h1 style={styles.title}>Department Management</h1>

      <InputSection
        editId={editId}
        editName={editName}
        setEditName={setEditName}
        newDepartment={newDepartment}
        setNewDepartment={setNewDepartment}
        handleAddOrUpdate={handleAddOrUpdate}
        searchText={searchText}
        setSearchText={setSearchText}
      />

      <DepartmentTable
        departments={filteredDepartments}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
};

const InputSection = ({
  editId,
  editName,
  setEditName,
  newDepartment,
  setNewDepartment,
  handleAddOrUpdate,
  searchText,
  setSearchText,
}) => {
  return (
    <>
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter Department Name"
          value={editId ? editName : newDepartment}
          onChange={(e) =>
            editId ? setEditName(e.target.value) : setNewDepartment(e.target.value)
          }
          style={styles.input}
        />
        <button onClick={handleAddOrUpdate} style={styles.addButton}>
          {editId ? "Update" : "Add Department"}
        </button>
      </div>

      <div style={{ ...styles.inputContainer, justifyContent: "center" }}>
        <input
          type="text"
          placeholder="Search by Name..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ ...styles.input, width: "350px" }}
        />
      </div>
    </>
  );
};

const DepartmentTable = ({ departments, handleEdit, handleDelete }) => {
  return (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Sr No.</th>
            <th style={styles.th}>Department Name</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept, index) => (
            <tr key={dept.department_id}>
              <td style={styles.td}>{index + 1}</td>
              <td style={styles.td}>{dept.department_name}</td>
              <td style={styles.td}>
                <button style={styles.tdButton} onClick={() => handleEdit(dept)}>
                  Edit
                </button>
                <button style={styles.tdButton} onClick={() => handleDelete(dept.department_id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0f1a, #1e1e2f, #2c2c3e)",
    padding: "40px",
    fontFamily: "'Poppins', sans-serif",
    color: "#fff",
  },
  title: {
    textAlign: "center",
    fontSize: "32px",
    color: "#00bcd4",
    marginBottom: "30px",
    fontWeight: "bold",
  },
  inputContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    width: "300px",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
    fontSize: "16px",
    background: "#222",
    color: "#fff",
  },
  addButton: {
    padding: "12px 20px",
    background: "linear-gradient(90deg, #00bcd4, #0097a7)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  tableWrapper: {
    overflowX: "auto",
    marginTop: "20px",
  },
  table: {
    width: "80%",
    margin: "auto",
    borderCollapse: "separate",
    borderSpacing: "0 10px",
    fontSize: "16px",
  },
  th: {
    background: "linear-gradient(90deg, #00bcd4, #0097a7)",
    color: "#fff",
    padding: "12px",
    textAlign: "center",
    fontWeight: "700",
    borderRadius: "8px",
  },
  td: {
    background: "#1e1e2f",
    color: "#fff",
    padding: "12px",
    textAlign: "center",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
  },
  tdButton: {
    background: "linear-gradient(90deg, #ff5252, #ff1744)",
    color: "#fff",
    padding: "6px 14px",
    margin: "0 5px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
};

export default DepartmentManagement;
