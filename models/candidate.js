const mongoose = require('mongoose')
const CandidatePost = require('./candidatePost')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const candidateSchema = new mongoose.Schema(
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
         bio:{
            type: String
        },
        skills: [String] ,
        experience: [
        {
            title: {
                type: String,
                required: true
            },
            company: {
                type: String,
                required: true
            },
            location: {
                type: String
            },
            from: {
                type: Date,
                required: true
            },
            to: {
                type: Date
            },
            current: {
                type: Boolean,
                default: false
            },
            description: {
                type: String
            }
        }],
        education: [
            {
              school: {
                type: String,
                required: true
              },
              degree: {
                type: String,
                required: true
              },
              fieldofstudy: {
                type: String,
                required: true
              },
              from: {
                type: Date,
                required: true
              },
              to: {
                type: Date
              },
              current: {
                type: Boolean,
                default: false
              }
            }],
        snap: {
            type: Buffer
        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }]
    },{
        timestamps: true
    }
)

candidateSchema.virtual('posts', {
    ref: 'CandidatePost',
    localField: '_id',
    foreignField: 'candidateId'
})

candidateSchema.pre('save' , async function(next) {
    const candidate = this
    if(candidate.isModified('password')){
        candidate.password = await bcrypt.hash(candidate.password , 8)
    }
    next()
})

candidateSchema.methods.generateAuthToken = async function() {
    const candidate = this
    const token = jwt.sign({_id : candidate._id} , process.env.JWT_SECRET)
    candidate.tokens = candidate.tokens.concat({ token })
    await candidate.save()
    return token
}

candidateSchema.methods.authenticate = function(password) {
    if(bcrypt.compare(password, this.password))
        return true
  return false
}

module.exports = mongoose.model('Candidate', candidateSchema)