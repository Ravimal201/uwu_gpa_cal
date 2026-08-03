import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function SemesterPage() {
  const { id, year, semester } = useParams();

  const navigate = useNavigate();

  const [student, setStudent] = useState(null);

  const [subjects, setSubjects] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSemester();
  }, []);

  const fetchSemester = async () => {
    try {
      const response = await API.get(`/students/${id}`);

      const data = response.data;

      setStudent(data);

      const selectedYear = data.academicYears.find(
        (y) => y.yearNumber === Number(year),
      );

      const selectedSemester = selectedYear.semesters.find(
        (s) => s.semesterNumber === Number(semester),
      );

      setSubjects(selectedSemester.subjects || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addSubject = () => {
    setSubjects([
      ...subjects,

      {
        subjectCode: "",

        subjectName: "",

        credits: 3,

        marks: 0,

        grade: "",

        gpv: 0,
      },
    ]);
  };

  const updateSubject = (index, field, value) => {
    const updated = [...subjects];

    updated[index][field] = value;

    setSubjects(updated);
  };

  const removeSubject = (index) => {
    const updated = subjects.filter((_, i) => i !== index);

    setSubjects(updated);
  };

  const calculateGrade = (marks) => {
    const scale = student.gradingScale;

    const result = scale.find((item) => marks >= item.min && marks <= item.max);

    return (
      result || {
        grade: "E",

        gpv: 0,
      }
    );
  };

  const calculateGPA = () => {
    let totalCredits = 0;

    let totalPoints = 0;

    subjects.forEach((subject) => {
      const result = calculateGrade(Number(subject.marks));

      totalCredits += Number(subject.credits);

      totalPoints += Number(subject.credits) * result.gpv;
    });

    if (totalCredits === 0) return 0;

    return (totalPoints / totalCredits).toFixed(2);
  };

  const saveSemester = async () => {
    try {
      const updatedSubjects = subjects.map((subject) => {
        const result = calculateGrade(Number(subject.marks));

        return {
          ...subject,

          grade: result.grade,

          gpv: result.gpv,
        };
      });

      await API.put(
        `/students/${id}/year/${year}/semester/${semester}`,

        {
          subjects: updatedSubjects,

          gpa: calculateGPA(),
        },
      );

      alert("Semester Saved Successfully");

      navigate(`/student/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <h2 className="p-10">Loading...</h2>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow rounded-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">
              Year {year} - Semester {semester}
            </h1>

            <p className="text-gray-500">Add subjects and calculate GPA</p>
          </div>

          <button
            onClick={() => navigate(`/student/${id}`)}
            className="bg-gray-600 text-white px-5 py-2 rounded-lg"
          >
            ← Back
          </button>
        </div>

        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 border">Code</th>

              <th className="p-3 border">Subject</th>

              <th className="p-3 border">Credits</th>

              <th className="p-3 border">Marks</th>

              <th className="p-3 border">Grade</th>

              <th className="p-3 border">GPV</th>

              <th className="p-3 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {subjects.map((subject, index) => (
              <tr key={index}>
                <td className="border">
                  <input
                    value={subject.subjectCode}
                    onChange={(e) =>
                      updateSubject(index, "subjectCode", e.target.value)
                    }
                    className="w-full p-2"
                  />
                </td>

                <td className="border">
                  <input
                    value={subject.subjectName}
                    onChange={(e) =>
                      updateSubject(index, "subjectName", e.target.value)
                    }
                    className="w-full p-2"
                  />
                </td>

                <td className="border">
                  <input
                    type="number"
                    value={subject.credits}
                    onChange={(e) =>
                      updateSubject(index, "credits", e.target.value)
                    }
                    className="w-full p-2"
                  />
                </td>

                <td className="border">
                  <input
                    type="number"
                    value={subject.marks}
                    onChange={(e) =>
                      updateSubject(index, "marks", e.target.value)
                    }
                    className="w-full p-2"
                  />
                </td>

                <td className="border text-center">
                  {calculateGrade(Number(subject.marks)).grade}
                </td>

                <td className="border text-center">
                  {calculateGrade(Number(subject.marks)).gpv}
                </td>

                <td className="border text-center">
                  <button
                    onClick={() => removeSubject(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between mt-8">
          <button
            onClick={addSubject}
            className="bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            + Add Subject
          </button>

          <div className="text-xl font-bold">
            GPA :<span className="text-blue-600">{calculateGPA()}</span>
          </div>

          <button
            onClick={saveSemester}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg"
          >
            Save Semester
          </button>
        </div>
      </div>
    </div>
  );
}

export default SemesterPage;
