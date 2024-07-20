import jwt from 'jsonwebtoken'

const generateTokenAndSetCookie=(userId,res)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn: '15d'
    })
    res.cookie("jwt",token,{
        maxAge: 15 * 24 * 60 * 60 * 1000, //milisegundos
        httpOnly:true, ///para prevenir ataques XSS
        sameSite:"strict", // ataques CSRF
        secure: process.env.NODE_ENV !== "development",
    });
};

export default generateTokenAndSetCookie;
// Para generar una cookie para el usuario asi se mantendra siempre