const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'database/faturas.db'));

const usuario = 'daoliveira';
const novaSenha = '123456'; // Senha padrão

console.log('🔐 Resetando senha...\n');

bcrypt.hash(novaSenha, 10, (err, hash) => {
  if (err) {
    console.error('❌ Erro ao gerar hash:', err.message);
    db.close();
    return;
  }

  db.run(
    'UPDATE usuarios SET senha = ? WHERE usuario = ?',
    [hash, usuario],
    function(err) {
      if (err) {
        console.error('❌ Erro ao atualizar senha:', err.message);
      } else {
        if (this.changes > 0) {
          console.log('✅ Senha resetada com sucesso!');
          console.log(`   Usuário: ${usuario}`);
          console.log(`   Nova senha: ${novaSenha}`);
          console.log('\n⚠️  IMPORTANTE: Altere esta senha após o primeiro login!');
        } else {
          console.log(`⚠️  Usuário "${usuario}" não encontrado.`);
        }
      }
      
      // Limpar usuário duplicado
      db.run('DELETE FROM usuarios WHERE usuario IS NULL', function(err) {
        if (!err && this.changes > 0) {
          console.log(`\n🗑️  ${this.changes} usuário(s) duplicado(s) removido(s).`);
        }
        db.close();
      });
    }
  );
});
