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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-700 text-white px-8 py-6 shadow-md">
        <h1 className="text-3xl font-bold">University GPA Calculator</h1>

        <p className="mt-2 text-blue-100">
          You can manage your GPA through this System,
        </p>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Statistics */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h1 className="text-4xl font-bold text-blue-700 mt-2">
              {totalStudents}
            </h1>

            <h3 className="text-gray-500 text-lg">
              Students Are using this System
            </h3>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h1 className="text-4xl font-bold text-purple-600 mt-2">
              {new Set(students.map((student) => student.university)).size}
            </h1>

            <h3 className="text-gray-500 text-lg">
              Universities repesenting with this System
            </h3>
          </div>
        </div>

        {/* Quick Actions */}

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-5">Quick Actions</h2>

          <div className="grid md:grid-cols-2 gap-5">
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
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
