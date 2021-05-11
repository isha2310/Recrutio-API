const mongoose = require('mongoose')
const RecruiterPost = require('./recruiterPost')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const recruiterSchema = new mongoose.Schema(
    {      
        name: {
            type: String,
            required: true,
            trim: true,           
        },
        password: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            unique:true,
            required: true,
            trim: true,
            lowercase: true 
        },
        gender: {
            type: String
        },
        company: {
            type: String
        },
        position: {
            type: String
        },
        snap: {
            type: Buffer
        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }]
    }
)

recruiterSchema.virtual('jobPosts', {
    ref: 'RecruiterPost',
    localField: '_id',
    foreignField: 'recruiterId'
})

recruiterSchema.pre('save' , async function(next) {
    const recruiter = this
    if(recruiter.isModified('password')){
        recruiter.password = await bcrypt.hash(recruiter.password , 8)
    }
    next()
})

recruiterSchema.methods.generateAuthToken = async function() {
    const recruiter = this
    const token = jwt.sign({_id : recruiter._id} , process.env.JWT_SECRET)
    recruiter.tokens = recruiter.tokens.concat({ token })
    await recruiter.save()
    return token
}

module.exports = mongoose.model('Recruiter', recruiterSchema)