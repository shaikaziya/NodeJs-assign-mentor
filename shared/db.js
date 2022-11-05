import mongoose, { Schema } from "mongoose";

export const dbConnect = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URL,{useNewUrlParser: true, useUnifiedTopology: true});
        console.log(`DB Connected\nServer listening to PORT ${process.env.PORT}`);
    }
    catch(e){
        console.log(e.message, "error in connecting db"); 
    }
}

const studentSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    course: {
        type: String,
        required: true,
    },
    mentorAssigned: {
        type: String,
        default: null,
        ref: "mentors",
    },
});

export const student = mongoose.model("students", studentSchema);

const mentorSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true,
    },
    expertise:{
        type: String,
        required: true,
    },
    studentsAssigned: []    
});

export const mentor = mongoose.model("mentors", mentorSchema)

