const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./conexao');
const senhaJwt = require('./senhaJwt');

const transacoes = async (req, res) => {
    const {id, usuarioId} = req.body

    try {
        const { rows, rowCount } = await pool.query(
            'SELECT * FROM transacoes WHERE id = $1 AND usuario_id = $2',
            [id, usuarioId]
        );

        if (rowCount === 0) {
            return res.status(404).json({ mensagem:  "Transação não encontrada." });
        }

        const transacao = rows[0];
        return res.status(200).json(transacao);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
};

module.exports = transacoes;



    