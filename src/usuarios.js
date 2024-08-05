const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../conexao')
const senhaJwt = require('../senhaJwt')

const cadastrar = async (req, res) => {
    const { nome, email, senha } = req.body;
 
    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: 'É necessário fornecer nome, email e senha.' });
    }
 
    try {
        // Criptografar a senha
        const salt = await bcrypt.genSalt(10);
        const senhaHasheada = await bcrypt.hash(senha, salt);
 
        // Inserir o usuário no banco de dados
        const { rows } = await pool.query(
            'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *',
            [nome, email, senhaHasheada]
        );
 
        const usuario = rows[0];
 
        res.status(201).json({
            mensagem: 'Usuário cadastrado com sucesso!',
            usuario
        });
 
        console.log(req.body);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
 };
 
 const criptograr = async (req, res) => {
     const { email, senha } = req.body;
 
     try {
         const { rows, rowCount } = await pool.query(
             'SELECT * FROM usuarios WHERE email = $1',
             [email]
         );
 
         if (rowCount === 0) {
             return res.status(400).json("Email inválido");
         }
 
         const { senha: senhaUsuario, ...usuario } = rows[0];
 
         const senhaCorreta = await bcrypt.compare(senha, senhaUsuario);
 
         if (!senhaCorreta) {
             return res.status(400).json({mensagem: "Já existe usuário cadastrado com o e-mail informado."});
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
 
 module.exports = { cadastrar, criptograr };