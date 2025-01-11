import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import url from "../url";

const RequestsList = ({ status, searchQuery }) => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${url}/admin/${status}`, {
          headers: { authorization: `Bearer ${token}` },
        });
        console.log(response.data.announcements);
        // const filteredRequests = response.data.filter((req) =>
        //   req.sellerName.toLowerCase().includes(searchQuery.toLowerCase())
        // );
        // setRequests(filteredRequests);
        setRequests(response.data.announcements);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, [status, searchQuery]);

  const handleRowClick = (request) => {
    navigate(`/request/${request._id}`, { state: { request } });
  };

  const handleAction = async (id, action) => {
    try {
      const token = localStorage.getItem("authToken");
      console.log(token)
      
      const response = await axios.get(`${url}/admin/${action}/${id}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
    }
  };

  return (
    <div className="requests-list">
      <h2>{status.charAt(0).toUpperCase() + status.slice(1)} Requests</h2>
      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Days</th>
              <th>Business Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id} onClick={() => handleRowClick(req)}>
                <td>{req.days}</td>
                <td>{req.businessName}</td>
                <td>
                  <button
                    className="approve"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction(req._id, "approve");
                    }}
                  >
                    ✅ Approve
                  </button>
                  <button
                    className="disapprove"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction(req._id, "dissapprove");
                    }}
                  >
                    ❌ Disapprove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RequestsList;
