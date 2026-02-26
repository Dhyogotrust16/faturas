// Test script to verify all formatting and conversion logic

console.log('=== TESTE DE FORMATAÇÃO E CONVERSÃO ===\n');

// 1. Test CPF/CNPJ Formatting
console.log('1. FORMATAÇÃO DE CPF/CNPJ:');
function formatCPFCNPJ(value) {
  if (!value) return '-';
  
  // Se começar com espaço, é CPF temporário - mostrar como vazio
  if (value.trim() === '' || value.startsWith(' ')) {
    return '-';
  }
  
  value = value.replace(/\D/g, '');
  
  // Se não tiver dígitos suficientes, retornar como está
  if (value.length < 11) {
    return value || '-';
  }
  
  if (value.length <= 11) {
    return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else {
    return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
}

console.log('  CPF normal:', formatCPFCNPJ('12345678901'));
console.log('  CNPJ normal:', formatCPFCNPJ('12345678901234'));
console.log('  CPF temporário (espaço):', formatCPFCNPJ(' 1772048337240'));
console.log('  Vazio:', formatCPFCNPJ(''));
console.log('  Null:', formatCPFCNPJ(null));

// 2. Test Phone Formatting
console.log('\n2. FORMATAÇÃO DE TELEFONE:');
function formatPhone(value) {
  if (!value) return '-';
  
  value = value.replace(/\D/g, '');
  
  // Se não tiver dígitos suficientes, retornar como está
  if (value.length < 10) {
    return value || '-';
  }
  
  if (value.length <= 10) {
    return value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else {
    return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
}

console.log('  Celular:', formatPhone('11987654321'));
console.log('  Fixo:', formatPhone('1133334444'));
console.log('  Incompleto:', formatPhone('119876'));
console.log('  Vazio:', formatPhone(''));

// 3. Test Date Conversion (DD/MM/YYYY -> YYYY-MM-DD)
console.log('\n3. CONVERSÃO DE DATA:');
function convertDate(dateString) {
  if (!dateString) return null;
  
  if (dateString.includes('/')) {
    // Converter de DD/MM/YYYY para YYYY-MM-DD
    const partes = dateString.split('/');
    if (partes.length === 3) {
      return `${partes[2]}-${partes[1]}-${partes[0]}`;
    }
  }
  return dateString;
}

console.log('  27/02/2026 →', convertDate('27/02/2026'));
console.log('  04/03/2026 →', convertDate('04/03/2026'));
console.log('  2026-03-15 →', convertDate('2026-03-15'));

// 4. Test Value Conversion
console.log('\n4. CONVERSÃO DE VALORES:');
function convertValue(valorFatura) {
  if (typeof valorFatura === 'string') {
    // Remove "R$" se houver
    valorFatura = valorFatura.replace('R$', '').trim();
    
    // Detectar formato: se tem vírgula, é formato brasileiro (1.500,00)
    // Se tem apenas ponto, é formato americano (1500.00)
    if (valorFatura.includes(',')) {
      // Formato brasileiro: remove pontos de milhar e substitui vírgula por ponto
      valorFatura = valorFatura.replace(/\./g, '').replace(',', '.');
    }
    // Se tem apenas ponto, mantém como está (formato americano)
  }
  // Converter para número
  return parseFloat(valorFatura) || 0;
}

console.log('  148,02 →', convertValue('148,02'));
console.log('  148.02 →', convertValue('148.02'));
console.log('  1.500,00 →', convertValue('1.500,00'));
console.log('  1500.00 →', convertValue('1500.00'));
console.log('  R$ 2.569,62 →', convertValue('R$ 2.569,62'));

// 5. Test Currency Formatting
console.log('\n5. FORMATAÇÃO DE MOEDA:');
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

console.log('  148.02 →', formatCurrency(148.02));
console.log('  1500.00 →', formatCurrency(1500.00));
console.log('  2569.62 →', formatCurrency(2569.62));

// 6. Test Date Display Formatting
console.log('\n6. FORMATAÇÃO DE DATA PARA EXIBIÇÃO:');
function formatDate(dateString) {
  if (!dateString) return '-';
  // Adicionar 'T00:00:00' para evitar problemas de timezone
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('pt-BR');
}

console.log('  2026-02-27 →', formatDate('2026-02-27'));
console.log('  2026-03-04 →', formatDate('2026-03-04'));
console.log('  2025-12-22 →', formatDate('2025-12-22'));

// 7. Test Status Conversion
console.log('\n7. CONVERSÃO DE STATUS:');
function convertStatus(situacao) {
  if (!situacao) return 'pendente';
  
  const sit = situacao.toString().toUpperCase();
  if (sit.includes('PAGO') || sit.includes('QUITADO')) {
    return 'pago';
  } else if (sit.includes('VENCIDO')) {
    return 'vencido';
  }
  return 'pendente';
}

console.log('  PAGO →', convertStatus('PAGO'));
console.log('  pago →', convertStatus('pago'));
console.log('  QUITADO →', convertStatus('QUITADO'));
console.log('  VENCIDO →', convertStatus('VENCIDO'));
console.log('  PENDENTE →', convertStatus('PENDENTE'));
console.log('  (vazio) →', convertStatus(''));

// 8. Test Client Name Matching
console.log('\n8. BUSCA DE CLIENTE:');
const clientes = [
  { id: 1, nome: 'JOÃO DA SILVA' },
  { id: 2, nome: 'MARIA SANTOS' },
  { id: 3, nome: 'CARLOS ALBERTO DA SILVA' }
];

function findCliente(nomeCSV) {
  const nomeBusca = nomeCSV.trim().toUpperCase();
  
  // Busca exata
  let cliente = clientes.find(c => c.nome.toUpperCase() === nomeBusca);
  
  // Busca parcial
  if (!cliente) {
    cliente = clientes.find(c => 
      c.nome.toUpperCase().includes(nomeBusca) || 
      nomeBusca.includes(c.nome.toUpperCase())
    );
  }
  
  return cliente;
}

console.log('  "JOÃO DA SILVA" →', findCliente('JOÃO DA SILVA')?.nome || 'NÃO ENCONTRADO');
console.log('  "  João Silva  " →', findCliente('  João Silva  ')?.nome || 'NÃO ENCONTRADO');
console.log('  "CARLOS ALBERTO" →', findCliente('CARLOS ALBERTO')?.nome || 'NÃO ENCONTRADO');
console.log('  "PEDRO OLIVEIRA" →', findCliente('PEDRO OLIVEIRA')?.nome || 'NÃO ENCONTRADO (criar novo)');

console.log('\n=== TESTE CONCLUÍDO ===');
