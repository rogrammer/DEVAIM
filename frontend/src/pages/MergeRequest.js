// src/pages/MergeRequest.js
import React, { useState } from "react";
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

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewMergeRequest({ ...newMergeRequest, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMergeRequests([...mergeRequests, newMergeRequest]);
    setNewMergeRequest({ title: "", source: "", target: "", description: "" });
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Merge Requests</h1>
        <div id="mergeList">
          {mergeRequests.map((mr, index) => (
            <div className="merge-request-item" key={index}>
              <h3>{mr.title}</h3>
              <p>
                <strong>Source Branch:</strong> {mr.source}
              </p>
              <p>
                <strong>Target Branch:</strong> {mr.target}
              </p>
              <p>Description: {mr.description}</p>
              <button className="btn merge-btn">Merge</button>
            </div>
          ))}
        </div>
        <h2>Yeni Merge Request Oluştur</h2>
        <form id="mergeRequestForm" onSubmit={handleSubmit}>
          <input
            type="text"
            id="title"
            placeholder="Başlık"
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
            placeholder="Açıklama"
            value={newMergeRequest.description}
            onChange={handleInputChange}
            required
          />
          <button type="submit" className="btn">
            Merge Request Oluştur
          </button>
        </form>
      </div>
    </div>
  );
};

export default MergeRequest;
