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
      document.getElementById("formResult").textContent = "Kullanıcı eklendi!";
      addUserForm.reset();
    });
  }

  // ----------------------------
  // Activity Sayfası: İş Butonları ve Pasta Grafiği
  // ----------------------------
  const taskButtons = document.querySelectorAll(".task-btn");
  if (taskButtons.length > 0) {
    taskButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        const taskName = this.getAttribute("data-task");
        const container = document.getElementById("selectedTaskContainer");
        container.innerHTML = `<h3>${taskName} detayları</h3><p>İlerleme durumu: %50</p>`;
        const ctx = document.getElementById('pieChart').getContext('2d');
        document.getElementById('pieChart').style.display = 'block';
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ['Yapıldı', 'Kalan'],
            datasets: [{
              data: [50, 50],
              backgroundColor: ['#36A2EB', '#FF6384']
            }]
          },
          options: {
            animation: {
              duration: 1000
            }
          }
        });
      });
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
      document.getElementById("mrResult").textContent = "Merge Request oluşturuldu!";
      mergeRequestForm.reset();
    });
  }

  // Merge butonlarına örnek işlev (tıklanınca alert)
  document.addEventListener("click", function(e) {
    if(e.target && e.target.classList.contains("merge-btn")) {
      alert("Merge işlemi gerçekleştirildi!");
    }
  });

  // ----------------------------
  // To-Do List Sayfası: Görev Ekleme ve Silme
  // ----------------------------
  const todoForm = document.getElementById("todoForm");
  if (todoForm) {
    todoForm.addEventListener("submit", function(e) {
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
    todoList.addEventListener("click", function(e) {
      if (e.target && e.target.classList.contains("remove-task")) {
        const li = e.target.parentElement;
        li.parentElement.removeChild(li);
      }
    });
  }

  // ----------------------------
  // Monitoring Sayfası: Sistem Metriği, Loglar ve Deployment
  // ----------------------------
  function updateMonitoring() {
    fetch("/api/monitor")
      .then(response => response.json())
      .then(data => {
        const memoryAllocElem = document.getElementById("memoryAlloc");
        const numGoroutineElem = document.getElementById("numGoroutine");
        const timestampElem = document.getElementById("timestamp");
        if(memoryAllocElem) memoryAllocElem.textContent = data.memory_alloc;
        if(numGoroutineElem) numGoroutineElem.textContent = data.num_goroutine;
        if(timestampElem) timestampElem.textContent = new Date(data.timestamp * 1000).toLocaleTimeString();
        // Chart güncellemesi
        if(monitorChart) {
          monitorChart.data.labels.push(new Date(data.timestamp * 1000).toLocaleTimeString());
          monitorChart.data.datasets[0].data.push(data.memory_alloc);
          if(monitorChart.data.labels.length > 10) {
            monitorChart.data.labels.shift();
            monitorChart.data.datasets[0].data.shift();
          }
          monitorChart.update();
        }
      })
      .catch(err => console.error("Monitor fetch error:", err));
    
    fetch("/api/logs")
      .then(response => response.json())
      .then(data => {
        const logsList = document.getElementById("logsList");
        if (logsList) {
          logsList.innerHTML = "";
          data.forEach(log => {
            const li = document.createElement("li");
            li.textContent = log;
            logsList.appendChild(li);
          });
        }
      })
      .catch(err => console.error("Logs fetch error:", err));
  }

  const deployBtn = document.getElementById("deployBtn");
  if(deployBtn) {
    deployBtn.addEventListener("click", function() {
      fetch("/api/deploy", { method: "POST" })
        .then(response => response.json())
        .then(data => {
          document.getElementById("deployResult").textContent = data.status;
          updateMonitoring(); // Deployment sonrası güncelleme
        })
        .catch(err => console.error("Deploy error:", err));
    });
  }

  let monitorChart;
  const monitorCtx = document.getElementById('monitorChart');
  if (monitorCtx) {
    monitorChart = new Chart(monitorCtx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Memory Alloc',
          data: [],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          fill: true,
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          }
        }
      }
    });
  }

  // Monitoring sayfası: periyodik güncelleme (5 saniyede bir)
  if(document.getElementById("memoryAlloc")){
    updateMonitoring();
    setInterval(updateMonitoring, 5000);
  }

  // ----------------------------
  // CI/CD Pipeline Sayfası: Simülasyon
  // ----------------------------
  const triggerPipelineBtn = document.getElementById("triggerPipeline");
  if(triggerPipelineBtn) {
    triggerPipelineBtn.addEventListener("click", function() {
      // Pipeline aşamalarının progress bar ve durum etiketleri
      const buildProgress = document.querySelector("#stage-build .progress");
      const buildStatus = document.querySelector("#stage-build .status-label");
      const testProgress = document.querySelector("#stage-test .progress");
      const testStatus = document.querySelector("#stage-test .status-label");
      const deployProgress = document.querySelector("#stage-deploy .progress");
      const deployStatus = document.querySelector("#stage-deploy .status-label");
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
  containers.forEach(container => {
    container.style.opacity = 0;
    setTimeout(() => {
      container.style.transition = "opacity 1s";
      container.style.opacity = 1;
    }, 200);
  });
});
