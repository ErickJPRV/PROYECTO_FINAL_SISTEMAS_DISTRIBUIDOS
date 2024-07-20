import sql from 'mssql';

const dbConfig = {
  user: 'Empleado',
  password: 'EPISI@Ilo2024',
  server: 'localhost',
  port: 1433,
  database: 'Proyecto',
  options: {
    encrypt: false,
    enableArithAbort: true,
  },
};

const conectarALaBaseDeDatos = async () => {
  try {
    const pool = await new sql.ConnectionPool(dbConfig).connect();
    console.log('Conectado a SQL Server');
    return pool;
  } catch (err) {
    console.error('Error al conectar con SQL Server:', err);
    throw err;
  }
};
export default conectarALaBaseDeDatos;
