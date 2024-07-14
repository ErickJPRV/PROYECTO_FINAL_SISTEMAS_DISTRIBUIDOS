import express from 'express';
import mssql from 'mssql';
import path from 'path'
import trabajadorRoutes from './Interfaz_trabajador/empleado.js'
const app = express();
const config = {
    user: 'Empleado', 
    password: 'EPISI@Ilo2024',
    server: 'localhost', 
    port: 1433, 
    database: 'Proyecto',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};

app.get('/verificarConexion', async function (req, res) {
    try {
        await mssql.connect(config);
        console.log('Conexión exitosa a SQL Server');
        res.send('Conexión exitosa a SQL Server');
    } catch (err) {
        console.error('Error al conectar a SQL Server:', err);
        res.status(500).send('Error al conectar a SQL Server');
    } finally {
        await mssql.close();
    }
});

app.get('/trabajador', async function (req, res) {
    const correo=req.query.correo;
    if(!correo){
        return res.status(400).send('Se requiere correo');
    }
    else{    
         try {
             await mssql.connect(config);
             const request = new mssql.Request();
             request.input('correo',mssql.VarChar,correo)
             const result = await request.query('SELECT * FROM Trabajador Where Correo_Electronico=@correo');
             if(result.recordset.length>0){
                res.redirect('/Interfaz_trabajador/Empleado.html')
             }
             else{
                res.status(404).send('No se encontraron registros')
             }
         } catch (err) {
             console.error('Error al ejecutar consulta:', err);
             res.status(500).send('Error al ejecutar consulta');
         } finally {
             await mssql.close();
         }
}});
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'server', 'index.html'));
});

app.use('/Interfaz_trabajador', trabajadorRoutes);

app.listen(5000, function () {
    console.log('Servidor escuchando en el puerto 5000...');
});
