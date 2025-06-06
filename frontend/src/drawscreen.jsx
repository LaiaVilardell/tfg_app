import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [message, setMessage] = useState("Load");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (!token || !role) {
      setMessage("You are not logged in.");
      navigate("/"); // Redirect to the login page if no token or role
      return;
    }

    const endpoint =
      "http://localhost:5000/dashboard/patient/drawscreen";

    fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
      .then((res) => {
        if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
            setError("Access denied or session expired");
            localStorage.removeItem("token"); // Clear invalid token
            localStorage.removeItem("role");   // Clear invalid role
            navigate("/"); // Redirect to login
          } else {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
        }
        return res.json();
      })

      .then((data) => {
        setMessage(data.message || "Welcome!")
    })

      .catch((err) => {
        setError("Access denied or session expired");
        console.error("DrawScreen fetch error:", err);
      });
  }, [navigate]); // Add navigate as a dependency

  return (
    <div style={{ padding: "2rem" }}>
      <h2>DrawScreen</h2>
      {error ? <p style={{ color: "red" }}>{error}</p> : <p>{message}</p>}
    </div>
  );
}

export default Dashboard;
