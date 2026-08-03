import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudent();
  }, [id]);

  async function fetchStudent() {
    try {
      const response = await API.get(`/students/${id}`);
      setStudent(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 text-center">
        Loading student profile...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Student not found</h2>
        <button
          onClick={() => navigate("/students")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Back to Student List
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{student.studentName}</h1>
            <p className="text-gray-600">
              {student.university || "University not set"} •{" "}
              {student.degreeYears} years • {student.semestersPerYear}{" "}
              semesters/year
            </p>
          </div>

          <button
            onClick={() => navigate("/students")}
            className="bg-gray-600 text-white px-5 py-2 rounded-lg"
          >
            ← Back
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">Overall GPA</p>
            <h2 className="text-3xl font-bold text-blue-700">
              {Number(student.overallCGPA || 0).toFixed(2)}
            </h2>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">Degree Years</p>
            <h2 className="text-3xl font-bold text-green-600">
              {student.degreeYears}
            </h2>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">Semesters/Year</p>
            <h2 className="text-3xl font-bold text-purple-600">
              {student.semestersPerYear}
            </h2>
          </div>
        </div>

        {!student.academicYears || student.academicYears.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-600">
            No academic records have been added yet.
          </div>
        ) : (
          student.academicYears.map((year) => (
            <div
              key={year.yearNumber}
              className="bg-white rounded-xl shadow p-6 mb-8"
            >
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-2xl font-bold">Year {year.yearNumber}</h3>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {(year.semesters || []).map((semester) => (
                  <div
                    key={semester.semesterNumber}
                    className="border border-gray-200 rounded-xl p-4 bg-gray-50"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-lg font-bold">
                        Semester {semester.semesterNumber}
                      </h4>
                      <button
                        onClick={() =>
                          navigate(
                            `/student/${id}/year/${year.yearNumber}/semester/${semester.semesterNumber}`,
                          )
                        }
                        className="bg-blue-600 text-white px-3 py-2 rounded-lg"
                      >
                        Edit
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      Semester GPA: {Number(semester.gpa || 0).toFixed(2)}
                    </p>

                    {semester.subjects && semester.subjects.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="p-2 text-left">Subject</th>
                              <th className="p-2 text-left">Credits</th>
                              <th className="p-2 text-left">Mark</th>
                              <th className="p-2 text-left">Grade</th>
                            </tr>
                          </thead>
                          <tbody>
                            {semester.subjects.map((subject, index) => (
                              <tr
                                key={`${subject.subjectName}-${index}`}
                                className="border-b"
                              >
                                <td className="p-2">
                                  {subject.subjectName || "Untitled"}
                                </td>
                                <td className="p-2">{subject.credits || 0}</td>
                                <td className="p-2">{subject.marks || 0}</td>
                                <td className="p-2">{subject.grade || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No subjects added for this semester yet.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default StudentProfile;
