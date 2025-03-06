import React, { useState, useEffect } from "react";

const Members = () => {
  const [users, setUsers] = useState([
    { name: "Arda", department: "Backend", experience: "3 Year" },
    { name: "Ayşe", department: "Frontend", experience: "2 Year" },
    { name: "Mehmet", department: "DevOps", experience: "4 Year" },
    { name: "Elif", department: "QA", experience: "1 Year" },
    { name: "Can", department: "Ops", experience: "5 Year" },
  ]);

  const [newUser, setNewUser] = useState({
    name: "",
    department: "",
    experience: "",
  });

  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [editingUser, setEditingUser] = useState(null); // State to track the user being edited

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewUser({ ...newUser, [id]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      // Edit existing user
      const updatedUsers = users.map((user) =>
        user === editingUser ? newUser : user
      );
      setUsers(updatedUsers);
    } else {
      // Add new user
      setUsers([...users, newUser]);
    }
    setNewUser({ name: "", department: "", experience: "" });
    setShowModal(false); // Close the modal after submission
    setEditingUser(null); // Reset the editing user
  };

  // Handle deleting a user
  const handleDelete = (user) => {
    setUsers(users.filter((u) => u !== user));
  };

  // Handle editing a user
  const handleEdit = (user) => {
    setEditingUser(user);
    setNewUser({ ...user }); // Pre-fill the form with the current user data
    setShowModal(true); // Open the modal
  };

  // Close modal when ESC key is pressed
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowModal(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div>
      <div className="container">
        <h1>Members</h1>
        <h2>Registered Users</h2>
        <div className="task-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Experience</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.department}</td>
                  <td>{user.experience}</td>
                  <td>
                    <button className="btned" onClick={() => handleEdit(user)}>
                      <i className="fas fa-pen"></i> {/* Pen icon */}
                    </button>
                    <button
                      className="btndel"
                      onClick={() => handleDelete(user)}
                    >
                      <i className="fas fa-trash-alt"></i> {/* Trash icon */}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* "Add User" Button with space */}
        <div style={{ marginTop: "20px" }}>
          <button className="btn" onClick={() => setShowModal(true)}>
            Add User
          </button>
        </div>
      </div>

      {/* Modal for Adding or Editing a User */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingUser ? "Edit User" : "Add New User"}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                id="name"
                placeholder="Name"
                value={newUser.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                id="department"
                placeholder="Department"
                value={newUser.department}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                id="experience"
                placeholder="Experience (e.g., 3 Year)"
                value={newUser.experience}
                onChange={handleInputChange}
                required
              />
              <button type="submit" className="btnsave">
                {editingUser ? "Save Changes" : "Add"}
              </button>
              <button
                type="button"
                className="btncls"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
