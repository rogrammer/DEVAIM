// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Members from "./pages/Members";
import Activity from "./pages/Activity";
import Tasks from "./pages/Tasks";
import MergeRequest from "./pages/MergeRequest";
import Todo from "./pages/Todo";
import Monitoring from "./pages/Monitoring";
import CICD from "./pages/CICD";

function App() {
  document.addEventListener("DOMContentLoaded", function () {
    // ----------------------------
    // Members Sayfası: Kullanıcı Ekleme
    // ----------------------------
    const addUserForm = document.getElementById("addUserForm");
    if (addUserForm) {
      addUserForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const department = document.getElementById("department").value;
        const experience = document.getElementById("experience").value;
        const userList = document.getElementById("userList");
        const li = document.createElement("li");
        li.textContent = `${name} - ${department} - ${experience}`;
        userList.appendChild(li);
        document.getElementById("formResult").textContent =
          "Kullanıcı eklendi!";
        addUserForm.reset();
      });
    }

    // ----------------------------
    // Merge Request Sayfası: Merge Request Oluşturma
    // ----------------------------
    const mergeRequestForm = document.getElementById("mergeRequestForm");
    if (mergeRequestForm) {
      mergeRequestForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const title = document.getElementById("mrTitle").value;
        const source = document.getElementById("mrSource").value;
        const target = document.getElementById("mrTarget").value;
        const description = document.getElementById("mrDescription").value;
        const mergeList = document.getElementById("mergeList");

        const mrDiv = document.createElement("div");
        mrDiv.className = "merge-request-item";
        mrDiv.innerHTML = `
          <h3>${title}</h3>
          <p><strong>Source Branch:</strong> ${source}</p>
          <p><strong>Target Branch:</strong> ${target}</p>
          <p>${description}</p>
          <button class="btn merge-btn">Merge</button>
        `;
        mergeList.appendChild(mrDiv);
        document.getElementById("mrResult").textContent =
          "Merge Request oluşturuldu!";
        mergeRequestForm.reset();
      });
    }

    // Merge butonlarına örnek işlev (tıklanınca alert)
    document.addEventListener("click", function (e) {
      if (e.target && e.target.classList.contains("merge-btn")) {
        alert("Merge işlemi gerçekleştirildi!");
      }
    });

    // ----------------------------
    // To-Do List Sayfası: Görev Ekleme ve Silme
    // ----------------------------
    const todoForm = document.getElementById("todoForm");
    if (todoForm) {
      todoForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const todoInput = document.getElementById("todoInput");
        const taskText = todoInput.value.trim();
        if (taskText !== "") {
          const todoList = document.getElementById("todoList");
          const li = document.createElement("li");
          li.textContent = taskText;
          const removeSpan = document.createElement("span");
          removeSpan.className = "remove-task";
          removeSpan.textContent = "×";
          li.appendChild(removeSpan);
          todoList.appendChild(li);
          todoInput.value = "";
        }
      });
    }

    const todoList = document.getElementById("todoList");
    if (todoList) {
      todoList.addEventListener("click", function (e) {
        if (e.target && e.target.classList.contains("remove-task")) {
          const li = e.target.parentElement;
          li.parentElement.removeChild(li);
        }
      });
    }

    // ----------------------------
    // CI/CD Pipeline Sayfası: Simülasyon
    // ----------------------------
    const triggerPipelineBtn = document.getElementById("triggerPipeline");
    if (triggerPipelineBtn) {
      triggerPipelineBtn.addEventListener("click", function () {
        // Pipeline aşamalarının progress bar ve durum etiketleri
        const buildProgress = document.querySelector("#stage-build .progress");
        const buildStatus = document.querySelector(
          "#stage-build .status-label"
        );
        const testProgress = document.querySelector("#stage-test .progress");
        const testStatus = document.querySelector("#stage-test .status-label");
        const deployProgress = document.querySelector(
          "#stage-deploy .progress"
        );
        const deployStatus = document.querySelector(
          "#stage-deploy .status-label"
        );
        const pipelineResult = document.getElementById("pipelineResult");

        // Başlangıç değerleri
        buildProgress.style.width = "0%";
        buildStatus.textContent = "0%";
        testProgress.style.width = "0%";
        testStatus.textContent = "0%";
        deployProgress.style.width = "0%";
        deployStatus.textContent = "0%";
        pipelineResult.textContent = "Pipeline çalışıyor...";

        // Build aşaması: 0 -> 100%
        setTimeout(() => {
          buildProgress.style.width = "100%";
          buildStatus.textContent = "100%";
        }, 500);

        // Test aşaması: 0 -> 80%
        setTimeout(() => {
          testProgress.style.width = "80%";
          testStatus.textContent = "80%";
        }, 2500);

        // Deploy aşaması: 0 -> 60%
        setTimeout(() => {
          deployProgress.style.width = "60%";
          deployStatus.textContent = "60%";
        }, 4500);

        // Pipeline tamamlandı mesajı
        setTimeout(() => {
          pipelineResult.textContent = "Pipeline tamamlandı!";
        }, 6500);
      });
    }

    // ----------------------------
    // Basit Fade-in Animasyonu: Sayfa yüklendiğinde container yavaşça görünür
    // ----------------------------
    const containers = document.querySelectorAll(".container");
    containers.forEach((container) => {
      container.style.opacity = 0;
      setTimeout(() => {
        container.style.transition = "opacity 1s";
        container.style.opacity = 1;
      }, 200);
    });
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/members" element={<Members />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/merge-request" element={<MergeRequest />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/cicd" element={<CICD />} />
      </Routes>
    </Router>
  );
}

export default App;
