const express = require('express');
const db = require('../database');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.use(authMiddleware);

// Listar todas as empresas
router.get('/', (req, res) => {
  db.all('SELECT * FROM empresa ORDER BY criado_em DESC', (err, empresas) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar empresas' });
    }
    res.json(empresas || []);
  });
});

// Obter uma empresa específica
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM empresa WHERE id = ?', [req.params.id], (err, empresa) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar empresa' });
    }
    if (!empresa) {
      return res.status(404).json({ erro: 'Empresa não encontrada' });
    }
    res.json(empresa);
  });
});

// Criar nova empresa
router.post('/', (req, res) => {
  const { nome, razao_social, cnpj, inscricao_estadual, endereco, telefone, email } = req.body;

  db.run(
    'INSERT INTO empresa (nome, razao_social, cnpj, inscricao_estadual, endereco, telefone, email) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [nome, razao_social, cnpj, inscricao_estadual, endereco, telefone, email],
    function(err) {
      if (err) {
        return res.status(400).json({ erro: 'Erro ao criar empresa' });
      }
      res.status(201).json({ mensagem: 'Empresa criada com sucesso', id: this.lastID });
    }
  );
});

// Atualizar empresa existente
router.put('/:id', (req, res) => {
  const { nome, razao_social, cnpj, inscricao_estadual, endereco, telefone, email } = req.body;
  const { id } = req.params;

  db.run(
    `UPDATE empresa SET 
      nome = ?, 
      razao_social = ?, 
      cnpj = ?, 
      inscricao_estadual = ?,
      endereco = ?, 
      telefone = ?, 
      email = ?,
      atualizado_em = CURRENT_TIMESTAMP 
    WHERE id = ?`,
    [nome, razao_social, cnpj, inscricao_estadual, endereco, telefone, email, id],
    function(err) {
      if (err) {
        return res.status(400).json({ erro: 'Erro ao atualizar empresa' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ erro: 'Empresa não encontrada' });
      }
      res.json({ mensagem: 'Empresa atualizada com sucesso', id: parseInt(id) });
    }
  );
});

// Deletar empresa
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM empresa WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(400).json({ erro: 'Erro ao deletar empresa' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ erro: 'Empresa não encontrada' });
    }
    res.json({ mensagem: 'Empresa deletada com sucesso' });
  });
});

module.exports = router;
