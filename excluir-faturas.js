const https = require('https');

const API_URL = 'https://visao-faturas.fly.dev/api';
let token = null;

function httpRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const reqOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve({ ok: true, json: () => JSON.parse(data), text: () => data });
          } catch {
            resolve({ ok: true, text: () => data });
          }
        } else {
          resolve({ ok: false, status: res.statusCode, text: () => data });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function login() {
  console.log('🔐 Fazendo login...');
  const res = await httpRequest(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario: 'daoliveira', senha: '123456' })
  });
  
  if (!res.ok) {
    throw new Error('Erro ao fazer login');
  }
  
  const data = res.json();
  token = data.token;
  console.log('✅ Login realizado com sucesso\n');
}

async function excluirTodasFaturas() {
  console.log('📋 Buscando todas as faturas...');
  
  const res = await httpRequest(`${API_URL}/faturas`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!res.ok) {
    throw new Error('Erro ao buscar faturas');
  }
  
  const faturas = res.json();
  console.log(`📄 Encontradas ${faturas.length} faturas\n`);
  
  if (faturas.length === 0) {
    console.log('✅ Nenhuma fatura para excluir');
    return;
  }
  
  console.log('🗑️  Excluindo faturas...');
  let sucesso = 0;
  let erros = 0;
  
  for (const fatura of faturas) {
    try {
      const delRes = await httpRequest(`${API_URL}/faturas/${fatura.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (delRes.ok) {
        sucesso++;
        if (sucesso % 50 === 0) {
          console.log(`   ✓ ${sucesso} faturas excluídas...`);
        }
      } else {
        console.log(`   ❌ Erro ao excluir fatura ${fatura.numero_fatura}`);
        erros++;
      }
    } catch (error) {
      console.log(`   ❌ Erro ao excluir fatura ${fatura.numero_fatura}:`, error.message);
      erros++;
    }
  }
  
  console.log(`\n✅ Exclusão concluída!`);
  console.log(`   Excluídas: ${sucesso}`);
  console.log(`   Erros: ${erros}`);
}

async function main() {
  try {
    await login();
    await excluirTodasFaturas();
    console.log('\n🎉 Processo concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

main();
