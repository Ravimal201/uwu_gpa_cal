import { useState, useMemo } from "react";
import API from "../services/api";

// Standard 4.0 scale (adjust points here if your university uses a different scale)
const GRADE_POINTS = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  E: 0.0,
};

function emptySubject() {
  return { subject: "", credits: "", grade: "", gpa: 0 };
}

function calcWeightedGPA(subjectList) {
  const totalCredits = subjectList.reduce(
    (sum, s) => sum + (Number(s.credits) || 0),
    0,
  );
  if (!totalCredits) return 0;

  const totalPoints = subjectList.reduce(
    (sum, s) => sum + (Number(s.credits) || 0) * (Number(s.gpa) || 0),
    0,
  );

  return totalPoints / totalCredits;
}

function Home() {
  const [studentName, setStudentName] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [subjects, setSubjects] = useState([emptySubject()]);
  const [savedSemesters, setSavedSemesters] = useState([]);
  const [saving, setSaving] = useState(false);

  function updateSubject(index, field, value) {
    const updated = [...subjects];
    updated[index] = { ...updated[index], [field]: value };

    // auto-fill GPA when a grade is picked (still editable afterward)
    if (field === "grade") {
      updated[index].gpa = GRADE_POINTS[value] ?? 0;
    }

    setSubjects(updated);
  }

  function addSubject() {
    setSubjects([...subjects, emptySubject()]);
  }

  function removeSubject(index) {
    setSubjects(subjects.filter((_, i) => i !== index));
  }

  const currentSemesterGPA = useMemo(
    () => calcWeightedGPA(subjects),
    [subjects],
  );

  const overallGPA = useMemo(() => {
    const allSubjects = savedSemesters.flatMap((s) => s.subjects);
    return calcWeightedGPA(allSubjects);
  }, [savedSemesters]);

  async function saveSemester() {
    if (!year || !semester) {
      alert("Please select year and semester before saving.");
      return;
    }

    const validSubjects = subjects.filter(
      (s) => s.subject.trim() && Number(s.credits) > 0 && s.grade,
    );

    if (validSubjects.length === 0) {
      alert("Add at least one subject with a name, credits, and grade.");
      return;
    }

    const semesterGPA = calcWeightedGPA(validSubjects);
    const totalCredits = validSubjects.reduce(
      (sum, s) => sum + Number(s.credits),
      0,
    );

    setSaving(true);
    try {
      await API.post("/students", {
        studentName,
        year,
        semester,
        subjects: validSubjects,
        gpa: semesterGPA,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }

    setSavedSemesters([
      ...savedSemesters,
      {
        id: Date.now(),
        year,
        semester,
        subjects: validSubjects,
        semesterGPA,
        totalCredits,
      },
    ]);

    // reset the form so the user can add the next year/semester
    setYear("");
    setSemester("");
    setSubjects([emptySubject()]);
  }

  function removeSavedSemester(id) {
    setSavedSemesters(savedSemesters.filter((s) => s.id !== id));
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h1>GPA Calculator</h1>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: 16,
          marginBottom: 24,
          background: "#f7f7f7",
        }}
      >
        <h2 style={{ margin: 0 }}>
          Overall GPA: {savedSemesters.length ? overallGPA.toFixed(2) : "-"}
        </h2>
        <p style={{ margin: "4px 0 0", color: "#555" }}>
          Based on {savedSemesters.length} saved semester
          {savedSemesters.length === 1 ? "" : "s"}
        </p>
      </div>

      {savedSemesters.length > 0 && (
        <table
          style={{
            width: "100%",
            marginBottom: 24,
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Year</th>
              <th style={thStyle}>Semester</th>
              <th style={thStyle}>Credits</th>
              <th style={thStyle}>GPA</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {savedSemesters.map((s) => (
              <tr key={s.id}>
                <td style={tdStyle}>{s.year}</td>
                <td style={tdStyle}>{s.semester}</td>
                <td style={tdStyle}>{s.totalCredits}</td>
                <td style={tdStyle}>{s.semesterGPA.toFixed(2)}</td>
                <td style={tdStyle}>
                  <button onClick={() => removeSavedSemester(s.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <input
        placeholder="Student Name"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
      />

      <div style={{ display: "flex", gap: 12, margin: "12px 0" }}>
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Select Year</option>
          <option value="1">Year 1</option>
          <option value="2">Year 2</option>
          <option value="3">Year 3</option>
          <option value="4">Year 4</option>
        </select>

        <select value={semester} onChange={(e) => setSemester(e.target.value)}>
          <option value="">Select Semester</option>
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
        </select>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>Subject</th>
            <th style={thStyle}>Credits</th>
            <th style={thStyle}>Grade</th>
            <th style={thStyle}>GPA</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject, index) => (
            <tr key={index}>
              <td style={tdStyle}>
                <input
                  value={subject.subject}
                  onChange={(e) =>
                    updateSubject(index, "subject", e.target.value)
                  }
                  placeholder="Subject name"
                />
              </td>
              <td style={tdStyle}>
                <input
                  type="number"
                  min="0"
                  value={subject.credits}
                  onChange={(e) =>
                    updateSubject(index, "credits", e.target.value)
                  }
                  placeholder="Credits"
                />
              </td>
              <td style={tdStyle}>
                <select
                  value={subject.grade}
                  onChange={(e) =>
                    updateSubject(index, "grade", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  {Object.keys(GRADE_POINTS).map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </td>
              <td style={tdStyle}>
                <input
                  type="number"
                  step="0.1"
                  value={subject.gpa}
                  onChange={(e) => updateSubject(index, "gpa", e.target.value)}
                />
              </td>
              <td style={tdStyle}>
                <button onClick={() => removeSubject(index)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={addSubject}>+ Add Subject</button>

      <br />
      <br />

      <div>Current semester GPA (preview): {currentSemesterGPA.toFixed(2)}</div>

      <br />

      <button onClick={saveSemester} disabled={saving}>
        {saving ? "Saving..." : "Save Semester"}
      </button>
    </div>
  );
}

const thStyle = {
  border: "1px solid #ddd",
  padding: 8,
  textAlign: "left",
  background: "#eee",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: 8,
};

export default Home;
