const mongoose = require('mongoose')

const recruiterPostSchema = new mongoose.Schema(
    {
        role:{
            type: String,
            required: true,
            trim: true
        },
        company: {
            type: String,
            required: true
        },
        jobDescription: {
            type: String,
            required: true
        },
        salary: {
            type: Number,
            required: true
        },
        skillsRequired: {
            type: [String],
            required: true
        } ,
        recruiterId: {
            type: mongoose.Schema.Types.ObjectId , 
            required: true
        },
        candidateIds: {
            candidateId: {
                type: mongoose.Schema.Types.ObjectId 
            }  
        }
    },
    {timestamps: true}
)

module.exports = mongoose.model('RecruiterPost',recruiterPostSchema )