const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'database/faturas.db'));

console.log('🔧 Corrigindo estrutura da tabela usuarios...\n');

// SQLite não suporta ALTER COLUMN, então precisamos recriar a tabela
db.serialize(() => {
  console.log('1. Criando tabela temporária...');
  
  db.run(`
    CREATE TABLE usuarios_temp (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      usuario TEXT UNIQUE NOT NULL,
      email TEXT,
      senha TEXT NOT NULL,
      is_admin INTEGER DEFAULT 0,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('❌ Erro ao criar tabela temporária:', err.message);
      db.close();
      return;
    }
    
    console.log('✅ Tabela temporária criada!\n');
    console.log('2. Copiando dados...');
    
    db.run(`
      INSERT INTO usuarios_temp (id, nome, usuario, email, senha, is_admin, criado_em)
      SELECT id, nome, usuario, email, senha, is_admin, criado_em
      FROM usuarios
    `, (err) => {
      if (err) {
        console.error('❌ Erro ao copiar dados:', err.message);
        db.close();
        return;
      }
      
      console.log('✅ Dados copiados!\n');
      console.log('3. Removendo tabela antiga...');
      
      db.run('DROP TABLE usuarios', (err) => {
        if (err) {
          console.error('❌ Erro ao remover tabela antiga:', err.message);
          db.close();
          return;
        }
        
        console.log('✅ Tabela antiga removida!\n');
        console.log('4. Renomeando tabela temporária...');
        
        db.run('ALTER TABLE usuarios_temp RENAME TO usuarios', (err) => {
          if (err) {
            console.error('❌ Erro ao renomear tabela:', err.message);
            db.close();
            return;
          }
          
          console.log('✅ Tabela renomeada!\n');
          console.log('✅ Estrutura corrigida com sucesso!');
          console.log('   Email agora é opcional.\n');
          
          db.close();
        });
      });
    });
  });
});
