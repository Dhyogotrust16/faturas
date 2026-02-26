const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database');
const auth = require('../middleware/auth');
const router = express.Router();

// Middleware para verificar se é admin
const isAdmin = (req, res, next) => {
  if (!req.usuario.is_admin) {
    return res.status(403).json({ erro: 'Acesso negado. Apenas administradores.' });
  }
  next();
};

// Listar usuários (apenas admin)
router.get('/', auth, isAdmin, (req, res) => {
  db.all('SELECT id, nome, usuario, email, is_admin FROM usuarios ORDER BY nome', [], (err, usuarios) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar usuários' });
    }
    res.json(usuarios);
  });
});

// Atualizar usuário (apenas admin)
router.put('/:id', auth, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { nome, usuario, email, senha, is_admin } = req.body;

  // Validar campos obrigatórios
  if (!nome || !usuario) {
    return res.status(400).json({ erro: 'Nome e usuário são obrigatórios' });
  }

  try {
    // Se a senha foi fornecida, fazer hash
    let updateQuery;
    let params;
    
    if (senha) {
      const senhaHash = await bcrypt.hash(senha, 10);
      updateQuery = 'UPDATE usuarios SET nome = ?, usuario = ?, email = ?, senha = ?, is_admin = ? WHERE id = ?';
      params = [nome, usuario, email || null, senhaHash, is_admin || 0, id];
    } else {
      updateQuery = 'UPDATE usuarios SET nome = ?, usuario = ?, email = ?, is_admin = ? WHERE id = ?';
      params = [nome, usuario, email || null, is_admin || 0, id];
    }
    
    db.run(updateQuery, params, function(err) {
      if (err) {
        console.error('[Usuarios] Erro ao atualizar:', err);
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ erro: 'Este nome de usuário já está em uso' });
        }
        return res.status(400).json({ erro: 'Erro ao atualizar usuário: ' + err.message });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }
      
      res.json({ mensagem: 'Usuário atualizado com sucesso' });
    });
  } catch (error) {
    console.error('[Usuarios] Erro ao atualizar:', error);
    res.status(500).json({ erro: 'Erro ao atualizar usuário' });
  }
});

// Deletar usuário (apenas admin, não pode deletar admin)
router.delete('/:id', auth, isAdmin, (req, res) => {
  const { id } = req.params;
  
  // Verificar se o usuário a ser deletado é admin
  db.get('SELECT is_admin FROM usuarios WHERE id = ?', [id], (err, usuario) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao verificar usuário' });
    }
    
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }
    
    if (usuario.is_admin) {
      return res.status(403).json({ erro: 'Não é possível deletar um administrador' });
    }
    
    // Deletar usuário
    db.run('DELETE FROM usuarios WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao deletar usuário' });
      }
      res.json({ mensagem: 'Usuário deletado com sucesso' });
    });
  });
});

module.exports = router;
