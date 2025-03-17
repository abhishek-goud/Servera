import 'dotenv/config'
import express from "express";
import morgan from 'morgan';
import connect from './db/db.js';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import userRoutes from './routes/user.routes.js'
import projectRoutes from './routes/project.routes.js'


connect();


const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'))
app.use(cookieParser());
app.use(cors());

app.get('/', (req, res) => {
    res.send("Hello World")
})

app.use('/users', userRoutes);
app.use('/projects', projectRoutes);


export default app;
