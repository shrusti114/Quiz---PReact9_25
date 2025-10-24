import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SubjectManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [searchText, setSearchText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    fetchDepartments();
    fetchSubjects();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/departments/display");
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to fetch departments");
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/subjects/display");
      setSubjects(res.data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to fetch subjects");
    }
  };

  const handleAddOrUpdate = async () => {
    const subjectName = editId ? editName : newSubject;
    if (!subjectName.trim() || !selectedDept) return;

    try {
      if (editId) {
        // UPDATE subject
        await axios.put("http://localhost:5000/subjects/update", {
          subject_id: editId,
          subject_name: subjectName,
          department_id: selectedDept,
        });
        toast.success("✅ Subject updated successfully");
      } else {
        // ADD new subject
        const lastSubject = subjects[subjects.length - 1];
        const lastNum = lastSubject
          ? parseInt(lastSubject.subject_id.slice(1)) || 0
          : 0;
        const newSubjectId = "S" + String(lastNum + 1).padStart(3, "0");

        await axios.post("http://localhost:5000/subjects/insert", {
          subject_id: newSubjectId,
          subject_name: subjectName,
          department_id: selectedDept,
        });
        toast.success("✅ Subject added successfully");
      }

      // Reset form
      setEditId(null);
      setEditName("");
      setNewSubject("");
      setSelectedDept("");
      fetchSubjects();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to save subject");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/subjects/delete?id=${id}`);
      fetchSubjects();
      toast.info("🗑️ Subject deleted");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete subject");
    }
  };

  const handleEdit = (subj) => {
    setEditId(subj.subject_id);
    setEditName(subj.subject_name);
    setSelectedDept(subj.department_id);
  };

  const filteredSubjects = subjects.filter((subj, index) => {
    const srNo = String(index + 1);
    return (
      subj.subject_name.toLowerCase().includes(searchText.toLowerCase()) ||
      srNo.includes(searchText)
    );
  });

  return (
    <div style={styles.container}>
      <ToastContainer position="top-right" autoClose={2500} />
      <h1 style={styles.title}>Subject Management</h1>

      <InputSection
        editId={editId}
        editName={editName}
        setEditName={setEditName}
        newSubject={newSubject}
        setNewSubject={setNewSubject}
        selectedDept={selectedDept}
        setSelectedDept={setSelectedDept}
        handleAddOrUpdate={handleAddOrUpdate}
        searchText={searchText}
        setSearchText={setSearchText}
        departments={departments}
      />

      <SubjectTable
        subjects={filteredSubjects}
        departments={departments}
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
  newSubject,
  setNewSubject,
  selectedDept,
  setSelectedDept,
  handleAddOrUpdate,
  searchText,
  setSearchText,
  departments,
}) => (
  <>
    <div style={styles.inputContainer}>
      <select
        value={selectedDept}
        onChange={(e) => setSelectedDept(e.target.value)}
        style={styles.select}
      >
        <option value="">Select Department</option>
        {departments.map((dept) => (
          <option key={dept.department_id} value={dept.department_id}>
            {dept.department_name}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Enter Subject Name"
        value={editId ? editName : newSubject}
        onChange={(e) =>
          editId ? setEditName(e.target.value) : setNewSubject(e.target.value)
        }
        style={styles.input}
      />
      <button onClick={handleAddOrUpdate} style={styles.addButton}>
        {editId ? "Update" : "Add Subject"}
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

const SubjectTable = ({ subjects, departments, handleEdit, handleDelete }) => (
  <div style={styles.tableWrapper}>
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Sr No.</th>
          <th style={styles.th}>Subject Name</th>
          <th style={styles.th}>Department</th>
          <th style={styles.th}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {subjects.map((subj, index) => (
          <tr key={subj.subject_id}>
            <td style={styles.td}>{index + 1}</td>
            <td style={styles.td}>{subj.subject_name}</td>
            <td style={styles.td}>
              {
                departments.find((d) => d.department_id === subj.department_id)
                  ?.department_name
              }
            </td>
            <td style={styles.td}>
              <button style={styles.tdButton} onClick={() => handleEdit(subj)}>
                Edit
              </button>
              <button
                style={styles.tdButton}
                onClick={() => handleDelete(subj.subject_id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

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
  select: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
    background: "#222",
    color: "#fff",
    fontSize: "16px",
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
  },
};

export default SubjectManagement;
