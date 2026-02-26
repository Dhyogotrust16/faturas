const express = require('express');
const db = require('../database');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.use(authMiddleware);

// Listar clientes
router.get('/', (req, res) => {
  db.all('SELECT * FROM clientes ORDER BY nome', (err, clientes) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar clientes' });
    }
    res.json(clientes);
  });
});

// Criar cliente
router.post('/', (req, res) => {
  const { nome, cpf_cnpj, email, telefone, endereco } = req.body;

  db.run(
    'INSERT INTO clientes (nome, cpf_cnpj, email, telefone, endereco) VALUES (?, ?, ?, ?, ?)',
    [nome, cpf_cnpj, email, telefone, endereco],
    function(err) {
      if (err) {
        return res.status(400).json({ erro: 'CPF/CNPJ já cadastrado' });
      }
      res.status(201).json({ mensagem: 'Cliente criado com sucesso', id: this.lastID });
    }
  );
});

// Atualizar cliente
router.put('/:id', (req, res) => {
  const { nome, cpf_cnpj, email, telefone, endereco } = req.body;
  const { id } = req.params;

  db.run(
    'UPDATE clientes SET nome = ?, cpf_cnpj = ?, email = ?, telefone = ?, endereco = ? WHERE id = ?',
    [nome, cpf_cnpj, email, telefone, endereco, id],
    function(err) {
      if (err) {
        return res.status(400).json({ erro: 'Erro ao atualizar cliente' });
      }
      res.json({ mensagem: 'Cliente atualizado com sucesso' });
    }
  );
});

// Deletar cliente
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM clientes WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(400).json({ erro: 'Erro ao deletar cliente' });
    }
    res.json({ mensagem: 'Cliente deletado com sucesso' });
  });
});

module.exports = router;
