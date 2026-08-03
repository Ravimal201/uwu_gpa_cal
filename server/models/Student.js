const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
      default: "",
    },
    credits: {
      type: Number,
      default: 0,
    },
    marks: {
      type: Number,
      default: 0,
    },
    grade: {
      type: String,
      default: "",
    },
    gpv: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const SemesterSchema = new mongoose.Schema(
  {
    semesterNumber: {
      type: Number,
      required: true,
    },
    subjects: [SubjectSchema],
    gpa: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const YearSchema = new mongoose.Schema(
  {
    yearNumber: {
      type: Number,
      required: true,
    },
    semesters: [SemesterSchema],
  },
  { _id: false },
);

const GradingScaleSchema = new mongoose.Schema(
  {
    grade: {
      type: String,
      required: true,
    },
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    gpv: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const StudentSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    university: {
      type: String,
      default: "",
    },
    degreeYears: {
      type: Number,
      default: 4,
    },
    semestersPerYear: {
      type: Number,
      default: 2,
    },
    gradingScale: [GradingScaleSchema],
    academicYears: [YearSchema],
    overallCGPA: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Student", StudentSchema);
