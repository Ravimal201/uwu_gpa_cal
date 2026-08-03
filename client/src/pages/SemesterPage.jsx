import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function SemesterPage() {
  const { id, year, semester } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudent();
  }, [id]);

  async function fetchStudent() {
    try {
      const response = await API.get(`/students/${id}`);
      const data = response.data;
      setStudent(data);

      const selectedYear = data.academicYears?.find(
        (entry) => entry.yearNumber === Number(year),
      );
      const selectedSemester = selectedYear?.semesters?.find(
        (entry) => entry.semesterNumber === Number(semester),
      );

      setSubjects(selectedSemester?.subjects || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const calculateGrade = (marks) => {
    if (
      !student ||
      !student.gradingScale ||
      student.gradingScale.length === 0
    ) {
      return { grade: "E", gpv: 0 };
    }

    const result = student.gradingScale.find(
      (item) =>
        Number(marks) >= Number(item.min) && Number(marks) <= Number(item.max),
    );

    return result || { grade: "E", gpv: 0 };
  };

  const resolveSubjectGrade = (subject) => {
    if (subject.inputMode === "grade") {
      const selectedGrade = student?.gradingScale?.find(
        (item) => item.grade === subject.grade,
      );

      if (selectedGrade) {
        return {
          grade: selectedGrade.grade,
          gpv: Number(selectedGrade.gpv) || 0,
          marks: Number(subject.marks) || 0,
        };
      }

      return {
        grade: subject.grade || "E",
        gpv: 0,
        marks: Number(subject.marks) || 0,
      };
    }

    return {
      ...calculateGrade(Number(subject.marks) || 0),
      marks: Number(subject.marks) || 0,
    };
  };

  const calculateGPA = useMemo(() => {
    let totalCredits = 0;
    let totalPoints = 0;

    subjects.forEach((subject) => {
      const result = resolveSubjectGrade(subject);
      const credits = Number(subject.credits) || 0;

      totalCredits += credits;
      totalPoints += credits * (Number(result.gpv) || 0);
    });

    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  }, [subjects, student]);

  function addSubject() {
    setSubjects((prev) => [
      ...prev,
      {
        subjectName: "",
        credits: 3,
        marks: "",
        grade: "A",
        gpv: 4,
        inputMode: "grade",
      },
    ]);
  }

  function updateSubject(index, field, value) {
    const updated = [...subjects];

    if (field === "inputMode") {
      updated[index] = {
        ...updated[index],
        inputMode: value,
      };
      setSubjects(updated);
      return;
    }

    updated[index] = {
      ...updated[index],
      [field]: field === "credits" || field === "marks" ? value : value,
    };
    setSubjects(updated);
  }

  function removeSubject(index) {
    setSubjects((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  }

  async function saveSemester() {
    try {
      const updatedSubjects = subjects.map((subject) => {
        const result = resolveSubjectGrade(subject);

        return {
          subjectName: subject.subjectName || "",
          credits: Number(subject.credits) || 0,
          marks: Number(subject.marks) || 0,
          grade: result.grade,
          gpv: Number(result.gpv) || 0,
          inputMode: subject.inputMode || "grade",
        };
      });

      await API.put(`/students/${id}/year/${year}/semester/${semester}`, {
        subjects: updatedSubjects,
        gpa: calculateGPA,
      });

      alert("Semester saved successfully.");
      navigate(`/student/${id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to save semester.");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 text-center">
        Loading semester editor...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">
              Year {year} - Semester {semester}
            </h1>
            <p className="text-gray-500">Add or edit subjects and marks</p>
          </div>

          <button
            onClick={() => navigate(`/student/${id}`)}
            className="bg-gray-600 text-white px-5 py-2 rounded-lg"
          >
            ← Back
          </button>
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2 text-left">Subject</th>
                <th className="border p-2 text-left">Credits</th>
                <th className="border p-2 text-left">Input Type</th>
                <th className="border p-2 text-left">Grade / Marks</th>
                <th className="border p-2 text-left">GPV</th>
                <th className="border p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, index) => {
                const result = resolveSubjectGrade(subject);

                return (
                  <tr key={index}>
                    <td className="border p-2">
                      <input
                        value={subject.subjectName}
                        onChange={(event) =>
                          updateSubject(
                            index,
                            "subjectName",
                            event.target.value,
                          )
                        }
                        className="w-full p-2 border rounded"
                        placeholder="Subject name"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        min="0"
                        value={subject.credits}
                        onChange={(event) =>
                          updateSubject(index, "credits", event.target.value)
                        }
                        className="w-full p-2 border rounded"
                      />
                    </td>
                    <td className="border p-2">
                      <select
                        value={subject.inputMode || "grade"}
                        onChange={(event) =>
                          updateSubject(index, "inputMode", event.target.value)
                        }
                        className="w-full p-2 border rounded"
                      >
                        <option value="grade">Grade</option>
                        <option value="marks">Marks</option>
                      </select>
                    </td>
                    <td className="border p-2">
                      {subject.inputMode === "marks" ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={subject.marks}
                          onChange={(event) =>
                            updateSubject(index, "marks", event.target.value)
                          }
                          className="w-full p-2 border rounded"
                          placeholder="Marks"
                        />
                      ) : (
                        <select
                          value={subject.grade || "A"}
                          onChange={(event) =>
                            updateSubject(index, "grade", event.target.value)
                          }
                          className="w-full p-2 border rounded"
                        >
                          {student?.gradingScale?.map((scaleItem) => (
                            <option
                              key={scaleItem.grade}
                              value={scaleItem.grade}
                            >
                              {scaleItem.grade}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="border p-2">
                      {Number(result.gpv).toFixed(1)}
                    </td>
                    <td className="border p-2">
                      <button
                        onClick={() => removeSubject(index)}
                        className="bg-red-500 text-white px-3 py-2 rounded-lg"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={addSubject}
            className="bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            + Add Subject
          </button>

          <div className="text-xl font-bold">
            GPA:{" "}
            <span className="text-blue-600">{calculateGPA.toFixed(2)}</span>
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
