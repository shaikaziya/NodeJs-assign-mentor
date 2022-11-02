import express from "express";
import { mentor } from "../shared/db.js";
import { student } from "../shared/db.js";

const router = express.Router();

//assign mentor to student
router.post("/new-mentor", async (req, res) => {
    console.log("assignMentorToStudent");
    //req has student id and mentor id
    try {
        const mentorData = await mentor.findById(req.body.mentorId);
        console.log(mentorData)
        mentorData.studentsAssigned = [
            ...mentorData.studentsAssigned,
            ...req.body.studentsArray,
        ];
        mentorData.save();
        //adding mentor to all respective students
        req.body.studentsArray.forEach(async (stud) => {
            const temp = await student.findById(stud);
            temp.mentorAssigned = req.body.mentorId;
            temp.save();
        });
        res.send("Mentor added to students and updated in mentor document too");
    }
    catch (e) {
        console.log(e, "error in assignment route")
        res.status(400).send("error");
    }
});

 //change mentor for a student
router.post("/modify-mentor", async (req, res) => {
    //req has student id and mentor id   
    try {       
        const stud = await student.findById(req.body.studentId);
        const oldMentorId = stud.mentorAssigned;
        stud.mentorAssigned = req.body.newMentorId;
        stud.save();

        //remove that student from old mentor students list and add in new mentor students list
        let oldMent = await mentor.findById(oldMentorId);

        if (oldMent.studentsAssigned.length < 0) {
            return;
        }
        else {
            const newAssigned = oldMent.studentsAssigned;
            const indexpos = newAssigned.indexOf(req.body.studentId);
            newAssigned.pop(indexpos);
            oldMent.studentsAssigned = newAssigned;
        }

        //filtering that one student and remove from studentList of mentor
        oldMent.save();

        //add the student id new mentor students assigned list
        let newMent = await mentor.findById(req.body.newMentorId);
        if (!newMent.studentsAssigned.includes(req.body.studentId)) {
            newMent.studentsAssigned = [
                ...newMent.studentsAssigned,
                req.body.studentId,
            ];
        }

        newMent.save();

        res.send("Updated mentor to respective student, updated in oldmentor and new mentor studentsAssigned list");
    }
    catch (e) {
        res.status(500).send("Error in updating mentor for student");
    }
});


export const assignMentorToStudentRoute = router;