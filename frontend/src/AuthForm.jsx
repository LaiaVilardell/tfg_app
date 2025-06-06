import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    center: "",
    phone: "",
    email: "",
    password: "",
    aceptaTerminos: false,
    role: "patient", // Default role
});

  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!isLogin && !formData.aceptaTerminos) {
      setError("You must accept the terms and conditions.");
      return;
    }
    
    const endpoint = isLogin ? "/login" : "/register";
    const url = `http://localhost:5000${endpoint}`; // Replace with deployed backend URL

    const payload = isLogin
      ? {
          email: formData.email, 
          password: formData.password
        }
      : {
          name: formData.name,
          surname: formData.surname,
          center: formData.center,
          phone: formData.phone || null,
          email: formData.email,
          password: formData.password,
          role: formData.role
        };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
          setMessage(isLogin ? "Login successful" : "Registration successful");
          setError("");
          
          // store the JWT token and role in localStorage
          if (isLogin) {
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("role", data.user.role);
          navigate("/dashboard");
        } else {
          setFormData({
            name: "",
            surname: "",
            center: "",
            phone: "",
            email: "",
            password: "",
            aceptaTerminos: false,
            role: "patient",
          });
        }
        } else {
          setError(data.message || "An error occurred");
        }
      } catch (err) {
          setError("Failed to connect to the server");
        }
      };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>{isLogin ? "HoloVoice" : "Register"}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            /><br />

            <input
              type="text"
              name="surname"
              placeholder="Surname"
              value={formData.surname}
              onChange={handleChange}
              required
            /><br />

            <input
              type="text"
              name="center"
              placeholder="Clinic/Center Name"
              value={formData.center}
              onChange={handleChange}
              required
            /><br />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number (optional)"
              value={formData.phone}
              onChange={handleChange}
            /><br />
          </>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        /><br />

        {!isLogin && (
          <>
          <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="">Select Role</option>
          <option value="patient">Patient</option>
          <option value="psychologist">Psychologist</option>
        </select><br />

          <label>
            <input
              type="checkbox"
              name="aceptaTerminos"
              checked={formData.aceptaTerminos}
              onChange={handleChange}
            />{" "}
            I accept{" "}
            <a href="/terminos" target="_blank" rel="noopener noreferrer">
              the privacy policy and terms of confidentiality
            </a>
          </label><br />
          </>
        )}

        <br />
        <button type="submit">{isLogin ? "Log in" : "Register"}</button>
      </form>

      <p>
        {isLogin ? "¿Do not have an account?" : "¿Already have an acocunt?"}{" "}
        <button onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Register" : "Log in"}
        </button>
      </p>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default AuthForm;

