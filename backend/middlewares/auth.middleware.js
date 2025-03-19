// import jwt from "jsonwebtoken"
// import redisClient
//  from "../services/redis.service.js";
// export const authUser = async (req, res, next) => {
//     try{
//         const token = req.cookies?.token || req.headers.authorization.split(' ')[1];

//         if(!token){
//             return res.status(401).send({errors: 'Unauthorized'})
//         }

//         const isBlacklisted = await redisClient.get(token);

//         if(isBlacklisted){
//             res.cookie('token', '')
//             return res.status(401).send({ error: 'Unauthorized User' });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//         req.user = decoded;
//         console.log("req.user-"+req.user)
//         next();
//     } catch(error){
//         console.log(error)
//         res.status(401).send({errors: "Unathorized"})
//     }
// }


import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";

export const authUser = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const isBlacklisted = await redisClient.get(token);
        if (isBlacklisted) {
            res.cookie("token", "");
            return res.status(401).json({ error: "Unauthorized User" });
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: "Invalid or expired token" });
            }
            req.user = decoded;
            console.log("Authenticated user:", req.user);
            next();
        });

    } catch (error) {
        console.error("Authentication error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
