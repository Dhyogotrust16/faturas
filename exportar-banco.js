const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'faturas.db');
const db = new sqlite3.Database(dbPath);

let sqlOutput = '-- Backup do banco de dados\n\n';

// Função para escapar strings SQL
function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

async function exportTable(tableName) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM ${tableName}`, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      if (rows.length === 0) {
        console.log(`Tabela ${tableName}: 0 registros`);
        resolve();
        return;
      }

      console.log(`Tabela ${tableName}: ${rows.length} registros`);
      
      sqlOutput += `-- Dados da tabela ${tableName}\n`;
      
      rows.forEach(row => {
        const columns = Object.keys(row);
        const values = columns.map(col => {
          const val = row[col];
          if (val === null || val === undefined) return 'NULL';
          if (typeof val === 'number') return val;
          return escapeSql(val);
        });
        
        sqlOutput += `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')});\n`;
      });
      
      sqlOutput += '\n';
      resolve();
    });
  });
}

async function exportDatabase() {
  try {
    console.log('Exportando banco de dados...\n');
    
    await exportTable('usuarios');
    await exportTable('empresa');
    await exportTable('clientes');
    await exportTable('faturas');
    
    fs.writeFileSync('backup.sql', sqlOutput);
    console.log('\n✅ Backup criado com sucesso: backup.sql');
    
    db.close();
  } catch (error) {
    console.error('❌ Erro ao exportar:', error);
    db.close();
  }
}

exportDatabase();
