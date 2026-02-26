const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'database/faturas.db'));

console.log('📋 Usuários cadastrados:\n');

db.all('SELECT id, nome, usuario, email, is_admin FROM usuarios', [], (err, rows) => {
  if (err) {
    console.error('❌ Erro:', err.message);
    db.close();
    return;
  }

  if (rows.length === 0) {
    console.log('⚠️  Nenhum usuário encontrado no banco de dados.');
  } else {
    rows.forEach(row => {
      console.log(`ID: ${row.id}`);
      console.log(`Nome: ${row.nome}`);
      console.log(`Usuário: ${row.usuario}`);
      console.log(`Email: ${row.email}`);
      console.log(`Admin: ${row.is_admin ? '👑 SIM' : 'Não'}`);
      console.log('---');
    });
  }

  db.close();
});
