import sql from 'mssql'

const config = {
    user: 'Empleado',
    password: 'EPISI@Ilo2024',
    server: 'DESKTOP-9R94EAG', 
    database: 'Proyecto',
    options: {
        trustedConnection: true,
        enableArithAbort: true,
        trustedServerCertificate: true
    },
    driver: 'msnodesqlv8',
};

async function conectarYConsultar() {
    try {
        await sql.connect(config);

        // Ejecutar una consulta
        const result = await sql.query`SELECT * FROM Trabajador`;

        console.log(result.recordset);

    } catch (err) {
        console.error('Error al conectar o consultar:', err);
    } finally {
        sql.close();
    }
}

conectarYConsultar();
