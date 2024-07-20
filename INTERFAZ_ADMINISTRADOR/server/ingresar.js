import express from 'express';
import mssql from 'mssql';
import path from 'path';

const app = express();

const config = {
    user: 'Administrador',
    password: 'Admin2024@unam',
    server: 'localhost',
    port: 1433,
    database: 'Proyecto',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};

// Configurar la carpeta Interfaz_administrador para archivos estáticos
app.use(express.static(path.join(process.cwd(), 'server', 'Interfaz_admin')));

app.get('/verificarConexion', async (req, res) => {
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

app.get('/administrador', async (req, res) => {
    const correo = req.query.correo;
    const contraseña = req.query.contraseña;

    if (!correo || !contraseña) {
        return res.status(400).send('Se requieren correo y contraseña');
    }

    try {
        await mssql.connect(config);
        const request = new mssql.Request();
        request.input('correo', mssql.VarChar, correo);
        request.input('contraseña', mssql.VarChar, contraseña);
        const result = await request.query("SELECT * FROM Trabajador WHERE Correo_Electronico = @correo AND Cargo = 'Administrador' AND Contraseña = @contraseña");
        
        if (result.recordset.length > 0) {
            res.redirect('/Administrador.html');
        } else {
            res.status(404).send('No se encontraron registros o el usuario no tiene permisos');
        }
    } catch (err) {
        console.error('Error al ejecutar consulta:', err);
        res.status(500).send('Error al ejecutar consulta');
    } finally {
        await mssql.close();
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'server', 'index.html'));
});

app.listen(5000, () => {
    console.log('Servidor escuchando en el puerto 5000...');
});
