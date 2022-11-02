import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbConnect } from './shared/db.js';
import { mentorRoute } from "./routes/mentor.js";
import { studentRoute } from "./routes/student.js";
import { assignMentorToStudentRoute } from "./routes/assignMentorToStudent.js";

dotenv.config()

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false}));

//API endpoints
app.get("/",(request,response)=>{
    response.send("Hello Everyone. Welcome to the Backend application for Student Mentor. The API endpoints are /student, /mentor")
})

//Routes
app.use('/mentor', mentorRoute)
app.use('/student',studentRoute)
app.use('/assign-mentor',assignMentorToStudentRoute)


app.listen(process.env.PORT || 3000, async(err) => {
    await dbConnect();
    console.log("Started server");
    if(err){
        console.log(err, "error in starting server");
    }
});