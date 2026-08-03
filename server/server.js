const express=require("express");
const cors=require("cors");
require("dotenv").config();

const connectDB=require("./config/db");


const app=express();


connectDB();


app.use(cors());

app.use(express.json());



app.get("/",(req,res)=>{

    res.send("API Running...");

});



app.use(
"/api/students",
require("./routes/studentRoutes")
);



app.listen(
process.env.PORT,
()=>{

console.log(
`Server running on ${process.env.PORT}`
);

});