const Student = require("../models/Student");


// Save student GPA data

exports.createStudent = async(req,res)=>{

    try{

        const student = new Student({

            studentName:req.body.studentName,

            semester:req.body.semester,

            subjects:req.body.subjects,

            gpa:req.body.gpa

        });


        const savedStudent =
        await student.save();


        res.status(201).json(savedStudent);


    }
    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};




// Get all students

exports.getStudents = async(req,res)=>{

    try{

        const students =
        await Student.find();


        res.json(students);


    }
    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};