import jwt from "jsonwebtoken"
import redisClient
 from "../services/redis.service.js";
export const authUser = async (req, res, next) => {
    try{
        const token = req.cookies?.token || req.headers.authorization.split(' ')[1];

        if(!token){
            return res.status(401).send({errors: 'Unauthorized'})
        }

        const isBlacklisted = await redisClient.get(token);

        if(isBlacklisted){
            res.cookie('token', '')
            return res.status(401).send({ error: 'Unauthorized User' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        console.log("req.user-"+req.user)
        next();
    } catch(error){
        console.log(error)
        res.status(401).send({errors: "Unathorized"})
    }
}