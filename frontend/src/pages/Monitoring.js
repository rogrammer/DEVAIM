import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import Navbar from "../components/Navbar";

const Monitoring = () => {
  const [memoryAlloc, setMemoryAlloc] = useState("-");
  const [numGoroutine, setNumGoroutine] = useState("-");
  const [timestamp, setTimestamp] = useState("-");
  const [logs, setLogs] = useState([]);
  const [deployResult, setDeployResult] = useState("");
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const fetchData = () => {
      axios
        .get("http://localhost:8080/api/monitor")
        .then((response) => {
          const data = response.data;
          setMemoryAlloc(data.memory_alloc);
          setNumGoroutine(data.num_goroutine);
          setTimestamp(new Date(data.timestamp * 1000).toLocaleTimeString());

          if (chartInstance.current) {
            chartInstance.current.data.labels.push(
              new Date(data.timestamp * 1000).toLocaleTimeString()
            );
            chartInstance.current.data.datasets[0].data.push(data.memory_alloc);
            if (chartInstance.current.data.labels.length > 10) {
              chartInstance.current.data.labels.shift();
              chartInstance.current.data.datasets[0].data.shift();
            }
            chartInstance.current.update();
          }
        })
        .catch((err) => console.error("Monitor fetch error:", err));

      axios
        .get("http://localhost:8080/api/logs")
        .then((response) => {
          setLogs(response.data);
        })
        .catch((err) => console.error("Logs fetch error:", err));
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy the previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create a new chart instance
      chartInstance.current = new Chart(chartRef.current, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: "Memory Alloc",
              data: [],
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
              fill: true,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }

    // Cleanup function to destroy the chart instance when the component unmounts
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, []);

  const handleDeploy = () => {
    axios
      .post("http://localhost:8080/api/deploy")
      .then((response) => {
        setDeployResult(response.data.status);
      })
      .catch((err) => console.error("Deploy error:", err));
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Monitoring</h1>
        <div id="systemMetrics">
          <h2>Sistem Kaynakları</h2>
          <p>
            Memory Alloc: <span id="memoryAlloc">{memoryAlloc}</span>
          </p>
          <p>
            Active Goroutines: <span id="numGoroutine">{numGoroutine}</span>
          </p>
          <p>
            Last Updated: <span id="timestamp">{timestamp}</span>
          </p>
        </div>
        <div id="logs">
          <h2>Loglar</h2>
          <ul id="logsList">
            {logs.map((log, index) => (
              <li key={index}>{log}</li>
            ))}
          </ul>
        </div>
        <div id="deploySection">
          <h2>Deployment</h2>
          <button id="deployBtn" className="btn" onClick={handleDeploy}>
            Deployment Trigger
          </button>
          <p id="deployResult">{deployResult}</p>
        </div>
        <div id="monitorChartContainer">
          <canvas
            id="monitorChart"
            ref={chartRef}
            width="400"
            height="200"
          ></canvas>
        </div>
      </div>
    </div>
  );
};

export default Monitoring;
