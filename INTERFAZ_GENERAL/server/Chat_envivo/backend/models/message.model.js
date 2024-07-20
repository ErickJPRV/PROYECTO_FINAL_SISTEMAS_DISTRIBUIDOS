import mssql from 'mssql';
import config from '../db/connectsqlserver.js'; // Tu configuración de base de datos

export const findConversation = async (senderId, receiverId) => {
    try {
        const pool = await mssql.connect(config);

        // Consulta SQL para encontrar la conversación
        const result = await pool.request()
            .input('senderId', mssql.Int, senderId)
            .input('receiverId', mssql.Int, receiverId)
            .query(`
                SELECT conversation_id
                FROM Participants p1
                JOIN Participants p2 ON p1.conversation_id = p2.conversation_id
                WHERE p1.user_id = @senderId AND p2.user_id = @receiverId
                GROUP BY conversation_id
                HAVING COUNT(DISTINCT p1.user_id) = 2
            `);

        if (result.recordset.length > 0) {
            return result.recordset[0].conversation_id;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error finding conversation:', error);
        throw error;
    }
};

export const createConversation = async (senderId, receiverId) => {
    try {
        const pool = await mssql.connect(config);

        // Insertar una nueva conversación
        const result = await pool.request()
            .query(`
                INSERT INTO Conversations (created_at, updated_at)
                OUTPUT INSERTED.conversation_id
                VALUES (GETDATE(), GETDATE())
            `);

        const conversationId = result.recordset[0].conversation_id;

        // Insertar participantes
        await pool.request()
            .input('conversationId', mssql.Int, conversationId)
            .input('senderId', mssql.Int, senderId)
            .input('receiverId', mssql.Int, receiverId)
            .query(`
                INSERT INTO Participants (conversation_id, user_id)
                VALUES (@conversationId, @senderId),
                       (@conversationId, @receiverId)
            `);

        return conversationId;
    } catch (error) {
        console.error('Error creating conversation:', error);
        throw error;
    }
};

export const addMessageToConversation = async (conversationId, senderId, receiverId, message) => {
    try {
        const pool = await mssql.connect(config);

        // Insertar el nuevo mensaje en la tabla Messages
        const result = await pool.request()
            .input('conversationId', mssql.Int, conversationId)
            .input('senderId', mssql.Int, senderId)
            .input('receiverId', mssql.Int, receiverId)
            .input('message', mssql.NVarChar, message)
            .query(`
                INSERT INTO Messages (conversation_id, sender_id, receiver_id, message, created_at)
                OUTPUT INSERTED.message_id
                VALUES (@conversationId, @senderId, @receiverId, @message, GETDATE())
            `);

        const newMessageId = result.recordset[0].message_id;

        // Actualizar la fecha de actualización de la conversación
        await pool.request()
            .input('conversationId', mssql.Int, conversationId)
            .query(`
                UPDATE Conversations
                SET updated_at = GETDATE()
                WHERE conversation_id = @conversationId
            `);

        return newMessageId;
    } catch (error) {
        console.error('Error adding message to conversation:', error);
        throw error;
    }
};

export const addParticipant = async (conversationId, userId) => {
    try {
        const pool = mssql.connect(config);
        await pool.request()
            .input('conversationId', mssql.Int, conversationId)
            .input('userId', mssql.Int, userId)
            .query(`
                INSERT INTO Participants (conversation_id, user_id)
                VALUES (@conversationId, @userId);
            `);
    } catch (error) {
        console.error('Error adding participant:', error);
        throw error;
    }
};

export const createMessage = async (conversationId, userId, content) => {
    try {
        const pool =mssql.connect(config);
        await pool.request()
            .input('conversationId', mssql.Int, conversationId)
            .input('userId', mssql.Int, userId)
            .input('content', mssql.NVarChar(mssql.MAX), content)
            .query(`
                INSERT INTO Messages (conversation_id, user_id, content)
                VALUES (@conversationId, @userId, @content);
            `);
    } catch (error) {
        console.error('Error creating message:', error);
        throw error;
    }
};

export const getMessagess = async (conversationId) => {
    try {
        const pool = await mssql.connect(config);
        const result = await pool.request()
            .input('conversationId', mssql.Int, conversationId)
            .query(`
                SELECT message_id AS id, conversation_id, sender_id AS senderId, receiver_id AS receiverId, message, created_at AS createdAt
                FROM Messages
                WHERE conversation_id = @conversationId
                ORDER BY created_at ASC;
            `);
        return result.recordset;
    } catch (error) {
        console.error('Error getting messages:', error);
        throw error;
    }
};