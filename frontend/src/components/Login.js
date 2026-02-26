import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [isRegistro, setIsRegistro] = useState(false);
  const [nome, setNome] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const endpoint = isRegistro ? '/api/auth/registro' : '/api/auth/login';
      const data = isRegistro ? { nome, email, senha } : { email, senha };
      
      const response = await axios.post(endpoint, data);
      
      if (isRegistro) {
        alert('Usuário criado com sucesso! Faça login.');
        setIsRegistro(false);
      } else {
        onLogin(response.data.token);
      }
    } catch (error) {
      setErro(error.response?.data?.erro || 'Erro ao processar requisição');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="card" style={{ width: '400px' }}>
        <h2>{isRegistro ? 'Criar Conta' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          {isRegistro && (
            <div className="form-group">
              <label>Nome</label>
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
          </div>
          {erro && <p style={{ color: 'red' }}>{erro}</p>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '10px' }}>
            {isRegistro ? 'Criar Conta' : 'Entrar'}
          </button>
          <button type="button" onClick={() => setIsRegistro(!isRegistro)} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}>
            {isRegistro ? 'Já tem conta? Faça login' : 'Criar nova conta'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
