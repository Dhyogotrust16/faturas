// Teste com o arquivo real
const csv = require('csv-parser');
const fs = require('fs');

console.log('=== TESTE COM ARQUIVO REAL ===\n');

// Detectar separador
const primeiraLinha = fs.readFileSync('exemplo-formato-real.csv', 'utf8').split('\n')[0];
const separador = primeiraLinha.includes(';') ? ';' : ',';
console.log('Separador detectado:', separador === ';' ? 'ponto e vírgula (;)' : 'vírgula (,)');
console.log('Primeira linha:', primeiraLinha);
console.log('---\n');

const faturas = [];
let ultimoClienteNome = '';
let linhaNum = 0;

fs.createReadStream('exemplo-formato-real.csv')
  .pipe(csv({ separator: separador }))
  .on('data', (row) => {
    linhaNum++;
    
    console.log(`Linha ${linhaNum}:`, row);
    
    // Detectar colunas
    const colunas = Object.keys(row);
    console.log('Colunas:', colunas);
    
    const colunaCliente = colunas.find(c => 
      c.toUpperCase().includes('CLIENTE')
    ) || colunas[0];
    
    const colunaNFatura = colunas.find(c => 
      c.toUpperCase().includes('FATURA') || 
      c.toUpperCase().includes('N°') ||
      c.toUpperCase().includes('NÂ°')
    ) || colunas[1];
    
    const colunaData = colunas.find(c => 
      c.toUpperCase().includes('DATA') || 
      c.toUpperCase().includes('VECTO')
    ) || colunas[2];
    
    const colunaValor = colunas.find(c => 
      c.toUpperCase().includes('VALOR')
    ) || colunas[3];
    
    console.log('Colunas detectadas:', {
      cliente: colunaCliente,
      nFatura: colunaNFatura,
      data: colunaData,
      valor: colunaValor
    });
    
    // Pegar valores
    let clienteNome = row[colunaCliente] ? row[colunaCliente].trim() : '';
    const numeroFatura = row[colunaNFatura] ? row[colunaNFatura].trim() : '';
    const dataVecto = row[colunaData] ? row[colunaData].trim() : '';
    const valor = row[colunaValor] ? row[colunaValor].trim() : '';
    
    console.log('Valores extraídos:', {
      cliente: clienteNome,
      numeroFatura,
      dataVecto,
      valor
    });
    
    // Se cliente está vazio e número da fatura começa com dígito, usar último cliente
    if (!clienteNome && numeroFatura && /^\d/.test(numeroFatura)) {
      clienteNome = ultimoClienteNome;
      console.log(`✓ Cliente vazio, usando: "${clienteNome}"`);
    }
    
    // Atualizar último cliente se não estiver vazio
    if (clienteNome && clienteNome !== '') {
      ultimoClienteNome = clienteNome;
    }
    
    // Adicionar à lista
    const faturaProcessada = {
      CLIENTE: clienteNome,
      'N° FATURA': numeroFatura,
      'DATA VECTO': dataVecto,
      VALOR: valor
    };
    
    console.log('Fatura processada:', faturaProcessada);
    console.log('---\n');
    
    faturas.push(faturaProcessada);
  })
  .on('end', () => {
    console.log('\n=== RESULTADO FINAL ===');
    console.log('Total de faturas:', faturas.length);
    console.log('\nPrimeiras 10 faturas:');
    faturas.slice(0, 10).forEach((f, i) => {
      console.log(`${i + 1}. ${f.CLIENTE} | ${f['N° FATURA']} | ${f['DATA VECTO']} | ${f.VALOR}`);
    });
  })
  .on('error', (error) => {
    console.error('Erro ao processar CSV:', error);
  });
