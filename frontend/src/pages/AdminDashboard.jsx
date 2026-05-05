import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

export default function AdminDashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await fetch(`${API_URL}/api/feedback`);
      const data = await res.json();
      setFeedbacks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/api/feedback/${id}`, {
      method: 'DELETE'
    });
    load();
  };

  return (
    <div className="page">
      <h2>Admin Dashboard</h2>

      {feedbacks.length === 0 ? (
        <p>No data</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Type</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {feedbacks.map(f => (
              <tr key={f.id}>
                <td>{f.name}</td>
                <td>{f.email}</td>
                <td>{f.type}</td>
                <td>{f.rating}</td>

                <td>
                  <button onClick={() => navigate(`/feedback/${f.id}`)}>View</button>
                  <button onClick={() => handleDelete(f.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}