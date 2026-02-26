const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'database/faturas.db'));

const usuario = 'daoliveira';
const senha = '123456';

console.log('🔍 Testando login...\n');
console.log(`Usuário: ${usuario}`);
console.log(`Senha: ${senha}\n`);

db.get('SELECT * FROM usuarios WHERE usuario = ?', [usuario], async (err, user) => {
  if (err) {
    console.error('❌ Erro no banco:', err.message);
    db.close();
    return;
  }

  if (!user) {
    console.log('❌ Usuário não encontrado!');
    console.log('\n📋 Verificando todos os usuários:');
    
    db.all('SELECT id, nome, usuario, email FROM usuarios', [], (err, rows) => {
      if (!err) {
        rows.forEach(row => {
          console.log(`  - ID: ${row.id}, Nome: ${row.nome}, Usuario: ${row.usuario}, Email: ${row.email}`);
        });
      }
      db.close();
    });
    return;
  }

  console.log('✅ Usuário encontrado!');
  console.log(`   ID: ${user.id}`);
  console.log(`   Nome: ${user.nome}`);
  console.log(`   Usuario: ${user.usuario}`);
  console.log(`   Email: ${user.email}\n`);

  const senhaValida = await bcrypt.compare(senha, user.senha);
  
  if (senhaValida) {
    console.log('✅ Senha correta! Login deve funcionar.');
  } else {
    console.log('❌ Senha incorreta!');
    console.log('   A senha no banco não corresponde à senha testada.');
  }

  db.close();
});
