import { useEffect, useState } from "react";
import api from "../api";

function Dashboard() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    api.get("/requests")
      .then(res => setRequests(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Maintenance Requests</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Resident</th>
            <th>Request Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(r => (
            <tr key={r.request_id}>
              <td>{r.request_id}</td>
              <td>{r.resident_name}</td>
              <td>{r.request_type}</td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
