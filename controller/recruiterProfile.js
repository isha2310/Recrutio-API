const sharp = require('sharp')
const RecruiterPost = require('../models/recruiterPost')
const Recruiter = require('../models/recruiter')

exports.updateRecuiterProfile = async (req,res) => {

    const updates = Object.keys(req.body)
    const allowedValidation = ['name', 'email', 'password', 'gender', 'company', 'position','phnNumber', 'address']
    const isValid = updates.every((update) => allowedValidation.includes(update))
    if (! isValid) {
        return res.status(400).send({error : 'Invalid data'})
    }
    try {
        updates.forEach((update) => req.recruiter[update] = req.body[update])
        await req.recruiter.save()
        req.recruiter.password = undefined
        res.send(req.recruiter)
    } catch (e) {
        res.status(400).send(e)
    }   
}

exports.uploadRecruiterPic = async (req,res) => {
    
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).jpeg().toBuffer()
    req.recruiter.snap = buffer
    await req.recruiter.save()
    res.send(req.recruiter)
}

exports.uploadJobPost = (req, res) => {
    const post = new RecruiterPost( {
        ...req.body,
        recruiterId: req.recruiter._id,
        recruiterName: req.recruiter.name
    })
    try{
        post.save()
        .then((post) => res.status(201).send(post))
        .catch((e) => res.status(400).send(e))
    } catch (e) {
        res.status(400).send(e)
    }
}

exports.getRecruiterById = async(req, res) => {
    const id = req.params.id

    Recruiter.findById(id, async (err, recruiter) => {
        try{
            if(err || !recruiter) {
                return res.status(404).send({
                    error: 'User not found!'
                })
            }
            recruiter.password = undefined
            await recruiter.populate('jobPosts').execPopulate()
            return res.status(200).send({ recruiter , jobPosts: recruiter.jobPosts})
        } catch (e) {
            res.status(400).send(e)
        }
    })
}

exports.getAllRecruiters = (req, res) => {
    Recruiter.find((err, recruiters) => {
        if(err) {
            res.status(404).send(err)
        } else {
            res.status(200).send(recruiters)
        }
    })
}

exports.getAllPosts = (req, res) => {
    RecruiterPost.find((err, jobPosts) => {
        if(err) {
            res.status(404).send(err)
        } else {
            res.status(200).send(jobPosts)
        }
    })
}

exports.deleteJobPost = async (req, res) => {
    try{
        const post = await RecruiterPost.findOneAndDelete({ _id: req.params.id })
        if(!post){
            res.status(404).send()
        }
        await req.recruiter.populate('jobPosts').execPopulate()
        res.status(200).send({post, jobPosts: req.recruiter.jobPosts})
    } catch (e) {
        res.status(500).send(e)
    }
}