import React, { useState } from "react";
import Navbar from "../components/Navbar";

const Todo = () => {
  const [todos, setTodos] = useState([
    "Setup project repository",
    "Configure CI/CD pipeline",
    "Implement user authentication",
  ]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setTodos([...todos, newTodo]);
    setNewTodo("");
  };

  const handleToggleComplete = (index) => {
    if (completedTodos.includes(index)) {
      setCompletedTodos(completedTodos.filter((i) => i !== index)); // Geri al
    } else {
      setCompletedTodos([...completedTodos, index]); // Tamamlandı olarak işaretle
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container2">
        <h1>To-Do List</h1>
        <div id="todoContainer">
          <ul id="todoList">
            {todos.map((todo, index) => (
              <li key={index} className={completedTodos.includes(index) ? "completed" : ""}>
                {todo}{" "}
                <span
                  className={`task-toggle ${completedTodos.includes(index) ? "completed-btn" : ""}`}
                  onClick={() => handleToggleComplete(index)}
                >
                  {completedTodos.includes(index) ? "✔" : "✖"}
                </span>
              </li>
            ))}
          </ul>
          <form id="todoForm" onSubmit={handleSubmit}>
            <input
              type="text"
              id="todoInput"
              placeholder="Add new todo"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              required
            />
            <button type="submit" className="btnpipe">
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Todo;
