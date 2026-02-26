const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testUpload() {
  try {
    // Fazer login primeiro
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@admin.com', senha: 'admin123' })
    });
    
    const loginData = await loginRes.json();
    console.log('Login:', loginData);
    
    if (!loginData.token) {
      console.error('Erro no login');
      return;
    }
    
    const token = loginData.token;
    
    // Testar upload
    const form = new FormData();
    form.append('arquivo', fs.createReadStream('exemplo-faturas-completo.csv'));
    form.append('empresa_id', '1');
    
    const uploadRes = await fetch('http://localhost:5000/api/faturas/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...form.getHeaders()
      },
      body: form
    });
    
    const uploadData = await uploadRes.json();
    console.log('Upload status:', uploadRes.status);
    console.log('Upload response:', uploadData);
    
  } catch (error) {
    console.error('Erro:', error.message);
    console.error('Stack:', error.stack);
  }
}

testUpload();
