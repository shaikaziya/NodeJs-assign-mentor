import express from "express";
import { mentor } from "../shared/db.js";
import { student } from "../shared/db.js";

const router = express.Router();

//get a mentor
router.get("/", async(req,res)=>{
    try{
        const data = await mentor.find(); 
        res.send(data);
    }
    catch(e){
        res.status(400).send(e);
    }
});

//create a mentor
router.post("/", async(req,res)=>{
    try{
        const data = await mentor.create({
            name: req.body.name,
            email: req.body.email,
            mobile:req.body.mobile,
            expertise: req.body.expertise,
            studentsAssigned: req.body.studentsAssigned,
        });
        res.send(data);        
    }
    catch(e) {
        console.log(e,"error");
        res.status(400).send("Error")
    }
});

//Get all students for a mentor
router.get("/:id", async(req,res) =>{
    const temp = [];
    let studArray = [];
    try{       
        const ment = await mentor.findById(req.params.id)       
        studArray = ment.studentsAssigned;      
        for(var i = 0; i < studArray.length; i++){    
            const stud = studArray[i];            
            const res = await student.findById(stud);
            temp.push(res);            
        }       
        res.send(`studentsAssigned:\n[${temp}]`);
    }
    catch(e){
        console.log(e, "error");
        res.status(500).send("error in getting all students for a mentor");
    }
})

export const mentorRoute = router;