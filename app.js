require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth')
const candidateRoutes = require('./routes/candidate')
const recruiterRoutes = require('./routes/recruiter')
const messengerRoutes = require('./routes/messenger')

const app = express()
const port = process.env.PORT || 3000

mongoose.connect(process.env.DATABASE, 
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
})
.then(() => console.log('Connected'))
.catch((err) => console.log(err))

app.use(cookieParser())
app.use(express.json({
    limit: '50mb'
}));
app.use(cors({origin: '*'}))

app.use('/api', authRoutes)
app.use('/api', candidateRoutes)
app.use('/api', recruiterRoutes)
app.use('/api', messengerRoutes)

app.listen(port, () => {
    console.log('App is ruuning at', port)
})