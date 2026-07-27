const Student = require("../models/Student");
const calculateGrade = require("../utils/gradeCalculator");



exports.createStudent = async(req,res)=>{

try{


const {
    studentName,
    semester,
    subjects
}=req.body;



let totalCredits=0;
let totalPoints=0;



subjects.forEach(subject=>{


    const result = calculateGrade(subject.marks);


    subject.grade=result.grade;

    subject.gpv=result.gpv;



    totalCredits += subject.credits;


    totalPoints += subject.credits * result.gpv;


});



const gpa = totalPoints / totalCredits;



const student = new Student({

    studentName,
    semester,
    subjects,
    gpa:gpa.toFixed(2)

});



await student.save();



res.status(201).json(student);



}

catch(error){

res.status(500).json({
    message:error.message
});

}


};