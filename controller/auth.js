const Candidate = require('../models/candidate')
const Recruiter = require('../models/recruiter')
const {validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')

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
        .then(async (candidate) => {
            const token = await candidate.generateAuthToken()
            const { _id, name, email } = candidate
            res.status(201).send({ candidate: {_id, name, email } , token})
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
        .then(async (recruiter) => {
            const token = await recruiter.generateAuthToken()
            const { _id, name, email } = recruiter
            res.status(201).send({ recruiter: {_id, name, email } , token})
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
            bcrypt.compare(password, candidate.password)
            .then(async (res1) => {
                if(res1 ){
                    const token = await candidate.generateAuthToken()
                    candidate.password = undefined
                    await candidate.populate('posts').execPopulate()
                    res.status(201).send({ candidate , token, posts: candidate.posts})
                }
                else if(res1 === false){
                    return res.status(400).json({
                        errors: 'Email and password do not match.'
                    }) 
                }
            }) 
            .catch((e) => console.log(e))
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
            bcrypt.compare(password, recruiter.password)
            .then(async (res1) => {
                if(res1 ){
                    const token = await recruiter.generateAuthToken()
                    recruiter.password = undefined
                    await recruiter.populate('jobPosts').execPopulate()
                    res.status(201).send({ recruiter , token, jobPosts: recruiter.jobPosts})
                }
                else if(res1 === false){
                    return res.status(400).json({
                        errors: 'Email and password do not match.'
                    }) 
                }
            }) 
            .catch((e) => console.log(e))
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