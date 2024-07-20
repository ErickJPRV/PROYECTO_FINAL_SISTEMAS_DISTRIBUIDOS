import jwt from 'jsonwebtoken';
import {findUserById} from '../models/user.model.js'
const protectRoute=async (req,res,next)=>{
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({error:"Unauthorized - No token Provited"})
        }
        const decoded= jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded){
            return res.status(401).json({error:"Unauthorized - Invalid Token"})
        }
        const userId=decoded.userId;
        const user= await findUserById(userId)
        if (!user) {
            return res.status(404).json({error:"User not foun"})
        }
        req.user=user;
        next();
    } catch (error) {
        console.log("Error en la proteccion middleware de la ruta",error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}

export default protectRoute;