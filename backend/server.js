//server.js sparate file is created because, using http in built module because its easy to integrate socket.io
import 'dotenv/config'
import http from 'http';
import app from './app.js';

const port = process.env.PORT;

const server = http.createServer(app);


server.listen(port, () => console.log(`server is running on port ${port}`))