import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const defaultGrades = [
  { grade: "A+", min: 85, max: 100, gpv: 4.0 },
  { grade: "A", min: 80, max: 84, gpv: 4.0 },
  { grade: "A-", min: 75, max: 79, gpv: 3.7 },
  { grade: "B+", min: 70, max: 74, gpv: 3.3 },
  { grade: "B", min: 65, max: 69, gpv: 3.0 },
  { grade: "B-", min: 60, max: 64, gpv: 2.7 },
  { grade: "C+", min: 55, max: 59, gpv: 2.3 },
  { grade: "C", min: 50, max: 54, gpv: 2.0 },
  { grade: "C-", min: 45, max: 49, gpv: 1.7 },
  { grade: "D+", min: 40, max: 44, gpv: 1.3 },
  { grade: "D", min: 35, max: 39, gpv: 1.0 },
  { grade: "E", min: 0, max: 34, gpv: 0 },
];

const universities = [
  "Uva Wellassa University",
  "University of Moratuwa",
  "University of Colombo",
  "University of Peradeniya",
  "University of Kelaniya",
  "University of Ruhuna",
  "SLIIT",
  "NSBM",
  "IIT",
  "Other",
];

function Register() {
  const navigate = useNavigate();
  const [customScale, setCustomScale] = useState(false);
  const [student, setStudent] = useState({
    studentName: "",
    university: "",
    degreeYears: 4,
    semestersPerYear: 2,
    gradingScale: defaultGrades,
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setStudent((prev) => ({
      ...prev,
      [name]:
        name === "degreeYears" || name === "semestersPerYear"
          ? Number(value)
          : value,
    }));
  }

  function updateGrade(index, key, value) {
    const updated = [...student.gradingScale];
    updated[index] = {
      ...updated[index],
      [key]: key === "grade" ? value : Number(value),
    };

    setStudent((prev) => ({
      ...prev,
      gradingScale: updated,
    }));
  }

  async function registerStudent(event) {
    event.preventDefault();

    if (!student.studentName.trim()) {
      alert("Please enter the student name.");
      return;
    }

    try {
      const payload = {
        ...student,
        studentName: student.studentName.trim(),
        degreeYears: Number(student.degreeYears) || 4,
        semestersPerYear: Number(student.semestersPerYear) || 2,
        gradingScale: student.gradingScale.map((item) => ({
          grade: item.grade,
          min: Number(item.min) || 0,
          max: Number(item.max) || 0,
          gpv: Number(item.gpv) || 0,
        })),
      };

      await API.post("/students", payload);
      alert("Student registered successfully.");
      navigate("/students");
    } catch (error) {
      console.error(error);
      alert("Registration failed. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Student Registration</h1>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-gray-600 text-white px-5 py-2 rounded-lg"
          >
            ← Back
          </button>
        </div>

        <form onSubmit={registerStudent}>
          <div className="mb-5">
            <label className="block font-semibold mb-2">Student Name</label>
            <input
              name="studentName"
              value={student.studentName}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              placeholder="Enter student name"
            />
          </div>

          <div className="mb-5">
            <label className="block font-semibold mb-2">University</label>
            <select
              name="university"
              value={student.university}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            >
              <option value="">Select University</option>
              {universities.map((uni) => (
                <option key={uni} value={uni}>
                  {uni}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-5">
            <label className="block font-semibold mb-2">
              Degree Duration (Years)
            </label>
            <input
              type="number"
              name="degreeYears"
              min="1"
              max="10"
              value={student.degreeYears}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />
          </div>

          <div className="mb-5">
            <label className="block font-semibold mb-2">
              Semesters Per Year
            </label>
            <select
              name="semestersPerYear"
              value={student.semestersPerYear}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            >
              <option value={2}>2 Semesters</option>
              <option value={3}>3 Semesters</option>
            </select>
          </div>

          <div className="mb-5 flex justify-between items-center">
            <h2 className="text-xl font-bold">Grading Scale</h2>
            <button
              type="button"
              onClick={() => setCustomScale(!customScale)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg"
            >
              {customScale ? "Use Default" : "Customize"}
            </button>
          </div>

          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2 text-left">Grade</th>
                  <th className="border p-2 text-left">Min</th>
                  <th className="border p-2 text-left">Max</th>
                  <th className="border p-2 text-left">GPV</th>
                </tr>
              </thead>
              <tbody>
                {student.gradingScale.map((item, index) => (
                  <tr key={`${item.grade}-${index}`}>
                    <td className="border p-2">
                      {customScale ? (
                        <input
                          type="text"
                          value={item.grade}
                          onChange={(event) =>
                            updateGrade(index, "grade", event.target.value)
                          }
                          className="w-full p-2 border rounded"
                        />
                      ) : (
                        item.grade
                      )}
                    </td>
                    <td className="border p-2">
                      {customScale ? (
                        <input
                          type="number"
                          value={item.min}
                          onChange={(event) =>
                            updateGrade(index, "min", event.target.value)
                          }
                          className="w-full p-2 border rounded"
                        />
                      ) : (
                        item.min
                      )}
                    </td>
                    <td className="border p-2">
                      {customScale ? (
                        <input
                          type="number"
                          value={item.max}
                          onChange={(event) =>
                            updateGrade(index, "max", event.target.value)
                          }
                          className="w-full p-2 border rounded"
                        />
                      ) : (
                        item.max
                      )}
                    </td>
                    <td className="border p-2">
                      {customScale ? (
                        <input
                          type="number"
                          step="0.1"
                          value={item.gpv}
                          onChange={(event) =>
                            updateGrade(index, "gpv", event.target.value)
                          }
                          className="w-full p-2 border rounded"
                        />
                      ) : (
                        item.gpv
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
            >
              Register Student
            </button>
            <button
              type="button"
              onClick={() => navigate("/students")}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700"
            >
              View Students
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
