const jwt = require('jsonwebtoken')
const Candidate = require('../models/candidate')
const Recruiter = require('../models/recruiter')
const multer = require('multer')

exports.candidateAuth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ' , '')
        const decode = jwt.verify(token , process.env.JWT_SECRET)
        const candidate = await Candidate.findOne({_id : decode._id , 'tokens.token' : token})
        if(! candidate){
            throw new Error
        }
        req.token = token
        req.candidate = candidate
        next()
    } catch(e) {
        res.status(401).send({error : 'Please autheticate!'})
    }
}

exports.recruiterAuth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ' , '')
        const decode = jwt.verify(token , process.env.JWT_SECRET)
        const recruiter = await Recruiter.findOne({_id : decode._id , 'tokens.token' : token})
        if(! recruiter){
            throw new Error
        }
        req.token = token
        req.recruiter = recruiter
        next()
    } catch(e) {
        res.status(401).send({error : 'Please autheticate!'})
    }
}

exports.upload = multer({ 
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error ('Upload an image'))
        }
        cb(undefined, true)
    }
})