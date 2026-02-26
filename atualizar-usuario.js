const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'database/faturas.db'));

console.log('🔄 Iniciando migração do banco de dados...\n');

// Passo 1: Verificar se a coluna usuario existe
db.all(`PRAGMA table_info(usuarios)`, (err, columns) => {
  if (err) {
    console.error('❌ Erro ao verificar estrutura da tabela:', err.message);
    db.close();
    return;
  }

  const hasUsuario = columns.some(col => col.name === 'usuario');
  
  if (!hasUsuario) {
    console.log('📝 Adicionando coluna "usuario" à tabela...');
    
    // Adicionar coluna usuario
    db.run(`ALTER TABLE usuarios ADD COLUMN usuario TEXT`, (err) => {
      if (err) {
        console.error('❌ Erro ao adicionar coluna:', err.message);
        db.close();
        return;
      }
      
      console.log('✅ Coluna "usuario" adicionada com sucesso!\n');
      
      // Passo 2: Copiar email para usuario para registros existentes
      console.log('📝 Copiando emails para campo usuario...');
      db.run(`UPDATE usuarios SET usuario = email WHERE usuario IS NULL`, function(err) {
        if (err) {
          console.error('❌ Erro ao copiar dados:', err.message);
          db.close();
          return;
        }
        
        console.log(`✅ ${this.changes} registro(s) atualizado(s)!\n`);
        
        // Passo 3: Atualizar o usuário específico
        atualizarUsuario();
      });
    });
  } else {
    console.log('✅ Coluna "usuario" já existe!\n');
    atualizarUsuario();
  }
});

function atualizarUsuario() {
  console.log('📝 Atualizando usuário dhyogotrust2023@gmail.com para daoliveira...');
  
  db.run(`
    UPDATE usuarios 
    SET usuario = 'daoliveira', 
        email = 'daoliveira@visao.com'
    WHERE email = 'dhyogotrust2023@gmail.com' OR usuario = 'dhyogotrust2023@gmail.com'
  `, function(err) {
    if (err) {
      console.error('❌ Erro ao atualizar usuário:', err.message);
    } else {
      if (this.changes > 0) {
        console.log('✅ Usuário atualizado com sucesso!');
        console.log('   Novo usuário: daoliveira');
        console.log('   Novo email: daoliveira@visao.com');
        console.log('   Registros atualizados:', this.changes);
      } else {
        console.log('⚠️  Nenhum usuário encontrado com esse email.');
        console.log('   Você pode criar um novo usuário através da tela de registro.');
      }
    }
    
    console.log('\n✅ Migração concluída!');
    console.log('   Agora você pode fazer login com:');
    console.log('   Usuário: daoliveira');
    console.log('   Senha: (a mesma senha anterior)\n');
    
    db.close();
  });
}

