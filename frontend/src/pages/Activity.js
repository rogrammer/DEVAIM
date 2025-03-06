import React, { useState, useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/ActivityModern.css"; // Import the new CSS file

Chart.register(...registerables);

const Activity = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskStatus, setTaskStatus] = useState(null);
  const [tasks, setTasks] = useState(() =>
    Array.from({ length: 10 }, (_, i) => ({
      name: `Task ${i + 1}`,
      branches: [`main`, `feature-${i + 1}`],
      progress: Math.floor(Math.random() * 101),
    }))
  );
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!selectedTask) return;

    const task = tasks.find((t) => t.name === selectedTask);
    const isCompleted = task.progress === 100;

    setTaskStatus({
      status: isCompleted ? "Completed" : "In Progress",
      progress: task.progress,
      branches: task.branches, // Ensure branches are passed correctly
    });

    const ctx = chartRef.current.getContext("2d");

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Completed", "Remaining"],
        datasets: [
          {
            label: "Task Progress",
            data: [task.progress, 100 - task.progress],
            backgroundColor: ["#34D399", "#F87171"],
            borderColor: ["#34D399", "#F87171"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true, max: 100 },
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
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
      if (event.key === "Escape") closeModal();
    };
    if (selectedTask) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedTask]);

  const handleDelete = (taskName) => {
    const updatedTasks = tasks.filter((task) => task.name !== taskName);
    setTasks(updatedTasks);
    setSelectedTask(null);
  };

  return (
    <div className="activity-wrapper">
      <div className="activity-container">
        <h1 className="activity-title">Activity Dashboard</h1>
        <p className="activity-subtitle">
          Select a task to view detailed insights.
        </p>

        <div className="tasks-grid">
          {tasks.map((task) => (
            <button
              key={task.name}
              onClick={() => setSelectedTask(task.name)}
              className="task-card"
            >
              <span>{task.name}</span>
              <span className="task-progress">{task.progress}%</span>
            </button>
          ))}
        </div>

        <div className="task-table-container">
          <table className="modern-task-table">
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
                  <td>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                    {task.progress}%
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(task.name)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTask && (
        <div className="modern-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedTask} Details</h3>
              <button className="modal-close-btn" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <p>
                Branches: <strong>{taskStatus?.branches?.join(", ")}</strong>
              </p>
              <p>
                Status:{" "}
                <span
                  className={`status-${taskStatus?.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {taskStatus?.status}
                </span>
              </p>
              <p>Progress: {taskStatus?.progress}%</p>
              <div className="chart-container">
                <canvas ref={chartRef} id="barChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activity;
