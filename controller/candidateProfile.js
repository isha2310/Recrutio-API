const Candidate = require('../models/candidate')
const sharp = require('sharp')
const CandidatePost = require('../models/candidatePost')
const cloudinary = require('./cloudinary')

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

    let origin = req.get('Origin')

    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Methods', 'POST') 
    res.header("Access-Control-Allow-Headers", '*')
    
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).jpeg().toBuffer()
    req.candidate.snap = buffer
    await req.candidate.save()
    return res.status(200).send(req.candidate)
}

exports.uploadPost = async (req,res) => {
    const post = new CandidatePost({
        ...req.body,
        candidateId: req.candidate._id,
        candidateName: req.candidate.name
    })
    if(req.files) {
        post.snaps = []
        console.log('yes')
        try{
            for(let i = 0; i< req.files.length; i++){
                let file = Buffer.from(req.files[i].buffer)
                file = file.toString('base64')
                let f = 'data:image/png;base64,' + file
                const uploadResponse = await cloudinary.cloudinary.uploader.upload(f, {
                    upload_preset: 'recrutio',
                    overwrite: true,
                    format: 'png'
                })
                post.snaps.push(uploadResponse.secure_url)
            }
        } catch (e) {
            res.status(400).send(e)
        }
    }    
    try{
        console.log(post)
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