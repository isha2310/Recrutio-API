const Candidate = require('../models/candidate')
const sharp = require('sharp')
const CandidatePost = require('../models/candidatePost')

exports.updateCandidateProfile = async (req,res) => {

    const updates = Object.keys(req.body)
    const allowedValidation = ['name', 'email', 'password', 'gender', 'skills', 'bio', 'experience', 'education','address', 'phnNumber']
    const isValid = updates.every((update) => allowedValidation.includes(update))
    if (! isValid) {
        return res.status(400).send({error : 'Invalid data'})
    }
    try {
        updates.forEach((update) => req.candidate[update] = req.body[update])
        await req.candidate.save()
        res.send(req.candidate)
    } catch (e) {
        res.status(400).send(e)
        console.log(e)
    }   
}

exports.uploadCandidatePic = async (req,res) => {

    res.set('Access-Control-Allow-Origin','*')
    res.set('Access-Control-Allow-Methods', 'POST') 
    res.set("Access-Control-Allow-Headers", 'Content-Type')
    
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).jpeg().toBuffer()
    req.candidate.snap = buffer
    await req.candidate.save()
    res.send(req.candidate)
}

exports.uploadPost = (req,res) => {
    const post = new CandidatePost({
        ...req.body,
        candidateId: req.candidate._id
    })
    try{
        post.save()
        .then((post) => res.status(201).send(post))
        .catch((e) => res.status(400).send(e))
    } catch(e) {
        res.status(400).send(e)
    }
}

exports.getAllCandidate = (req, res) => {
    Candidate.find((err, candidates) => {
        if(err){
            return res.status(401).send(err)
        }
        return res.status(200).send(candidates)
    })
}

exports.getAllPost = (req, res) => {
    CandidatePost.find( (err, posts) => {
        if(err) {
            res.status(401).send(err)
        }
        res.status(200).send(posts)
    })
}

exports.getCandidateById = async (req, res) => {
    const id = req.params.userId
    Candidate.findById(id, async (err, candidate) => {
        try{
            if(err || !candidate) {
                return res.status(404).send({
                    error: 'Candidate not found!'
                })
            }
            candidate.password = undefined
            await candidate.populate('posts').execPopulate()
            return res.status(200).send({ candidate , posts: candidate.posts})
        } catch (e) {
            res.status(400).send(e)
        }
    })
}