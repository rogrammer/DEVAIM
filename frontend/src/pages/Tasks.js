// src/pages/Tasks.js
import React from "react";
import Navbar from "../components/Navbar";

const Tasks = () => {
  return (
    <div>
      <Navbar />
      <div className="container tasks-container">
        <div className="task-table">
          <h2>Önceden Yapılan İşler</h2>
          <table>
            <thead>
              <tr>
                <th>İş Adı</th>
                <th>Sorumlu</th>
                <th>Süre</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Örnek İş 1</td>
                <td>Arda</td>
                <td>2 Hafta</td>
              </tr>
              <tr>
                <td>Örnek İş 2</td>
                <td>Ayşe</td>
                <td>1 Hafta</td>
              </tr>
            </tbody>
          </table>
          <button className="btn">Yeni Eski İş Ekle</button>
        </div>
        <div className="task-table">
          <h2>Şu Anda Yapılması Gerekenler</h2>
          <table>
            <thead>
              <tr>
                <th>İş Adı</th>
                <th>Bölüm</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Web Sitesi</td>
                <td>DB, Backend, Frontend</td>
              </tr>
            </tbody>
          </table>
          <button className="btn">Yeni İş Ekle</button>
        </div>
        <div className="task-table">
          <h2>İleri Tarihli Yapılacak İşler</h2>
          <table>
            <thead>
              <tr>
                <th>İş Adı</th>
                <th>Süre</th>
                <th>Bölümler</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Örnek İş 3</td>
                <td>3 Hafta</td>
                <td>Backend, Ops</td>
              </tr>
            </tbody>
          </table>
          <button className="btn">Yeni Gelecek İş Ekle</button>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
