const express = require('express');

const { cadastrar} = require('../usuarios');
const { logar } = require('../../login');
const transacoes = require('../../transacaoID');
const transacao = require('../../transacao');
const extrato = require('../../extrato');

const router = express();

router.post('/usuarios', cadastrar)
router.post('/login', logar)
router.post('/transacaoID', transacoes)
router.post('/transacao', transacao)
router.get('/transacao/extrato', extrato);


module.exports = router;