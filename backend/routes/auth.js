const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const auth = require('../middleware/auth');
const router = express.Router();

// Registro (apenas para admins)
router.post('/registro', auth, async (req, res) => {
  // Verificar se o usuário logado é admin
  if (!req.usuario.is_admin) {
    return res.status(403).json({ erro: 'Apenas administradores podem cadastrar usuários' });
  }

  const { nome, usuario, email, senha, is_admin } = req.body;

  // Validar campos obrigatórios
  if (!nome || !usuario || !senha) {
    return res.status(400).json({ erro: 'Nome, usuário e senha são obrigatórios' });
  }

  try {
    const senhaHash = await bcrypt.hash(senha, 10);
    
    db.run(
      'INSERT INTO usuarios (nome, usuario, email, senha, is_admin) VALUES (?, ?, ?, ?, ?)',
      [nome, usuario, email || null, senhaHash, is_admin || 0],
      function(err) {
        if (err) {
          console.error('[Auth] Erro ao criar usuário:', err);
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ erro: 'Este nome de usuário já está em uso' });
          }
          return res.status(400).json({ erro: 'Erro ao cadastrar usuário: ' + err.message });
        }
        res.status(201).json({ mensagem: 'Usuário criado com sucesso', id: this.lastID });
      }
    );
  } catch (error) {
    console.error('[Auth] Erro ao criar usuário:', error);
    res.status(500).json({ erro: 'Erro ao criar usuário' });
  }
});

// Login
router.post('/login', (req, res) => {
  const { usuario, senha } = req.body;

  db.get('SELECT * FROM usuarios WHERE usuario = ?', [usuario], async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, usuario: user.usuario, is_admin: user.is_admin || 0 },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      token, 
      usuario: { 
        id: user.id, 
        nome: user.nome, 
        usuario: user.usuario, 
        email: user.email,
        is_admin: user.is_admin || 0
      } 
    });
  });
});

module.exports = router;
