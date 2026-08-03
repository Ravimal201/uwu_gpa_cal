const mongoose = require("mongoose");


// Subject Schema
const SubjectSchema = new mongoose.Schema({

    subject: {
        type: String,
        required: true
    },

    credits: {
        type: Number,
        required: true
    },

    marks: {
        type: Number,
        required: true
    },

    grade: {
        type: String
    },

    gpv: {
        type: Number
    }

});



// Semester Schema
const SemesterSchema = new mongoose.Schema({

    semesterName: {
        type: String,
        required: true
    },

    subjects: [
        SubjectSchema
    ],

    gpa: {
        type: Number,
        default: 0
    }

});



// Academic Year Schema
const YearSchema = new mongoose.Schema({

    yearNumber: {
        type: Number,
        required: true
    },

    semesters: [
        SemesterSchema
    ]

});




// Main Student Schema
const StudentSchema = new mongoose.Schema({


    studentName: {

        type: String,

        required: true

    },


    university: {

        type: String

    },


    degreeName: {

        type: String

    },


    degreeYears: {

        type: Number

    },


    semestersPerYear: {

        type: Number

    },


    gradingScale: {

        type: Array

    },



    academicYears: [

        YearSchema

    ],



    overallCGPA: {

        type: Number,

        default: 0

    },


    createdAt: {

        type: Date,

        default: Date.now

    }


});



module.exports = mongoose.model(
    "Student",
    StudentSchema
);