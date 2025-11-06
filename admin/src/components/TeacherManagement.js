import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";

const teacherSchema = yup.object().shape({
  teacherName: yup.string().required("Teacher name is required"),
  teacherEmail: yup.string().email().required("Email is required"),
  teacherPassword: yup.string().required("Password is required"),
  department_id: yup.string().required("Department is required"),
});

const TeacherRegister = () => {
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [teacherName, setTeacherName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [searchText, setSearchText] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchDepartments();
    fetchTeachers();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/departments/display");
      setDepartments(res.data);
    } catch {
      toast.error("Failed to fetch departments");
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/teachers/display");
      setTeachers(res.data);
    } catch {
      toast.error("Failed to fetch teachers");
    }
  };

  const handleAddOrUpdate = async () => {
    try {
      await teacherSchema.validate(
        {
          teacherName,
          teacherEmail,
          teacherPassword,
          department_id: selectedDept,
        },
        { abortEarly: false }
      );

      if (editId) {
        await axios.put("http://localhost:5000/teachers/update", {
          teacher_id: editId,
          teacherName,
          teacherEmail,
          teacherPassword,
          department_id: selectedDept,
        });
        toast.success("Teacher updated successfully");
      } else {
        await axios.post("http://localhost:5000/teachers/insert", {
          teacherName,
          teacherEmail,
          teacherPassword,
          department_id: selectedDept,
        });
        toast.success("Teacher registered successfully");
      }

      setEditId(null);
      setTeacherName("");
      setTeacherEmail("");
      setTeacherPassword("");
      setSelectedDept("");
      fetchTeachers();
    } catch (err) {
      if (err.inner) err.inner.forEach((e) => toast.warning(e.message));
      else toast.error("Failed to save teacher");
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/teachers/delete?id=${id}`);
    toast.info("Teacher deleted");
    fetchTeachers();
  };

  const handleEdit = (teacher) => {
    setEditId(teacher.teacher_id);
    setTeacherName(teacher.teacherName);
    setTeacherEmail(teacher.teacherEmail);
    setTeacherPassword(teacher.teacherPassword);
    setSelectedDept(teacher.department_id);
  };

  const filteredTeachers = teachers.filter((t, index) => {
    const srNo = String(index + 1);
    return (
      t.teacherName.toLowerCase().includes(searchText.toLowerCase()) ||
      t.teacherEmail.toLowerCase().includes(searchText.toLowerCase()) ||
      srNo.includes(searchText)
    );
  });

  return (
    <div style={styles.container}>
      <ToastContainer position="top-right" autoClose={2500} />
      <h1 style={styles.title}>Teacher Register</h1>

      <div style={styles.inputContainer}>
        <input
          placeholder="Teacher Name"
          value={teacherName}
          onChange={(e) => setTeacherName(e.target.value)}
          style={styles.input}
        />
        <input
          type="email"
          placeholder="Email"
          value={teacherEmail}
          onChange={(e) => setTeacherEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={teacherPassword}
          onChange={(e) => setTeacherPassword(e.target.value)}
          style={styles.input}
        />
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          style={styles.select}
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.department_id} value={d.department_id}>
              {d.department_name}
            </option>
          ))}
        </select>
        <button onClick={handleAddOrUpdate} style={styles.addButton}>
          {editId ? "Update" : "Register"}
        </button>
      </div>

      <div style={styles.inputContainer}>
        <input
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ ...styles.input, width: "300px" }}
        />
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Sr No.</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Department</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.map((t, i) => (
              <tr key={t.teacher_id} style={styles.tr}>
                <td style={styles.td}>{i + 1}</td>
                <td style={styles.td}>{t.teacherName}</td>
                <td style={styles.td}>{t.teacherEmail}</td>
                <td style={styles.td}>
                  {departments.find((d) => d.department_id === t.department_id)
                    ?.department_name || "-"}
                </td>
                <td style={styles.td}>
                  <button style={styles.editBtn} onClick={() => handleEdit(t)}>
                    Edit
                  </button>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(t.teacher_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
    flexWrap: "wrap",
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
    width: "200px",
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
    marginTop: "30px",
  },

  // ✅ Updated spacing between columns and rows
  table: {
    width: "90%",
    margin: "auto",
    borderCollapse: "separate",
    borderSpacing: "20px 15px", // <== space between columns (20px) and rows (15px)
    textAlign: "center",
  },

  th: {
    background: "linear-gradient(90deg, #00bcd4, #0097a7)",
    color: "#fff",
    padding: "15px",
    textAlign: "center",
    fontSize: "18px",
    borderRadius: "10px",
  },
  tr: {
    transition: "transform 0.2s ease, background 0.2s ease",
  },
  td: {
    background: "#1e1e2f",
    color: "#fff",
    padding: "16px 25px", // ✅ extra padding for inner spacing
    textAlign: "center",
    fontSize: "16px",
    borderRadius: "10px",
    boxShadow: "0 3px 8px rgba(0,0,0,0.4)",
  },
  editBtn: {
    background: "linear-gradient(90deg, #4caf50, #388e3c)",
    color: "#fff",
    padding: "6px 14px",
    margin: "0 5px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  },
  deleteBtn: {
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

export default TeacherRegister;
