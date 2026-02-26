const bcrypt = require('bcryptjs');
const db = require('./database');

// Criar usuário admin inicial se não existir nenhum usuário
async function seedDatabase() {
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as count FROM usuarios', async (err, row) => {
      if (err) {
        console.error('❌ Erro ao verificar usuários:', err);
        reject(err);
        return;
      }

      if (row.count === 0) {
        console.log('📝 Criando usuário administrador inicial...');
        
        const senhaHash = await bcrypt.hash('123456', 10);
        
        db.run(
          'INSERT INTO usuarios (nome, usuario, email, senha, is_admin) VALUES (?, ?, ?, ?, ?)',
          ['Diogo Alves', 'daoliveira', null, senhaHash, 1],
          function(err) {
            if (err) {
              console.error('❌ Erro ao criar usuário admin:', err);
              reject(err);
            } else {
              console.log('✅ Usuário administrador criado com sucesso!');
              console.log('   Usuário: daoliveira');
              console.log('   Senha: 123456');
              resolve();
            }
          }
        );
      } else {
        console.log('✅ Banco de dados já possui usuários');
        resolve();
      }
    });
  });
}

module.exports = seedDatabase;
