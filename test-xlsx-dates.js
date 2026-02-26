const XLSX = require('xlsx');

// Criar um arquivo de teste
const dados = [
  ['CLIENTE', 'N° FATURA', 'DATA VECTO', 'VALOR'],
  ['TESTE CLIENTE', '001', '04.08.2025', '1069.66'],
  ['', '002', '11.08.2025', '1843.65']
];

// Criar workbook
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet(dados);
XLSX.utils.book_append_sheet(wb, ws, 'Faturas');

// Salvar arquivo
XLSX.writeFile(wb, 'teste-upload.xlsx');

console.log('Arquivo teste-upload.xlsx criado!');

// Agora ler e processar
console.log('\n=== LENDO ARQUIVO ===\n');
const workbook = XLSX.readFile('teste-upload.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Converter para array
const dadosLidos = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

console.log('Total de linhas:', dadosLidos.length);
console.log('\nDados lidos:');
dadosLidos.forEach((linha, i) => {
  console.log(`Linha ${i}:`, linha);
  if (i > 0 && linha[2]) {
    console.log(`  -> Data tipo: ${typeof linha[2]}, valor: "${linha[2]}"`);
  }
});

// Testar conversão de data
console.log('\n=== TESTANDO CONVERSÃO ===\n');

function converterData(dataVencimento) {
  console.log(`Input: "${dataVencimento}", tipo: ${typeof dataVencimento}`);
  
  if (!dataVencimento) {
    console.log('  -> Data vazia!');
    return null;
  }
  
  // Se for número (data serial do Excel)
  if (typeof dataVencimento === 'number') {
    console.log('  -> É número serial do Excel');
    const dataExcel = XLSX.SSF.parse_date_code(dataVencimento);
    const resultado = `${dataExcel.y}-${String(dataExcel.m).padStart(2, '0')}-${String(dataExcel.d).padStart(2, '0')}`;
    console.log(`  -> Convertido: ${resultado}`);
    return resultado;
  } 
  // Se for string
  else if (typeof dataVencimento === 'string') {
    dataVencimento = dataVencimento.trim();
    console.log(`  -> É string: "${dataVencimento}"`);
    
    // Formato DD/MM/YYYY
    if (dataVencimento.includes('/')) {
      const partes = dataVencimento.split('/');
      if (partes.length === 3) {
        const resultado = `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
        console.log(`  -> Formato DD/MM/YYYY: ${resultado}`);
        return resultado;
      }
    }
    // Formato DD.MM.YYYY
    else if (dataVencimento.includes('.')) {
      const partes = dataVencimento.split('.');
      if (partes.length === 3) {
        const resultado = `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
        console.log(`  -> Formato DD.MM.YYYY: ${resultado}`);
        return resultado;
      }
    }
  }
  
  console.log('  -> Não foi possível converter!');
  return null;
}

// Testar com as datas do arquivo
for (let i = 1; i < dadosLidos.length; i++) {
  console.log(`\nLinha ${i + 1}:`);
  const dataConvertida = converterData(dadosLidos[i][2]);
  console.log(`Resultado final: ${dataConvertida}\n`);
}
