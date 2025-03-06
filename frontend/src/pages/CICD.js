import React, { useState } from "react";
import axios from "axios";

const CICD = () => {
  const [selectedRepo, setSelectedRepo] = useState("");
  const [stages, setStages] = useState({
    build: { progress: 0, status: "idle", logs: [] },
    test: { progress: 0, status: "idle", logs: [] },
    deploy: { progress: 0, status: "idle", logs: [] },
  });
  const [pipelineStatus, setPipelineStatus] = useState("idle");
  const [message, setMessage] = useState("");

  // Token'ı sabit olarak JS içinde tanımla
  const headers = {
    Authorization: `Bearer ${process.env.REACT_APP_GIT_TOKEN}`,
    Accept: "application/vnd.github+json",
  };

  // Fork edilmiş repository'ler (kendi kullanıcı adınla güncelle)
  const repos = [
    {
      full_name: "your-username/traefik",
      language: "Go",
      description: "HTTP Reverse Proxy",
      branch: "master",
    },
    {
      full_name: "your-username/fastapi",
      language: "Python",
      description: "High-Performance Web Framework",
      branch: "main",
    },
  ];

  // Workflow içeriği
  const getWorkflowContent = (repoName) => {
    if (repoName === "your-username/traefik") {
      return `
name: CI/CD for Traefik
on:
  push:
    branches: [ master ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-go@v3
        with:
          go-version: '1.21'
      - run: make build
  test:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-go@v3
        with:
          go-version: '1.21'
      - run: make test-unit
  deploy:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v3
      - run: echo "Deploying Traefik (simulation)"
`;
    } else if (repoName === "your-username/fastapi") {
      return `
name: CI/CD for FastAPI
on:
  push:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: pip install poetry
      - run: poetry install
  test:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: pip install poetry
      - run: poetry install
      - run: poetry run pytest
  deploy:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v3
      - run: echo "Deploying FastAPI (simulation)"
`;
    }
  };

  // Workflow'u yükle
  const uploadWorkflow = async () => {
    if (!selectedRepo) return setMessage("Please select a repository!");
    const [owner, repo] = selectedRepo.split("/");
    const repoData = repos.find((r) => r.full_name === selectedRepo);
    const branch = repoData.branch;
    const workflowContent = getWorkflowContent(selectedRepo);
    const encodedWorkflow = btoa(workflowContent);

    try {
      // Branch'in varlığını kontrol et
      await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/branches/${branch}`,
        { headers }
      );

      // Workflow dosyasını yükle
      const response = await axios.put(
        `https://api.github.com/repos/${owner}/${repo}/contents/.github/workflows/ci-cd.yml`,
        { message: `Add CI/CD for ${repo}`, content: encodedWorkflow, branch },
        { headers }
      );
      setMessage("Workflow uploaded successfully!");
      return true;
    } catch (error) {
      if (error.response?.status === 404) {
        setMessage(
          `Failed to upload: Repository or branch "${branch}" not found. Did you fork the project correctly?`
        );
      } else if (error.response?.status === 401) {
        setMessage(
          "Failed to upload: Invalid token or insufficient permissions."
        );
      } else {
        setMessage(
          `Failed to upload: ${error.response?.status} - ${
            error.response?.data?.message || error.message
          }`
        );
      }
      return false;
    }
  };

  // Workflow'u tetikle
  const triggerWorkflow = async () => {
    const [owner, repo] = selectedRepo.split("/");
    const branch = repos.find((r) => r.full_name === selectedRepo).branch;
    try {
      await axios.post(
        `https://api.github.com/repos/${owner}/${repo}/actions/workflows/ci-cd.yml/dispatches`,
        { ref: branch },
        { headers }
      );
      setMessage("Workflow triggered!");
      return true;
    } catch (error) {
      setMessage(
        `Failed to trigger: ${error.response?.status} - ${
          error.response?.data?.message || error.message
        }`
      );
      return false;
    }
  };

  // Pipeline durumunu izle
  const checkPipelineStatus = async () => {
    const [owner, repo] = selectedRepo.split("/");
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/actions/runs`,
        { headers }
      );
      const latestRun = response.data.workflow_runs[0];
      if (!latestRun) return;

      const statusMap = {
        in_progress: "running",
        completed: latestRun.conclusion === "success" ? "success" : "failed",
        queued: "idle",
      };

      setStages({
        build: {
          ...stages.build,
          status: statusMap[latestRun.status] || "idle",
          progress: latestRun.status === "completed" ? 100 : 33,
          logs: [`Build: ${latestRun.status}`],
        },
        test: {
          ...stages.test,
          status:
            latestRun.status === "completed"
              ? statusMap[latestRun.status]
              : "idle",
          progress: latestRun.status === "completed" ? 100 : 66,
          logs: [`Test: ${latestRun.status}`],
        },
        deploy: {
          ...stages.deploy,
          status:
            latestRun.status === "completed"
              ? statusMap[latestRun.status]
              : "idle",
          progress: latestRun.status === "completed" ? 100 : 0,
          logs: [`Deploy: ${latestRun.status}`],
        },
      });
      setPipelineStatus(statusMap[latestRun.status] || "idle");
      setMessage(
        `Status: ${latestRun.status} - ${latestRun.conclusion || "running"}`
      );
    } catch (error) {
      setMessage(
        `Status check failed: ${error.response?.status} - ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // Pipeline'ı başlat
  const triggerPipeline = async () => {
    if (!selectedRepo) return setMessage("Please select a repository!");
    setPipelineStatus("running");
    setMessage("Initializing pipeline...");

    const uploaded = await uploadWorkflow();
    if (!uploaded) return;

    await new Promise((resolve) => setTimeout(resolve, 2000)); // API senkronizasyonu

    const triggered = await triggerWorkflow();
    if (!triggered) return;

    const interval = setInterval(checkPipelineStatus, 5000);
    setTimeout(() => clearInterval(interval), 60000);
  };

  const getStatusColor = (stage) => {
    switch (stage.status) {
      case "success":
        return "#22c55e";
      case "failed":
        return "#ef4444";
      case "running":
        return "#2563eb";
      default:
        return "#6b7280";
    }
  };

  return (
    <div
      className="container2"
      style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        CI/CD Pipeline
      </h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          marginBottom: "30px",
        }}
      >
        {repos.map((repo) => (
          <div
            key={repo.full_name}
            onClick={() => setSelectedRepo(repo.full_name)}
            style={{
              padding: "15px 25px",
              borderRadius: "8px",
              border:
                selectedRepo === repo.full_name
                  ? "2px solid #2563eb"
                  : "1px solid #ccc",
              background: selectedRepo === repo.full_name ? "#e6f0ff" : "white",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              textAlign: "center",
              width: "200px",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)")
            }
          >
            <h3 style={{ margin: "0", fontSize: "18px" }}>
              {repo.full_name.split("/")[1]}
            </h3>
            <p style={{ margin: "5px 0 0", color: "#666" }}>
              {repo.description}
            </p>
          </div>
        ))}
      </div>

      <div
        id="pipeline"
        style={{ display: "flex", gap: "20px", marginBottom: "30px" }}
      >
        {Object.entries(stages).map(([stageName, stage]) => (
          <div key={stageName} style={{ flex: 1, textAlign: "center" }}>
            <h3>{stageName.charAt(0).toUpperCase() + stageName.slice(1)}</h3>
            <div
              style={{
                height: "20px",
                background: "#eee",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${stage.progress}%`,
                  height: "100%",
                  backgroundColor: getStatusColor(stage),
                  transition: "width 0.5s",
                }}
              ></div>
            </div>
            <p style={{ marginTop: "10px" }}>
              Status:{" "}
              <span>
                {stage.status === "failed"
                  ? "Failed"
                  : `${Math.round(stage.progress)}%`}
              </span>
            </p>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {stage.logs.map((log, idx) => (
                <div key={idx}>{log}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={triggerPipeline}
        disabled={pipelineStatus === "running" || !selectedRepo}
        style={{
          display: "block",
          margin: "0 auto 20px",
          padding: "10px 20px",
          background: pipelineStatus === "running" ? "#ccc" : "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor:
            pipelineStatus === "running" || !selectedRepo
              ? "not-allowed"
              : "pointer",
        }}
      >
        {pipelineStatus === "running" ? "Running..." : "Run Pipeline"}
      </button>
      <div
        style={{
          textAlign: "center",
          color: pipelineStatus === "failed" ? "#ef4444" : "#22c55e",
        }}
      >
        {message}
      </div>
    </div>
  );
};

export default CICD;
