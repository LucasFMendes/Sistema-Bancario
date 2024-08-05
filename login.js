const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./conexao');
const senhaJwt = require('./senhaJwt');

const logar = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: "Email ou senha inválidos" });
    }

    try {
        const { rows, rowCount } = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1',
            [email]
        );

        if (rowCount === 0) {
            return res.status(400).json({ mensagem: "Usuário e/ou senha inválido(s)." });
        }

        const { senha: senhaUsuario, ...usuario } = rows[0];
        const senhaCorreta = await bcrypt.compare(senha, senhaUsuario);

        if (!senhaCorreta) {
            return res.status(400).json({ mensagem: "Usuário e/ou senha inválido(s)." });
        }

        const token = jwt.sign({ id: usuario.id }, senhaJwt, { expiresIn: '8h' });

        return res.json({
            usuario,
            token
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};

module.exports = { logar };
