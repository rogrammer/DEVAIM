import React, { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/TasksModern.css";

const Tasks = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // For delete confirmation

  const [newTask, setNewTask] = useState({
    taskName: "",
    responsible: "",
    duration: "",
    department: "",
  });

  const [previousTasks, setPreviousTasks] = useState([
    { taskName: "Example Task 1", responsible: "Arda", duration: "48" }, // Duration in hours
    { taskName: "Example Task 2", responsible: "Ayşe", duration: "24" },
  ]);

  const [tasksToDoNow, setTasksToDoNow] = useState([
    {
      taskName: "Website",
      responsible: "John",
      department: "DB, Backend, Frontend",
    },
  ]);

  const [futureTasks, setFutureTasks] = useState([
    { taskName: "Example Task 3", department: "Backend, Ops", duration: "72" },
  ]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewTask({ ...newTask, [id]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedTask = { ...newTask };

    if (editingTask) {
      if (editingTask.table === "previous") {
        setPreviousTasks(
          previousTasks.map((task) =>
            task.taskName === editingTask.taskName ? updatedTask : task
          )
        );
      } else if (editingTask.table === "now") {
        setTasksToDoNow(
          tasksToDoNow.map((task) =>
            task.taskName === editingTask.taskName ? updatedTask : task
          )
        );
      } else if (editingTask.table === "future") {
        setFutureTasks(
          futureTasks.map((task) =>
            task.taskName === editingTask.taskName ? updatedTask : task
          )
        );
      }
    } else {
      if (modalType === 1) setPreviousTasks([...previousTasks, updatedTask]);
      if (modalType === 2) setTasksToDoNow([...tasksToDoNow, updatedTask]);
      if (modalType === 3) setFutureTasks([...futureTasks, updatedTask]);
    }

    setShowModal(false);
    setEditingTask(null);
    setNewTask({ taskName: "", responsible: "", duration: "", department: "" });
  };

  // Edit task
  const editTask = (task, table) => {
    setEditingTask({ ...task, table });
    setNewTask({ ...task });
    setShowModal(true);
    setModalType(table === "previous" ? 1 : table === "now" ? 2 : 3);
  };

  // Move task with proper field handling
  const moveTask = (task, fromTable, toTable) => {
    const updatedTask = { ...task };
    if (toTable === "now" && !updatedTask.responsible)
      updatedTask.responsible = "Unassigned";
    if (toTable === "future" && !updatedTask.duration)
      updatedTask.duration = "TBD";
    if (toTable === "previous" && !updatedTask.duration)
      updatedTask.duration = "Completed";

    if (fromTable === "previous") {
      setPreviousTasks(previousTasks.filter((t) => t !== task));
    } else if (fromTable === "now") {
      setTasksToDoNow(tasksToDoNow.filter((t) => t !== task));
    } else if (fromTable === "future") {
      setFutureTasks(futureTasks.filter((t) => t !== task));
    }

    if (toTable === "previous") {
      setPreviousTasks([...previousTasks, updatedTask]);
    } else if (toTable === "now") {
      setTasksToDoNow([...tasksToDoNow, updatedTask]);
    } else if (toTable === "future") {
      setFutureTasks([...futureTasks, updatedTask]);
    }
  };

  // Delete task with confirmation
  const deleteTask = (task, table) => {
    setDeleteConfirm({ task, table });
  };

  const confirmDelete = () => {
    const { task, table } = deleteConfirm;
    if (table === "previous") {
      setPreviousTasks(previousTasks.filter((t) => t !== task));
    } else if (table === "now") {
      setTasksToDoNow(tasksToDoNow.filter((t) => t !== task));
    } else if (table === "future") {
      setFutureTasks(futureTasks.filter((t) => t !== task));
    }
    setDeleteConfirm(null);
  };

  // Close modal on ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowModal(false);
        setDeleteConfirm(null);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="tasks-wrapper">
      <div className="tasks-container">
        {/* Previous Tasks Table */}
        <div className="task-section">
          <h2 className="section-title">Previous Tasks</h2>
          <table className="modern-tasks-table">
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Responsible</th>
                <th>Duration (hrs)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {previousTasks.map((task, index) => (
                <tr key={index}>
                  <td>{task.taskName}</td>
                  <td>{task.responsible}</td>
                  <td>{task.duration}</td>
                  <td>
                    <button
                      className="move-btn now"
                      onClick={() => moveTask(task, "previous", "now")}
                    >
                      <i className="fas fa-arrow-right"></i> Now
                    </button>
                    <button
                      className="move-btn future"
                      onClick={() => moveTask(task, "previous", "future")}
                    >
                      <i className="fas fa-arrow-right"></i> Future
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(task, "previous")}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => editTask(task, "previous")}
                    >
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="add-btn"
            onClick={() => {
              setShowModal(true);
              setModalType(1);
            }}
          >
            <i className="fas fa-plus"></i> Add Previous Task
          </button>
        </div>

        {/* Tasks to Do Now Table */}
        <div className="task-section">
          <h2 className="section-title">Tasks to Be Done Now</h2>
          <table className="modern-tasks-table">
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Responsible</th>
                <th>Departments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasksToDoNow.map((task, index) => (
                <tr key={index}>
                  <td>{task.taskName}</td>
                  <td>{task.responsible}</td>
                  <td>{task.department}</td>
                  <td>
                    <button
                      className="move-btn previous"
                      onClick={() => moveTask(task, "now", "previous")}
                    >
                      <i className="fas fa-arrow-left"></i> Prev
                    </button>
                    <button
                      className="move-btn future"
                      onClick={() => moveTask(task, "now", "future")}
                    >
                      <i className="fas fa-arrow-right"></i> Future
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(task, "now")}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => editTask(task, "now")}
                    >
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="add-btn"
            onClick={() => {
              setShowModal(true);
              setModalType(2);
            }}
          >
            <i className="fas fa-plus"></i> Add New Task
          </button>
        </div>

        {/* Future Tasks Table */}
        <div className="task-section">
          <h2 className="section-title">Future Tasks</h2>
          <table className="modern-tasks-table">
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Departments</th>
                <th>Duration (hrs)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {futureTasks.map((task, index) => (
                <tr key={index}>
                  <td>{task.taskName}</td>
                  <td>{task.department}</td>
                  <td>{task.duration}</td>
                  <td>
                    <button
                      className="move-btn previous"
                      onClick={() => moveTask(task, "future", "previous")}
                    >
                      <i className="fas fa-arrow-left"></i> Prev
                    </button>
                    <button
                      className="move-btn now"
                      onClick={() => moveTask(task, "future", "now")}
                    >
                      <i className="fas fa-arrow-right"></i> Now
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(task, "future")}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => editTask(task, "future")}
                    >
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="add-btn"
            onClick={() => {
              setShowModal(true);
              setModalType(3);
            }}
          >
            <i className="fas fa-plus"></i> Add Future Task
          </button>
        </div>
      </div>

      {/* Modal for Adding or Editing a Task */}
      {showModal && (
        <div className="modern-modal">
          <div className="modal-content">
            <h2 className="modal-title">
              {modalType === 1 &&
                (editingTask ? "Edit Previous Task" : "Add Previous Task")}
              {modalType === 2 &&
                (editingTask ? "Edit Current Task" : "Add Current Task")}
              {modalType === 3 &&
                (editingTask ? "Edit Future Task" : "Add Future Task")}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                id="taskName"
                placeholder="Task Name"
                value={newTask.taskName}
                onChange={handleInputChange}
                required
              />
              {modalType !== 3 && (
                <input
                  type="text"
                  id="responsible"
                  placeholder="Responsible Person"
                  value={newTask.responsible}
                  onChange={handleInputChange}
                  required
                />
              )}
              {modalType !== 1 && (
                <input
                  type="text"
                  id="department"
                  placeholder="Departments (e.g., Backend, DB)"
                  value={newTask.department}
                  onChange={handleInputChange}
                  required
                />
              )}
              {modalType !== 2 && (
                <input
                  type="number"
                  id="duration"
                  placeholder="Duration (hours)"
                  value={newTask.duration}
                  onChange={handleInputChange}
                  required
                  min="1"
                />
              )}
              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  {editingTask ? "Save Changes" : "Add Task"}
                </button>
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modern-modal">
          <div className="modal-content">
            <h2 className="modal-title">Confirm Deletion</h2>
            <p>
              Are you sure you want to delete "{deleteConfirm.task.taskName}"?
            </p>
            <div className="modal-actions">
              <button className="delete-confirm-btn" onClick={confirmDelete}>
                Yes, Delete
              </button>
              <button
                className="close-btn"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
