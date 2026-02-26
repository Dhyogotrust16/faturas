const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'database/faturas.db'));

console.log('=== Verificando empresas no banco ===\n');

db.all('SELECT * FROM empresa', (err, empresas) => {
  if (err) {
    console.error('Erro ao buscar empresas:', err);
    return;
  }

  console.log(`Total de empresas no banco: ${empresas.length}\n`);

  if (empresas.length === 0) {
    console.log('Nenhuma empresa cadastrada.');
  } else {
    empresas.forEach((empresa, index) => {
      console.log(`Empresa ${index + 1}:`);
      console.log(`  ID: ${empresa.id}`);
      console.log(`  Nome: ${empresa.nome}`);
      console.log(`  Razão Social: ${empresa.razao_social}`);
      console.log(`  CNPJ: ${empresa.cnpj}`);
      console.log(`  IE: ${empresa.inscricao_estadual || 'N/A'}`);
      console.log(`  Criado em: ${empresa.criado_em}`);
      console.log(`  Atualizado em: ${empresa.atualizado_em || 'N/A'}`);
      console.log('');
    });
  }

  db.close();
});
