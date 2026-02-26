// Teste do processamento de CSV
const csv = require('csv-parser');
const fs = require('fs');

console.log('=== TESTE DE PROCESSAMENTO CSV ===\n');

const faturas = [];
let ultimoClienteNome = '';

fs.createReadStream('teste-cliente-vazio.csv')
  .pipe(csv())
  .on('data', (row) => {
    console.log('Linha original:', row);
    console.log('Colunas:', Object.keys(row));
    
    // Detectar nome da coluna do cliente (pode variar)
    const colunas = Object.keys(row);
    const colunaCliente = colunas.find(c => 
      c.toUpperCase().includes('CLIENTE') || 
      c === 'A' || 
      c === 'CLIENTE'
    ) || colunas[0];
    
    const colunaNFatura = colunas.find(c => 
      c.toUpperCase().includes('FATURA') || 
      c.toUpperCase().includes('N°') ||
      c.toUpperCase().includes('NÂ°') ||
      c === 'B'
    ) || colunas[1];
    
    const colunaData = colunas.find(c => 
      c.toUpperCase().includes('DATA') || 
      c.toUpperCase().includes('VECTO') ||
      c === 'C'
    ) || colunas[2];
    
    const colunaValor = colunas.find(c => 
      c.toUpperCase().includes('VALOR') ||
      c === 'D'
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
      console.log(`Linha sem cliente, usando: ${clienteNome}`);
    }
    
    // Atualizar último cliente se não estiver vazio
    if (clienteNome && clienteNome !== '') {
      ultimoClienteNome = clienteNome;
    }
    
    // Adicionar à lista com nome normalizado
    const faturaProcessada = {
      CLIENTE: clienteNome,
      'N° FATURA': numeroFatura,
      'DATA VECTO': dataVecto,
      VALOR: valor
    };
    
    console.log('Fatura processada:', faturaProcessada);
    console.log('---');
    
    faturas.push(faturaProcessada);
  })
  .on('end', () => {
    console.log('\n=== RESULTADO FINAL ===');
    console.log('Total de faturas:', faturas.length);
    console.log('\nFaturas processadas:');
    faturas.forEach((f, i) => {
      console.log(`${i + 1}. ${f.CLIENTE} - ${f['N° FATURA']} - ${f['DATA VECTO']} - ${f.VALOR}`);
    });
  })
  .on('error', (error) => {
    console.error('Erro ao processar CSV:', error);
  });
