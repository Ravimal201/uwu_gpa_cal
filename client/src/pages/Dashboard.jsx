import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/students");
      setStudents(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const totalStudents = students.length;

  const averageCGPA =
    students.length > 0
      ? (
          students.reduce(
            (sum, student) => sum + (student.overallCGPA || 0),
            0,
          ) / students.length
        ).toFixed(2)
      : "0.00";

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-700 text-white px-8 py-6 shadow-md">
        <h1 className="text-3xl font-bold">
          Academic Record Management System
        </h1>

        <p className="mt-2 text-blue-100">
          Manage Students, GPA, CGPA and Academic Records
        </p>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Statistics */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-500 text-lg">Total Students</h3>

            <h1 className="text-4xl font-bold text-blue-700 mt-2">
              {totalStudents}
            </h1>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-500 text-lg">Average CGPA</h3>

            <h1 className="text-4xl font-bold text-green-600 mt-2">
              {averageCGPA}
            </h1>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-500 text-lg">Universities</h3>

            <h1 className="text-4xl font-bold text-purple-600 mt-2">
              {new Set(students.map((student) => student.university)).size}
            </h1>
          </div>
        </div>

        {/* Quick Actions */}

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-5">Quick Actions</h2>

          <div className="grid md:grid-cols-3 gap-5">
            <button
              onClick={() => navigate("/register")}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-6 transition"
            >
              <h3 className="text-xl font-bold">Register Student</h3>

              <p className="mt-2 text-blue-100">Add a new student profile</p>
            </button>

            <button
              onClick={() => navigate("/students")}
              className="bg-green-600 hover:bg-green-700 text-white rounded-xl p-6 transition"
            >
              <h3 className="text-xl font-bold">Student List</h3>

              <p className="mt-2 text-green-100">
                View all registered students
              </p>
            </button>

            <button
              onClick={() => navigate("/grading")}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl p-6 transition"
            >
              <h3 className="text-xl font-bold">Grading Scales</h3>

              <p className="mt-2 text-purple-100">Manage grading systems</p>
            </button>
          </div>
        </div>

        {/* Recent Students */}

        <div className="mt-12">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold">Recently Registered Students</h2>

            <button
              onClick={() => navigate("/students")}
              className="text-blue-600 font-semibold"
            >
              View All
            </button>
          </div>

          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left px-5 py-3">Student Name</th>

                  <th className="text-left px-5 py-3">University</th>

                  <th className="text-left px-5 py-3">Degree</th>

                  <th className="text-left px-5 py-3">CGPA</th>

                  <th className="text-center px-5 py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8">
                      Loading...
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8">
                      No students found.
                    </td>
                  </tr>
                ) : (
                  students.slice(0, 5).map((student) => (
                    <tr key={student._id} className="border-b hover:bg-gray-50">
                      <td className="px-5 py-4">{student.studentName}</td>

                      <td className="px-5 py-4">{student.university}</td>

                      <td className="px-5 py-4">{student.degreeYears} Years</td>

                      <td className="px-5 py-4">
                        {student.overallCGPA || "0.00"}
                      </td>

                      <td className="text-center">
                        <button
                          onClick={() => navigate(`/student/${student._id}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                        >
                          Open
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
