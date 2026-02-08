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

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Resident</th>
            <th>Type</th>
            <th>Status</th>
            <th>Category</th>
            <th>Related To</th>
          </tr>
        </thead>

        <tbody>
          {requests.map(r => (
            <tr key={r.request_id}>
              <td>{r.request_id}</td>
              <td>{r.resident_name}</td>
              <td>{r.request_type}</td>

              <td>
                <span className={`status ${r.status}`}>
                  {r.status}
                </span>
              </td>

              <td>
                <span className={`category ${r.request_category}`}>
                  {r.request_category}
                </span>
              </td>

              <td>
                {r.request_category === "ASSET"
                  ? r.asset_name
                  : `Flat ${r.flat_number}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
