import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    location: "",
    familyContact: "",
    message: ""
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            const locationName = data.display_name; // or data.address.city/state, etc.
  
            setFormData((prevData) => ({
              ...prevData,
              location: locationName
            }));
          } catch (error) {
            console.error("Error fetching location name:", error);
          }
        },
        (error) => {
          console.error("Error fetching coordinates:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, []);
  

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/users", formData);
      alert(response.data.message);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form.");
    }
  };

  const sendEmergencyAlert = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/alert", formData);
      alert(response.data.message);
    } catch (error) {
      console.error("Error sending mail");
      alert("Failed to send mail form.");
    }
  };

  return (
    <div className="app-container">
      <h1>🌸 Women Safety App 🌸</h1>
      <form onSubmit={submitForm} className="form-container">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <label>Age:</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleInputChange}
          required
        />
        <label>Location (Auto-filled):</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          readOnly
        />
        <label>Family Contact:</label>
        <input
          type="text"
          name="familyContact"
          value={formData.familyContact}
          onChange={handleInputChange}
          placeholder="e.g., family@example.com"
          required
        />
        <label>Message (optional): </label>
        <input
          type="text"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          placeholder="Enter a message"
        />
        <button type="submit" className="submit-btn">Submit</button>
      </form>
      <button onClick={sendEmergencyAlert} className="alert-btn">
        🚨 Send Emergency Alert 🚨
      </button>
    </div>
  );
}

export default App;
