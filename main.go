package main

import (
	"encoding/json"
	"log"
	"net/http"
	"runtime"
	"sync"
	"time"
)

type User struct {
	Name       string `json:"name"`
	Department string `json:"department"`
	Experience string `json:"experience"`
}

var (
	users = []User{
		{"Arda", "Backend", "3 Year"},
		{"Ayşe", "Frontend", "2 Year"},
		{"Mehmet", "DevOps", "4 Year"},
		{"Elif", "QA", "1 Year"},
		{"Can", "Ops", "5 Year"},
	}
	usersMutex sync.Mutex
)

type SystemMetrics struct {
	MemoryAlloc  uint64 `json:"memory_alloc"`
	NumGoroutine int    `json:"num_goroutine"`
	Timestamp    int64  `json:"timestamp"`
}

var logsData = []string{
	"Server started",
	"User Arda logged in",
	"Merge request created",
}
var logsMutex sync.Mutex

func main() {
	// Statik dosyaları sun: URL yolu "/" ise index.html, diğer isteklerde ilgili dosyayı sunuyoruz.
	http.HandleFunc("/", serveFile)

	// API endpoint'leri
	http.HandleFunc("/api/adduser", addUserHandler)
	http.HandleFunc("/api/monitor", monitorHandler)
	http.HandleFunc("/api/logs", logsHandler)
	http.HandleFunc("/api/deploy", deployHandler)

	log.Println("Sunucu port 8080'de çalışıyor...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func serveFile(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path
	if path == "/" {
		http.ServeFile(w, r, "index.html")
	} else {
		// Dosya yolunun başındaki "/" karakterini kaldırarak dosyayı sunuyoruz.
		http.ServeFile(w, r, path[1:])
	}
}

func addUserHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Sadece POST yöntemi destekleniyor", http.StatusMethodNotAllowed)
		return
	}
	var newUser User
	if err := json.NewDecoder(r.Body).Decode(&newUser); err != nil {
		http.Error(w, "Veri hatalı", http.StatusBadRequest)
		return
	}
	usersMutex.Lock()
	users = append(users, newUser)
	usersMutex.Unlock()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(newUser)
}

func monitorHandler(w http.ResponseWriter, r *http.Request) {
	var m runtime.MemStats
	runtime.ReadMemStats(&m)
	metrics := SystemMetrics{
		MemoryAlloc:  m.Alloc,
		NumGoroutine: runtime.NumGoroutine(),
		Timestamp:    time.Now().Unix(),
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(metrics)
}

func logsHandler(w http.ResponseWriter, r *http.Request) {
	logsMutex.Lock()
	defer logsMutex.Unlock()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(logsData)
}

func deployHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Sadece POST yöntemi destekleniyor", http.StatusMethodNotAllowed)
		return
	}
	// Deployment işlemini simüle ediyoruz.
	time.Sleep(2 * time.Second)
	result := map[string]string{
		"status": "Deployment başarılı şekilde tetiklendi",
	}
	logsMutex.Lock()
	logsData = append(logsData, "Deployment tetiklendi: "+time.Now().Format(time.RFC1123))
	logsMutex.Unlock()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}
