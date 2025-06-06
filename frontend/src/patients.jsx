import React, { useState } from "react";

const initialPatients = [
  {
    id: 1,
    firstName: "Ana",
    lastName: "Pérez",
    age: 30,
    gender: "Female",
    medicalHistory: "Anorexia diagnosed in 2020",
    tcaType: "Anorexia nervosa",
    observations: "Patient shows good progress.",
    sessionTracking: [
      { date: "2025-01-10", note: "First session, patient was receptive." },
      { date: "2025-01-17", note: "Improved eating habits." },
    ],
    emergencyContact: "Carlos Pérez, 555-1234",
    lastUpdated: "2025-01-17",
  },
  {
    id: 2,
    firstName: "Luis",
    lastName: "Gómez",
    age: 25,
    gender: "Male",
    medicalHistory: "Bulimia diagnosed in 2019",
    tcaType: "Bulimia nervosa",
    observations: "Needs intensive follow-up.",
    sessionTracking: [],
    emergencyContact: "María Gómez, 555-5678",
    lastUpdated: "2025-01-05",
  },
];

function PatientsPage() {
  const [patients, setPatients] = useState(initialPatients);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    medicalHistory: "",
    tcaType: "",
    observations: "",
    sessionTracking: [],
    emergencyContact: "",
  });
  const [newNote, setNewNote] = useState("");

  const selectPatient = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      firstName: patient.firstName,
      lastName: patient.lastName,
      age: patient.age,
      gender: patient.gender,
      medicalHistory: patient.medicalHistory,
      tcaType: patient.tcaType,
      observations: patient.observations,
      sessionTracking: patient.sessionTracking,
      emergencyContact: patient.emergencyContact,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveChanges = () => {
    const updatedPatient = {
      ...selectedPatient,
      ...formData,
      age: Number(formData.age),
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    setPatients((prev) =>
      prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
    );
    setSelectedPatient(updatedPatient);
    alert("Changes saved");
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    const newEntry = {
      date: new Date().toISOString().split("T")[0],
      note: newNote.trim(),
    };
    const updatedSessionTracking = [...formData.sessionTracking, newEntry];
    setFormData((prev) => ({ ...prev, sessionTracking: updatedSessionTracking }));
    setNewNote("");
  };

  return (
    <div style={{ display: "flex", maxWidth: "900px", margin: "auto" }}>
      {/* Patients list */}
      <div style={{ flex: 1, marginRight: "20px" }}>
        <h2>Patients</h2>
        <ul>
          {patients.map((p) => (
            <li
              key={p.id}
              style={{
                cursor: "pointer",
                fontWeight: selectedPatient?.id === p.id ? "bold" : "normal",
              }}
              onClick={() => selectPatient(p)}
            >
              {p.firstName} {p.lastName}
            </li>
          ))}
        </ul>
      </div>

      {/* Patient detail and edit */}
      <div style={{ flex: 2 }}>
        {selectedPatient ? (
          <>
            <h2>
              Profile of {selectedPatient.firstName} {selectedPatient.lastName}
            </h2>
            <label>
              First Name:<br />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Last Name:<br />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Age:<br />
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="0"
              />
            </label>
            <br />
            <label>
              Gender:<br />
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select...</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <br />
            <label>
              Medical History:<br />
              <textarea
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleChange}
                rows={3}
              />
            </label>
            <br />
            <label>
              Type of Eating Disorder:<br />
              <input
                type="text"
                name="tcaType"
                value={formData.tcaType}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Observations:<br />
              <textarea
                name="observations"
                value={formData.observations}
                onChange={handleChange}
                rows={3}
              />
            </label>
            <br />
            <label>
              Emergency Contact:<br />
              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
              />
            </label>
            <br />

            <h3>Session Tracking</h3>
            <ul>
              {formData.sessionTracking.map((entry, idx) => (
                <li key={idx}>
                  <strong>{entry.date}:</strong> {entry.note}
                </li>
              ))}
            </ul>
            <textarea
              placeholder="Add session note"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={2}
            />
            <br />
            <button onClick={addNote}>Add Note</button>
            <br />
            <br />
            <button onClick={saveChanges}>Save Changes</button>
          </>
        ) : (
          <p>Select a patient to view or edit their profile</p>
        )}
      </div>
    </div>
  );
}

export default PatientsPage;
