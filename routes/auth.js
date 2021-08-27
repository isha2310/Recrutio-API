const express = require('express')
const {check } = require('express-validator')
const { signupCandidate, signupRecruiter, loginCandidate, loginRecruiter, logoutCandidate, logoutRecruiter } = require('../controller/auth')
const {candidateAuth, recruiterAuth} = require('../controller/middleware')

const router = express.Router()

router.post('/signupCandidate',[
    check('password', 'Password should be of atleast 7 characters.').isLength({min : 7}),
    check('password','Password should contain alpha-numeric characters, atleast one upper-case letter and symbol.').isStrongPassword({ minLength: 7, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1}),
    check('email', 'Enter a valid e-mail address.').isEmail()
], signupCandidate)

router.post('/signupRecruiter',[
    check('password', 'Password should be of atleast 7 characters.').isLength({min : 7}),
    check('password','Password should contain alpha-numeric characters, atleast one upper-case letter and symbol.').isStrongPassword({ minLength: 7, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1}),
    check('email', 'Enter a valid e-mail address.').isEmail()
], signupRecruiter)

router.post('/candidate/login', loginCandidate)

router.post('/recruiter/login', loginRecruiter)

router.post('/candidate/logout', candidateAuth, logoutCandidate)

router.post('/recruiter/logout', recruiterAuth, logoutRecruiter)

module.exports = router