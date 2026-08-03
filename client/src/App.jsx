import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import StudentList from "./pages/StudentList";
import StudentProfile from "./pages/StudentProfile";
import SemesterPage from "./pages/SemesterPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/students" element={<StudentList />} />
        <Route path="/student/:id" element={<StudentProfile />} />
        <Route
          path="/student/:id/year/:year/semester/:semester"
          element={<SemesterPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
