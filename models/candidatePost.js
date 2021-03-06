const mongoose = require('mongoose')

const candidatePostSchema = new mongoose.Schema(
    {
        caption: {
            type: String,
            required: true
        },
        repolink: {
            type: String
        },
        link: {
            type: String
        },
        candidateId: {
            type: mongoose.Schema.Types.ObjectId , 
            required: true
        },
        candidateName: {
            type: String,
            required: true
        },
        technologies: {
            type: [String],
            required: true
        },
        snaps: [String],
        date: {
            type: Date,
            default: Date.now
        }
    }
    
)

module.exports = mongoose.model('CandidatePost', candidatePostSchema)