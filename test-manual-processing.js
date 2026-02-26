// Teste do processamento manual do CSV
const fs = require('fs');

console.log('=== TESTE DE PROCESSAMENTO MANUAL ===\n');

const faturas = [];
let ultimoClienteNome = '';

// Ler arquivo completo
const conteudo = fs.readFileSync('exemplo-formato-real.csv', 'utf8');
const linhas = conteudo.split('\n').filter(l => l.trim() !== '');

console.log('Total de linhas:', linhas.length);
console.log('Primeira linha (cabeçalho):', linhas[0]);
console.log('---\n');

// Pular primeira linha (cabeçalho)
for (let i = 1; i < linhas.length; i++) {
  const linha = linhas[i].trim();
  if (!linha) continue;
  
  // Separar por ponto e vírgula
  const colunas = linha.split(';').map(c => c.trim());
  
  // Remover colunas vazias do final
  while (colunas.length > 0 && colunas[colunas.length - 1] === '') {
    colunas.pop();
  }
  
  console.log(`Linha ${i + 1}:`, colunas);
  
  // Deve ter pelo menos 4 colunas
  if (colunas.length < 4) {
    console.log(`  ⚠️  Ignorada (colunas insuficientes: ${colunas.length})`);
    continue;
  }
  
  let clienteNome = colunas[0];
  const numeroFatura = colunas[1];
  const dataVecto = colunas[2];
  const valor = colunas[3];
  
  console.log(`  Cliente: "${clienteNome}"`);
  console.log(`  N° Fatura: "${numeroFatura}"`);
  console.log(`  Data: "${dataVecto}"`);
  console.log(`  Valor: "${valor}"`);
  
  // Se cliente está vazio e número da fatura começa com dígito, usar último cliente
  if (!clienteNome && numeroFatura && /^\d/.test(numeroFatura)) {
    clienteNome = ultimoClienteNome;
    console.log(`  ✓ Cliente vazio, usando: "${clienteNome}"`);
  }
  
  // Atualizar último cliente se não estiver vazio
  if (clienteNome && clienteNome !== '') {
    ultimoClienteNome = clienteNome;
  }
  
  // Adicionar à lista
  faturas.push({
    CLIENTE: clienteNome,
    'N° FATURA': numeroFatura,
    'DATA VECTO': dataVecto,
    VALOR: valor
  });
  
  console.log('---\n');
}

console.log('=== RESULTADO FINAL ===');
console.log('Total de faturas processadas:', faturas.length);
console.log('\nPrimeiras 10 faturas:');
faturas.slice(0, 10).forEach((f, i) => {
  console.log(`${i + 1}. ${f.CLIENTE} | ${f['N° FATURA']} | ${f['DATA VECTO']} | ${f.VALOR}`);
});

console.log('\nFaturas com cliente vazio (devem usar o anterior):');
faturas.filter((f, i) => !f.CLIENTE || f.CLIENTE === '').forEach((f, i) => {
  console.log(`  Linha ${i + 1}: ${f['N° FATURA']} | ${f['DATA VECTO']} | ${f.VALOR}`);
});
