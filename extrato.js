const express = require('express');
const pool = require('./conexao');

const extratos = async (req, res) => {

  try {
    const userId = req.userId; 

    const query = `SELECT COALESCE(SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END), 0) AS entrada,
    COALESCE(SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END), 0) AS saida
      FROM transacoes
      WHERE usuario_id = $1`;
    const result = await pool.query(query, [userId]);

    const { entrada, saida } = result.rows[0];

    res.status(200).json({entrada, saida});
  } catch (error) {
    console.error('Erro ao obter extrato de transações:', error);
    res.status(500).json({ mensagem: 'Erro ao obter extrato de transações' });
  }
};

module.exports = extratos;
