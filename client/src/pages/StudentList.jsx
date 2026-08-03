import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function StudentList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    try {
      const response = await API.get("/students");
      setStudents(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">All Students</h1>
            <p className="text-gray-600">Saved students and overall GPA list</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/register")}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              + Register
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-gray-600 text-white px-5 py-2 rounded-lg"
            >
              ← Back
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow p-6 text-center">
            Loading students...
          </div>
        ) : students.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-600">
            No students have been registered yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {students.map((student) => (
              <div
                key={student._id}
                className="bg-white rounded-xl shadow p-6 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold">{student.studentName}</h2>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                    {Number(student.overallCGPA || 0).toFixed(2)}
                  </span>
                </div>

                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>University:</strong>{" "}
                    {student.university || "Not selected"}
                  </p>
                  <p>
                    <strong>Degree:</strong> {student.degreeYears || 0} years
                  </p>
                  <p>
                    <strong>Semesters/year:</strong>{" "}
                    {student.semestersPerYear || 0}
                  </p>
                  <p>
                    <strong>Total GPA:</strong>{" "}
                    {Number(student.overallCGPA || 0).toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/student/${student._id}`)}
                  className="mt-5 w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700"
                >
                  View Student Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentList;
