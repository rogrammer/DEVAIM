import React, { useState, useEffect } from "react"; 
import Navbar from "../components/Navbar";
import '@fortawesome/fontawesome-free/css/all.min.css';

const Tasks = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // To track the type of modal
  const [editingTask, setEditingTask] = useState(null); // To track the task being edited

  const [newTask, setNewTask] = useState({
    taskName: "",
    responsible: "",
    duration: "",
    department: "",
  });

  const [previousTasks, setPreviousTasks] = useState([
    { taskName: "Example Task 1", responsible: "Arda", duration: "2 Weeks" },
    { taskName: "Example Task 2", responsible: "Ayşe", duration: "1 Week" },
  ]);

  const [tasksToDoNow, setTasksToDoNow] = useState([
    { taskName: "Website", responsible: "John", department: "DB, Backend, Frontend" },
  ]);

  const [futureTasks, setFutureTasks] = useState([
    { taskName: "Example Task 3", department: "Backend, Ops", duration: "3 Weeks" },
  ]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewTask({ ...newTask, [id]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (editingTask) {
      const updatedTask = { ...newTask };
  
      if (editingTask.table === "previous") {
        setPreviousTasks(previousTasks.map(task => 
          task.taskName === editingTask.taskName ? updatedTask : task
        ));
      } else if (editingTask.table === "now") {
        setTasksToDoNow(tasksToDoNow.map(task => 
          task.taskName === editingTask.taskName ? updatedTask : task
        ));
      } else if (editingTask.table === "future") {
        setFutureTasks(futureTasks.map(task => 
          task.taskName === editingTask.taskName ? updatedTask : task
        ));
      }
    } else {
      if (modalType === 1) setPreviousTasks([...previousTasks, newTask]);
      if (modalType === 2) setTasksToDoNow([...tasksToDoNow, newTask]);
      if (modalType === 3) setFutureTasks([...futureTasks, newTask]);
    }
  
    setShowModal(false); 
    setEditingTask(null); 
  };
  

  // Edit task
  const editTask = (task, table) => {
    setEditingTask({ ...task, table }); 
    setNewTask({ ...task }); 
    setShowModal(true);
    setModalType(table === "previous" ? 1 : table === "now" ? 2 : 3);
  };
  

  // Move task between tables
  const moveTask = (task, fromTable, toTable) => {
    if (fromTable === "previous") {
      setPreviousTasks(previousTasks.filter((t) => t !== task));
    } else if (fromTable === "now") {
      setTasksToDoNow(tasksToDoNow.filter((t) => t !== task));
    } else if (fromTable === "future") {
      setFutureTasks(futureTasks.filter((t) => t !== task));
    }

    if (toTable === "previous") {
      setPreviousTasks([...previousTasks, task]);
    } else if (toTable === "now") {
      setTasksToDoNow([...tasksToDoNow, task]);
    } else if (toTable === "future") {
      setFutureTasks([...futureTasks, task]);
    }
  };

  // Delete task
  const deleteTask = (task, table) => {
    if (table === "previous") {
      setPreviousTasks(previousTasks.filter((t) => t !== task));
    } else if (table === "now") {
      setTasksToDoNow(tasksToDoNow.filter((t) => t !== task));
    } else if (table === "future") {
      setFutureTasks(futureTasks.filter((t) => t !== task));
    }
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
      <Navbar />
      <div className="container tasks-container">
        {/* Previous Tasks Table */}
        <div className="task-table">
          <h2>Previous Tasks</h2>
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Responsible</th>
                <th>Duration</th>
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
                    <button className="btnnow" onClick={() => moveTask(task, "previous", "now")}>Move to Now</button>
                    <button className="btnfut" onClick={() => moveTask(task, "previous", "future")}>Move to Future</button>
                    <button className="btndel" onClick={() => deleteTask(task, "previous")}>
                      <i className="fa fa-trash"></i>
                    </button>
                    <button className="btned" onClick={() => editTask(task, "previous")}>
                      <i className="fa fa-pencil-alt"></i> {/* Pencil icon for editing */}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn" onClick={() => { setShowModal(true); setModalType(1); }}>
          Add Previous Task
        </button>

        {/* Tasks to Do Now Table */}
        <div className="task-table">
          <h2>Tasks to Be Done Now</h2>
          <table className="tasks-table">
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
                    <button className="btnprev" onClick={() => moveTask(task, "now", "previous")}>Move to Prev</button>
                    <button className="btnfut" onClick={() => moveTask(task, "now", "future")}>Move to Future</button>
                    <button className="btndel" onClick={() => deleteTask(task, "now")}>
                      <i className="fa fa-trash"></i>
                    </button>
                    <button className="btned" onClick={() => editTask(task, "now")}>
                      <i className="fa fa-pencil-alt"></i> {/* Pencil icon for editing */}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn" onClick={() => { setShowModal(true); setModalType(2); }}>
          Add New Task
        </button>

        {/* Future Tasks Table */}
        <div className="task-table">
          <h2>Future Tasks</h2>
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Departments</th>
                <th>Duration</th>
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
                    <button className="btnprev" onClick={() => moveTask(task, "future", "previous")}>Move to Prev</button>
                    <button className="btnnow" onClick={() => moveTask(task, "future", "now")}>Move to Now</button>
                    <button className="btndel" onClick={() => deleteTask(task, "future")}>
                      <i className="fa fa-trash"></i>
                    </button>
                    <button className="btned" onClick={() => editTask(task, "future")}>
                      <i className="fa fa-pencil-alt"></i> {/* Pencil icon for editing */}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn" onClick={() => { setShowModal(true); setModalType(3); }}>
          Add Future Task
        </button>
      </div>

      {/* Modal for Adding or Editing a Task */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            {modalType === 1 && <h2>{editingTask ? "Edit Previous Task" : "Add Previous Task"}</h2>}
            {modalType === 2 && <h2>{editingTask ? "Edit Task with Details" : "Add Task with Details"}</h2>}
            {modalType === 3 && <h2>{editingTask ? "Edit Task with Duration and Details" : "Add Task with Duration and Details"}</h2>}

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
                  type="text"
                  id="duration"
                  placeholder="Duration (e.g., 3 Weeks)"
                  value={newTask.duration}
                  onChange={handleInputChange}
                  required
                />
              )}
              <button type="submit" className="btnsave">
                {editingTask ? "Save Changes" : "Add"}
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

export default Tasks;
