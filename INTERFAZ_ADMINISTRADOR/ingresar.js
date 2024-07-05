const sql = require('mssql');

// Configuración de la conexión
const config = {
    user: 'tuUsuario',       // Reemplaza con tu nombre de usuario de SQL Server
    password: 'tuContraseña', // Reemplaza con tu contraseña de SQL Server
    server: 'localhost',      // Servidor de SQL Server
    database: 'tuBaseDeDatos', // Reemplaza con el nombre de tu base de datos
    options: {
        encrypt: true,        // Utilizado si tu servidor de SQL tiene SSL habilitado
        trustServerCertificate: true // Solo si es necesario para conexiones locales
    }
};

// Función asincrónica para realizar una consulta
async function hacerConsulta() {
    try {
        // Conectar al servidor
        let pool = await sql.connect(config);
        // Realizar la consulta
        let result = await pool.request().query('SELECT * FROM tuTabla'); // Reemplaza con tu consulta SQL
        console.log(result.recordset); // Mostrar los resultados en la consola
    } catch (err) {
        console.error('Error al realizar la consulta:', err);
    } finally {
        // Cerrar la conexión
        await sql.close();
    }
}

// Llamar a la función para realizar la consulta
hacerConsulta();
