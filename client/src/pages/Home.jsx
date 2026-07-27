import { useState } from "react";
import SubjectRow from "../component/SubjectRow";
import API from "../services/api";

function Home() {
  const [studentName, setStudentName] = useState("");

  const [semester, setSemester] = useState("");

  const [subjects, setSubjects] = useState([
    {
      subject: "",
      credits: 0,
      marks: 0,
    },
  ]);

  const [gpa, setGpa] = useState(null);

  function updateSubject(index, field, value) {
    const updated = [...subjects];

    updated[index][field] = value;

    setSubjects(updated);
  }

  function addSubject() {
    setSubjects([
      ...subjects,

      {
        subject: "",
        credits: 0,
        marks: 0,
      },
    ]);
  }

  function removeSubject(index) {
    const updated = subjects.filter((_, i) => i !== index);

    setSubjects(updated);
  }

  async function calculateGPA() {
    try {
      const response = await API.post("/students", {
        studentName,
        semester,
        subjects,
      });

      setGpa(response.data.gpa);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <h1>GPA Calculator</h1>

      <input
        placeholder="Student Name"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
      />

      <input
        placeholder="Semester"
        value={semester}
        onChange={(e) => setSemester(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>Subject</th>

            <th>Credits</th>

            <th>Marks</th>

            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {subjects.map((subject, index) => (
            <SubjectRow
              key={index}
              index={index}
              subject={subject}
              updateSubject={updateSubject}
              removeSubject={removeSubject}
            />
          ))}
        </tbody>
      </table>

      <button onClick={addSubject}>+ Add Subject</button>

      <br />

      <button onClick={calculateGPA}>Calculate GPA</button>

      {gpa && <h2>Your GPA : {gpa}</h2>}
    </div>
  );
}

export default Home;
