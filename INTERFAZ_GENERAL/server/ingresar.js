import express from 'express';
import path from 'path';
import session from 'express-session';
import mssql from 'mssql';
import trabajadorRoutes from './Interfaz_trabajador/empleado.js';

const app = express();
const PORT = 5000;

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

// Middleware para analizar cuerpos JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar sesiones
app.use(session({
  secret: 'mi_secreto_super_secreto',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Configurar ruta para servir Empleado.html
app.get('/Interfaz_trabajador/Empleado.html', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'server', 'Interfaz_trabajador', 'Empleado.html'));
});

// Ruta para verificar la conexión a SQL Server
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

// Ruta para procesar el formulario de trabajador
app.post('/trabajador', async (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).send('Se requieren correo y contraseña');
  }

  try {
    await mssql.connect(config);
    const request = new mssql.Request();
    request.input('correo', mssql.VarChar, correo);
    request.input('contraseña', mssql.VarChar, contraseña);
    const result = await request.query('SELECT Nombres,Apellidos,Correo_Electronico FROM Trabajador WHERE Correo_Electronico = @correo AND Contraseña = @contraseña');

    if (result.recordset.length > 0) {
      // Guardar los datos del trabajador en la sesión
      req.session.trabajador = result.recordset[0];
      res.redirect('/Interfaz_trabajador/Empleado.html');
    } else {
      res.status(404).send('No se encontraron registros o contraseña errónea');
    }
  } catch (err) {
    console.error('Error al ejecutar consulta:', err);
    res.status(500).send('Error al ejecutar consulta');
  } finally {
    mssql.close();
  }
});

// Usar las rutas definidas en empleado.js
app.use('/Interfaz_trabajador', trabajadorRoutes);

// Ruta principal para servir index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'server', 'index.html'));
});



// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}...`);
});
