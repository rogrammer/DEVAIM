import React, { useState } from "react";
import Navbar from "../components/Navbar";

const CICD = () => {
  const [buildProgress, setBuildProgress] = useState(0);
  const [testProgress, setTestProgress] = useState(0);
  const [deployProgress, setDeployProgress] = useState(0);
  const [pipelineResult, setPipelineResult] = useState("");

  const triggerPipeline = () => {
    // Reset progress and result
    setBuildProgress(0);
    setTestProgress(0);
    setDeployProgress(0);
    setPipelineResult("Pipeline çalışıyor...");

    // Simulate Build stage
    setTimeout(() => {
      setBuildProgress(100);
    }, 500);

    // Simulate Test stage
    setTimeout(() => {
      setTestProgress(80);
    }, 2500);

    // Simulate Deploy stage
    setTimeout(() => {
      setDeployProgress(60);
    }, 4500);

    // Pipeline completion message
    setTimeout(() => {
      setPipelineResult("Pipeline tamamlandı!");
    }, 6500);
  };

  return (
    <div>
      <Navbar />
      <div className="container fade-in">
        <h1>CI/CD Pipeline</h1>
        <div id="pipeline">
          <div className="pipeline-stage" id="stage-build">
            <h3>Build</h3>
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${buildProgress}%` }}
              ></div>
            </div>
            <p>
              Status: <span className="status-label">{buildProgress}%</span>
            </p>
          </div>
          <div className="pipeline-stage" id="stage-test">
            <h3>Test</h3>
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${testProgress}%` }}
              ></div>
            </div>
            <p>
              Status: <span className="status-label">{testProgress}%</span>
            </p>
          </div>
          <div className="pipeline-stage" id="stage-deploy">
            <h3>Deploy</h3>
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${deployProgress}%` }}
              ></div>
            </div>
            <p>
              Status: <span className="status-label">{deployProgress}%</span>
            </p>
          </div>
        </div>
        <button id="triggerPipeline" className="btn" onClick={triggerPipeline}>
          Pipeline'ı Çalıştır
        </button>
        <div id="pipelineResult">{pipelineResult}</div>
      </div>
    </div>
  );
};

export default CICD;
