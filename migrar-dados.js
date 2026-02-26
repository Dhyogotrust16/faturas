const sqlite3 = require('sqlite3').verbose();
const https = require('https');
const path = require('path');

const API_URL = 'https://visao-faturas.fly.dev/api';
const dbPath = path.join(__dirname, 'database', 'faturas.db');

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

async function migrarClientes(db) {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM clientes', async (err, clientes) => {
      if (err) {
        reject(err);
        return;
      }
      
      console.log(`📋 Migrando ${clientes.length} clientes...`);
      let sucesso = 0;
      let erros = 0;
      
      for (const cliente of clientes) {
        try {
          const res = await httpRequest(`${API_URL}/clientes`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              nome: cliente.nome,
              cpf_cnpj: cliente.cpf_cnpj,
              email: cliente.email,
              telefone: cliente.telefone,
              endereco: cliente.endereco
            })
          });
          
          if (res.ok) {
            sucesso++;
          } else {
            const error = res.text();
            if (!error.includes('já existe')) {
              console.log(`   ⚠️  ${cliente.nome}: ${error}`);
            }
            erros++;
          }
        } catch (error) {
          console.log(`   ❌ Erro ao migrar ${cliente.nome}:`, error.message);
          erros++;
        }
      }
      
      console.log(`✅ Clientes: ${sucesso} migrados, ${erros} erros\n`);
      resolve();
    });
  });
}

async function migrarFaturas(db) {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT f.*, c.nome as cliente_nome, c.cpf_cnpj
      FROM faturas f
      JOIN clientes c ON f.cliente_id = c.id
    `, async (err, faturas) => {
      if (err) {
        reject(err);
        return;
      }
      
      console.log(`📄 Migrando ${faturas.length} faturas...`);
      let sucesso = 0;
      let erros = 0;
      
      for (const fatura of faturas) {
        try {
          // Buscar cliente no sistema remoto
          const resClientes = await httpRequest(`${API_URL}/clientes`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const clientes = resClientes.json();
          const clienteRemoto = clientes.find(c => c.cpf_cnpj === fatura.cpf_cnpj);
          
          if (!clienteRemoto) {
            console.log(`   ⚠️  Cliente não encontrado para fatura ${fatura.numero_fatura}`);
            erros++;
            continue;
          }
          
          const res = await httpRequest(`${API_URL}/faturas`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              cliente_id: clienteRemoto.id,
              numero_fatura: fatura.numero_fatura,
              valor: fatura.valor,
              data_vencimento: fatura.data_vencimento,
              status: fatura.status
            })
          });
          
          if (res.ok) {
            sucesso++;
          } else {
            const error = res.text();
            console.log(`   ⚠️  Fatura ${fatura.numero_fatura}: ${error}`);
            erros++;
          }
        } catch (error) {
          console.log(`   ❌ Erro ao migrar fatura ${fatura.numero_fatura}:`, error.message);
          erros++;
        }
      }
      
      console.log(`✅ Faturas: ${sucesso} migradas, ${erros} erros\n`);
      resolve();
    });
  });
}

async function migrar() {
  const db = new sqlite3.Database(dbPath);
  
  try {
    await login();
    await migrarClientes(db);
    await migrarFaturas(db);
    
    console.log('🎉 Migração concluída com sucesso!');
  } catch (error) {
    console.error('❌ Erro na migração:', error);
  } finally {
    db.close();
  }
}

migrar();
