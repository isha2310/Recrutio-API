const express = require('express')
const { recruiterAuth, upload } = require('../controller/middleware')
const { updateRecuiterProfile, uploadRecruiterPic, uploadJobPost, getRecruiterById, getAllRecruiters, getAllPosts, deleteJobPost } = require('../controller/recruiterProfile')

const router = express.Router()

router.patch('/recruiter/updateProfile', recruiterAuth, updateRecuiterProfile )

router.get('/recruiter/:id', getRecruiterById)

router.get('/allRecruiters', getAllRecruiters)

router.post('/recruiter/snap', recruiterAuth, upload.single('snap'), uploadRecruiterPic, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.post('/recruiter/jobPost', recruiterAuth, uploadJobPost)

router.get('/allJobPosts', getAllPosts)

router.delete('/recruiter/jobPost/:id', recruiterAuth, deleteJobPost)

module.exports = router