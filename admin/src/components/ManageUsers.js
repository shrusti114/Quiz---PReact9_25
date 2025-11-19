import React, { useEffect, useState } from "react";
import axios from "axios";

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
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    width: "250px",
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
    width: "90%",
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
  },
  editButton: {
    background: "linear-gradient(90deg, #00e676, #00c853)",
  },
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    studentId: "",
    username: "",
    email: "",
    collegeName: "",
    degree: "",
    password: "",
  });
  const [editingUserId, setEditingUserId] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/Users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch next student ID for form
  const fetchNextId = async () => {
    try {
      const res = await axios.get("http://localhost:5000/Users/nextId");
      setFormData((prev) => ({ ...prev, studentId: res.data.nextId }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchNextId();
  }, []);

  // Submit (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingUserId) {
        await axios.put(`http://localhost:5000/Users/${editingUserId}`, formData);
        setEditingUserId(null);
      } else {
        await axios.post("http://localhost:5000/Users/register", formData);
      }

      setFormData({
        studentId: "",
        username: "",
        email: "",
        collegeName: "",
        degree: "",
        password: "",
      });

      fetchUsers();
      fetchNextId();
    } catch (err) {
      console.log(err);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/Users/${id}`);
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setFormData({
      studentId: user.studentId,
      username: user.username,
      email: user.email,
      collegeName: user.collegeName,
      degree: user.degree,
      password: "",
    });
  };

  // Search filter
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Manage Users</h2>

      {/* Search */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Search by Email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={styles.inputContainer}>
        <input type="text" value={formData.studentId} readOnly style={styles.input} />

        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          required
          style={styles.input}
        />

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
          style={styles.input}
        />

        <input
          type="text"
          placeholder="College Name"
          value={formData.collegeName}
          onChange={(e) =>
            setFormData({ ...formData, collegeName: e.target.value })
          }
          required
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Degree"
          value={formData.degree}
          onChange={(e) =>
            setFormData({ ...formData, degree: e.target.value })
          }
          required
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required={!editingUserId}
          style={styles.input}
        />

        <button type="submit" style={styles.addButton}>
          {editingUserId ? "Update User" : "Add User"}
        </button>
      </form>

      {/* Table */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Sr No</th>
              <th style={styles.th}>Username</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>College</th>
              <th style={styles.th}>Degree</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user._id}>
                <td style={styles.td}>{index + 1}</td> {/* Serial Number */}
                <td style={styles.td}>{user.username}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>{user.collegeName}</td>
                <td style={styles.td}>{user.degree}</td>

                <td style={styles.td}>
                  <button
                    onClick={() => handleEdit(user)}
                    style={{ ...styles.tdButton, ...styles.editButton }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(user._id)}
                    style={styles.tdButton}
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

export default ManageUsers;
