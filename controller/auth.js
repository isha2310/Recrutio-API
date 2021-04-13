const Candidate = require('../models/candidate')
const Recruiter = require('../models/recruiter')
const {validationResult} = require('express-validator')

exports.signupCandidate = async (req,res) => {

    const error = validationResult(req)
    
    if(!error.isEmpty()) {
        return res.status(422).json({
            errors: error.array()[0].msg
        })
    }
    
    const candidate = new Candidate(req.body)

    try{
        await candidate.save()
        .then((candidate) => {
            const token = candidate.generateAuthToken()
            const { _id, name } = candidate
            res.status(201).send({ candidate: {_id, name } , token})
        })
        .catch((e) => res.status(400).send(e))
    } catch(e) {
        res.status(400).send(e)
    }

}

exports.signupRecruiter = async (req,res) => {

    const error = validationResult(req)

    if(!error.isEmpty()) {
        return res.status(422).json({
            errors: error.array()[0].msg
        })
    }

    const recruiter = new Recruiter(req.body)

    try{
        await recruiter.save()
        .then((recruiter) => {
            const token = recruiter.generateAuthToken()
            const { _id, name } = recruiter
            res.status(201).send({ recruiter: {_id, name } , token})
        })
        .catch((e) => res.status(400).send(e))
    } catch(e) {
        res.status(400).send(e)
    }

}

exports.loginCandidate = async (req,res) => {

    const {email, password} = req.body
    
    try{
        Candidate.findOne({ email }, async (err, candidate) => {
            if( err || !candidate){
                return res.status(400).json({
                    error: "User doesn't exist."
                })
            } 
            if(!candidate.authenticate(password)) {
                return res.status(400).json({
                    errors: 'Email and password do not match.'
                })
            }
            const token = await candidate.generateAuthToken()
            candidate.password = undefined
            await candidate.populate('posts').execPopulate()
            res.status(201).send({ candidate , token, posts: candidate.posts})
        })
    } catch(e) {
        res.status(400).send(e)
    }
}

exports.loginRecruiter = async (req,res) => {

    const {email, password} = req.body
    
    try{
        Recruiter.findOne({ email }, async (err, recruiter) => {
            if( err || !recruiter){
                return res.status(400).json({
                    error: "User doesn't exist."
                })
            } 
            if(!recruiter.authenticate(password)) {
                return res.status(400).json({
                    errors: 'Email and password do not match.'
                })
            }
            const token = await recruiter.generateAuthToken()
            recruiter.password = undefined
            await recruiter.populate('jobPosts').execPopulate()
            res.status(201).send({ recruiter , token, jobPosts: recruiter.jobPosts})
        })
    } catch(e) {
        res.status(400).send(e)
    }
}

exports.logoutCandidate = async(req,res) => {
    try{
        req.candidate.tokens = req.candidate.tokens.filter((token) => token.token !== req.token )
        await req.candidate.save()
        res.send()
    } catch(e){
        res.status(500).send()
    }
}

exports.logoutRecruiter = async(req,res) => {
    try{
        req.recruiter.tokens = req.recruiter.tokens.filter((token) => token.token !== req.token )
        await req.recruiter.save()
        res.send()
    } catch(e){
        res.status(500).send()
    }
}