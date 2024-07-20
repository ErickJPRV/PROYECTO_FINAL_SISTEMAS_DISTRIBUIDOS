import { getUsersForSidebar } from '../models/user.model.js';

export const getUsersForSidebarController = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const filteredUsers = await getUsersForSidebar(loggedInUserId);

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error en la funcion de obtener usuarios filtrados: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
