import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/message.routes.js'
import userRoutes from './routes/userRoute.routes.js'

import conectarALaBaseDeDatos from './db/connectsqlserver.js';

const app= express();
dotenv.config()
const PORT=process.env.PORT || 5000; //que ponga el puerto desde el archivo env o en el 5000;
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);
app.use("/api/users",userRoutes);

app.use(cookieParser());

app.listen(PORT,()=> {
    conectarALaBaseDeDatos();
    console.log(`Server Running on port ${PORT}`)}
)