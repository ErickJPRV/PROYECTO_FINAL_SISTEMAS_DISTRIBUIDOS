import mssql from 'mssql';
const conectarALaBaseDeDatos = async () => {
  try {
      await mssql.connect({
          user: 'Empleado',
          password: 'EPISI@Ilo2024',
          server: 'localhost',
          port: 1433,
          database: 'Proyecto',
          options: {
              encrypt: false,
              enableArithAbort: true,
          },
      });
  } catch (error) {
      console.error("Error al conectar a la base de datos:", error.message);
      throw new Error("Error al conectar a la base de datos");
  }
};
export default conectarALaBaseDeDatos;