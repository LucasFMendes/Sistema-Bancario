const pool = require('./conexao');

const transacao = async (req, res) => {
    try { 
        const { descricao, valor, data, categoria_id, tipo, usuario_id } = req.body;

        // Validação dos campos obrigatórios
        if (!descricao || !valor || !data || !categoria_id || !tipo || !usuario_id) {
            return res.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser informados." });
        }

        // Validação do campo 'tipo'
        if (tipo !== 'entrada' && tipo !== 'saida') {
            return res.status(400).json({ mensagem: "O campo 'tipo' deve ser 'entrada' ou 'saida'." });
        }

        // Validação se a categoria existe
        const categoria = await pool.query(
            'SELECT * FROM categorias WHERE id = $1',
            [categoria_id]
        );

        if (categoria.rowCount === 0) {
            return res.status(400).json({ mensagem: "Categoria não encontrada." });
        }

        // Validação se o usuário existe
        const usuario = await pool.query(
            'SELECT * FROM usuarios WHERE id = $1',
            [usuario_id]
        );

        if (usuario.rowCount === 0) {
            return res.status(400).json({ mensagem: "Usuário não encontrado." });
        }

        // Inserir a transação no banco de dados
        const { rows } = await pool.query(
            'INSERT INTO transacoes (descricao, valor, data, categoria_id, tipo, usuario_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [descricao, valor, data, categoria_id, tipo, usuario_id]
        );

        const transacao = rows[0];

        res.status(201).json({
            mensagem: 'Transação cadastrada com sucesso!',
            transacao
        });

    } catch (error) {
        
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

module.exports = transacao;


