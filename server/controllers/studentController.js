const Student = require("../models/Student");

const defaultGradingScale = [
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

const calculateOverallCGPA = (student) => {
  const allSubjects = (student.academicYears || []).flatMap((year) =>
    (year.semesters || []).flatMap((semester) => semester.subjects || []),
  );

  let totalCredits = 0;
  let totalPoints = 0;

  allSubjects.forEach((subject) => {
    const credits = Number(subject.credits) || 0;
    const gpv = Number(subject.gpv) || 0;

    totalCredits += credits;
    totalPoints += credits * gpv;
  });

  return totalCredits > 0 ? totalPoints / totalCredits : 0;
};

const generateAcademicStructure = ({ degreeYears = 4, semestersPerYear = 2 }) => {
  const academicYears = [];

  for (let yearNumber = 1; yearNumber <= Number(degreeYears); yearNumber += 1) {
    const semesters = [];

    for (let semesterNumber = 1; semesterNumber <= Number(semestersPerYear); semesterNumber += 1) {
      semesters.push({
        semesterNumber,
        subjects: [],
        gpa: 0,
      });
    }

    academicYears.push({
      yearNumber,
      semesters,
    });
  }

  return academicYears;
};

exports.createStudent = async (req, res) => {
  try {
    const { studentName, university, degreeYears, semestersPerYear, gradingScale } = req.body;

    if (!studentName || !studentName.trim()) {
      return res.status(400).json({ message: "Student name is required." });
    }

    const normalizedDegreeYears = Number(degreeYears) || 4;
    const normalizedSemestersPerYear = Number(semestersPerYear) || 2;

    const student = new Student({
      studentName: studentName.trim(),
      university: university || "",
      degreeYears: normalizedDegreeYears,
      semestersPerYear: normalizedSemestersPerYear,
      gradingScale: Array.isArray(gradingScale) && gradingScale.length ? gradingScale : defaultGradingScale,
      academicYears: generateAcademicStructure({
        degreeYears: normalizedDegreeYears,
        semestersPerYear: normalizedSemestersPerYear,
      }),
      overallCGPA: 0,
    });

    const savedStudent = await student.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStudentSemester = async (req, res) => {
  try {
    const { id, yearNumber, semesterNumber } = req.params;
    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const yearValue = Number(yearNumber);
    const semesterValue = Number(semesterNumber);
    const { subjects = [], gpa } = req.body;

    let academicYear = student.academicYears.find((year) => year.yearNumber === yearValue);

    if (!academicYear) {
      academicYear = {
        yearNumber: yearValue,
        semesters: [],
      };
      student.academicYears.push(academicYear);
    }

    let semester = academicYear.semesters.find((item) => item.semesterNumber === semesterValue);

    if (!semester) {
      semester = {
        semesterNumber: semesterValue,
        subjects: [],
        gpa: 0,
      };
      academicYear.semesters.push(semester);
    }

    semester.subjects = Array.isArray(subjects)
      ? subjects.map((subject) => ({
          subjectName: subject.subjectName || "",
          credits: Number(subject.credits) || 0,
          marks: Number(subject.marks) || 0,
          grade: subject.grade || "",
          gpv: Number(subject.gpv) || 0,
        }))
      : [];

    semester.gpa = Number(gpa) || 0;
    student.overallCGPA = calculateOverallCGPA(student);

    await student.save();
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
