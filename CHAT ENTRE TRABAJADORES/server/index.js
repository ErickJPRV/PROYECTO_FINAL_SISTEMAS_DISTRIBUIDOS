import express from 'express';
import logger from 'morgan';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { createServer } from 'http';
import sql from 'mssql'; 

dotenv.config();

const port = process.env.PORT ?? 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {}
});

app.use(logger('dev'));

io.on('connection', async (socket) => {
  console.log('a user has connected');

  socket.on('disconnect', () => {
    console.log('a user has disconnected');
  });

  socket.on('chat message', async (msg) => {
    const userId = socket.handshake.auth.userid;
    try {
      const pool = await conectarALaBaseDeDatos();
      const insertQuery = 'INSERT INTO chat (message, fecha_mensaje, Id_usuario) VALUES (@msg, GETDATE(), @userId)';
      const result = await pool.request()
        .input('msg', sql.VarChar, msg)
        .input('userId', sql.Int, userId)
        .query(insertQuery);

      console.log('Mensaje insertado correctamente');
      
      const insertId = result.recordset[0].insertId;
      await pool.close();

      io.emit('chat message', msg, insertId.toString(), new Date(), userId);
    } catch (err) {
      console.error('Error al insertar mensaje:', err);
    }
  });

  if (!socket.recovered) {
    try {
      const pool = await conectarALaBaseDeDatos();
      const userId = socket.handshake.auth.userid;
      const serverOffset = socket.handshake.auth.serverOffset ?? 0;
      const query = 'SELECT IDchat, message, fecha_mensaje, nombre FROM chat INNER JOIN registros ON chat.Id_usuario = registros.IDusuario WHERE IDchat > @serverOffset';
      const result = await pool.request()
        .input('serverOffset', sql.Int, serverOffset)
        .query(query);

      result.recordset.forEach(row => {
        socket.emit('chat message', row.message, row.IDchat.toString(), row.nombre, row.fecha_mensaje);
      });

      await pool.close();
    } catch (err) {
      console.error('Error al recuperar mensajes:', err);
    }
  }
});

const dbConfig = {
  user: 'trabajador',
  password: '123$',
  server: 'localhost',
  database: 'Chat',
  options: {
    encrypt: true,
    enableArithAbort: true
  }
};

async function conectarALaBaseDeDatos() {
  try {
    const pool = await new sql.ConnectionPool(dbConfig).connect();
    console.log('Conectado a SQL Server');
    return pool;
  } catch (err) {
    console.error('Error al conectar con SQL Server:', err);
    throw err;
  }
}

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/Interfaz/Index.html');
});

server.listen(port, () => {
  console.log(`Servidor ejecutándose en el puerto ${port}`);
});
