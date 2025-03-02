import React, { useState, useRef, useEffect } from "react"; // Removed 'useMemo'
import { Chart, registerables } from "chart.js";
import '@fortawesome/fontawesome-free/css/all.min.css';

Chart.register(...registerables);

const Activity = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskStatus, setTaskStatus] = useState(null);
  const [tasks, setTasks] = useState(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      name: `Task ${i + 1}`,
      branches: [`main`, `feature-${i + 1}`],
      progress: Math.floor(Math.random() * 101), // Random progress between 0 and 100
    }));
  });
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!selectedTask) return;

    const task = tasks.find((t) => t.name === selectedTask);
    const isCompleted = task.progress === 100;

    setTaskStatus({
      status: isCompleted ? "Completed" : "In Progress",
      progress: task.progress,
    });

    const ctx = chartRef.current.getContext("2d");

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Completed", "In Progress"],
        datasets: [
          {
            label: "Task Progress",
            data: [isCompleted ? 100 : task.progress, isCompleted ? 0 : 100 - task.progress],
            backgroundColor: ["#36A2EB", "#FF6384"],
            borderColor: ["#36A2EB", "#FF6384"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [selectedTask, tasks]);

  const closeModal = () => setSelectedTask(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    if (selectedTask) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedTask]);

  const handleDelete = (taskName) => {
    const updatedTasks = tasks.filter((task) => task.name !== taskName);
    setTasks(updatedTasks);
    setSelectedTask(null); // Close modal if the task is deleted
  };

  return (
    <div>
      <div className="navbar">
        <a href="/" className="nav-btn">Home</a>
        <a href="/members" className="nav-btn">Members</a>
        <a href="/activity" className="nav-btn active">Activity</a>
        <a href="/tasks" className="nav-btn">Tasks</a>
        <a href="/merge-request" className="nav-btn">Merge Requests</a>
        <a href="/todo" className="nav-btn">To-Do List</a>
        <a href="/monitoring" className="nav-btn">Monitoring</a>
        <a href="/cicd" className="nav-btn">CI/CD</a>
      </div>

      <div className="container">
        <h1>Activity</h1>
        <p>Click on a task name to view details.</p>

        <div id="tasksContainer">
          {tasks.map((task) => (
            <button
              key={task.name}
              onClick={() => setSelectedTask(task.name)}
              className="act-btn"
            >
              {task.name}
            </button>
          ))}
        </div>

        {/* Display task details in a table */}
        <div className="task-table">
          <table>
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Branches</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.name}>
                  <td>{task.name}</td>
                  <td>{task.branches.join(", ")}</td>
                  <td>{task.progress}%</td>
                  <td>
                    <button className="btndel" onClick={() => handleDelete(task.name)}>
                      <i className="fas fa-trash-alt"></i> {/* Trash icon for deletion */}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Task Details */}
      {selectedTask && (
        <div className="modal">
          <div className="modal-content">
            <h3>
              Details for {selectedTask}
              <button className="close-btn" onClick={closeModal}>
                X
              </button>
            </h3>
            <div className="task-info">
              <p>
                This task involves working on the following branches: {taskStatus?.branches?.join(", ")}.
                The task is {taskStatus?.status}.
              </p>
              <p>
                The progress for this task is currently at {taskStatus?.progress}%.
                It is crucial to complete this task for project deadlines.
              </p>
            </div>
            <div className="task-status">
              <p>Status: {taskStatus?.status}</p>
              <p>Progress: {taskStatus?.progress}%</p>
            </div>
            <div className="task-chart">
              <canvas ref={chartRef} id="barChart" width="100" height="100"></canvas>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activity;
