const express = require('express')
const { updateCandidateProfile, uploadCandidatePic, uploadPost, getAllCandidate, getAllPost, getCandidateById, deletePost, applyJob } = require('../controller/candidateProfile')
const { candidateAuth, upload } = require('../controller/middleware')

const router = express.Router()

router.patch('/candidate/updateProfile', candidateAuth, updateCandidateProfile )

router.get('/allCandidates', getAllCandidate)

router.get('/getCandidateById/:userId', getCandidateById)

router.post('/candidate/snap', candidateAuth, upload.single('snap'), uploadCandidatePic, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.post('/candidate/post', candidateAuth, upload.array('snaps', 10), uploadPost, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.get('/allPosts', getAllPost)

router.delete('/candidate/post/:id', candidateAuth, deletePost)

router.patch('/applyJob/:postId', candidateAuth, applyJob)

module.exports = router