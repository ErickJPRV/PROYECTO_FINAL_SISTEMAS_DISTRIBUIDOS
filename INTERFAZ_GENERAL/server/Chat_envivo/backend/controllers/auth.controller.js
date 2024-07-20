import bcrypt from 'bcryptjs'
import mssql from 'mssql'
import generateTokenAndSetCookie from '../utils/generateToken.js';
import conectarALaBaseDeDatos from '../db/connectsqlserver.js';
import { json } from 'express';
export const login= async (req ,res)=>{
    try{
        conectarALaBaseDeDatos()
        const {email,password} =req.body;
        const request = new mssql.Request();
        request.input('correo', mssql.VarChar, email);
        const result = await request.query("SELECT Contraseña FROM Trabajador WHERE Correo_Electronico=@email");
        const isPasswordCorrect = bcrypt.compare(password,result.recordset[0].Contraseña || "")
        if(!isPasswordCorrect){
            return res.status(400).json({error:"Correo o contraseña invalidos"})
        }

        const request1 = new mssql.Request();
        request.input('correo', mssql.VarChar, email);
        const result1 = await request.query("SELECT * FROM Trabajador WHERE Correo_Electronico=@email");
        generateTokenAndSetCookie(email,res);
        res.status(200).json({
            _id:result1.recordset[0].id_Trabajador,
            Nombre:result1.recordset[1].id_Trabajador,
            Apellido:result1.recordset[2].id_Trabajador,
            Cargo:result1.recordset[3].id_Trabajador,
            ImageUrl:result1.recordset[6].id_Trabajador
        })
    }catch(error){
        console.log("Error en el controlador de login",error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}
export const logout= (req ,res)=>{
    console.log("logoutUser");
    try{
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"El deslogeo fue exitoso"});
    }catch (error){
        console.log("Error en el controlador de deslogeo",error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}