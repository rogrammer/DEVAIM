// src/pages/Todo.js
import React, { useState } from "react";
import Navbar from "../components/Navbar";

const Todo = () => {
  const [todos, setTodos] = useState([
    "Setup project repository",
    "Configure CI/CD pipeline",
    "Implement user authentication",
  ]);
  const [newTodo, setNewTodo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setTodos([...todos, newTodo]);
    setNewTodo("");
  };

  const handleRemoveTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>To-Do List</h1>
        <div id="todoContainer">
          <ul id="todoList">
            {todos.map((todo, index) => (
              <li key={index}>
                {todo}{" "}
                <span
                  className="remove-task"
                  onClick={() => handleRemoveTodo(index)}
                >
                  &times;
                </span>
              </li>
            ))}
          </ul>
          <form id="todoForm" onSubmit={handleSubmit}>
            <input
              type="text"
              id="todoInput"
              placeholder="Yeni görev ekle..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              required
            />
            <button type="submit" className="btn">
              Ekle
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Todo;
