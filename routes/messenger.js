const express = require('express')
const { setConversation, getConversation, setMessage, getMessages } = require('../controller/messenger')

const router = express.Router()



router.post('/conversation', setConversation)

router.post('/message', setMessage)

router.get('/conversation:userId', getConversation )

router.get('/message/:conversationId', getMessages)


module.exports = router