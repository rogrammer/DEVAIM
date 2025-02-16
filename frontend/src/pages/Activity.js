import React, { useState, useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const Activity = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!selectedTask) return; // Eğer görev seçilmemişse grafik oluşturma

    const ctx = chartRef.current.getContext("2d");

    // Önceki grafik varsa yok et
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Yeni grafik oluştur
    chartInstance.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Yapıldı", "Kalan"],
        datasets: [
          {
            data: [50, 50],
            backgroundColor: ["#36A2EB", "#FF6384"],
          },
        ],
      },
      options: {
        animation: {
          duration: 1000,
        },
      },
    });

    // Cleanup function: Bileşen unmount edilirse grafiği yok et
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [selectedTask]); // selectedTask değiştiğinde grafik güncellenir

  return (
    <div>
      <div className="navbar">
        <a href="/" className="nav-btn">
          Ana Sayfa
        </a>
        <a href="/members" className="nav-btn">
          Members
        </a>
        <a href="/activity" className="nav-btn active">
          Activity
        </a>
        <a href="/tasks" className="nav-btn">
          Tasks
        </a>
        <a href="/merge-request" className="nav-btn">
          Merge Requests
        </a>
        <a href="/todo" className="nav-btn">
          To-Do List
        </a>
        <a href="/monitoring" className="nav-btn">
          Monitoring
        </a>
        <a href="/cicd" className="nav-btn">
          CI/CD
        </a>
      </div>

      <div className="container">
        <h1>Activity</h1>
        <p>Örnek işler:</p>
        <div id="tasksContainer">
          <button
            onClick={() => setSelectedTask("Task 1")}
            className="task-btn"
          >
            Task 1
          </button>
          <button
            onClick={() => setSelectedTask("Task 2")}
            className="task-btn"
          >
            Task 2
          </button>
          <button
            onClick={() => setSelectedTask("Task 3")}
            className="task-btn"
          >
            Task 3
          </button>
        </div>

        {selectedTask && (
          <div id="selectedTaskContainer">
            <h3>{selectedTask} detayları</h3>
            <p>İlerleme durumu: %50</p>
            <canvas
              ref={chartRef}
              id="pieChart"
              width="400"
              height="400"
            ></canvas>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activity;
