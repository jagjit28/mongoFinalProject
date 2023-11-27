const mongoose = require('mongoose')
const studentSchema = mongoose.Schema(
    {
        name:{
            type : String,
            required : [true, "please enter name"]
        },
        email:{
            type: String,
            unique: true,
            required : [true, "please enter email"]
        },
        password:{
            type: String,
            required : [true, "please enter password"]
        },
        verified: {
            type: Boolean,
            default: false
        },
        is_admin: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps : true
    }
)
const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
