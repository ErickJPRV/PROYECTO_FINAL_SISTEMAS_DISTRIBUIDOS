import mssql from 'mssql';

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

export const findUserById = async (userId) => {
  try {
    // Conectar a SQL Server
    await mssql.connect(config);
    const request = new mssql.Request();

    // Pasar el parámetro a la consulta
    request.input('userId', mssql.Int, userId);

    // Ejecutar la consulta
    const result = await request.query(
      "SELECT Nombres,Apellidos,Cargo  FROM Trabajador WHERE UserId = @userId"
    );

    if (result.recordset.length > 0) {
      return result.recordset[0]; // Devolver el primer (y único) registro encontrado
    } else {
      console.log('Usuario no encontrado');
      return null;
    }
  } catch (err) {
    console.error('Error al encontrar el usuario:', err);
    return null;
  } finally {
    // Cerrar la conexión a SQL Server
    mssql.close();
  }
};
export const getUsersForSidebar = async (loggedInUserId) => {
  try {
      const pool = await mssql.connect(config);
      const result = await pool.request()
          .input('loggedInUserId', mssql.Int, loggedInUserId)
          .query(`
              SELECT user_id AS id, full_name AS fullName, username, gender, profile_pic AS profilePic
              FROM Users
              WHERE user_id <> @loggedInUserId
          `);

      return result.recordset;
  } catch (error) {
      console.error('Error getting users for sidebar:', error);
      throw error;
  }
};
