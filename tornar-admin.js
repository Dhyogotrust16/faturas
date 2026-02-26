const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'database/faturas.db'));

console.log('👑 Configurando permissões de administrador...\n');

// Passo 1: Adicionar coluna is_admin se não existir
db.all(`PRAGMA table_info(usuarios)`, (err, columns) => {
  if (err) {
    console.error('❌ Erro:', err.message);
    db.close();
    return;
  }

  const hasIsAdmin = columns.some(col => col.name === 'is_admin');
  
  if (!hasIsAdmin) {
    console.log('📝 Adicionando coluna is_admin...');
    db.run(`ALTER TABLE usuarios ADD COLUMN is_admin INTEGER DEFAULT 0`, (err) => {
      if (err) {
        console.error('❌ Erro ao adicionar coluna:', err.message);
        db.close();
        return;
      }
      console.log('✅ Coluna is_admin adicionada!\n');
      tornarAdmin();
    });
  } else {
    console.log('✅ Coluna is_admin já existe!\n');
    tornarAdmin();
  }
});

function tornarAdmin() {
  console.log('📝 Tornando daoliveira administrador...');
  
  db.run(
    'UPDATE usuarios SET is_admin = 1 WHERE usuario = ?',
    ['daoliveira'],
    function(err) {
      if (err) {
        console.error('❌ Erro:', err.message);
      } else {
        if (this.changes > 0) {
          console.log('✅ Usuário daoliveira agora é ADMINISTRADOR!');
          console.log('   Pode cadastrar novos usuários no sistema.\n');
        } else {
          console.log('⚠️  Usuário não encontrado.');
        }
      }
      db.close();
    }
  );
}
