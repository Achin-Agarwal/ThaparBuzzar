import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/RequestDetail.css";

const RequestDetail = () => {
  const location = useLocation();
  const { request } = location.state;
  //   const { id } = useParams();
  //   const [requestDetails, setRequestDetails] = useState(null);

  //   useEffect(() => {
  //     const fetchRequestDetails = async () => {
  //       try {
  //         const endpoint = `/admin/request/${id}`;
  //         const response = await axios.get(endpoint);
  //         setRequestDetails(response.data);
  //       } catch (error) {
  //         console.error("Error fetching request details:", error);
  //       }
  //     };

  //     fetchRequestDetails();
  //   }, [id]);

  //   if (!requestDetails) {
  //     return <p>Loading...</p>;
  //   }

  return (
    <div className="request-detail">
      <h2>Request Details</h2>
      <table>
        <tbody>
          <tr>
            <th>Seller Name:</th>
            <td>{request.sellerName}</td>
          </tr>
          <tr>
            <th>Business Name:</th>
            <td>{request.businessName}</td>
          </tr>
          <tr>
            <th>Rate Bifurcation:</th>
            <td>{request.rateBifercation || "N/A"}</td>
          </tr>
          <tr>
            <th>Days:</th>
            <td>{request.days || "N/A"}</td>
          </tr>
          <tr>
            <th>Is Approved:</th>
            <td>{request.isApproved ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <th>Is Disapproved:</th>
            <td>{request.isDisapproved ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <th>Approved On:</th>
            <td>{request.approvedOn || "N/A"}</td>
          </tr>
          <tr>
            <th>Expires In:</th>
            <td>{request.expiresin || "N/A"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RequestDetail;
