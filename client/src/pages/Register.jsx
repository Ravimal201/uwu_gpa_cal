import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const defaultGrades = [
    {
      grade: "A+",
      min: 85,
      max: 100,
      gpv: 4.0,
    },
    {
      grade: "A-",
      min: 80,
      max: 84,
      gpv: 3.7,
    },
    {
      grade: "B+",
      min: 75,
      max: 79,
      gpv: 3.3,
    },
    {
      grade: "B",
      min: 70,
      max: 74,
      gpv: 3.0,
    },
    {
      grade: "B-",
      min: 65,
      max: 69,
      gpv: 2.7,
    },
    {
      grade: "C+",
      min: 60,
      max: 64,
      gpv: 2.3,
    },
    {
      grade: "C",
      min: 55,
      max: 59,
      gpv: 2.0,
    },
    {
      grade: "C-",
      min: 50,
      max: 54,
      gpv: 1.7,
    },
    {
      grade: "D+",
      min: 45,
      max: 49,
      gpv: 1.3,
    },
    {
      grade: "D",
      min: 40,
      max: 44,
      gpv: 1.0,
    },
    {
      grade: "E",
      min: 0,
      max: 39,
      gpv: 0,
    },
  ];

  const [student, setStudent] = useState({
    studentName: "",
    university: "",
    degreeYears: 4,
    semestersPerYear: 2,
    gradingScale: defaultGrades,
  });

  const [customScale, setCustomScale] = useState(false);

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

  function handleChange(e) {
    setStudent({
      ...student,

      [e.target.name]: e.target.value,
    });
  }

  function updateGrade(index, key, value) {
    const updated = [...student.gradingScale];

    updated[index][key] = Number(value);

    setStudent({
      ...student,

      gradingScale: updated,
    });
  }

  async function registerStudent(e) {
    e.preventDefault();

    try {
      await API.post("/students", student);

      alert("Student Registered Successfully");

      navigate("/students");
    } catch (error) {
      console.log(error);

      alert("Registration Failed");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8">
        <h1 className="text-3xl font-bold mb-6">Student Registration</h1>

        <form onSubmit={registerStudent}>
          {/* Name */}

          <label className="font-semibold">Student Name</label>

          <input
            name="studentName"
            value={student.studentName}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg mb-5"
            placeholder="Enter student name"
          />

          {/* University */}

          <label className="font-semibold">University</label>

          <select
            name="university"
            value={student.university}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg mb-5"
          >
            <option>Select University</option>

            {universities.map((uni, index) => (
              <option key={index}>{uni}</option>
            ))}
          </select>

          {/* Degree */}

          <label className="font-semibold">Degree Duration (Years)</label>

          <input
            type="number"
            name="degreeYears"
            value={student.degreeYears}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg mb-5"
          />

          {/* Semester */}

          <label className="font-semibold">Semesters Per Year</label>

          <select
            name="semestersPerYear"
            value={student.semestersPerYear}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg mb-5"
          >
            <option value="2">2 Semesters</option>

            <option value="3">3 Semesters</option>
          </select>

          {/* Grading */}

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Grading Scale</h2>

            <button
              type="button"
              onClick={() => setCustomScale(!customScale)}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              {customScale ? "Use Default" : "Customize"}
            </button>
          </div>

          <table className="w-full border mb-6">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Grade</th>

                <th>Min</th>

                <th>Max</th>

                <th>GPV</th>
              </tr>
            </thead>

            <tbody>
              {student.gradingScale.map((item, index) => (
                <tr key={index}>
                  <td className="border p-2">{item.grade}</td>

                  <td className="border">
                    {customScale ? (
                      <input
                        type="number"
                        value={item.min}
                        onChange={(e) =>
                          updateGrade(index, "min", e.target.value)
                        }
                        className="w-full p-2"
                      />
                    ) : (
                      item.min
                    )}
                  </td>

                  <td className="border">
                    {customScale ? (
                      <input
                        type="number"
                        value={item.max}
                        onChange={(e) =>
                          updateGrade(index, "max", e.target.value)
                        }
                        className="w-full p-2"
                      />
                    ) : (
                      item.max
                    )}
                  </td>

                  <td className="border">
                    {customScale ? (
                      <input
                        type="number"
                        step="0.1"
                        value={item.gpv}
                        onChange={(e) =>
                          updateGrade(index, "gpv", e.target.value)
                        }
                        className="w-full p-2"
                      />
                    ) : (
                      item.gpv
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700">
            Register Student
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="ml-4 bg-gray-500 text-white px-8 py-3 rounded-lg"
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
