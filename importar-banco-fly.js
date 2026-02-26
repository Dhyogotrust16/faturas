const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Este script deve ser executado no Fly.io
const dbPath = process.env.NODE_ENV === 'production' && fs.existsSync('/app/data')
  ? '/app/data/faturas.db'
  : path.join(__dirname, 'database', 'faturas.db');

console.log('📁 Banco de dados:', dbPath);

const db = new sqlite3.Database(dbPath);
const sqlFile = fs.readFileSync('backup.sql', 'utf8');

// Dividir em comandos individuais
const commands = sqlFile
  .split('\n')
  .filter(line => line.trim() && !line.startsWith('--'))
  .join('\n')
  .split(';')
  .filter(cmd => cmd.trim());

console.log(`\n📝 Total de comandos SQL: ${commands.length}\n`);

let executed = 0;
let errors = 0;

db.serialize(() => {
  // Limpar tabelas existentes (exceto usuarios se já tiver admin)
  db.get('SELECT COUNT(*) as count FROM usuarios WHERE is_admin = 1', (err, row) => {
    const hasAdmin = !err && row && row.count > 0;
    
    if (!hasAdmin) {
      console.log('⚠️  Nenhum admin encontrado, limpando todas as tabelas...');
      db.run('DELETE FROM faturas');
      db.run('DELETE FROM clientes');
      db.run('DELETE FROM empresa');
      db.run('DELETE FROM usuarios');
    } else {
      console.log('✅ Admin encontrado, mantendo usuários e limpando apenas dados...');
      db.run('DELETE FROM faturas');
      db.run('DELETE FROM clientes');
      db.run('DELETE FROM empresa');
    }
    
    // Executar comandos de importação
    commands.forEach((cmd, index) => {
      db.run(cmd, (err) => {
        if (err) {
          // Ignorar erros de UNIQUE constraint (dados já existem)
          if (!err.message.includes('UNIQUE constraint')) {
            console.error(`❌ Erro no comando ${index + 1}:`, err.message);
            errors++;
          }
        } else {
          executed++;
        }
        
        if (index === commands.length - 1) {
          console.log(`\n✅ Importação concluída!`);
          console.log(`   Executados: ${executed}`);
          console.log(`   Erros: ${errors}`);
          db.close();
        }
      });
    });
  });
});
