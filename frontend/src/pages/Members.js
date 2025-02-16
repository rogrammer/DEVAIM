// src/pages/Members.js
import React, { useState } from "react";
import Navbar from "../components/Navbar";

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

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewUser({ ...newUser, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUsers([...users, newUser]);
    setNewUser({ name: "", department: "", experience: "" });
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Members</h1>
        <h2>Kayıtlı Kullanıcılar</h2>
        <ul id="userList">
          {users.map((user, index) => (
            <li key={index}>
              {user.name} - {user.department} - {user.experience}
            </li>
          ))}
        </ul>
        <h2>Yeni Kullanıcı Ekle</h2>
        <form id="addUserForm" onSubmit={handleSubmit}>
          <input
            type="text"
            id="name"
            placeholder="İsim"
            value={newUser.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            id="department"
            placeholder="Bölüm"
            value={newUser.department}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            id="experience"
            placeholder="Deneyim (örneğin 3 Year)"
            value={newUser.experience}
            onChange={handleInputChange}
            required
          />
          <button type="submit" className="btn">
            Kullanıcı Ekle
          </button>
        </form>
      </div>
    </div>
  );
};

export default Members;
