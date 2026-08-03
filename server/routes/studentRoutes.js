const express = require("express");

const router = express.Router();

const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudentSemester,
} = require("../controllers/studentController");

router.post("/", createStudent);
router.get("/", getStudents);
router.get("/:id", getStudentById);
router.put("/:id/year/:yearNumber/semester/:semesterNumber", updateStudentSemester);

module.exports = router;
