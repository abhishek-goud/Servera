//server.js sparate file is created because, using http in built module because its easy to integrate socket.io
import 'dotenv/config'
import http from 'http';
import app from './app.js';
import { Server as SocketIOServer } from 'socket.io';
import jwt from "jsonwebtoken"
import mongoose from 'mongoose';
import projectModel from './models/project.model.js';
import * as aiService from './services/ai.service.js'

const port = process.env.PORT;

const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: "*"
    }
});

io.use(async (socket, next) => {
    try{
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(" ")[1];
        const projectId = socket.handshake.query.projectId;

        if(!mongoose.Types.ObjectId.isValid(projectId)) return next(new Error("Invalid project ID"))

        socket.project = await projectModel.findById(projectId);
        console.log(socket.project, "line 27")

        if(!token) return next(new Error("Authentication error"));

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if(!decoded) return next(new Error("Authentication error"));

        socket.user = decoded;
        next();
    } catch(error){
        next(error)
    }
})
io.on('connection', socket => {
    socket.roomId = socket.project._id.toString();
    console.log("User connected")
    socket.join(socket.roomId)
    console.log("room id:",socket.roomId)
    socket.on('project-message', async (data) => {
        console.log(data)
        const message = data.message;

        socket.broadcast.to(socket.roomId).emit('project-message', data)
        
        // const aiIsPresentInMessage = message.includes('@ai');
        const aiIsPresentInMessage = /(^|\s)(@ai|@AI)(\s|$)/.test(message);
        if(aiIsPresentInMessage){
            console.log("Ai is present in message")
            // const prompt = message.replace('@ai', '');
            const prompt = message.replace(/\b@ai\b|\b@AI\b/g, '');
            const result = await aiService.generateResult(prompt);
            // console.log({
            //     message: result,
            //     sender: {
            //         userId: "ai",
            //         email: "AI"
            //     }})

            io.to(socket.roomId).emit('project-message',{
                message: result,
                sender: {
                    userId: "ai",
                    email: "AI"
                },
            })
            return;
        }

    })
    socket.on('event', data => { /* … */ });
    socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.leave(socket.roomId)
    });
})


server.listen(port, () => console.log(`server is running on port ${port}`))