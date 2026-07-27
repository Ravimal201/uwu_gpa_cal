const mongoose = require("mongoose");


const SubjectSchema = new mongoose.Schema({

    subject:{
        type:String,
        required:true
    },

    credits:{
        type:Number,
        required:true
    },

    marks:{
        type:Number,
        required:true
    },

    grade:{
        type:String
    },

    gpv:{
        type:Number
    }

});


const StudentSchema = new mongoose.Schema({

    studentName:{
        type:String,
        required:true
    },


    semester:{
        type:String,
        required:true
    },


    subjects:[
        SubjectSchema
    ],


    gpa:{
        type:Number
    },


    createdAt:{
        type:Date,
        default:Date.now
    }


});


module.exports = mongoose.model(
    "Student",
    StudentSchema
);