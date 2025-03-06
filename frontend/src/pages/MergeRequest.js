import React, { useState, useEffect } from "react";
import "../styles/MergeRequest.css";

const MergeRequest = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState("bcicen/ctop"); // Varsayılan repo
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const GITHUB_TOKEN = process.env.REACT_APP_GIT_TOKEN; // Token'ını buraya yaz

  // Mevcut projeler (dropdown seçenekleri)
  const repositories = [
    { name: "ctop", fullName: "bcicen/ctop" },
    { name: "img", fullName: "genuinetools/img" },
  ];

  // Seçilen repoya göre issue'ları çekme
  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.github.com/repos/${selectedRepo}/issues?state=all&per_page=100`,
          {
            headers: {
              Accept: "application/vnd.github+json",
              Authorization: `token ${GITHUB_TOKEN}`,
            },
          }
        );

        if (!response.ok)
          throw new Error("API isteği başarısız: " + response.status);
        const data = await response.json();
        setIssues(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchIssues();
  }, [selectedRepo]); // selectedRepo değiştiğinde yeniden çalışır

  const openIssues = issues.filter((issue) => issue.state === "open");
  const closedIssues = issues.filter((issue) => issue.state === "closed");

  // Dropdown'ı açma/kapama
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Repo seçimi
  const handleRepoSelect = (repo) => {
    setSelectedRepo(repo);
    setIsDropdownOpen(false); // Seçim yapıldığında dropdown kapanır
  };

  return (
    <div className="merge-request-container">
      <div className="repo-selector">
        <h1 className="merge-request-title" onClick={toggleDropdown}>
          {repositories.find((repo) => repo.fullName === selectedRepo)?.name}{" "}
          GitHub Issues
          <span className="dropdown-arrow">{isDropdownOpen ? "▲" : "▼"}</span>
        </h1>
        {isDropdownOpen && (
          <ul className="dropdown-menu">
            {repositories.map((repo) => (
              <li
                key={repo.fullName}
                className="dropdown-item"
                onClick={() => handleRepoSelect(repo.fullName)}
              >
                {repo.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {loading && <p className="merge-request-loading">Yükleniyor...</p>}
      {error && <p className="merge-request-error">{error}</p>}

      <section className="issues-section">
        <h2 className="issues-section-title">
          Açık Issues ({openIssues.length})
        </h2>
        {openIssues.length > 0 ? (
          <div className="issues-table">
            <table>
              <thead>
                <tr>
                  <th>Başlık</th>
                  <th>Durum</th>
                  <th>Oluşturulma Tarihi</th>
                  <th>Açıklama</th>
                </tr>
              </thead>
              <tbody>
                {openIssues.map((issue) => (
                  <tr key={issue.id}>
                    <td>
                      <a
                        href={issue.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {issue.title}
                      </a>
                    </td>
                    <td className="status-cell">
                      <span className="status-open-dot"></span>
                      {issue.state}
                    </td>
                    <td>{new Date(issue.created_at).toLocaleDateString()}</td>
                    <td>
                      {issue.body
                        ? issue.body.substring(0, 100) + "..."
                        : "Açıklama yok"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-issues">Henüz açık issue yok.</p>
        )}
      </section>

      <section className="issues-section">
        <h2 className="issues-section-title">
          Kapalı Issues ({closedIssues.length})
        </h2>
        {closedIssues.length > 0 ? (
          <div className="issues-table">
            <table>
              <thead>
                <tr>
                  <th>Başlık</th>
                  <th>Durum</th>
                  <th>Kapanma Tarihi</th>
                  <th>Açıklama</th>
                </tr>
              </thead>
              <tbody>
                {closedIssues.map((issue) => (
                  <tr key={issue.id}>
                    <td>
                      <a
                        href={issue.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {issue.title}
                      </a>
                    </td>
                    <td className="status-cell">
                      <span className="status-closed-dot"></span>
                      {issue.state}
                    </td>
                    <td>{new Date(issue.closed_at).toLocaleDateString()}</td>
                    <td>
                      {issue.body
                        ? issue.body.substring(0, 100) + "..."
                        : "Açıklama yok"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-issues">Henüz kapalı issue yok.</p>
        )}
      </section>
    </div>
  );
};

export default MergeRequest;
