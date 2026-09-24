import Usuario from '../models/Usuario.js';
import { signToken } from '../utils/jwt.js';

const authController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email y password son obligatorios' });
            }

            const user = await Usuario.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            const passwordOk = await user.comparePassword(password);
            if (!passwordOk) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            const payload = {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                role: user.role
            };

            const token = signToken(payload, 7200);

            res.json({
                success: true,
                token,
                user: payload
            });
        } catch (error) {
            res.status(500).json({ error: 'Error al iniciar sesión' });
        }
    }
};

export default authController;
