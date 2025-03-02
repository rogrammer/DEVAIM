import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

const MergeRequest = () => {
  const [mergeRequests, setMergeRequests] = useState([
    {
      title: "Feature: Update README",
      source: "feature/readme-update",
      target: "main",
      description: "Updated the project documentation and added examples.",
    },
    {
      title: "Bugfix: Fix login issue",
      source: "bugfix/login",
      target: "main",
      description: "Fixed an issue causing login failure on mobile devices.",
    },
  ]);

  const [newMergeRequest, setNewMergeRequest] = useState({
    title: "",
    source: "",
    target: "",
    description: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewMergeRequest({ ...newMergeRequest, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMergeRequests([...mergeRequests, newMergeRequest]);
    setNewMergeRequest({ title: "", source: "", target: "", description: "" });
    setIsModalOpen(false); // Close the modal after submit
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Add event listener for Escape key to close the modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Merge Requests</h1>
        <button className="btn" onClick={openModal}>Create Merge Request</button>

        <div id="mergeList">
          {mergeRequests.map((mr, index) => (
            <div className="task-table" key={index}>
              <h3>{mr.title}</h3>
              <table>
                <thead>
                  <tr>
                    <th>Source Branch</th>
                    <th>Target Branch</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{mr.source}</td>
                    <td>{mr.target}</td>
                    <td>{mr.description}</td>
                  </tr>
                </tbody>
              </table>
              <button className="btn merge-btn">Merge</button>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>Create Merge Request
                <button className="close-btn2" onClick={closeModal}>X</button>
              </h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  id="title"
                  placeholder="Title"
                  value={newMergeRequest.title}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  id="source"
                  placeholder="Source Branch"
                  value={newMergeRequest.source}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  id="target"
                  placeholder="Target Branch"
                  value={newMergeRequest.target}
                  onChange={handleInputChange}
                  required
                />
                <textarea
                  id="description"
                  placeholder="Description"
                  value={newMergeRequest.description}
                  onChange={handleInputChange}
                  required
                />
                <button type="submit" className="btn">Create Merge Request</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MergeRequest;
