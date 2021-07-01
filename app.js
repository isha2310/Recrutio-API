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



// const app = express()
const port = process.env.PORT || 4000
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server,{
    cors: {
        origin: "https://recrutio.netlify.app",
    },
});



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

// app.listen(port, () => {
//     console.log('App is ruuning at', port)
// })

let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
    //when ceonnect
    console.log("a user connected.");

    //take userId and socketId from user
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });

    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        if(user !== undefined){
            io.to(user.socketId).emit("getMessage", {
                senderId,
                text,
            });
        }

    });

    //when disconnect
    socket.on("disconnect", () => {
        console.log("a user disconnected!");
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});



server.listen(port);